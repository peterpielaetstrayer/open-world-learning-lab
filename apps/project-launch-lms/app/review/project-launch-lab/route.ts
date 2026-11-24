import { facultyReviewEnabled, REVIEW_PATH } from "@/lib/faculty-review";
const headers = {
  "Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow"
};
export function GET(request: Request) {
  if (!facultyReviewEnabled()) return new Response(null, { status: 404, headers });
  return Response.redirect(new URL(REVIEW_PATH, request.url), 307);
}
export function HEAD(request: Request) { return GET(request); }
