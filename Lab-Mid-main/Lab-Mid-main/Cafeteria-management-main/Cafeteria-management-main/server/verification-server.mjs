import http from "node:http";
import { URL } from "node:url";

const PORT = Number(process.env.VERIFICATION_PORT || 8787);
const CODE_TTL_MS = 5 * 60 * 1000;
const SEND_WINDOW_MS = 60 * 1000;
const SEND_LIMIT_PER_PHONE = 3;
const SEND_LIMIT_PER_IP = 10;
const MAX_VERIFY_ATTEMPTS = 5;
const verificationStore = new Map();
const rateLimitStore = new Map();

const json = (statusCode, payload) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  },
  body: JSON.stringify(payload),
});

const normalizePhone = (value) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  let normalized = trimmed.replace(/[^\d+]/g, "");
  if (normalized.startsWith("00")) {
    normalized = `+${normalized.slice(2)}`;
  }
  if (!normalized.startsWith("+")) {
    normalized = `+${normalized}`;
  }
  return normalized;
};

const isPhoneValid = (value) => /^\+[1-9]\d{7,14}$/.test(value);
const isCodeValid = (value) => /^\d{6}$/.test(value);

const getClientIp = (req) => {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  if (forwarded) return forwarded;
  return req.socket.remoteAddress || "unknown";
};

const pruneExpiredRecords = () => {
  const now = Date.now();

  for (const [phone, record] of verificationStore.entries()) {
    if (now > record.expiresAt) {
      verificationStore.delete(phone);
    }
  }

  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.windowStart + SEND_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
};

const consumeRateLimit = (key, limit) => {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.windowStart + SEND_WINDOW_MS) {
    rateLimitStore.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.windowStart + SEND_WINDOW_MS - now) / 1000)
    );
    return { allowed: false, retryAfterSeconds };
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);
  return { allowed: true, retryAfterSeconds: 0 };
};

const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  const raw = Buffer.concat(chunks).toString("utf8");
  try {
    return JSON.parse(raw || "{}");
  } catch {
    return null;
  }
};

const createCode = () => `${Math.floor(100000 + Math.random() * 900000)}`;

const hasTwilioConfig = () =>
  Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM
  );

const sendViaTwilio = async ({ to, code }) => {
  if (!hasTwilioConfig()) {
    return { sent: false, reason: "not_configured" };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const form = new URLSearchParams({
    From: from,
    To: `whatsapp:${to}`,
    Body: `Your COMSATS cafeteria verification code is ${code}. It expires in 5 minutes.`,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Twilio send failed: ${response.status} ${text}`);
  }

  return { sent: true };
};

const server = http.createServer(async (req, res) => {
  try {
    pruneExpiredRecords();
    const host = req.headers.host || `127.0.0.1:${PORT}`;
    const url = new URL(req.url || "/", `http://${host}`);

    if (req.method === "OPTIONS") {
      const response = json(204, {});
      res.writeHead(response.statusCode, response.headers);
      res.end();
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/verification/send") {
      const body = await readBody(req);
      if (body === null) {
        const response = json(400, { message: "Invalid JSON body." });
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
        return;
      }
      const whatsappNumber = normalizePhone(body.whatsappNumber);
      const clientIp = getClientIp(req);

      if (!isPhoneValid(whatsappNumber)) {
        const response = json(400, { message: "Please enter a valid WhatsApp number in international format." });
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
        return;
      }

      const phoneRate = consumeRateLimit(`phone:${whatsappNumber}`, SEND_LIMIT_PER_PHONE);
      if (!phoneRate.allowed) {
        const response = json(429, {
          success: false,
          message: `Too many code requests for this number. Try again in ${phoneRate.retryAfterSeconds} seconds.`,
          retryAfterSeconds: phoneRate.retryAfterSeconds,
        });
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
        return;
      }

      const ipRate = consumeRateLimit(`ip:${clientIp}`, SEND_LIMIT_PER_IP);
      if (!ipRate.allowed) {
        const response = json(429, {
          success: false,
          message: `Too many requests from this network. Try again in ${ipRate.retryAfterSeconds} seconds.`,
          retryAfterSeconds: ipRate.retryAfterSeconds,
        });
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
        return;
      }

      const code = createCode();
      const expiresAt = Date.now() + CODE_TTL_MS;
      verificationStore.set(whatsappNumber, { code, expiresAt, attempts: 0 });
      const twilioConfigured = hasTwilioConfig();

      try {
        const sendResult = await sendViaTwilio({ to: whatsappNumber, code });
        if (sendResult.sent) {
          const response = json(200, {
            success: true,
            delivery: "whatsapp",
            expiresInSeconds: Math.floor(CODE_TTL_MS / 1000),
          });
          res.writeHead(response.statusCode, response.headers);
          res.end(response.body);
          return;
        }
      } catch (error) {
        console.error("WhatsApp provider error:", error);
        if (twilioConfigured) {
          const response = json(502, {
            success: false,
            message: "Failed to send verification code through WhatsApp provider. Please retry.",
          });
          res.writeHead(response.statusCode, response.headers);
          res.end(response.body);
          return;
        }
      }

      const response = json(200, {
        success: true,
        delivery: "mock",
        devCode: code,
        expiresInSeconds: Math.floor(CODE_TTL_MS / 1000),
        note: "Twilio WhatsApp credentials are not configured. Configure env vars to send real WhatsApp OTP.",
      });
      res.writeHead(response.statusCode, response.headers);
      res.end(response.body);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/verification/verify") {
      const body = await readBody(req);
      if (body === null) {
        const response = json(400, { message: "Invalid JSON body." });
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
        return;
      }
      const whatsappNumber = normalizePhone(body.whatsappNumber);
      const code = String(body.code || "").trim();

      if (!isPhoneValid(whatsappNumber)) {
        const response = json(400, { verified: false, message: "Invalid WhatsApp number format." });
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
        return;
      }

      if (!isCodeValid(code)) {
        const response = json(400, { verified: false, message: "Verification code must be 6 digits." });
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
        return;
      }

      const record = verificationStore.get(whatsappNumber);
      if (!record) {
        const response = json(400, { verified: false, message: "No code found. Please request a new code." });
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
        return;
      }

      if (Date.now() > record.expiresAt) {
        verificationStore.delete(whatsappNumber);
        const response = json(400, { verified: false, message: "Code expired. Please request a new code." });
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
        return;
      }

      if (record.code !== code) {
        const attempts = (record.attempts || 0) + 1;
        if (attempts >= MAX_VERIFY_ATTEMPTS) {
          verificationStore.delete(whatsappNumber);
          const response = json(429, {
            verified: false,
            message: "Too many incorrect attempts. Please request a new verification code.",
          });
          res.writeHead(response.statusCode, response.headers);
          res.end(response.body);
          return;
        }

        verificationStore.set(whatsappNumber, { ...record, attempts });
        const response = json(400, { verified: false, message: "Incorrect verification code." });
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
        return;
      }

      verificationStore.delete(whatsappNumber);
      const response = json(200, { verified: true });
      res.writeHead(response.statusCode, response.headers);
      res.end(response.body);
      return;
    }

    const notFound = json(404, { message: "Not found" });
    res.writeHead(notFound.statusCode, notFound.headers);
    res.end(notFound.body);
  } catch (error) {
    const failure = json(500, {
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    res.writeHead(failure.statusCode, failure.headers);
    res.end(failure.body);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[verification-server] listening on http://127.0.0.1:${PORT}`);
});
