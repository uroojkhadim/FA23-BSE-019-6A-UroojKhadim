export function logEvent(message, meta = {}) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${message}`, meta);
}
