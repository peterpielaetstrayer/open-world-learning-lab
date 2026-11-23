import { NextResponse } from "next/server";
import { createRequestSupabaseClient } from "@/lib/supabase-server";

function privateResponse(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  return response;
}

export async function proxy() {
  const authorized = privateResponse(NextResponse.next());

  try {
    const supabase = await createRequestSupabaseClient((cookies) => {
      for (const { name, value, options } of cookies) {
        authorized.cookies.set(name, value, options);
      }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return privateResponse(new NextResponse(null, { status: 401 }));
    }

    // The course read policy permits current course members only.
    const { data: course, error: courseError } = await supabase
      .from("pll_courses")
      .select("id")
      .eq("slug", "project-launch-lab")
      .maybeSingle();

    if (courseError) {
      return privateResponse(new NextResponse(null, { status: 503 }));
    }
    if (!course) {
      return privateResponse(new NextResponse(null, { status: 404 }));
    }
    return authorized;
  } catch {
    return privateResponse(new NextResponse(null, { status: 503 }));
  }
}

export const config = {
  matcher: ["/media/:path*", "/resources/:path*"],
};
