export function isBrowserE2EMode() {
  return process.env.E2E_TEST_MODE === "1" && process.env.NODE_ENV !== "production";
}
