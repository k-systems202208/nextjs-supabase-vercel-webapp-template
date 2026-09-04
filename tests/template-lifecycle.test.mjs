import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(read("package.json"));
const ci = read(".github/workflows/ci.yml");
const readme = read("README.md");
const gettingStarted = read("GETTING-STARTED.md");
const development = read("docs/DEVELOPMENT.md");
const beginnerGuide = read("BEGINNER-GUIDE.md");
const githubSetup = read("docs/GITHUB-SETUP.md");
const operations = read("docs/OPERATIONS.md");
const extending = read("docs/EXTENDING.md");
const smokeTest = read("docs/TEMPLATE-SMOKE-TEST.md");

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

test("beginner guide explains the full GitHub Desktop workflow", () => {
  assert.equal(existsSync(new URL("../BEGINNER-GUIDE.md", import.meta.url)), true);
  assert.match(beginnerGuide, /GitHub Desktop/);
  assert.match(beginnerGuide, /Commit/);
  assert.match(beginnerGuide, /Push/);
  assert.match(beginnerGuide, /Pull Request/);
  assert.match(beginnerGuide, /CI/);
  assert.match(beginnerGuide, /Squash Merge/);
  assert.match(beginnerGuide, /Conflict/);
  assert.match(beginnerGuide, /ChatGPT \/ Codex/);
});

test("GitHub setup guidance is part of the template documentation", () => {
  assert.equal(existsSync(new URL("../docs/GITHUB-SETUP.md", import.meta.url)), true);
  assert.match(readme, /docs\/GITHUB-SETUP\.md/);
  assert.match(githubSetup, /setup-github\.ps1/);
  assert.match(githubSetup, /quality/);
  assert.match(githubSetup, /Squash Merge/);
});

test("sampleless smoke test protects the reusable common core", () => {
  assert.equal(existsSync(new URL("../docs/TEMPLATE-SMOKE-TEST.md", import.meta.url)), true);
  assert.match(ci, /Sampleless template smoke test/);
  assert.match(ci, /app\/\(sample\)\/dashboard/);
  assert.match(ci, /features\/todos/);
  assert.match(ci, /tests\/sample\.test\.mjs/);
  assert.match(smokeTest, /Use this template/);
  assert.match(smokeTest, /npm run check/);
  assert.match(smokeTest, /Pull Request/);
});

test("README, Getting Started and Development link beginner guidance", () => {
  assert.match(readme, /BEGINNER-GUIDE\.md/);
  assert.match(gettingStarted, /BEGINNER-GUIDE\.md/);
  assert.match(development, /BEGINNER-GUIDE\.md/);
  assert.match(readme, /docs\/OPERATIONS\.md/);
  assert.match(readme, /docs\/EXTENDING\.md/);
  assert.match(readme, /docs\/TEMPLATE-SMOKE-TEST\.md/);
  assert.match(development, /TEMPLATE-SMOKE-TEST\.md/);
  assert.match(readme, /npm run doctor/);
});
