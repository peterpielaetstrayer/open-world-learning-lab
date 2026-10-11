import { NextResponse } from "next/server";
import { aiStatus } from "@/features/space-designer-v02/server";

export const dynamic = "force-dynamic";
export function GET() {
  return NextResponse.json({ ...aiStatus(), mode: "research-preview" }, {
    headers: { "Cache-Control": "no-store" }
  });
}
