# Quality Verification

このテンプレートでは、**CIがGreenであることを品質そのものとは扱いません。**

Greenは「現在定義されている評価条件を満たした」というSignalです。変更を信頼できるかは、その前に **何がRiskで、何を正しい状態とし、どのLayerで、どのFailure Signalを使って確認したか** で判断します。

AI / Coding Agentへ実装・テスト・修正を任せる場合も、この原則は変わりません。

## Verification Designの基本

変更を始める前に、最低限次を定義します。

```text
Risk
  ↓
Correct State / Test Oracle
  ↓
Verification Layer
  ↓
Blocking Signal
  ↓
Independent Verification / Human Judgment
```

### 1. Risk

「何が壊れたら困るか」を先に言語化します。

例:

- 未認証ユーザーが保護画面へ入れる
- RLSを外して他利用者のデータを読める
- Auth ConfirmのRedirect先が意図しないPathになる
- Service Workerが認証済みResponseをCacheする
- ProductionでE2E fixtureが有効になる
- Supabase URL / envが不正でも起動時に見逃す
- Schema変更で既存データや権限を壊す
- Next.js / React / Supabase / ESLint等の更新で第三者Cloneが再現できなくなる

### 2. Correct State / Test Oracle

Test Oracleは「結果が正しいと判断する基準」です。

HTTP 200やBuild成功だけではなく、必要に応じて次も確認対象にします。

- Redirect URL / status
- HTML Validation
- Browser上の入力・クリック結果
- SupabaseのRow State
- RLS / GRANT
- Session / Cookie更新
- Production envの有効性
- Service Worker Cache対象外Path
- Vercel Productionでの実接続

### 3. Verification Layer

Riskに対して、最も安く・速く・再現性が高いLayerへ検証を置きます。

| Layer | 主な役割 |
| --- | --- |
| Static | ESLint / TypeScriptで構文・型・明確な規約違反を検出 |
| Unit / Contract | 純粋ロジック、Repository契約、env判定、設定ファイル |
| Build | Next.js production buildとの整合 |
| Browser E2E | Auth / form / click / browser behavior |
| Sampleless smoke | Todoサンプル削除後も共通基盤が成立すること |
| Integration / Acceptance | 実Supabase、RLS、確認メール、Vercel Production |
| Operations | `/api/health`、環境変数、Rollback、Production確認 |

全部をBrowser E2EやHuman Reviewに寄せず、Failure Modeに合うLayerを選びます。

### 4. Blocking Signal

「何が失敗したらMergeを止めるか」を明確にします。

このテンプレートの標準Blocking Signal:

- doctor FAIL
- `npm ci` FAIL
- lint FAIL
- typecheck FAIL
- test FAIL
- build FAIL
- Browser keyboard E2E FAIL
- sampleless template smoke FAIL

ただし、これらがすべてGreenでも、Issueで定義したRiskを観測していなければ十分な保証にはなりません。

## Risk Level

PRでは変更のRisk Levelを1つ選びます。

### Low

例:

- typo
- 説明だけのdocs更新
- 振る舞いを変えない明確な整理

最低限:

- 差分確認
- 関連するStatic / Contract check
- docs linkや契約テストがある場合はその確認

### Medium

例:

- Page / Server Actionの振る舞い変更
- Validation変更
- scripts変更
- PWA表示変更
- sample feature変更

最低限:

- `npm run check`
- 正常系
- 境界値または異常系
- 関連するContract Test
- User操作が変わる場合はBrowser E2E

### High

例:

- Auth / Session / Cookie
- RLS / GRANT / Database Schema
- Production env
- Service Workerの認証関連Cache
- E2E fixtureのProduction隔離
- dependency major update
- CI / Ruleset / deploy条件

最低限:

- `npm run check`
- 正常系 + 境界値 + Failure Mode
- 関連Contract / Browser E2E
- CI全Required Check
- 実装者の自己確認とは別の差分・受入観点
- 必要なSupabase / Vercel実環境確認
- Rollback / Recovery観点

High Risk変更は、AIの「問題ありません」という自己申告だけでMerge判断しません。

## Falsification: 正しさの確認だけでなく、壊しにいく

振る舞いを変更するPRでは、可能な範囲で「この実装が間違っていたら失敗するケース」を最低1つ考えます。

例:

- 空文字・短すぎるpassword・不正email
- 不正Supabase URL
- 非HTTP(S) URL
- 未認証アクセス
- 他利用者Rowへの操作
- RLS / GRANT不足
- Productionで `E2E_TEST_MODE=1`
- `/auth` / `/dashboard` / `/api` のService Worker Cache
- Todoサンプル削除後のBuild

正常系だけを追加してGreenにするのではなく、変更のBlind Spotを探します。

## AI / Coding Agent利用時のルール

AIに実装とテストを両方任せても構いません。ただし次を守ります。

1. Issue側でRiskとCorrect Stateを先に定義する
2. Agentへ「テストを通す」だけをGoalとして与えない
3. Production CodeとTest Codeを同時に変更した場合、Test Oracleが都合よく変更されていないか差分確認する
4. 既存契約テストやBrowser E2Eを削除・弱体化する場合は理由をPRへ明記する
5. Build成功やDOM存在確認だけでUser操作の正しさを代用しない
6. AIが作ったTestだけを唯一のQuality Gateにしない
7. High Risk変更ではHuman Judgmentまたは実装Loopと異なる受入観点を残す

## Independent Verification

Independent Verificationは「別の人間が全行レビューする」ことだけを意味しません。

このテンプレートでは、実装Loopと異なる評価軸を組み合わせます。

- ESLint / TypeScript
- Node Contract Test
- Next.js production build
- Playwright Chromium Browser E2E
- sampleless template smoke
- Doctor / env contract
- 実SupabaseのAuth / RLS / Database確認
- Vercel Production受入確認
- High Risk変更に対する人間のJudgment

重要なのはAgentの数ではなく、**評価軸が同じBlind Spotだけを共有しないこと**です。

## PRで記録するVerification Plan

PRテンプレートでは次を記載します。

```text
Risk Level:
Important Risk:
Correct State / Test Oracle:
Verification Layer:
Blocking Signal:
Falsification / Negative Case:
Independent Verification:
Greenが保証する範囲:
Greenだけでは保証しない範囲:
```

すべてを長文にする必要はありません。変更に対して判断可能な粒度で記載します。

## CI成功報告

従来の4点に加えて、品質上重要な変更ではVerification Planの要点も報告します。

1. 修正ソース
2. 修正ドキュメント
3. 修正・追加テスト
4. CI結果
5. 何をRiskとして、どのSignalで確認したか
6. Greenだけでは未保証の範囲が残る場合はその内容

## このテンプレートで採用しないもの

### Test数を増やすこと自体の目標化

Test件数はQualityそのものではありません。重要なInvariant / Failure Modeを観測できることを優先します。

### 全変更のBrowser E2E化

E2Eは高価でFailure原因の切り分けも遅くなります。Static / Contract / Buildで安く確実に止められるRiskはそちらへ置きます。

### Mutation Testingの標準必須化

有用な場面はありますが、この汎用テンプレートでは実行時間・導入コスト・第三者利用時の負担が増えるため標準Gateにはしません。案件側のRiskに応じて追加します。

### AI Reviewerだけを独立検証とみなすこと

AI Reviewは利用できますが、同じContext・同じ評価基準を共有する可能性があります。既存CI、Browser E2E、実Supabase / Vercel確認、人間のJudgmentと組み合わせます。

## 関連ドキュメント

- [DEVELOPMENT.md](DEVELOPMENT.md)
- [TEMPLATE-SMOKE-TEST.md](TEMPLATE-SMOKE-TEST.md)
- [SECURITY.md](SECURITY.md)
- [OPERATIONS.md](OPERATIONS.md)
- [THIRD-PARTY-VALIDATION.md](THIRD-PARTY-VALIDATION.md)
- [../CONTRIBUTING.md](../CONTRIBUTING.md)
