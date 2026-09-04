# Architecture

## 目的

このテンプレートは「再利用しやすい」「安全な初期値」「実案件の開始点として十分」に加え、**共通基盤と削除可能な業務サンプルを混ぜないこと**を優先します。

## システム全体像

```mermaid
flowchart LR
    U["Browser"] --> N["Next.js App Router"]
    N --> P["proxy.ts"]
    N --> SB["Supabase Client"]
    SB --> SA["Supabase Auth"]
    SB --> DB["Supabase Database"]
    N --> SW["Service Worker"]
    N --> V["Vercel"]
    N --> SAMPLE["Optional Todo Sample"]
```

## 共通基盤とサンプル

```mermaid
flowchart TD
    T["Template"] --> C["Core"]
    T --> S["Sample"]

    C --> C1["app/auth"]
    C --> C2["lib/supabase"]
    C --> C3["proxy.ts"]
    C --> C4["PWA / health / CI"]

    S --> S1["app/(sample)/dashboard"]
    S --> S2["features/todos"]
    S --> S3["supabase/sample/todos.sql"]
    S --> S4["tests/sample.test.mjs"]
```

Todoサンプルを削除しても、Supabase接続・Auth・PWA・品質ゲートなどの共通基盤は独立して残せる構成にします。

## ディレクトリ

```text
app/
  api/health/route.ts          ヘルスチェック
  auth/                        Login / Signup / Confirm
  (sample)/dashboard/          削除可能なTodo CRUD画面（URLは /dashboard）
  offline/page.tsx             PWAオフライン画面
  manifest.ts                  Web App Manifest
  layout.tsx                   ルートレイアウト
  page.tsx                     初期画面
features/
  todos/actions.ts             削除可能なTodo業務処理
components/
  pwa-register.tsx             Service Worker登録
lib/supabase/
  client.ts                    Browser Client
  server.ts                    Server Client
  proxy.ts                     Auth Cookie更新
  env.ts                       環境変数検証
public/
  sw.js                        Service Worker
  icon-*.png                   PWAアイコン
supabase/
  sample/todos.sql             削除可能なTodo/RLSサンプルSQL
proxy.ts                       Next.js 16 Proxy entry
.github/workflows/ci.yml        CI
docs/                           運用ドキュメント
tests/
  core.test.mjs                共通基盤テスト
  sample.test.mjs              Todoサンプル専用テスト
```

```mermaid
flowchart TD
    ROOT["Repository"] --> APP["app/"]
    ROOT --> FEATURES["features/"]
    ROOT --> LIB["lib/supabase/"]
    ROOT --> COMP["components/"]
    ROOT --> PUB["public/"]
    ROOT --> SUPA["supabase/"]
    ROOT --> GH[".github/workflows/"]
    ROOT --> DOCS["docs/"]
    ROOT --> TESTS["tests/"]

    APP --> AUTH["auth/"]
    APP --> DASH["(sample)/dashboard/"]
    FEATURES --> TODOS["todos/"]
    SUPA --> SAMPLESQL["sample/todos.sql"]
    TESTS --> CORETEST["core.test.mjs"]
    TESTS --> SAMPLETEST["sample.test.mjs"]
```

## Server / Client の境界

- Browser Component: `lib/supabase/client.ts`
- Server Component / Server Action / Route Handler: `lib/supabase/server.ts`
- Cookieセッション更新: `proxy.ts` → `lib/supabase/proxy.ts`
- TodoサンプルのServer Action: `features/todos/actions.ts`

```mermaid
sequenceDiagram
    participant B as Browser
    participant P as proxy.ts
    participant A as App Router
    participant S as Supabase
    B->>P: Request
    P->>S: Cookie / Token確認・更新
    S-->>P: 更新結果
    P->>A: Requestを引き渡す
    A->>S: 必要なAuth / Dataアクセス
    S-->>A: Result
    A-->>B: Response
```

## 多層防御

1. Proxy: Auth Cookie更新
2. Server Component / Action: `getClaims()` で認証確認
3. Supabase RLS: データ所有・共有ルールで最終認可

Proxyを通っただけで認可済みとはみなしません。

```mermaid
flowchart TD
    R["Request"] --> P["Proxy: Cookie更新"]
    P --> S["Server: getClaims()"]
    S --> D["Databaseアクセス"]
    D --> RLS{"RLS Policy"}
    RLS -->|"許可"| OK["データ操作"]
    RLS -->|"拒否"| NG["アクセス拒否"]
```

## PWA

PWAは公開シェルと静的アセットだけをキャッシュし、Auth / Dashboard / APIはキャッシュ対象外にします。

## UI

テンプレートではUIライブラリを固定しません。Tailwind CSS、shadcn/ui等は案件要件に応じて追加します。
