import { facultyReviewEnabled } from "@/lib/faculty-review";
import { reviewHtml } from "./review-content";

const headers = {
  "Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "Content-Type": "text/html; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; media-src 'self'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'",
};

export function GET() {
  if (!facultyReviewEnabled()) return new Response(null, { status: 404, headers });
  return new Response(reviewHtml, { headers });
}

export function HEAD() {
  return new Response(null, { status: facultyReviewEnabled() ? 200 : 404, headers });
}
