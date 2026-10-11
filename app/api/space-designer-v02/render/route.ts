import { NextRequest, NextResponse } from "next/server";
import { aiStatus, isValidBrief, validPhoto, rateLimited, sameOrigin, providerError } from "@/features/space-designer-v02/server";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Same-origin requests only." }, { status: 403 });
  if (!aiStatus().rendering) return NextResponse.json({ error: "AI rendering is not enabled for this private preview." }, { status: 503 });
  if (Number(req.headers.get("content-length") || 0) > 3_800_000) return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  if (rateLimited(req, "render")) return NextResponse.json({ error: "Render request limit reached." }, { status: 429 });

  try {
    const body = await req.json() as { brief?: unknown; photo?: unknown; renderPrompt?: unknown; consent?: unknown; revision?: unknown };
    if (body.consent !== true || !isValidBrief(body.brief) || !validPhoto(body.photo) ||
        typeof body.renderPrompt !== "string" || body.renderPrompt.length > 1500 ||
        typeof body.revision !== "string" || body.revision.length > 400) {
      return NextResponse.json({ error: "A valid room photo, concept, and consent are required." }, { status: 400 });
    }
    const source = body.photo.match(/^data:image\/(jpeg|png|webp);base64,(.*)$/);
    if (!source) return NextResponse.json({ error: "Invalid photo." }, { status: 400 });
    const bytes = Uint8Array.from(Buffer.from(source[2], "base64"));
    if (bytes.byteLength > 2_100_000) return NextResponse.json({ error: "Photo is too large." }, { status: 413 });
    const form = new FormData();
    form.append("model", process.env.OWLL_IMAGE_MODEL || "gpt-image-1.5");
    form.append("image[]", new File([bytes], "original-room." + (source[1] === "jpeg" ? "jpg" : source[1]), {
      type: "image/" + source[1],
    }));
    form.append("quality", "low");
    form.append("size", "1536x1024");
    form.append("output_format", "jpeg");
    form.append("output_compression", "65");
    form.append("prompt", [
      "Edit this user-supplied photograph into a believable CONCEPT RENDER of the SAME room.",
      "Preserve visible walls, windows, doors, ceiling shape, and room perspective as closely as possible.",
      "Keep it architecturally plausible, with realistic furniture scale and unobstructed circulation.",
      "Don't insert people, written signage, fake logos or implausible technology. Do not assume unseen geometry.",
      "Design direction: " + body.renderPrompt,
      "User constraints: " + body.brief.roomConstraints,
      "Existing to keep: " + body.brief.keep,
      "Feedback/revision: " + body.revision,
      "The result is illustrative, NOT measurement-accurate or a contractor plan.",
    ].join("\n"));
    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.OPENAI_API_KEY },
      body: form,
      signal: AbortSignal.timeout(115000),
      cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ error: providerError(response) }, { status: 502 });
    const payload = await response.json();
    const b64 = payload?.data?.[0]?.b64_json;
    if (typeof b64 !== "string") throw new Error("No render returned");
    return NextResponse.json({ image: "data:image/jpeg;base64," + b64, source: "ai" }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Rendering failed. Your original photo and concepts are still available locally." }, { status: 502 });
  }
}
