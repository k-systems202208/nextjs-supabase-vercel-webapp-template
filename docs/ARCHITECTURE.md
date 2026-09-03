# Architecture

## 目的

このテンプレートは「再利用しやすい」「安全な初期値」「実案件の開始点として十分」を優先します。

## ディレクトリ

```text
app/
  api/health/route.ts      ヘルスチェック
  auth/                    Login / Signup / Confirm
  dashboard/               RLS付きTodo CRUD
  offline/page.tsx         PWAオフライン画面
  manifest.ts              Web App Manifest
  layout.tsx               ルートレイアウト
  page.tsx                 初期画面
components/
  pwa-register.tsx         Service Worker登録
lib/supabase/
  client.ts                Browser Client
  server.ts                Server Client
  proxy.ts                 Auth Cookie更新
  env.ts                   環境変数検証
public/
  sw.js                    Service Worker
  icon-*.png               PWAアイコン
supabase/
  schema.sql               Todo/RLS bootstrap SQL
proxy.ts                    Next.js 16 Proxy entry
.github/workflows/ci.yml    CI
docs/                       運用ドキュメント
tests/                      スモークテスト
```

## Server / Client の境界

- Browser Component: `lib/supabase/client.ts`
- Server Component / Server Action / Route Handler: `lib/supabase/server.ts`
- Cookieセッション更新: `proxy.ts` → `lib/supabase/proxy.ts`

## 多層防御

1. Proxy: Auth Cookie更新
2. Server Component / Action: `getClaims()` で認証確認
3. Supabase RLS: `auth.uid() = user_id` で最終認可

Proxyを通っただけで認可済みとはみなしません。

## PWA

PWAは公開シェルと静的アセットだけをキャッシュし、Auth / Dashboard / APIはキャッシュ対象外にします。

## UI

テンプレートではUIライブラリを固定しません。Tailwind CSS、shadcn/ui等は案件要件に応じて追加します。
