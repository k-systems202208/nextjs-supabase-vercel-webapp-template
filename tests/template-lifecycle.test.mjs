import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(read("package.json"));
const ci = read(".github/workflows/ci.yml");
const readme = read("README.md");
const operations = read("docs/OPERATIONS.md");
const extending = read("docs/EXTENDING.md");

test("developer doctor is part of the template contract", () => {
  assert.equal(existsSync(new URL("../scripts/doctor.mjs", import.meta.url)), true);
  assert.equal(packageJson.scripts.doctor, "node scripts/doctor.mjs");
  assert.match(ci, /npm run doctor/);
  assert.match(ci, /npm run check/);
});

test("operations runbook uses the existing common health endpoint", () => {
  assert.equal(existsSync(new URL("../app/api/health/route.ts", import.meta.url)), true);
  assert.match(operations, /\/api\/health/);
  assert.match(operations, /ロールバック/);
  assert.match(operations, /RLS/);
});

test("extension guide keeps domain features outside the common core", () => {
  assert.match(extending, /features\/equipment/);
  assert.match(extending, /RLS/);
  assert.match(extending, /共通基盤/);
  assert.match(extending, /npm run check/);
});

test("README links operations and extension guidance", () => {
  assert.match(readme, /docs\/OPERATIONS\.md/);
  assert.match(readme, /docs\/EXTENDING\.md/);
  assert.match(readme, /npm run doctor/);
});
