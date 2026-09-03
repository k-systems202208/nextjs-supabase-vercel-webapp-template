import Link from "next/link";
import { signUp } from "../actions";

type SearchParams = Promise<{ error?: string | string[] }>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignUpPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const error = first(params.error);

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">SUPABASE AUTH</p>
        <h1 className="auth-title">アカウント作成</h1>
        <p className="muted">確認メールを使うメール/パスワード認証のサンプルです。</p>

        {error ? <p className="notice error">{error}</p> : null}

        <form action={signUp} className="form-stack">
          <label>
            メールアドレス
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            パスワード（8文字以上）
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <button type="submit" className="button primary">アカウント作成</button>
        </form>

        <div className="auth-links">
          <Link href="/auth/login">ログインへ戻る</Link>
          <Link href="/">トップへ戻る</Link>
        </div>
      </section>
    </main>
  );
}
