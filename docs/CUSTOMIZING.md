# 独自アプリへのカスタマイズ

このテンプレートは、特定業務向けの完成アプリではなく、Next.js App Router + Supabase + Vercel を使ったWebアプリ開発の共通土台です。

Todo CRUDは、Auth・CRUD・RLSの仕組みを確認するための**削除可能なサンプル**です。共通基盤とは分離しているため、新しいアプリではTodoサンプル一式だけを削除・置換できます。

## カスタマイズの全体像

```mermaid
flowchart TD
    T["共通テンプレート"] --> K["残す共通基盤"]
    T --> S["削除可能なTodoサンプル"]
    T --> C["案件ごとに変更"]

    K --> K1["Next.js / Supabase接続"]
    K --> K2["Authセッション更新"]
    K --> K3["RLS前提の設計"]
    K --> K4["PWA / CI / 品質チェック"]

    S --> S1["app/(sample)/dashboard"]
    S --> S2["features/todos"]
    S --> S3["supabase/sample/todos.sql"]
    S --> S4["tests/sample.test.mjs"]

    C --> C1["アプリ名 / UI"]
    C --> C2["独自Database / RLS"]
    C --> C3["環境変数 / URL"]
```

## 1. 最初に決めること

Clone後、実装を始める前に最低限以下を決めます。

- アプリ名
- 目的
- 主な利用者
- 認証が必要か
- 保存するデータ
- データの所有者 / 共有範囲
- 公開範囲
- PWAが必要か
- 本番URL

```mermaid
flowchart LR
    A["目的 / 利用者"] --> B["認証要否"]
    B --> C["データ設計"]
    C --> D["公開範囲 / RLS"]
    D --> E["PWA / 本番URL"]
```

## 2. 共通基盤とサンプルの境界

Todoサンプルは次の4か所に分離しています。

```text
app/(sample)/dashboard/       Todoサンプル画面。Route GroupなのでURLは /dashboard
features/todos/               Todo用Server Action
supabase/sample/todos.sql     Todoテーブル / GRANT / RLS
tests/sample.test.mjs         Todoサンプル専用テスト
```

Todoを使わないアプリでは、上記4か所をまとめて削除してください。

**削除しても残す共通基盤:** 

- `app/auth/`
- `lib/supabase/`
- `proxy.ts`
- `app/api/health/`
- `app/manifest.ts` / `public/sw.js` 等のPWA基本構成
- `tests/core.test.mjs`
- lint / typecheck / build / GitHub Actions CI

`tests/core.test.mjs` はTodoサンプルのファイルやSQLを必須にしていません。そのためTodoサンプルを削除するときは `tests/sample.test.mjs` だけを一緒に削除できます。

## 3. アプリ名・説明を変更する

最低限、以下を自分のアプリに合わせます。

- `package.json` の `name`
- `app/layout.tsx` のmetadata
- `app/manifest.ts` の `name` / `short_name` / `description`
- `README.md`
- `/api/health` のservice名

リポジトリ名も新しいアプリ名へ変更することを推奨します。

## 4. トップページ・UIを置き換える

`app/page.tsx` と `app/globals.css` はテンプレートの案内画面です。アプリ要件に合わせて自由に作り替えてください。

テンプレート側の見た目を維持する必要はありません。

## 5. Todoサンプルを使わない場合

Todoサンプルを削除するときは、次を**セットで**扱います。

```text
app/(sample)/dashboard/
features/todos/
supabase/sample/todos.sql
tests/sample.test.mjs
```

```mermaid
flowchart TD
    T["Todo sample"] --> P["app/(sample)/dashboard"]
    T --> A["features/todos"]
    T --> S["supabase/sample/todos.sql"]
    T --> X["tests/sample.test.mjs"]
```

この4か所を削除した後に `npm run check` を実行し、共通基盤が正常なことを確認します。

`/dashboard` を別用途に再利用する場合は、新しい `app/dashboard/` または任意のRoute Group内へ独自画面を作成して構いません。

## 6. 独自テーブルへ置き換える

Todoサンプルを参考にする場合は `supabase/sample/todos.sql` を読み、アプリ固有のテーブルとRLSを設計します。

例:

```sql
create table public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
```

ただし、サンプルSQLを機械的にコピーするのではなく、実際のデータ所有関係に合わせて設計してください。

```mermaid
flowchart LR
    A["Todo sample SQL"] --> B["独自テーブル"]
    B --> C["所有者 / 共有範囲"]
    C --> D["GRANT"]
    D --> E["RLS Policy"]
```

独自アプリでDB変更を継続管理する段階では、Supabase CLI migrationへの移行を推奨します。詳細は [DEVELOPMENT.md](DEVELOPMENT.md) を参照してください。

## 7. RLSを設計する

公開schemaの業務テーブルでは、原則としてRLSを有効化します。

```sql
alter table public.items enable row level security;
```

ユーザー本人だけが扱うデータなら、サンプルと同様に `auth.uid()` と所有者列を比較します。

```sql
using (auth.uid() = user_id)
```

共有データ、管理者データ、組織単位データでは必要なPolicyが異なります。アプリ要件に合わせて設計してください。

アプリ側の画面制御だけを認可境界にせず、DBのRLSを最終防御層として維持します。

```mermaid
flowchart TD
    U["ユーザー"] --> APP["画面 / Server Action"]
    APP --> DB["Database"]
    DB --> RLS{"RLS Policy"}
    RLS -->|"許可"| OK["データ操作"]
    RLS -->|"拒否"| NG["アクセス拒否"]
```

## 8. 認証を使わない場合

公開サイトなど認証不要のアプリではAuth関連を削除できます。ただしこれはTodoサンプル削除とは別のカスタマイズです。

主な対象:

```text
app/auth/
proxy.ts のAuthセッション更新
lib/supabase/proxy.ts
```

認証を外す場合はAuth関連のテスト・ドキュメント・リダイレクトも合わせて見直してください。

Supabaseをブラウザから利用する場合のRLSと権限設計は、認証の有無にかかわらず必要です。

## 9. PWAをカスタマイズする

以下を自分のアプリ用に変更します。

- `app/manifest.ts`
- `public/icon-192.png`
- `public/icon-512.png`
- `app/offline/page.tsx`

Service Workerのキャッシュ方針は、個人情報や認証後レスポンスを不用意に保存しないよう注意してください。

PWAが不要なら、Manifest・Service Worker・登録コンポーネントを削除できます。PWAもTodoサンプルとは別の共通機能です。

## 10. 環境変数を設定する

`.env.example` は第三者が必要な設定項目を把握するためのテンプレートです。

新しい環境変数を追加したら、秘密値そのものではなく変数名とダミー値だけを `.env.example` に追記してください。

秘密情報はGitHubへコミットしません。

## 11. Vercelへ接続する

新しいアプリ用のGitHubリポジトリをVercelへImportし、Supabase関連の環境変数を設定します。

Supabase Authを使う場合は、Vercel Production URLをSupabase AuthenticationのSite URL / Redirect URLにも追加します。

詳細は [DEPLOYMENT.md](DEPLOYMENT.md) を参照してください。

## 12. テストをアプリ仕様へ置き換える

テストは役割を分離しています。

```text
tests/core.test.mjs      共通基盤の保護
tests/sample.test.mjs    Todoサンプルの保護
```

Todoを削除したら `tests/sample.test.mjs` も削除し、代わりにそのアプリの重要仕様をテストしてください。

`tests/core.test.mjs` は原則残します。

少なくとも以下は維持することを推奨します。

- 依存関係の固定確認
- lint
- TypeScript型チェック
- 秘密情報の混入防止
- 主要ルート / 主要機能のテスト
- production build

## 13. カスタマイズ後の完了条件

以下を満たした状態を、新しいアプリの開発開始点とします。

```powershell
npm run check
```

```mermaid
flowchart LR
    A["カスタマイズ"] --> B["lint"]
    B --> C["typecheck"]
    C --> D["test"]
    D --> E["build"]
    E --> F["GitHub Actions CI"]
```

さらに確認します。

- アプリ名・説明がテンプレートのまま残っていない
- 不要なTodoサンプル4か所が残っていない
- 独自テーブルのRLSが設計されている
- `.env.example` が最新
- PWA名・アイコンが独自アプリ用になっている
- READMEが独自アプリの内容になっている
- GitHub Actions CIが成功している

## 14. このテンプレート本体へ追加しないもの

このテンプレート本体では、特定アプリだけに必要な業務機能を増やしません。

たとえば以下は、テンプレートから作成した各アプリ側で実装します。

- Todoの期限・タグ・通知などの機能拡張
- 特定会社向けマスタ
- 特定業務の画面
- 固有の外部API連携
- 固有の権限ロール

テンプレート本体へ追加するのは、複数のWebアプリで再利用価値がある共通基盤・安全策・開発手順を基本とします。
