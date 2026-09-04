import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(read("package.json"));
const gitignore = read(".gitignore");
const envExample = read(".env.example");
const serviceWorker = read("public/sw.js");
const authActions = read("app/auth/actions.ts");
const authConfirm = read("app/auth/confirm/route.ts");
const readme = read("README.md");
const customizing = read("docs/CUSTOMIZING.md");
const supabaseSetup = read("docs/SUPABASE-SETUP.md");
const development = read("docs/DEVELOPMENT.md");
const license = read("LICENSE");
const dependabot = read(".github/dependabot.yml");
const docsToVisualize = [
  "README.md",
  "GETTING-STARTED.md",
  "docs/SUPABASE-SETUP.md",
  "docs/AUTH-CRUD.md",
  "docs/CUSTOMIZING.md",
  "docs/ARCHITECTURE.md",
  "docs/DEVELOPMENT.md",
  "docs/DEPLOYMENT.md",
  "docs/PWA.md",
  "docs/SECURITY.md",
];

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

test("common auth and PWA scaffold files exist", () => {
  for (const path of [
    "app/auth/login/page.tsx",
    "app/auth/sign-up/page.tsx",
    "app/auth/confirm/route.ts",
    "app/manifest.ts",
    "public/sw.js",
    "public/icon-192.png",
    "public/icon-512.png",
  ]) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), true, `${path} is missing`);
  }
});

test("common auth default flow is not coupled to the optional Todo dashboard", () => {
  assert.doesNotMatch(authActions, /redirect\("\/dashboard"\)/);
  assert.doesNotMatch(authActions, /next=\/dashboard/);
  assert.doesNotMatch(authConfirm, /return "\/dashboard"/);
  assert.match(authActions, /redirect\("\/"\)/);
  assert.match(authConfirm, /return "\/"/);
});

test("service worker does not cache authenticated routes", () => {
  assert.match(serviceWorker, /pathname\.startsWith\("\/auth"\)/);
  assert.match(serviceWorker, /pathname\.startsWith\("\/dashboard"\)/);
  assert.match(serviceWorker, /pathname\.startsWith\("\/api"\)/);
});

test("template documents the core and replaceable sample boundary", () => {
  assert.match(readme, /削除可能なサンプル/);
  assert.match(readme, /docs\/CUSTOMIZING\.md/);
  assert.match(customizing, /削除可能なサンプル/);
  assert.match(customizing, /共通基盤とサンプルの境界/);
  assert.match(customizing, /このテンプレート本体へ追加しないもの/);
});

test("detailed Supabase setup guide covers common configuration", () => {
  assert.match(readme, /docs\/SUPABASE-SETUP\.md/);
  assert.match(supabaseSetup, /Project URLとPublishable Key/);
  assert.match(supabaseSetup, /Authentication → URL Configuration/);
  assert.match(supabaseSetup, /Custom SMTP/);
  assert.match(supabaseSetup, /NEXT_PUBLIC_SITE_URL/);
});

test("all primary documents include Mermaid diagrams", () => {
  for (const path of docsToVisualize) {
    const content = read(path);
    assert.match(content, /```mermaid[\s\S]*?```/, `${path} must include a Mermaid diagram`);
  }
});

test("public template has MIT license and Dependabot maintenance", () => {
  assert.match(license, /^MIT License/m);
  assert.match(license, /Copyright \(c\) 2026 k-systems202208/);
  assert.match(dependabot, /package-ecosystem: npm/);
  assert.match(dependabot, /package-ecosystem: github-actions/);
  assert.match(dependabot, /interval: monthly/);
  assert.match(dependabot, /dependency-name: eslint/);
  assert.match(dependabot, /version-update:semver-major/);
  assert.match(readme, /MIT License/);
  assert.match(development, /ESLint 10/);
  assert.match(development, /Dependabot/);
});
