# Security

## Supabase API Key

フロントエンドで使用可能:

- Project URL
- Publishable Key

フロントエンドで使用禁止:

- Secret Key
- `service_role`
- DB password

`NEXT_PUBLIC_` が付いた環境変数はブラウザへ公開される前提で扱います。

## RLS

Supabase Data API からアクセス可能な schema、特に `public` のテーブルは原則 RLS を有効にします。

Policy は単に `TO authenticated` とするだけでなく、所有者判定など実際の認可条件を入れます。

例:

```sql
create policy "users can read own rows"
on public.example
for select
to authenticated
using ((select auth.uid()) = user_id);
```

UPDATE Policy では `USING` と `WITH CHECK` の両方を検討します。

## Authorization data

ユーザーが編集可能な `user_metadata` を権限判定には使用しません。

権限情報が必要な場合は信頼できるサーバー側データ、DB、または適切に管理された `app_metadata` を利用します。

## Secrets

`.env.local`、秘密鍵、認証情報をGitへコミットしません。

誤ってコミットした場合は「ファイルを消すだけ」では不十分です。キーを失効・ローテーションし、必要に応じてGit履歴から除去します。

## Server-side checks

Proxyでセッションを更新していても、重要な Server Action / Route Handler では認証・認可を再確認してください。
