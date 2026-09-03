# Deployment to Vercel

## 全体構成

```mermaid
flowchart LR
    G["GitHub Repository"] --> V["Vercel Project"]
    V --> N["Next.js App"]
    N --> A["Supabase Auth"]
    N --> D["Supabase Database"]
    U["User"] --> N
```

## GitHub連携

Vercel で New Project を作成し、対象 GitHub リポジトリを Import します。Framework Preset は `Next.js` のままで利用します。

## Environment Variables

Vercel Project Settings に以下を登録します。

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`（推奨: Production URL）

Production / Preview / Development の適用範囲を確認してください。

```mermaid
flowchart TD
    E["Environment Variables"] --> P["Production"]
    E --> R["Preview"]
    E --> D["Development"]
    P --> P1["本番URL / 本番Supabase設定"]
    R --> R1["Preview認証を使う場合はRedirect URLも確認"]
```

## Supabase Auth URL

Supabase Dashboard の Authentication URL Configuration へVercel URLを登録します。

例:

```text
Site URL: https://your-app.vercel.app
Redirect URL: https://your-app.vercel.app/**
```

Preview DeployでAuth確認する場合は、許可するPreview URLの運用方針も決めてください。

## デプロイフロー

```mermaid
flowchart TD
    F["feature branch"] --> PR["Pull Request"]
    PR --> CI["GitHub Actions CI"]
    CI --> VP["Vercel Preview"]
    VP --> CK["動作確認"]
    CK --> M["main merge"]
    M --> PROD["Production deploy"]
```

## デプロイ後確認

```mermaid
flowchart TD
    A["Production deploy完了"] --> B["/ 表示"]
    A --> C["/api/health"]
    A --> D["Login / Signup / Signout"]
    D --> E["確認メール → /auth/confirm"]
    E --> F["Todo CRUD / RLS"]
    A --> G["PWA Manifest / Service Worker / Offline"]
```

- `/` が表示される
- `/api/health` が `status: ok`
- Login / Signup / Signout
- 確認メールから `/auth/confirm` へ戻れる
- Todo CRUD
- 別ユーザーのTodoをRLSで参照・更新できない
- PWA Manifest / Service Worker / Offline fallback

PWAのService WorkerはProductionでのみ登録します。VercelのHTTPS環境で確認してください。
