# Next.js + Supabase + Vercel Web App Template

Next.js App Router、Supabase、Vercel を使った Web アプリ開発をすぐに始めるための共通テンプレートです。

新規案件ごとに同じ初期設定を繰り返さず、Clone 後すぐに実装へ入れることを目的にしています。

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

- Next.js App Router の最小構成
- Supabase Browser / Server Client
- Next.js 16 の `proxy.ts` による Supabase Auth セッション更新
- Publishable Key 前提の環境変数テンプレート
- `/api/health` ヘルスチェック
- ESLint / TypeScript / スモークテスト / Build
- GitHub Actions CI
- Vercel デプロイ手順
- GitHub Desktop、ChatGPT、Codex を使った開発手順

## クイックスタート

```bash
git clone https://github.com/k-systems202208/nextjs-supabase-vercel-webapp-template.git
cd nextjs-supabase-vercel-webapp-template
npm install
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
npm run dev
```

`.env.local` に Supabase の Project URL と Publishable Key を設定します。

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
```

ブラウザで `http://localhost:3000` を開きます。

Supabase の設定前でもトップページと `/api/health` は起動できます。

## 開発コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript 型チェック |
| `npm test` | テンプレートのスモークテスト |
| `npm run build` | 本番ビルド |
| `npm run check` | lint → typecheck → test → build を一括実行 |

## ドキュメント

- [GETTING-STARTED.md](GETTING-STARTED.md) - Clone から開発開始まで
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - 構成と設計方針
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - 日常の開発・Git・CI 運用
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Vercel デプロイ
- [docs/SECURITY.md](docs/SECURITY.md) - Supabase / 環境変数のセキュリティ方針

## CI

`main` への Push および Pull Request で次を実行します。

1. 依存関係のインストール
2. ESLint
3. TypeScript 型チェック
4. スモークテスト
5. Next.js 本番ビルド

初回 `npm install` で `package-lock.json` が生成されたら、必ずリポジトリへコミットしてください。その後 CI の install を `npm ci` に切り替えることを推奨します。

## Supabase の重要事項

ブラウザで使用するのは **Publishable Key** のみです。

`service_role` / Secret Key を `NEXT_PUBLIC_` 付きの環境変数へ設定したり、GitHub にコミットしたりしないでください。

Database の公開 schema に作成するテーブルは原則 RLS (Row Level Security) を有効にし、用途に合った Policy を作成してください。

## テンプレートとしての運用

このリポジトリにはアプリ固有仕様を直接積み上げず、新しいアプリを始める際の土台として利用することを推奨します。
