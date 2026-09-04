import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const ruleset = JSON.parse(read("github/protect-main.ruleset.json"));
const setupScript = read("scripts/setup-github.ps1");

test("main protection ruleset enforces the common safe workflow", () => {
  assert.equal(ruleset.name, "Protect main");
  assert.equal(ruleset.enforcement, "active");
  assert.deepEqual(ruleset.bypass_actors, []);

  const types = ruleset.rules.map((rule) => rule.type);
  assert.equal(types.includes("deletion"), true);
  assert.equal(types.includes("non_fast_forward"), true);
  assert.equal(types.includes("required_linear_history"), true);

  const pullRequest = ruleset.rules.find((rule) => rule.type === "pull_request");
  assert.equal(pullRequest.parameters.required_review_thread_resolution, true);
  assert.deepEqual(pullRequest.parameters.allowed_merge_methods, ["squash"]);

  const requiredChecks = ruleset.rules.find((rule) => rule.type === "required_status_checks");
  assert.deepEqual(requiredChecks.parameters.required_status_checks, [
    { context: "quality", integration_id: 15368 },
  ]);
});

test("setup script is idempotent and can migrate the legacy ruleset name", () => {
  assert.match(setupScript, /RulesetName = "Protect main"/);
  assert.match(setupScript, /main protection/);
  assert.match(setupScript, /--method", "PUT"/);
  assert.match(setupScript, /--method", "POST"/);
  assert.match(setupScript, /allow_squash_merge=true/);
  assert.match(setupScript, /allow_merge_commit=false/);
  assert.match(setupScript, /allow_rebase_merge=false/);
  assert.match(setupScript, /delete_branch_on_merge=true/);
  assert.match(setupScript, /allow_update_branch=true/);
});
