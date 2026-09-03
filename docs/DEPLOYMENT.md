# Deployment to Vercel

## GitHub連携

Vercel で New Project を作成し、対象 GitHub リポジトリを Import します。

基本的に Next.js は自動認識されるため、Framework Preset は `Next.js` のままで利用します。

## Environment Variables

Vercel Project Settings に以下を登録します。

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Production / Preview / Development の適用範囲を確認してください。

## デプロイフロー

推奨:

```text
feature branch
  ↓
Pull Request
  ↓
GitHub Actions CI
  ↓
Vercel Preview
  ↓
確認
  ↓
main merge
  ↓
Production deploy
```

## デプロイ後確認

- トップページが表示される
- `/api/health` が `status: ok` を返す
- Supabase 設定済みなら `supabaseConfigured: true`
- Auth 使用時はログイン・ログアウト・Cookie更新
- Supabase RLS が意図どおり機能している

## 将来の自動化

安定稼働後に、必要であればローカル・社内環境への自動デプロイを追加できます。

ただし Production のデプロイ経路とローカル同期は分離し、CI成功・レビュー・ロールバック方法を決めてから導入します。
