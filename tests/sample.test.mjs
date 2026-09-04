import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const schema = read("supabase/sample/todos.sql");
const readme = read("README.md");
const customizing = read("docs/CUSTOMIZING.md");
const supabaseSetup = read("docs/SUPABASE-SETUP.md");

test("optional Todo sample is kept inside the sample boundary", () => {
  for (const path of [
    "app/(sample)/dashboard/page.tsx",
    "features/todos/actions.ts",
    "supabase/sample/todos.sql",
  ]) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), true, `${path} is missing`);
  }

  assert.equal(existsSync(new URL("../app/dashboard/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../app/dashboard/actions.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../supabase/schema.sql", import.meta.url)), false);
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

test("Todo sample removal boundary is documented", () => {
  for (const content of [readme, customizing]) {
    assert.match(content, /app\/\(sample\)\/dashboard/);
    assert.match(content, /features\/todos/);
    assert.match(content, /supabase\/sample\/todos\.sql/);
    assert.match(content, /tests\/sample\.test\.mjs/);
  }
  assert.match(supabaseSetup, /supabase\/sample\/todos\.sql/);
});
