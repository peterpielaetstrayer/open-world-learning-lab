import type { NextRequest } from "next/server";
import type { StudioBrief } from "./model";

const history = new Map<string, { count: number; reset: number }>();

export function aiStatus() {
  const configured = Boolean(process.env.OPENAI_API_KEY);
  const preview = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development";
  return {
    analysis: configured && preview && process.env.OWLL_AI_ANALYSIS_ENABLED === "true",
    rendering: configured && preview && process.env.OWLL_AI_RENDERING_ENABLED === "true",
  };
}

export function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}

/** Best-effort additional throttle. Serverless replicas do not share memory.
 * Preview Vercel Authentication plus provider-level spend limits are mandatory for paid features. */
export function rateLimited(req: NextRequest, kind: "analysis" | "render"): boolean {
  const id = (req.headers.get("x-forwarded-for") || "local").split(",")[0].slice(0, 64);
  const key = kind + ":" + id;
  const now = Date.now();
  const entry = history.get(key);
  const limit = kind === "render" ? 4 : 12;
  if (!entry || entry.reset < now) { history.set(key, { count: 1, reset: now + 60 * 60 * 1000 }); return false; }
  if (entry.count >= limit) return true;
  entry.count += 1;
  return false;
}

export function isValidBrief(input: unknown): input is StudioBrief {
  if (!input || typeof input !== "object") return false;
  const b = input as Partial<StudioBrief>;
  const stringOk = (v: unknown, max: number) => typeof v === "string" && v.length <= max;
  return ["family", "teen", "adult"].includes(String(b.audience)) &&
    ["research","making","exploration"].includes(String(b.focus)) &&
    ["quiet","balanced","immersive"].includes(String(b.technology)) &&
    ["bright","mixed","dim"].includes(String(b.lighting)) &&
    stringOk(b.goals, 900) && stringOk(b.obstacles, 900) &&
    stringOk(b.roomConstraints, 900) && stringOk(b.keep, 500) &&
    stringOk(b.budget, 100) && stringOk(b.feedback, 650) &&
    !!b.dimensions && stringOk(b.dimensions.width, 12) && stringOk(b.dimensions.length, 12);
}

export function validPhoto(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2_800_000) return false;
  return /^data:image\/(jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(value);
}

export function providerError(res: Response) {
  if (res.status === 429) return "AI provider rate limit reached. Try later.";
  if (res.status === 401 || res.status === 403) return "AI provider configuration needs attention.";
  return "The AI provider couldn't complete this request.";
}
