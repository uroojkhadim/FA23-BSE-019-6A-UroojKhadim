import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCmd = "npm";
const children = [];

const start = (command, args) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: isWindows,
    cwd: process.cwd(),
    env: process.env,
  });

  children.push(child);

  child.on("exit", (code) => {
    if (code !== 0) {
      shutdown(code ?? 1);
    }
  });

  return child;
};

const shutdown = (code = 0) => {
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }
  process.exit(code);
};

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

start("node", ["server/verification-server.mjs"]);
start(npmCmd, ["run", "dev:client", "--", "--host", "127.0.0.1", "--port", "5173"]);
