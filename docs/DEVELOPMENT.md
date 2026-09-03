# Development

## 基本ルール

変更前に目的を明確にし、変更後は次を実行します。

```powershell
npm run check
```

## CI 完了報告

CI 成功をもって作業完了と報告する場合、最低限以下を併記します。

1. 修正ソース
2. 修正ドキュメント
3. 修正・追加テスト
4. CI結果

## ブランチ

推奨:

- `main`: 安定版
- `feature/<name>`: 新機能
- `fix/<name>`: 不具合修正
- `docs/<name>`: ドキュメントのみ

## Commit

変更理由が分かる日本語または Conventional Commits 形式を推奨します。

例:

```text
feat: ログイン画面を追加
fix: セッション更新処理を修正
docs: Vercelデプロイ手順を更新
```

## Pull Request

PRには次を記載します。

- 目的
- 変更内容
- 確認方法
- 影響範囲
- 未対応事項

## README 更新

以下が変わった場合は README / docs も同じ変更で更新します。

- セットアップ手順
- 環境変数
- 開発コマンド
- デプロイ方法
- ディレクトリ構成
- CIルール
