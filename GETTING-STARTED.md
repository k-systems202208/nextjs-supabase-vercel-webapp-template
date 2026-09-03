# Getting Started

このドキュメントは、このテンプレートをCloneしてSupabase Auth / CRUD / PWAまで動かす手順です。

## 1. 前提

- GitHubアカウント
- GitHub Desktop
- Node.js 22
- npm
- Supabaseアカウント
- Vercelアカウント（本番デプロイ時）

```powershell
node --version
npm --version
```

## 2. Clone

GitHub Desktop: `File` → `Clone repository...`

または:

```bash
git clone https://github.com/k-systems202208/nextjs-supabase-vercel-webapp-template.git
cd nextjs-supabase-vercel-webapp-template
```

## 3. 依存関係

`package-lock.json` がコミット済みなので通常は以下を使います。

```powershell
npm ci
```

依存バージョンを意図的に変更する場合だけ `npm install` を使い、更新されたlockfileもコミットします。

## 4. Supabase環境変数

```powershell
Copy-Item .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
# NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

## 5. Database / RLS

Supabase Dashboard → SQL Editor で `supabase/schema.sql` を実行します。

作成される `todos` は authenticatedユーザーにのみCRUD権限を付与し、RLSで本人の行だけを操作可能にします。

## 6. Auth URL設定

Supabase Dashboard → Authentication → URL Configuration でローカル開発用URLを登録します。

```text
Site URL: http://localhost:3000
Redirect URL: http://localhost:3000/**
```

本番時はVercel Production URLも追加します。

SSR用に確認メールをカスタマイズする場合は [docs/AUTH-CRUD.md](docs/AUTH-CRUD.md) を参照してください。

## 7. 起動

```powershell
npm run dev
```

- `/` 初期画面
- `/auth/sign-up` アカウント作成
- `/auth/login` ログイン
- `/dashboard` Todo CRUD
- `/api/health` ヘルスチェック

## 8. 品質チェック

```powershell
npm run check
```

すべて成功した状態を開発開始点・完了条件にします。

## 9. PWA確認

Service WorkerはProductionでのみ登録します。

```powershell
npm run build
npm start
```

ブラウザのApplication/Manifest/Service Workersで確認します。Auth / Dashboard / APIはオフラインキャッシュ対象外です。

## 10. ChatGPT / Codex

ChatGPTは設計、GitHub内容確認、レビュー、Issue/PR管理に利用できます。接続権限によってコード書き込みができない場合は、ローカル変更をGitHub DesktopからPushします。

CodexではClone済みローカルリポジトリを作業ディレクトリとして開き、完了条件に `npm run check` を指定します。

## 11. Gitフロー

```text
main
  ↓
feature/xxxx
  ↓
実装
  ↓
npm run check
  ↓
commit / push
  ↓
Pull Request
  ↓
GitHub Actions CI
  ↓
merge
```

## 12. CI成功報告ルール

CI成功報告時は必ず次を併記します。

- 修正ソース一覧
- 修正ドキュメント一覧
- 修正または追加したテスト一覧
- CI結果
