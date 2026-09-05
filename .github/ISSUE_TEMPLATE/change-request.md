---
name: 変更・改善
about: 機能追加、修正、リファクタリング、ドキュメント更新など
labels: ''
assignees: ''
---

## 目的
この変更が必要な理由を日本語で記載してください。

## 対応内容
- 変更する内容
- 追加する内容
- 削除する内容

## Verification Plan

実装前に「何が壊れたら困るか」と「何を正しい状態とするか」を決めます。詳細は `docs/QUALITY-VERIFICATION.md` を参照してください。

- Risk Level: Low / Medium / High
- Important Risk:
- Correct State / Test Oracle:
- Verification Layer: Static / Contract / Build / Browser E2E / Sampleless / Integration / Manual / Operations
- Blocking Signal:
- Falsification / Negative Case:
- Independent Verification:

## 影響範囲
- 対象機能：
- Supabase Schema / RLS変更：あり / なし
- Auth / Session / Cookieへの影響：あり / なし
- Production env変更：あり / なし
- PWA / Service Workerへの影響：あり / なし
- dependency変更：あり / なし
- Vercel / deployへの影響：あり / なし

## 完了条件
- [ ] 実装または修正が完了している
- [ ] Verification Planで定義したRiskを観測できるテスト・確認がある
- [ ] 必要な正常系・境界値・異常系テストが追加・更新されている
- [ ] `npm run check` が成功している
- [ ] User操作変更では必要なBrowser E2Eを確認している
- [ ] README / 関連docsの更新要否を確認している
- [ ] PRを作成し、CI成功後にmainへ取り込める状態になっている
