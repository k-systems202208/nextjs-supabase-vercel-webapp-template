import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">OFFLINE</p>
        <h1 className="auth-title">ネットワークに接続できません</h1>
        <p className="muted">接続が戻ったら再読み込みしてください。</p>
        <Link href="/" className="button secondary">トップへ戻る</Link>
      </section>
    </main>
  );
}
