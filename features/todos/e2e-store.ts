import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { isBrowserE2EMode } from "@/lib/e2e/mode";

export type E2ETodo = {
  id: string;
  title: string;
  is_complete: boolean;
  created_at: string;
};

const fixtureDirectory = join(process.cwd(), ".next");
const fixturePath = join(fixtureDirectory, "sample-todo-e2e.json");

function assertEnabled() {
  if (!isBrowserE2EMode()) {
    throw new Error("Todo E2E fixture store is disabled outside E2E test mode.");
  }
}

function readStore(): E2ETodo[] {
  assertEnabled();

  try {
    return JSON.parse(readFileSync(fixturePath, "utf8")) as E2ETodo[];
  } catch {
    return [];
  }
}

function writeStore(todos: E2ETodo[]) {
  assertEnabled();
  mkdirSync(fixtureDirectory, { recursive: true });
  writeFileSync(fixturePath, JSON.stringify(todos), "utf8");
}

export function listE2ETodos() {
  return readStore();
}

export function addE2ETodo(title: string) {
  const todos = readStore();
  todos.unshift({
    id: randomUUID(),
    title,
    is_complete: false,
    created_at: new Date().toISOString(),
  });
  writeStore(todos);
}

export function toggleE2ETodo(id: string) {
  const todos = readStore();
  const todo = todos.find((item) => item.id === id);
  if (!todo) return;
  todo.is_complete = !todo.is_complete;
  writeStore(todos);
}

export function deleteE2ETodo(id: string) {
  writeStore(readStore().filter((item) => item.id !== id));
}

export function resetE2ETodos() {
  writeStore([]);
}
