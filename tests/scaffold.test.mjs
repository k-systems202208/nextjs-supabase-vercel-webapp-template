import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(read("package.json"));
const gitignore = read(".gitignore");
const envExample = read(".env.example");
const schema = read("supabase/schema.sql");
const serviceWorker = read("public/sw.js");
const readme = read("README.md");
const customizing = read("docs/CUSTOMIZING.md");

test("core dependencies are pinned", () => {
  for (const name of ["next", "react", "react-dom", "@supabase/ssr", "@supabase/supabase-js"]) {
    const version = packageJson.dependencies[name];
    assert.ok(version, `${name} is missing`);
    assert.doesNotMatch(version, /^[~^]/, `${name} must be pinned`);
  }
});

test("required quality scripts exist", () => {
  for (const script of ["lint", "typecheck", "test", "build", "check"]) {
    assert.ok(packageJson.scripts[script], `${script} script is missing`);
  }
});

test("secrets are ignored and publishable env template exists", () => {
  assert.match(gitignore, /^\.env\*$/m);
  assert.match(gitignore, /^!\.env\.example$/m);
  assert.match(gitignore, /\*\.pem/);
  assert.match(gitignore, /\*\.key/);
  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.doesNotMatch(envExample, /service_role/i);
});

test("auth, CRUD and PWA scaffold files exist", () => {
  for (const path of [
    "app/auth/login/page.tsx",
    "app/auth/sign-up/page.tsx",
    "app/auth/confirm/route.ts",
    "app/dashboard/page.tsx",
    "app/dashboard/actions.ts",
    "app/manifest.ts",
    "public/sw.js",
    "public/icon-192.png",
    "public/icon-512.png",
    "supabase/schema.sql",
  ]) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), true, `${path} is missing`);
  }
});

test("sample todos table is protected by ownership RLS", () => {
  assert.match(schema, /alter table public\.todos enable row level security/i);
  assert.match(schema, /grant select, insert, update, delete on table public\.todos to authenticated/i);
  assert.match(schema, /revoke all on table public\.todos from anon/i);
  assert.match(schema, /for select[\s\S]*auth\.uid\(\)[\s\S]*user_id/i);
  assert.match(schema, /for insert[\s\S]*with check[\s\S]*auth\.uid\(\)[\s\S]*user_id/i);
  assert.match(schema, /for update[\s\S]*using[\s\S]*with check/i);
  assert.match(schema, /for delete[\s\S]*auth\.uid\(\)[\s\S]*user_id/i);
});

test("service worker does not cache authenticated routes", () => {
  assert.match(serviceWorker, /pathname\.startsWith\("\/auth"\)/);
  assert.match(serviceWorker, /pathname\.startsWith\("\/dashboard"\)/);
  assert.match(serviceWorker, /pathname\.startsWith\("\/api"\)/);
});

test("template documents that Todo is replaceable sample code", () => {
  assert.match(readme, /削除可能なサンプル/);
  assert.match(readme, /docs\/CUSTOMIZING\.md/);
  assert.match(customizing, /自由に削除・置換/);
  assert.match(customizing, /このテンプレート本体へ追加しないもの/);
});
