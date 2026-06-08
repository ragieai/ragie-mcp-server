import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(
  readFileSync(resolve(repoRoot, "package.json"), "utf8")
);
const cliEntry = resolve(repoRoot, "build/index.js");

function runCli(flag) {
  const env = { ...process.env };
  delete env.RAGIE_API_KEY;

  return spawnSync(process.execPath, [cliEntry, flag], {
    cwd: repoRoot,
    env,
    encoding: "utf8",
    timeout: 3000,
  });
}

describe("CLI metadata flags", () => {
  it("prints the package version without a Ragie API key", () => {
    const result = runCli("--version");

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), packageJson.version);
    assert.equal(result.stderr, "");
  });

  it("prints help without a Ragie API key", () => {
    const result = runCli("--help");

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Usage:/);
    assert.match(result.stdout, /--version/);
    assert.equal(result.stderr, "");
  });
});
