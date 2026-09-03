# PWA

## 構成

- `app/manifest.ts` Web App Manifest
- `public/icon-192.png` / `public/icon-512.png` インストール用アイコン
- `components/pwa-register.tsx` Service Worker 登録
- `public/sw.js` キャッシュ処理
- `/offline` オフラインフォールバック

```mermaid
flowchart LR
    M["app/manifest.ts"] --> WM["Web App Manifest"]
    I1["icon-192.png"] --> ICON["Install Icon"]
    I2["icon-512.png"] --> ICON
    R["pwa-register.tsx"] --> SW["public/sw.js"]
    SW --> OFF["/offline fallback"]
```

Service Worker はProductionビルドでのみ登録します。開発中の古いキャッシュによる混乱を避けるためです。

## キャッシュ方針

ユーザー固有データを端末キャッシュへ残さないため、次のパスはService Workerでキャッシュしません。

- `/auth/**`
- `/dashboard/**`
- `/api/**`

```mermaid
flowchart TD
    R["GET Request"] --> Q{"Pathは?"}
    Q -->|"/auth/**"| N1["キャッシュしない"]
    Q -->|"/dashboard/**"| N2["キャッシュしない"]
    Q -->|"/api/**"| N3["キャッシュしない"]
    Q -->|"公開ページ / 静的アセット"| C["必要最小限をキャッシュ"]
```

静的アセットと公開ページの最低限だけを対象にしています。案件固有のオフライン要件がある場合は、認証情報・個人情報・機密情報の扱いを決めてからキャッシュ対象を拡張してください。

## オフライン時の考え方

```mermaid
flowchart LR
    U["User"] --> SW["Service Worker"]
    SW -->|"Network available"| N["Network response"]
    SW -->|"Network unavailable / 公開ページ"| C["Cache / Offline fallback"]
    SW -->|"認証・API系"| X["キャッシュを利用しない"]
```

## HTTPS

Service Worker / PWA は本番ではHTTPSが前提です。VercelデプロイではHTTPSが自動提供されます。
