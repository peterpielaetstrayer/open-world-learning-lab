import { NextResponse, type NextRequest } from "next/server";
import { createRequestSupabaseClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // Never forward an external redirect supplied by a login link.
  const rawNext = url.searchParams.get("next") ?? "/studio";
  // Accept only explicitly supported local destinations (reject protocol-relative
  // URLs, backslash normalization, encoded redirects and arbitrary paths).
  const next = rawNext === "/set-password" ? "/set-password" : "/studio";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing-code", url.origin));
  }

  const response = NextResponse.redirect(new URL(next, url.origin));
  response.headers.set("Cache-Control", "no-store");
  try {
    const supabase = await createRequestSupabaseClient((newCookies) => {
      for (const cookie of newCookies) {
        response.cookies.set(cookie.name, cookie.value, cookie.options);
      }
    });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/login?error=invalid-link", url.origin));
    }
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=configuration", url.origin));
  }
}
