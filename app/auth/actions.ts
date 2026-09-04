"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

function readText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function authErrorUrl(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

async function requestOrigin() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configuredSiteUrl) return configuredSiteUrl;

  const headerStore = await headers();
  return headerStore.get("origin") ?? "http://localhost:3000";
}

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(authErrorUrl("/auth/login", "Supabase の環境変数を設定してください。"));
  }

  const email = readText(formData, "email");
  const password = readText(formData, "password");

  if (!email || !password) {
    redirect(authErrorUrl("/auth/login", "メールアドレスとパスワードを入力してください。"));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(authErrorUrl("/auth/login", "メールアドレスまたはパスワードを確認してください。"));
  }

  // Auth is common infrastructure. Do not couple its default destination to the optional Todo sample.
  redirect("/");
}

export async function signUp(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(authErrorUrl("/auth/sign-up", "Supabase の環境変数を設定してください。"));
  }

  const email = readText(formData, "email");
  const password = readText(formData, "password");

  if (!email || password.length < 8) {
    redirect(authErrorUrl("/auth/sign-up", "メールアドレスと8文字以上のパスワードを入力してください。"));
  }

  const supabase = await createClient();
  const origin = await requestOrigin();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/`,
    },
  });

  if (error) {
    redirect(authErrorUrl("/auth/sign-up", "アカウントを作成できませんでした。入力内容を確認してください。"));
  }

  redirect(
    `/auth/login?message=${encodeURIComponent("確認メールを送信しました。メール内のリンクを開いてください。")}`,
  );
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
