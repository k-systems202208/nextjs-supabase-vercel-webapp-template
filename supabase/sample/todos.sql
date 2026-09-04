-- Sample SQL for the optional Todo Auth + CRUD example.
-- Run this in Supabase SQL Editor only when you want to try the Todo sample.
-- New applications may delete this file and replace it with their own schema / RLS.

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  is_complete boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.todos enable row level security;

-- New Supabase projects no longer expose every new table to the Data API automatically.
-- Explicitly grant only the authenticated role the CRUD privileges used by this sample.
revoke all on table public.todos from anon;
grant select, insert, update, delete on table public.todos to authenticated;

drop policy if exists "todos_select_own" on public.todos;
create policy "todos_select_own"
on public.todos
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "todos_insert_own" on public.todos;
create policy "todos_insert_own"
on public.todos
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "todos_update_own" on public.todos;
create policy "todos_update_own"
on public.todos
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "todos_delete_own" on public.todos;
create policy "todos_delete_own"
on public.todos
for delete
to authenticated
using ((select auth.uid()) = user_id);
