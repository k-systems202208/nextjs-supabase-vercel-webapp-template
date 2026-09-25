export type AuthAccessMode = "public" | "invite_only";

export function getAuthAccessMode(): AuthAccessMode {
  return process.env.AUTH_ACCESS_MODE === "invite_only" ? "invite_only" : "public";
}

export function isInviteOnlyAccess() {
  return getAuthAccessMode() === "invite_only";
}

export function safeInternalPath(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export function isInviteOnlyPublicPath(pathname: string) {
  return (
    pathname === "/auth/login" ||
    pathname.startsWith("/auth/login/") ||
    pathname === "/auth/confirm" ||
    pathname.startsWith("/auth/confirm/") ||
    pathname === "/offline"
  );
}
