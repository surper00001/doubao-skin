import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const helper = join(root, "scripts", "client-config.command");

function detect(skillRoot, ...args) {
  const result = spawnSync(
    "/bin/bash",
    [
      "-c",
      'source "$1"; shift; detect_doubao_client "$@"',
      "client-config-test",
      helper,
      skillRoot,
      ...args,
    ],
    { encoding: "utf8", env: { ...process.env, DOUBAO_CLIENT: "" } },
  );
  if (result.status !== 0) throw new Error(result.stderr.trim());
  return result.stdout.trim();
}

test("detects the client from each skill installation directory", () => {
  assert.equal(
    detect("/Users/test/Library/Application Support/Doubao/Profile 1/.doubao/agent_mode/workspace/.user_skills/doubao-skin"),
    "personal",
  );
  assert.equal(
    detect("/Users/test/Library/Application Support/DoubaoWork/Default/.doubaowork/agent_mode/workspace/.user_skills/doubao-skin"),
    "work",
  );
});

function runHelper(script, environment = {}) {
  const result = spawnSync(
    "/bin/bash",
    ["-c", 'source "$1"; shift; eval "$1"', "client-config-test", helper, script],
    { encoding: "utf8", env: { ...process.env, ...environment } },
  );
  if (result.status !== 0) throw new Error(result.stderr.trim());
  return result.stdout.trim();
}

test("resolves a running non-Applications client path", () => {
  const output = runHelper('doubao_running_binary() { echo "/Users/test/Desktop/Doubao.app/Contents/MacOS/Doubao"; }; configure_doubao_client personal; printf "%s" "$DOUBAO_APP"');
  assert.equal(output, "/Users/test/Desktop/Doubao.app");
});

test("falls back to the standard Applications path", () => {
  const output = runHelper('doubao_running_binary() { return 1; }; resolve_doubao_app Doubao /Applications/Doubao.app');
  assert.equal(output, "/Applications/Doubao.app");
});
