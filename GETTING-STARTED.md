# Getting Started

このドキュメントは、新しい作業者がこのテンプレートを利用して、GitHub Desktop・ChatGPT・Codex のいずれでも開発を始められる状態にするための手順です。

## 1. 前提

- GitHub アカウント
- GitHub Desktop
- Node.js 22
- npm
- Supabase アカウント
- Vercel アカウント

確認:

```powershell
node --version
npm --version
```

## 2. GitHub Desktop で Clone

1. GitHub Desktop を起動
2. `File` → `Clone repository...`
3. 対象リポジトリを選択
4. Local path を決定
5. `Clone`

コマンドの場合:

```bash
git clone https://github.com/k-systems202208/nextjs-supabase-vercel-webapp-template.git
cd nextjs-supabase-vercel-webapp-template
```

## 3. 依存関係をインストール

```powershell
npm install
```

初回は `package-lock.json` が生成されます。内容を確認し、必ず Git 管理へ追加してください。

以後は lockfile を使い、CI も `npm ci` に切り替えるのが基本です。

## 4. Supabase 環境変数

```powershell
Copy-Item .env.example .env.local
```

`.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
```

値は Supabase Dashboard の Connect 画面から取得します。

## 5. 起動

```powershell
npm run dev
```

- アプリ: `http://localhost:3000`
- ヘルスチェック: `http://localhost:3000/api/health`

Supabase未設定でもトップページは起動できます。

## 6. 開発前チェック

```powershell
npm run check
```

すべて成功した状態を開発開始点とします。

## 7. ChatGPT で開発する場合

ChatGPT に GitHub リポジトリを接続して、対象リポジトリと変更内容を明示します。

例:

```text
@GitHub
k-systems202208/<repository-name> を確認してください。
○○機能を追加してください。
修正後は lint / typecheck / test / build の観点で確認してください。
```

GitHub コネクタに Contents の書き込み権限がない場合、ChatGPT から直接コミットできません。その場合は生成された変更をローカルへ反映して GitHub Desktop から Push します。

## 8. Codex で開発する場合

Codex では Clone 済みローカルリポジトリを作業ディレクトリとして開きます。

作業依頼時には次を明示すると安定します。

- 変更目的
- 変更対象
- 既存仕様を壊さないこと
- テスト条件
- `npm run check` を完了条件にすること

## 9. Git の基本フロー

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

小規模な個人開発でも、変更が大きい場合は feature branch を推奨します。

## 10. 開発完了時に確認するもの

- 修正ソース一覧
- 修正ドキュメント一覧
- 修正または追加したテスト一覧
- CI 結果
- Vercel Preview の確認（利用している場合）

ドキュメントと実装が食い違わないよう、README と docs は随時更新します。
