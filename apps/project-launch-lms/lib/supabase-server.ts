import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createRequestSupabaseClient(
  setCookies?: (cookies: Array<{ name: string; value: string; options: Record<string, unknown> }>) => void
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase public configuration missing");
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    auth: { flowType: "pkce" },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet) {
        if (setCookies) {
          setCookies(toSet);
        } else {
          // Read-only server components cannot write cookies. Route handlers
          // supply setCookies to carry refreshed sessions back to the browser.
          // Their absence must not silently escalate authorization.
        }
      },
    },
  });
}
