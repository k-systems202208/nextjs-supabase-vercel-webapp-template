import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REQUIRED_FILES = ["package.json", "package-lock.json", ".env.example"];
const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
];

export function parseNodeMajor(version) {
  const major = Number.parseInt(String(version).split(".")[0], 10);
  return Number.isInteger(major) ? major : Number.NaN;
}

export function parseEnv(text) {
  const values = new Map();
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    values.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
  }
  return values;
}

function isPlaceholder(value) {
  if (!value) return true;
  return /your-project|your-key|example\.com/i.test(value);
}

export function diagnose({ root = ROOT, nodeVersion = process.versions.node } = {}) {
  const checks = [];
  const add = (level, message) => checks.push({ level, message });

  const major = parseNodeMajor(nodeVersion);
  if (!Number.isInteger(major) || major < 22 || major >= 27) {
    add("FAIL", `Node.js ${nodeVersion} は対象外です。22以上27未満を使用してください。`);
  } else {
    add("PASS", `Node.js ${nodeVersion}`);
  }

  for (const relativePath of REQUIRED_FILES) {
    if (existsSync(path.join(root, relativePath))) {
      add("PASS", `${relativePath} を確認`);
    } else {
      add("FAIL", `${relativePath} がありません。Clone / checkout状態を確認してください。`);
    }
  }

  const envPath = path.join(root, ".env.local");
  if (!existsSync(envPath)) {
    add("WARN", ".env.local は未作成です。Supabase機能を使う前に .env.example から作成してください。");
  } else {
    const env = parseEnv(readFileSync(envPath, "utf8"));
    for (const name of REQUIRED_ENV) {
      const value = env.get(name);
      if (isPlaceholder(value)) {
        add("WARN", `${name} が未設定またはサンプル値です。`);
      } else {
        add("PASS", `${name} を確認`);
      }
    }
  }

  return {
    checks,
    failed: checks.some((check) => check.level === "FAIL"),
  };
}

export function runDoctor(options) {
  const result = diagnose(options);
  for (const check of result.checks) {
    console.log(`[${check.level}] ${check.message}`);
  }
  console.log(result.failed ? "Doctor: FAILED" : "Doctor: OK");
  return result.failed ? 1 : 0;
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  process.exitCode = runDoctor();
}
