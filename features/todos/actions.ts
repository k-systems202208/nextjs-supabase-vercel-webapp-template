"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function dashboardError(message: string) {
  return `/dashboard?error=${encodeURIComponent(message)}`;
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string") {
    redirect("/auth/login");
  }

  return supabase;
}

export async function addTodo(formData: FormData) {
  const titleValue = formData.get("title");
  const title = typeof titleValue === "string" ? titleValue.trim() : "";

  if (!title || title.length > 200) {
    redirect(dashboardError("Todoは1〜200文字で入力してください。"));
  }

  const supabase = await authenticatedClient();
  const { error } = await supabase.from("todos").insert({ title });

  if (error) {
    redirect(dashboardError("Todoを追加できませんでした。Supabaseのsample SQL / RLSを確認してください。"));
  }

  revalidatePath("/dashboard");
}

export async function toggleTodo(formData: FormData) {
  const idValue = formData.get("id");
  const completedValue = formData.get("completed");
  const id = typeof idValue === "string" ? idValue : "";

  if (!uuidPattern.test(id)) {
    redirect(dashboardError("不正なTodo IDです。"));
  }

  const nextCompleted = completedValue !== "true";
  const supabase = await authenticatedClient();
  const { error } = await supabase
    .from("todos")
    .update({ is_complete: nextCompleted })
    .eq("id", id);

  if (error) {
    redirect(dashboardError("Todoを更新できませんでした。"));
  }

  revalidatePath("/dashboard");
}

export async function deleteTodo(formData: FormData) {
  const idValue = formData.get("id");
  const id = typeof idValue === "string" ? idValue : "";

  if (!uuidPattern.test(id)) {
    redirect(dashboardError("不正なTodo IDです。"));
  }

  const supabase = await authenticatedClient();
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) {
    redirect(dashboardError("Todoを削除できませんでした。"));
  }

  revalidatePath("/dashboard");
}
