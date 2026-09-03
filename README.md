# Next.js + Supabase + Vercel Web App Template

Next.js App Router、Supabase、Vercel を使ったWebアプリ開発をすぐに始めるための共通テンプレートです。

認証、所有者RLS付きCRUD、PWA、CIまでを初期実装し、新規案件ごとの定型セットアップを減らします。

## 技術構成

- Next.js 16.3.3 / App Router
- React 19.2.8
- TypeScript 5.9.3
- Supabase (`@supabase/ssr` / `@supabase/supabase-js`)
- Vercel
- ESLint
- GitHub Actions CI
- Node.js 22

## 含まれるもの

- Supabase Browser / Server Client
- `proxy.ts` によるCookie Authセッション更新
- メール/パスワード Login / Signup / Confirm / Signout
- `todos` サンプルCRUD
- `auth.uid() = user_id` のRLS Policy
- Data API向け明示GRANT
- PWA Manifest / Service Worker / Offline fallback
- `/api/health`
- lint / typecheck / test / build
- GitHub Actions CI
- Vercelデプロイ手順
- GitHub Desktop / ChatGPT / Codex 開発手順

## クイックスタート

```bash
git clone https://github.com/k-systems202208/nextjs-supabase-vercel-webapp-template.git
cd nextjs-supabase-vercel-webapp-template
npm ci
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
npm run dev
```

`.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
# NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

次に `supabase/schema.sql` を Supabase SQL Editor で実行します。

Supabase未設定でもトップページと `/api/health` は起動できます。認証/CRUDはSupabase設定後に利用します。

## サンプルURL

- `/auth/login` ログイン
- `/auth/sign-up` サインアップ
- `/dashboard` Todo CRUD（要ログイン）
- `/offline` PWAオフライン画面
- `/api/health` ヘルスチェック

## 開発コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript型チェック |
| `npm test` | スモークテスト |
| `npm run build` | 本番ビルド |
| `npm run check` | lint → typecheck → test → build |

## ドキュメント

- [GETTING-STARTED.md](GETTING-STARTED.md) - Cloneから開発開始まで
- [docs/AUTH-CRUD.md](docs/AUTH-CRUD.md) - Auth / CRUD / RLS
- [docs/PWA.md](docs/PWA.md) - PWAとキャッシュ方針
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - 構成と設計方針
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - 日常の開発・Git・CI
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Vercelデプロイ
- [docs/SECURITY.md](docs/SECURITY.md) - セキュリティ方針

## CI

`main` へのPushおよびPull Requestで `npm ci` → lint → typecheck → test → build を実行します。

## セキュリティ

ブラウザで使用するのはPublishable Keyのみです。Secret Key / `service_role` / DB passwordを `NEXT_PUBLIC_` へ設定したりGitHubへコミットしたりしないでください。

認可はアプリ側チェックだけで完結させず、RLSを最終防御層として維持します。PWAもAuth / Dashboard / APIレスポンスをキャッシュしません。

## テンプレートとしての運用

このリポジトリ自体には案件固有仕様を積み上げず、新しいアプリを始める際の土台として利用することを推奨します。
