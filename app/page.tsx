import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const checks = [
  "Next.js 16 App Router / TypeScript",
  "Supabase SSR Cookie Auth",
  "ログイン / サインアップ",
  "削除可能なRLS付きTodo CRUDサンプル",
  "Installable PWA / Offline fallback",
  "GitHub Actions CI / Vercel ready",
];

export default function Home() {
  const configured = isSupabaseConfigured();

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">WEB APP STARTER</p>
        <h1>Next.js + Supabase + Vercel</h1>
        <p className="lead">
          認証・RLS・PWA・CIなどの共通基盤と、削除可能なTodo CRUDサンプルを分離したWebアプリテンプレートです。
        </p>

        <div className={`status ${configured ? "ok" : "warn"}`}>
          <strong>Supabase:</strong>{" "}
          {configured
            ? "環境変数が設定されています。認証とTodoサンプルを試せます。"
            : ".env.local を作成して接続情報を設定してください。"}
        </div>

        <div className="hero-actions">
          <Link className="button primary" href={configured ? "/auth/login" : "/dashboard"}>
            {configured ? "認証サンプルを開く" : "セットアップ状態を確認"}
          </Link>
          <Link className="button secondary" href="/dashboard">Todo Dashboard</Link>
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
        <h2>初回セットアップ</h2>
        <ol>
          <li><code>.env.example</code> を <code>.env.local</code> にコピー</li>
          <li>Supabase Project URL / Publishable Key を設定</li>
          <li>Todoサンプルを試す場合だけ <code>supabase/sample/todos.sql</code> を SQL Editor で実行</li>
          <li>Supabase Auth の Site URL / Redirect URLs を設定</li>
          <li><code>npm run check</code> で一括検証</li>
        </ol>
      </section>
    </main>
  );
}
