import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isInviteOnlyAccess, isInviteOnlyPublicPath } from "@/lib/auth/access";
import { isBrowserE2EMode } from "@/lib/e2e/mode";
import { getSupabaseEnv, isSupabaseConfigured } from "./env";

function copyAuthResponse(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));

  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = source.headers.get(header);
    if (value) target.headers.set(header, value);
  }

  return target;
}

function loginRedirect(request: NextRequest, response: NextResponse) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/auth/login";
  loginUrl.search = "";
  loginUrl.searchParams.set(
    "next",
    request.nextUrl.pathname + request.nextUrl.search,
  );
  return copyAuthResponse(response, NextResponse.redirect(loginUrl));
}

function signupDisabledRedirect(request: NextRequest, response: NextResponse) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/auth/login";
  loginUrl.search = "";
  loginUrl.searchParams.set(
    "message",
    "このアプリは招待制です。招待済みアカウントでログインしてください。",
  );
  return copyAuthResponse(response, NextResponse.redirect(loginUrl));
}

function isSignupPath(pathname: string) {
  return pathname === "/auth/sign-up" || pathname.startsWith("/auth/sign-up/");
}

export async function updateSession(request: NextRequest) {
  const inviteOnly = isInviteOnlyAccess();

  if (inviteOnly && isBrowserE2EMode()) {
    const response = NextResponse.next({ request });

    if (isSignupPath(request.nextUrl.pathname)) {
      return signupDisabledRedirect(request, response);
    }

    const authenticated = request.cookies.get("e2e-auth")?.value === "1";
    if (!authenticated && !isInviteOnlyPublicPath(request.nextUrl.pathname)) {
      return loginRedirect(request, response);
    }

    return response;
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  const { url, publishableKey } = getSupabaseEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );

        Object.entries(headers).forEach(([key, value]) =>
          response.headers.set(key, value),
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();

  if (!inviteOnly) {
    return response;
  }

  if (isSignupPath(request.nextUrl.pathname)) {
    return signupDisabledRedirect(request, response);
  }

  const authenticated = Boolean(data?.claims?.sub);
  if (!authenticated && !isInviteOnlyPublicPath(request.nextUrl.pathname)) {
    return loginRedirect(request, response);
  }

  return response;
}
