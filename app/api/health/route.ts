import { isSupabaseConfigured } from "@/lib/supabase/env";

export function GET() {
  return Response.json({
    status: "ok",
    service: "nextjs-supabase-vercel-webapp-template",
    supabaseConfigured: isSupabaseConfigured(),
    timestamp: new Date().toISOString(),
  });
}
