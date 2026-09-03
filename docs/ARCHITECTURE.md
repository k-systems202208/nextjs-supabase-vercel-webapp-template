# Architecture

## 目的

このテンプレートは「最小構成」「再利用しやすい」「セキュリティ上の危険な初期値を持たない」を優先します。

## ディレクトリ

```text
app/
  api/health/route.ts  ヘルスチェック
  layout.tsx           ルートレイアウト
  page.tsx             初期画面
lib/
  supabase/
    client.ts           Browser Client
    server.ts           Server Client
    proxy.ts            Auth Cookie 更新
    env.ts              環境変数検証
proxy.ts                Next.js 16 Proxy entry
.github/workflows/
  ci.yml                CI
docs/                    運用ドキュメント
tests/                   最小スモークテスト
```

## Server / Client の境界

- Browser Component から Supabase を呼ぶ場合: `lib/supabase/client.ts`
- Server Component / Server Action / Route Handler: `lib/supabase/server.ts`
- Cookie のセッション更新: `proxy.ts` → `lib/supabase/proxy.ts`

Server Component で無理に Cookie を更新せず、Proxy をセッション更新の中心にします。

## Auth と認可

Proxy はセッション Cookie の更新を担当しますが、それだけで認可済みとはみなしません。

保護ページ、Server Action、Route Handler は各処理でユーザー情報と権限を検証してください。

DBアクセスでは RLS を認可の主要な防御層として利用します。

## UI

テンプレートでは UI ライブラリを固定しません。

Tailwind CSS、shadcn/ui 等は案件要件に応じて追加します。共通テンプレートに最初から大量の依存を持たせない方針です。
