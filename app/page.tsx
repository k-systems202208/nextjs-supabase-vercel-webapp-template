import { isSupabaseConfigured } from "@/lib/supabase/env";

const checks = [
  "Next.js App Router",
  "TypeScript strict mode",
  "Supabase SSR client",
  "Next.js 16 proxy.ts",
  "GitHub Actions CI",
  "Vercel ready",
];

export default function Home() {
  const configured = isSupabaseConfigured();

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">WEB APP STARTER</p>
        <h1>Next.js + Supabase + Vercel</h1>
        <p className="lead">
          Clone 後すぐに開発を始めるための、最小で安全な共通テンプレートです。
        </p>

        <div className={`status ${configured ? "ok" : "warn"}`}>
          <strong>Supabase:</strong>{" "}
          {configured
            ? "環境変数が設定されています。"
            : ".env.local を作成して接続情報を設定してください。"}
        </div>
      </section>

      <section className="card">
        <h2>Included</h2>
        <ul>
          {checks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Next step</h2>
        <ol>
          <li><code>.env.example</code> を <code>.env.local</code> にコピー</li>
          <li>Supabase の Project URL / Publishable Key を設定</li>
          <li><code>npm run check</code> で一括検証</li>
          <li>GitHub へ Push して CI を確認</li>
        </ol>
      </section>
    </main>
  );
}
