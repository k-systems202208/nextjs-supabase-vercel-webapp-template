# Template Smoke Test

このドキュメントは、このテンプレートを**第三者・初心者が新しいRepositoryとして使い始めても成立するか**を確認するための受入スモークテストです。

目的はTodoサンプル自体を守ることではありません。**Todoサンプルを削除しても共通基盤だけで `npm run check` が成功し、その後に独自featureを追加できること**を確認します。

## 自動CIで確認していること

通常の `quality` jobでは、まずテンプレートをそのまま品質チェックします。

```text
npm run doctor
npm ci
npm run check
```

その後、CIの一時workspace上だけで次のTodoサンプルを削除します。

```text
app/(sample)/dashboard/
features/todos/
supabase/sample/todos.sql
tests/sample.test.mjs
```

削除後にもう一度次を実行します。

```text
npm run check
```

これにより、共通基盤のlint / typecheck / test / buildがTodoサンプルへ依存していないことを毎回確認します。

## 手動で行う第三者利用テスト

テンプレートの大きな構成変更後や、初心者向け導線を変更したときは、以下を一度通すことを推奨します。

### 1. 新しいRepositoryを作る

GitHubで **Use this template** を選択し、テスト用の新しいRepositoryを作成します。

テンプレート本体を直接改造するテストではありません。

### 2. GitHub推奨設定を適用する

GitHub CLIを利用できるWindows環境では、新しいRepositoryをCloneした後に実行します。

```powershell
gh auth login
.\scripts\setup-github.ps1
```

確認事項:

- Pull Request必須
- `quality` Required Status Check
- Conversation resolution必須
- Linear history
- Squash Merge only
- Force push禁止
- main削除禁止

詳細は [GITHUB-SETUP.md](GITHUB-SETUP.md) を参照してください。

### 3. 基準状態を確認する

```powershell
npm run doctor
npm ci
npm run check
```

ここで失敗する場合は、カスタマイズを始めず先に原因を解消します。

必要なら開発サーバーも起動します。

```powershell
Copy-Item .env.example .env.local
npm run dev
```

Supabase未設定でも `/` と `/api/health` は確認できます。

### 4. Todoサンプルを削除する

Todoを使わない新規アプリを想定して次を削除します。

```text
app/(sample)/dashboard/
features/todos/
supabase/sample/todos.sql
tests/sample.test.mjs
```

削除後:

```powershell
npm run check
```

**ここで成功することがテンプレートの重要な受入条件です。**

### 5. 小さな独自featureを追加する

Todoをコピーすることを目的にせず、例えば `/equipment` のような小さな独自画面を1つ追加します。

設計方針は [EXTENDING.md](EXTENDING.md) を参照してください。

最低限確認すること:

- feature固有コードを共通coreへ混ぜていない
- SecretをClient Componentへ渡していない
- Databaseを使う場合はRLSを設計している
- feature固有テストを追加した
- `npm run check` が成功する

### 6. Gitフローを1回通す

```text
Issue
  ↓
Issue番号入りBranch
  ↓
Commit / Push
  ↓
Pull Request
  ↓
quality CI
  ↓
Squash Merge
```

Git操作に不安がある場合は [../BEGINNER-GUIDE.md](../BEGINNER-GUIDE.md) のREADME 1行変更チュートリアルを先に実施してください。

## 合格条件

- Use this templateから新しいRepositoryを作成できる
- `npm run doctor` に致命的エラーがない
- 初期状態で `npm run check` 成功
- Todoサンプル削除後も `npm run check` 成功
- 独自feature追加後も `npm run check` 成功
- Pull Requestの `quality` CI成功
- Squash Mergeできる

## 失敗した場合

sample削除後に失敗した場合は、まず**共通基盤がTodo固有ファイルを参照していないか**を疑います。

特に確認する場所:

- `tests/core.test.mjs`
- `tests/template-lifecycle.test.mjs`
- `app/` の共通Route
- `lib/`
- `proxy.ts`
- PWA / Service Worker
- README / docsの固定パス参照

サンプルを残すことでCIを通すのではなく、共通基盤とサンプルの依存を切り離して修正してください。
