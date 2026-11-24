import { NextResponse, type NextRequest } from "next/server";
import { createRequestSupabaseClient } from "@/lib/supabase-server";

/**
 * For Supabase email templates using TokenHash:
 * https://example.com/auth/confirm?token_hash={{ .TokenHash }}&type=invite
 * This route is also usable with magiclink/email links if configured.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const hash = url.searchParams.get("token_hash");
  const kind = url.searchParams.get("type");
  if (!hash || (kind !== "invite" && kind !== "email" && kind !== "magiclink")) {
    return NextResponse.redirect(new URL("/login?error=invalid-link", url.origin));
  }
  const target = kind === "invite" ? "/set-password" : "/studio";
  const response = NextResponse.redirect(new URL(target, url.origin));
  response.headers.set("Cache-Control", "no-store");
  try {
    const supabase = await createRequestSupabaseClient((newCookies) => {
      for (const cookie of newCookies) {
        response.cookies.set(cookie.name, cookie.value, cookie.options);
      }
    });
    const { error } = await supabase.auth.verifyOtp({
      token_hash: hash,
      type: kind,
    });
    if (error) {
      return NextResponse.redirect(new URL("/login?error=invalid-link", url.origin));
    }
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=configuration", url.origin));
  }
}
