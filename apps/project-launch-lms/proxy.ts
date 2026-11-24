import { isAuthSessionMissingError } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { facultyReviewEnabled, isReviewAsset, REVIEW_COURSE_ID, REVIEW_PATH } from "@/lib/faculty-review";
import { createRequestSupabaseClient } from "@/lib/supabase-server";

function privateResponse(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  return response;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const readOnly = request.method === "GET" || request.method === "HEAD";
  if (pathname.startsWith("/review-materials/") || pathname === "/review-materials") {
    if (!facultyReviewEnabled() || !isReviewAsset(pathname)) {
      return privateResponse(new NextResponse(null, { status: 404 }));
    }
    if (!readOnly) {
      return privateResponse(new NextResponse(null, { status: 405, headers: { Allow: "GET, HEAD" } }));
    }
    const asset = privateResponse(NextResponse.next());
    asset.headers.set("X-Robots-Tag", "noindex, nofollow");
    asset.headers.set("X-Content-Type-Options", "nosniff");
    return asset;
  }

  const studio = pathname === "/studio";
  if (studio && (!readOnly || !facultyReviewEnabled() ||
    request.nextUrl.searchParams.getAll("course").length !== 1 ||
    request.nextUrl.searchParams.get("course") !== REVIEW_COURSE_ID)) {
    return NextResponse.next();
  }

  const authorized = privateResponse(NextResponse.next());

  try {
    const supabase = await createRequestSupabaseClient((cookies) => {
      for (const { name, value, options } of cookies) {
        authorized.cookies.set(name, value, options);
      }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (studio) {
      if (!user && (!userError || isAuthSessionMissingError(userError))) {
        const review = request.nextUrl.clone();
        review.pathname = REVIEW_PATH;
        review.search = "";
        const redirect = privateResponse(NextResponse.redirect(review));
        for (const cookie of authorized.cookies.getAll()) redirect.cookies.set(cookie);
        return redirect;
      }
      return authorized;
    }
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
    if (studio) return authorized;
    return privateResponse(new NextResponse(null, { status: 503 }));
  }
}

export const config = {
  matcher: ["/studio", "/media/:path*", "/resources/:path*", "/review-materials/:path*"],
};
