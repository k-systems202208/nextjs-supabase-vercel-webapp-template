import Link from "next/link";
import { signIn } from "../actions";

type SearchParams = Promise<{
  message?: string | string[];
  error?: string | string[];
}>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const message = first(params.message);
  const error = first(params.error);

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">SUPABASE AUTH</p>
        <h1 className="auth-title">ログイン</h1>
        <p className="muted">メールアドレスとパスワードでログインします。</p>

        {message ? <p className="notice success">{message}</p> : null}
        {error ? <p className="notice error">{error}</p> : null}

        <form action={signIn} className="form-stack">
          <label>
            メールアドレス
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            パスワード
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" className="button primary">ログイン</button>
        </form>

        <div className="auth-links">
          <Link href="/auth/sign-up">新規アカウントを作成</Link>
          <Link href="/">トップへ戻る</Link>
        </div>
      </section>
    </main>
  );
}
