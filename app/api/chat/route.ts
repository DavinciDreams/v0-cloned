import { NextRequest, NextResponse } from "next/server";
import { AI } from "@vercel/ai-sdk";

const ai = new AI({ apiKey: process.env.AI_GATEWAY_API_KEY });

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await ai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    stream: true,
  });

  return new NextResponse(response.body);
}
