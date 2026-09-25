import Link from "next/link";
import { isInviteOnlyAccess, safeInternalPath } from "@/lib/auth/access";
import { signIn } from "../actions";

type SearchParams = Promise<{
  message?: string | string[];
  error?: string | string[];
  next?: string | string[];
}>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const message = first(params.message);
  const error = first(params.error);
  const next = safeInternalPath(first(params.next));
  const inviteOnly = isInviteOnlyAccess();

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">SUPABASE AUTH</p>
        <h1 className="auth-title">ログイン</h1>
        <p className="muted">
          {inviteOnly
            ? "このアプリは招待制です。招待済みアカウントでログインしてください。"
            : "メールアドレスとパスワードでログインします。"}
        </p>

        {message ? <p className="notice success">{message}</p> : null}
        {error ? <p className="notice error">{error}</p> : null}

        <form action={signIn} className="form-stack">
          <input type="hidden" name="next" value={next} />
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
          {!inviteOnly ? <Link href="/auth/sign-up">新規アカウントを作成</Link> : null}
          <Link href="/">トップへ戻る</Link>
        </div>
      </section>
    </main>
  );
}
