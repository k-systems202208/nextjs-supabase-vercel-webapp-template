const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function isHttpUrl(value: string | undefined): value is string {
  if (!value) return false;

  try {
    const parsed = new URL(value);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      Boolean(parsed.hostname) &&
      !parsed.username &&
      !parsed.password
    );
  } catch {
    return false;
  }
}

export function isSupabaseConfigured() {
  return Boolean(isHttpUrl(supabaseUrl) && supabasePublishableKey);
}

export function getSupabaseEnv() {
  if (!supabasePublishableKey || !isHttpUrl(supabaseUrl)) {
    throw new Error(
      "Supabase is not configured correctly. Set a valid HTTP(S) NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return {
    url: supabaseUrl,
    publishableKey: supabasePublishableKey,
  };
}
