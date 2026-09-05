import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(read("package.json"));
const lockfile = JSON.parse(read("package-lock.json"));
const ci = read(".github/workflows/ci.yml");
const readme = read("README.md");
const gettingStarted = read("GETTING-STARTED.md");
const development = read("docs/DEVELOPMENT.md");
const beginnerGuide = read("BEGINNER-GUIDE.md");
const githubSetup = read("docs/GITHUB-SETUP.md");
const operations = read("docs/OPERATIONS.md");
const extending = read("docs/EXTENDING.md");
const smokeTest = read("docs/TEMPLATE-SMOKE-TEST.md");
const thirdPartyValidation = read("docs/THIRD-PARTY-VALIDATION.md");
const qualityVerification = read("docs/QUALITY-VERIFICATION.md");
const contributing = read("CONTRIBUTING.md");
const issueTemplate = read(".github/ISSUE_TEMPLATE/change-request.md");
const prTemplate = read(".github/pull_request_template.md");
const proxyConfig = read("proxy.ts");

const collectMarkdownFiles = (directory) => {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
};

const markdownFiles = () => [
  ...readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => join(root, entry.name)),
  ...collectMarkdownFiles(join(root, "docs")),
  ...collectMarkdownFiles(join(root, ".github")),
];

test("developer doctor is part of the template contract", () => {
  assert.equal(existsSync(new URL("../scripts/doctor.mjs", import.meta.url)), true);
  assert.equal(packageJson.scripts.doctor, "node scripts/doctor.mjs");
  assert.match(ci, /npm run doctor/);
  assert.match(ci, /npm run check/);
});

test("supported Node runtime matches the CI contract", () => {
  assert.equal(packageJson.engines.node, ">=22 <23");
  assert.match(ci, /node-version: 22/);
  assert.match(gettingStarted, /Node\.js 22系/);
});

test("Playwright is a reproducible development dependency", () => {
  assert.equal(packageJson.devDependencies["@playwright/test"], "1.62.1");
  assert.equal(lockfile.packages[""].devDependencies["@playwright/test"], "1.62.1");
  assert.equal(packageJson.scripts["test:e2e:install"], "npx playwright install chromium");
  assert.doesNotMatch(ci, /npm install --no-save/);
  assert.match(ci, /npx playwright install --with-deps chromium/);
});

test("operations runbook uses the existing common health endpoint", () => {
  assert.equal(existsSync(new URL("../app/api/health/route.ts", import.meta.url)), true);
  assert.match(operations, /\/api\/health/);
  assert.match(operations, /ロールバック/);
  assert.match(operations, /RLS/);
});

test("health endpoint is independent from the Supabase auth proxy", () => {
  assert.match(proxyConfig, /\(\?!api\/health\|/);
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
  assert.match(ci, /app\/\(sample\)/);
  assert.match(ci, /features\/todos/);
  assert.match(ci, /tests\/sample\.test\.mjs/);
  assert.match(ci, /e2e\/sample-todos\.spec\.mjs/);
  assert.match(gettingStarted, /app\/\(sample\)\//);
  assert.match(gettingStarted, /e2e\/sample-todos\.spec\.mjs/);
  assert.doesNotMatch(gettingStarted, /サンプル4か所/);
  assert.match(smokeTest, /Use this template/);
  assert.match(smokeTest, /npm run check/);
  assert.match(smokeTest, /Pull Request/);
  assert.match(smokeTest, /THIRD-PARTY-VALIDATION\.md/);
  assert.match(smokeTest, /npm run test:e2e/);
});

test("third-party validation records real service checks", () => {
  assert.equal(existsSync(new URL("../docs/THIRD-PARTY-VALIDATION.md", import.meta.url)), true);
  assert.match(thirdPartyValidation, /Use this template/);
  assert.match(thirdPartyValidation, /revoke all on table public\.example from authenticated/);
  assert.match(thirdPartyValidation, /Performance Advisor/);
  assert.match(thirdPartyValidation, /NEXT_PUBLIC_SITE_URL/);
  assert.match(thirdPartyValidation, /\/auth\/confirm/);
  assert.match(thirdPartyValidation, /Vercel Production/);
  assert.match(thirdPartyValidation, /Auth Proxy/);
});

test("verification design is part of issue PR and contribution contracts", () => {
  for (const content of [qualityVerification, contributing, issueTemplate, prTemplate]) {
    assert.match(content, /Verification Plan/);
    assert.match(content, /Risk Level/);
    assert.match(content, /Test Oracle/);
    assert.match(content, /Independent Verification/);
  }

  assert.match(qualityVerification, /Falsification/);
  assert.match(qualityVerification, /High Risk/);
  assert.match(qualityVerification, /Mutation Testing/);
  assert.match(prTemplate, /Greenだけでは保証しない範囲/);
  assert.match(readme, /docs\/QUALITY-VERIFICATION\.md/);
  assert.match(readme, /CONTRIBUTING\.md/);
  assert.match(development, /QUALITY-VERIFICATION\.md/);
});

test("GitHub Actions are pinned and ruleset requires the latest main", () => {
  const actionRefs = [...ci.matchAll(/uses:\s+([^\s#]+)/g)].map((match) => match[1]);
  assert.ok(actionRefs.length > 0);

  for (const actionRef of actionRefs) {
    if (actionRef.startsWith("./")) continue;
    assert.match(actionRef, /^[^@]+@[0-9a-f]{40}$/);
  }

  const ruleset = JSON.parse(read("github/protect-main.ruleset.json"));
  const statusRule = ruleset.rules.find((rule) => rule.type === "required_status_checks");
  assert.equal(statusRule.parameters.strict_required_status_checks_policy, true);
});

test("security policy is separate from security design", () => {
  const policy = read(".github/SECURITY.md");
  const design = read("docs/SECURITY.md");

  assert.match(policy, /Reporting a vulnerability/);
  assert.match(policy, /Public Issue/);
  assert.match(policy, /docs\/SECURITY\.md/);
  assert.match(design, /セキュリティ全体像/);
});

test("repository internal Markdown links resolve", () => {
  const broken = [];

  for (const source of markdownFiles()) {
    const content = readFileSync(source, "utf8");
    for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      const rawTarget = match[1].trim();
      let target = rawTarget;

      if (target.startsWith("<") && target.includes(">")) {
        target = target.slice(1, target.indexOf(">"));
      } else {
        target = target.split(/\s+/, 1)[0];
      }

      if (
        !target ||
        target.startsWith("#") ||
        target.startsWith("/") ||
        target.startsWith("http://") ||
        target.startsWith("https://") ||
        target.startsWith("mailto:") ||
        target.startsWith("tel:")
      ) {
        continue;
      }

      try {
        target = decodeURIComponent(target.split("#", 1)[0].split("?", 1)[0]);
      } catch {
        broken.push(`${relative(root, source)} -> ${rawTarget} (invalid URL encoding)`);
        continue;
      }

      if (!target) continue;

      const candidate = resolve(dirname(source), target);
      const fromRoot = relative(root, candidate);
      if (fromRoot.startsWith("..") || isAbsolute(fromRoot)) {
        broken.push(`${relative(root, source)} -> ${rawTarget} (outside repository)`);
        continue;
      }

      if (!existsSync(candidate)) {
        broken.push(`${relative(root, source)} -> ${rawTarget}`);
      }
    }
  }

  assert.deepEqual(broken, []);
});

test("README, Getting Started and Development link beginner guidance", () => {
  assert.match(readme, /BEGINNER-GUIDE\.md/);
  assert.match(gettingStarted, /BEGINNER-GUIDE\.md/);
  assert.match(development, /BEGINNER-GUIDE\.md/);
  assert.match(readme, /docs\/OPERATIONS\.md/);
  assert.match(readme, /docs\/EXTENDING\.md/);
  assert.match(readme, /docs\/TEMPLATE-SMOKE-TEST\.md/);
  assert.match(development, /TEMPLATE-SMOKE-TEST\.md/);
  assert.match(development, /npm run test:e2e/);
  assert.match(development, /PlaywrightはdevDependency/);
  assert.match(readme, /npm run doctor/);
});
