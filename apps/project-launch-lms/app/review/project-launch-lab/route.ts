import { facultyReviewEnabled } from "@/lib/faculty-review";
import { reviewHtml } from "./review-content";

const headers = {
  "Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "Content-Type": "text/html; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
  "Content-Security-Policy": "default-src 'none'; style-src 'self' 'unsafe-inline'; script-src 'self'; media-src 'self'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'",
};

export function GET() {
  if (!facultyReviewEnabled()) return new Response(null, { status: 404, headers });
  // Serve the same approved curriculum snapshot inside a navigable, read-only course shell.
  const coursePage = reviewHtml.replace("<style>", '<link rel="stylesheet" href="/review-ui.css"><script src="/review-ui.js" defer></script><style>');
  return new Response(coursePage, { headers });
}

export function HEAD() {
  return new Response(null, { status: facultyReviewEnabled() ? 200 : 404, headers });
}
