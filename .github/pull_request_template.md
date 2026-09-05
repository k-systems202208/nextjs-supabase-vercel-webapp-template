## 対応Issue
Closes #

## 変更内容
- 

## Verification Plan

詳細は `docs/QUALITY-VERIFICATION.md` を参照してください。

- Risk Level: Low / Medium / High
- Important Risk:
- Correct State / Test Oracle:
- Verification Layer: Static / Contract / Build / Browser E2E / Sampleless / Integration / Manual / Operations
- Blocking Signal:
- Falsification / Negative Case:
- Independent Verification:
- Greenが保証する範囲:
- Greenだけでは保証しない範囲:

## テスト
- [ ] `npm run check` を実施した
- [ ] Verification Planで定義したRiskを観測するテスト・確認を実施した
- [ ] 振る舞い変更では正常系だけでなく境界値・異常系を検討した
- [ ] User操作変更では必要なBrowser keyboard E2Eを実施した
- [ ] 必要なSupabase / Vercel実環境確認を実施した

## 影響範囲
- 主な変更ファイル：
- 影響する機能：

## 注意事項
- Supabase Schema / RLS変更：あり / なし
- Auth / Session / Cookieへの影響：あり / なし
- Production env変更：あり / なし
- PWA / Service Workerへの影響：あり / なし
- dependency変更：あり / なし
- Vercel / deployへの影響：あり / なし
- 既存Test Oracle / 契約テスト / E2Eの変更：あり / なし

## ドキュメント
- README更新：必要 / 不要 / 更新済み
- 関連docs更新：必要 / 不要 / 更新済み

## Merge前チェック
- [ ] 対応Issueが日本語で作成されている
- [ ] ブランチ名にIssue番号が含まれている
- [ ] mainへの直接Commit / Pushではない
- [ ] CIの `quality` が成功している
- [ ] Browser keyboard E2Eが成功している
- [ ] Sampleless template smoke testが成功している
- [ ] 意図しない差分がない
- [ ] Production CodeとTest Codeを同時変更した場合、テストを通すためだけにOracleを弱めていない
- [ ] High Risk変更ではAIの自己確認以外のIndependent Verification / Human Judgmentがある
- [ ] `.env.local` / Secret Key / service_role / DB password等が含まれていない
- [ ] README / 関連docsが最新である
- [ ] Squash Mergeでmainへ取り込む
