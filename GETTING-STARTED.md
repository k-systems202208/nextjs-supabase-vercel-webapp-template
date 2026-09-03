# Getting Started

このドキュメントは、このテンプレートをCloneして動作確認し、そこから自分のWebアプリ開発を始めるための手順です。

`todos` / `/dashboard` はSupabase Auth・CRUD・RLSを確認するためのサンプルです。サンプルをそのまま使う必要はありません。独自アプリへ作り替える手順は [docs/CUSTOMIZING.md](docs/CUSTOMIZING.md) を参照してください。

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

自分の新規アプリとして利用する場合は、GitHub上でこのテンプレートから新しいリポジトリを作成するか、Clone後に独自リポジトリへPushしてください。テンプレート本体へ案件固有コードを追加しないことを推奨します。

## 3. 依存関係

`package-lock.json` がコミット済みなので通常は以下を使います。

```powershell
npm ci
```

依存バージョンを意図的に変更する場合だけ `npm install` を使い、更新されたlockfileもコミットします。

## 4. まずテンプレート単体を確認

Supabaseを設定しなくても、トップページとヘルスチェック、品質チェックは確認できます。

```powershell
npm run check
npm run dev
```

- `/` 初期画面
- `/api/health` ヘルスチェック

この時点で `npm run check` が成功することを、カスタマイズ前の基準状態とします。

## 5. Supabase環境変数

認証・サンプルCRUDを利用する場合は設定します。

```powershell
Copy-Item .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
# NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

## 6. サンプルDatabase / RLS

Todoサンプルを動かして仕組みを確認したい場合だけ、Supabase Dashboard → SQL Editor で `supabase/schema.sql` を実行します。

作成される `todos` は authenticatedユーザーにのみCRUD権限を付与し、RLSで本人の行だけを操作可能にします。

独自アプリでは、このSQLをそのまま業務DBとして使うのではなく、自分のテーブル設計・RLS Policyへ置き換えてください。

## 7. Auth URL設定

Supabase Dashboard → Authentication → URL Configuration でローカル開発用URLを登録します。

```text
Site URL: http://localhost:3000
Redirect URL: http://localhost:3000/**
```

本番時はVercel Production URLも追加します。

SSR用に確認メールをカスタマイズする場合は [docs/AUTH-CRUD.md](docs/AUTH-CRUD.md) を参照してください。

## 8. サンプル機能の確認

```powershell
npm run dev
```

- `/auth/sign-up` アカウント作成
- `/auth/login` ログイン
- `/dashboard` Todo CRUD
- `/offline` PWAオフライン画面

ここまで動けば、Auth・RLS・CRUD・PWAの実装例が確認できています。

## 9. 自分のアプリへ作り替える

次は [docs/CUSTOMIZING.md](docs/CUSTOMIZING.md) に沿って、以下を自分のアプリ用に置き換えます。

1. アプリ名・説明
2. トップページ・UI
3. Todoサンプル
4. Supabaseテーブル / RLS
5. PWA名・アイコン
6. 環境変数・URL
7. Vercelプロジェクト

Todoを使わないアプリなら、`/dashboard`、Todo用Server Action、`public.todos` を削除して構いません。認証自体が不要ならAuth機能も削除可能です。

## 10. 品質チェック

変更の区切りごとに実行します。

```powershell
npm run check
```

すべて成功した状態を開発開始点・完了条件にします。

## 11. PWA確認

Service WorkerはProductionでのみ登録します。

```powershell
npm run build
npm start
```

ブラウザのApplication/Manifest/Service Workersで確認します。Auth / Dashboard / APIはオフラインキャッシュ対象外です。

## 12. ChatGPT / Codex

ChatGPT / Codexでは、テンプレートから作成した対象アプリのリポジトリと、変更目的・変更範囲・完了条件を明示します。

例:

```text
このリポジトリは nextjs-supabase-vercel-webapp-template から作成しました。
Todoサンプルは削除して、○○管理アプリを実装してください。
既存のSupabase SSR、RLS方針、CIは維持してください。
完了条件は npm run check 成功です。
```

GitHub Appに対象リポジトリのアクセス権が付与されている場合は、ChatGPTからブランチ作成・Commit・PR・CI確認・mergeまで進められます。

## 13. Gitフロー

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

## 14. CI成功報告ルール

CI成功報告時は必ず次を併記します。

- 修正ソース一覧
- 修正ドキュメント一覧
- 修正または追加したテスト一覧
- CI結果
