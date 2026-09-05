# Template Smoke Test

このドキュメントは、このテンプレートを**第三者・初心者が新しいRepositoryとして使い始めても成立するか**を確認するための受入スモークテストです。

目的はTodoサンプル自体を守ることではありません。**Todoサンプルを削除しても共通基盤だけで `npm run check` が成功し、その後に独自featureを追加できること**を確認します。

実際の第三者利用テストで見つかったSupabase / Vercel / GitHub上の注意点は [THIRD-PARTY-VALIDATION.md](THIRD-PARTY-VALIDATION.md) にまとめています。

## 自動CIで確認していること

通常の `quality` jobでは、まずテンプレートをそのまま品質チェックします。

```text
npm run doctor
npm ci
npm run check
npm run test:e2e
```

`npm run test:e2e` ではPlaywright Chromiumを起動し、実際に次を操作します。

- Sign upのメール / パスワードを打鍵
- 短いパスワードのブラウザValidation
- Loginのメール / パスワードを打鍵して送信
- Todoタイトルを打鍵して追加
- Todo完了状態をクリックで切替
- Todoを削除

E2Eは専用fixtureで動くため、実Supabaseのメール認証や秘密情報には依存しません。fixtureは `E2E_TEST_MODE=1` かつ非Productionの場合だけ有効です。

その後、CIの一時workspace上だけで次のTodoサンプルを削除します。

```text
app/(sample)/
features/todos/
supabase/sample/todos.sql
tests/sample.test.mjs
e2e/sample-todos.spec.mjs
```

削除後にもう一度次を実行します。

```text
npm run check
```

これにより、共通基盤のlint / typecheck / test / buildがTodoサンプルへ依存していないことを毎回確認します。

## 第三者利用の実地テスト

テンプレートの大きな構成変更後や、初心者向け導線を変更したときは、以下を一度通します。

画面への打鍵・クリックそのものはCIのBrowser E2Eへ任せます。人が同じ文字入力を繰り返すことは受入条件にしません。人手が必要なのはGitHub / Supabase / Vercelの実サービス設定など、自動fixtureでは確認できない部分です。

### 1. 新しいRepositoryを作る

GitHubで **Use this template** を選択し、テスト用の新しいRepositoryを作成します。

テンプレート本体を直接改造するテストではありません。

**Use this templateではRulesetは引き継がれません。** また、ChatGPTのGitHub連携をRepository限定にしている場合は、新Repositoryを連携対象へ追加します。

### 2. GitHub推奨設定を適用する

GitHub CLIを利用できるWindows環境では、新しいRepositoryをCloneした後、そのRepository自身のスクリプトを実行します。

```powershell
gh auth login
.\scripts\setup-github.ps1 -Repository owner/new-repository
```

別テンプレートのCloneフォルダから実行しないでください。Ruleset JSONは**実行中Repositoryの `github/protect-main.ruleset.json`** を使用します。

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
npm run test:e2e:install
npm run test:e2e
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
app/(sample)/
features/todos/
supabase/sample/todos.sql
tests/sample.test.mjs
e2e/sample-todos.spec.mjs
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
- `authenticated` は一度 `revoke all` して必要な権限だけgrantする
- `user_id` など所有者検索に使うFK列へindexを付ける
- 2ユーザーで所有者RLSを実際に確認する
- Security / Performance Advisorを確認する
- feature固有テストを追加した
- feature固有のブラウザE2Eを追加した
- `npm run check` が成功する
- `npm run test:e2e` が成功する

Todoを削除した場合、`e2e/sample-todos.spec.mjs` を独自feature用のE2Eへ置き換えます。表示だけではなく、主要入力・更新・削除などを実際に打鍵・クリックしてください。

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
  ↓
main CI
```

Git操作に不安がある場合は [../BEGINNER-GUIDE.md](../BEGINNER-GUIDE.md) のREADME 1行変更チュートリアルを先に実施してください。

### 7. Supabase / Vercelの実サービスまで確認する

Supabaseを使う独自featureなら、テスト用ProjectへMigrationを実際に適用します。

Vercel Production URLが確定したら、Vercelへ次を設定します。

```text
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

Supabase **Authentication → URL Configuration** では、Site URLをProduction URLへ設定し、ProductionのRedirect URLは必要な `/auth/confirm` へ限定します。

Production Deploy後は少なくとも次を確認します。

```text
/
/api/health
/auth/sign-up
/auth/login
独自featureの認証必須Route
```

ブラウザ操作の回帰確認はCI E2Eが担当し、Production確認では「実Supabase Authへ接続できる」「RLSが効いている」「Vercel環境変数が正しい」といった実サービス固有の観点を確認します。

## 合格条件

- Use this templateから新しいRepositoryを作成できる
- 新Repositoryへ `Protect main` を適用できる
- `npm run doctor` に致命的エラーがない
- 初期状態で `npm run check` 成功
- Browser keyboard E2E成功
- Todoサンプル削除後も `npm run check` 成功
- 独自feature追加後も `npm run check` / `npm run test:e2e` 成功
- Pull Requestの `quality` CI成功
- Squash Mergeできる
- merge後main CI成功
- Supabase実DBでRLS / 最小権限 / indexを確認できる
- Vercel Production Deployが成功する
- `/api/health`、Auth、独自featureをProduction URLで確認できる

## 失敗した場合

sample削除後に失敗した場合は、まず**共通基盤がTodo固有ファイルを参照していないか**を疑います。

特に確認する場所:

- `tests/core.test.mjs`
- `tests/browser-e2e.test.mjs`
- `tests/template-lifecycle.test.mjs`
- `e2e/auth.spec.mjs`
- `app/` の共通Route
- `lib/`
- `proxy.ts`
- PWA / Service Worker
- README / docsの固定パス参照

サンプルを残すことでCIを通すのではなく、共通基盤とサンプルの依存を切り離して修正してください。
