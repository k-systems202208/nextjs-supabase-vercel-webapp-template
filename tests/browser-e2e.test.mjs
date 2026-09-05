import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(read("package.json"));
const ci = read(".github/workflows/ci.yml");
const mode = read("lib/e2e/mode.ts");
const authActions = read("app/auth/actions.ts");
const env = read("lib/supabase/env.ts");
const playwrightConfig = read("playwright.config.mjs");

test("browser keyboard E2E is part of the common CI contract", () => {
  assert.match(packageJson.scripts["test:e2e:install"], /@playwright\/test@1\.62\.1/);
  assert.match(packageJson.scripts["test:e2e:install"], /package-lock=false/);
  assert.match(packageJson.scripts["test:e2e"], /playwright test/);
  assert.match(ci, /Browser keyboard E2E/);
  assert.match(ci, /npm install --no-save --package-lock=false @playwright\/test@1\.62\.1/);
  assert.match(ci, /playwright install --with-deps chromium/);
  assert.match(ci, /npm run test:e2e/);
});

test("E2E fixture mode cannot activate in production", () => {
  assert.match(mode, /E2E_TEST_MODE === "1"/);
  assert.match(mode, /NODE_ENV !== "production"/);
  assert.match(authActions, /isBrowserE2EMode/);
});

test("Supabase configuration validates URL syntax instead of presence only", () => {
  assert.match(env, /new URL\(value\)/);
  assert.match(env, /parsed\.protocol === "http:"/);
  assert.match(env, /parsed\.protocol === "https:"/);
  assert.match(env, /value is string/);
});

test("Playwright runs against a dedicated local E2E server", () => {
  assert.match(playwrightConfig, /127\.0\.0\.1:3100/);
  assert.match(playwrightConfig, /E2E_TEST_MODE: "1"/);
  assert.match(playwrightConfig, /NEXT_PUBLIC_SUPABASE_URL: "http:\/\/127\.0\.0\.1:54321"/);
});
