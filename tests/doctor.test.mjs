import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { diagnose, isHttpUrl, parseEnv, parseNodeMajor } from "../scripts/doctor.mjs";

function makeRepo() {
  const root = mkdtempSync(path.join(tmpdir(), "next-template-doctor-"));
  for (const file of ["package.json", "package-lock.json", ".env.example"]) {
    writeFileSync(path.join(root, file), "{}\n", "utf8");
  }
  return root;
}

function writeEnv(root, url) {
  writeFileSync(
    path.join(root, ".env.local"),
    `NEXT_PUBLIC_SUPABASE_URL=${url}\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_test-key\n`,
    "utf8",
  );
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

test("isHttpUrl matches the application URL contract", () => {
  assert.equal(isHttpUrl("https://example.supabase.co"), true);
  assert.equal(isHttpUrl("http://localhost:54321"), true);
  assert.equal(isHttpUrl("not-a-url"), false);
  assert.equal(isHttpUrl("ftp://example.supabase.co"), false);
  assert.equal(isHttpUrl("https://user:pass@example.supabase.co"), false);
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

test("doctor accepts a valid Supabase HTTP(S) URL", () => {
  const root = makeRepo();
  try {
    writeEnv(root, "https://example.supabase.co");
    const result = diagnose({ root, nodeVersion: "22.18.0" });

    assert.equal(result.failed, false);
    assert.equal(
      result.checks.some(
        (check) =>
          check.level === "PASS" && check.message === "NEXT_PUBLIC_SUPABASE_URL を確認",
      ),
      true,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("doctor fails an invalid configured Supabase URL", () => {
  for (const url of [
    "not-a-url",
    "ftp://example.supabase.co",
    "https://user:pass@example.supabase.co",
  ]) {
    const root = makeRepo();
    try {
      writeEnv(root, url);
      const result = diagnose({ root, nodeVersion: "22.18.0" });

      assert.equal(result.failed, true, url);
      assert.equal(
        result.checks.some(
          (check) =>
            check.level === "FAIL" &&
            check.message.includes("NEXT_PUBLIC_SUPABASE_URL") &&
            check.message.includes("HTTP(S) URL"),
        ),
        true,
        url,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
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
