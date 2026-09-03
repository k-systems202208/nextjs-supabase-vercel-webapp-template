import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const gitignore = readFileSync(new URL("../.gitignore", import.meta.url), "utf8");
const envExample = readFileSync(new URL("../.env.example", import.meta.url), "utf8");

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
