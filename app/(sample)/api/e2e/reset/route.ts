import { resetE2ETodos } from "@/features/todos/e2e-store";
import { isBrowserE2EMode } from "@/lib/e2e/mode";

export function POST() {
  if (!isBrowserE2EMode()) {
    return new Response(null, { status: 404 });
  }

  resetE2ETodos();
  return Response.json({ status: "ok" });
}
