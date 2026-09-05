import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { diagnose, parseEnv, parseNodeMajor } from "../scripts/doctor.mjs";

function makeRepo() {
  const root = mkdtempSync(path.join(tmpdir(), "next-template-doctor-"));
  for (const file of ["package.json", "package-lock.json", ".env.example"]) {
    writeFileSync(path.join(root, file), "{}\n", "utf8");
  }
  return root;
}

test("parseNodeMajor reads the major version", () => {
  assert.equal(parseNodeMajor("22.18.0"), 22);
  assert.equal(parseNodeMajor("23.1.0"), 23);
  assert.equal(Number.isNaN(parseNodeMajor("unknown")), true);
});

test("parseEnv ignores comments and reads values", () => {
  const env = parseEnv("# comment\nA=1\nB = two\n");
  assert.equal(env.get("A"), "1");
  assert.equal(env.get("B"), "two");
});

test("doctor passes Node 22 repository checks and only warns when env is absent", () => {
  const root = makeRepo();
  try {
    const result = diagnose({ root, nodeVersion: "22.18.0" });
    assert.equal(result.failed, false);
    assert.equal(result.checks.some((check) => check.level === "WARN"), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("doctor fails Node versions below 22", () => {
  const root = makeRepo();
  try {
    const result = diagnose({ root, nodeVersion: "21.9.0" });
    assert.equal(result.failed, true);
    assert.equal(
      result.checks.some(
        (check) =>
          check.level === "FAIL" &&
          check.message.includes("対象外") &&
          check.message.includes("Node.js 22"),
      ),
      true,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("doctor fails Node versions above 22", () => {
  const root = makeRepo();
  try {
    const result = diagnose({ root, nodeVersion: "23.0.0" });
    assert.equal(result.failed, true);
    assert.equal(
      result.checks.some(
        (check) =>
          check.level === "FAIL" &&
          check.message.includes("対象外") &&
          check.message.includes("Node.js 22"),
      ),
      true,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
