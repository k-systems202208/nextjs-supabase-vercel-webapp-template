import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { addTodo, deleteTodo, toggleTodo } from "@/features/todos/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type Todo = {
  id: string;
  title: string;
  is_complete: boolean;
  created_at: string;
};

type SearchParams = Promise<{ error?: string | string[] }>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const actionError = first(params.error);

  if (!isSupabaseConfigured()) {
    return (
      <main className="shell">
        <section className="card">
          <h1>Dashboard</h1>
          <p>Supabase が未設定です。.env.local を設定してから再度開いてください。</p>
          <Link href="/">トップへ戻る</Link>
        </section>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || typeof userId !== "string") {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("todos")
    .select("id,title,is_complete,created_at")
    .order("created_at", { ascending: false });

  const todos = (data ?? []) as Todo[];

  return (
    <main className="shell dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">AUTHENTICATED SAMPLE</p>
          <h1>Todo Dashboard</h1>
          <p className="muted">Supabase Auth + CRUD + RLS の動作確認用サンプルです。</p>
        </div>
        <form action={signOut}>
          <button className="button secondary" type="submit">ログアウト</button>
        </form>
      </header>

      {actionError ? <p className="notice error">{actionError}</p> : null}
      {error ? (
        <section className="card">
          <h2>Database setup required</h2>
          <p>todos テーブルを取得できませんでした。</p>
          <p><code>supabase/sample/todos.sql</code> を Supabase SQL Editor で実行してください。</p>
        </section>
      ) : (
        <>
          <section className="card">
            <h2>Todoを追加</h2>
            <form action={addTodo} className="todo-add-form">
              <input
                name="title"
                maxLength={200}
                placeholder="例: 認証後のCRUDを確認する"
                required
              />
              <button type="submit" className="button primary">追加</button>
            </form>
          </section>

          <section className="card">
            <h2>自分のTodo</h2>
            {todos.length === 0 ? <p className="muted">まだTodoはありません。</p> : null}
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id} className="todo-row">
                  <form action={toggleTodo} className="todo-toggle-form">
                    <input type="hidden" name="id" value={todo.id} />
                    <input type="hidden" name="completed" value={String(todo.is_complete)} />
                    <button type="submit" className="todo-toggle" aria-label="完了状態を切り替え">
                      {todo.is_complete ? "☑" : "☐"}
                    </button>
                    <span className={todo.is_complete ? "todo-title done" : "todo-title"}>
                      {todo.title}
                    </span>
                  </form>
                  <form action={deleteTodo}>
                    <input type="hidden" name="id" value={todo.id} />
                    <button type="submit" className="button danger">削除</button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <p className="footer-link"><Link href="/">トップへ戻る</Link></p>
    </main>
  );
}
