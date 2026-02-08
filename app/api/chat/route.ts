import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createZhipu } from "zhipu-ai-provider";


export async function POST(req: NextRequest) {
  const { messages, prompt } = await req.json();

  // Use Zhipu provider, base URL, and model from env
  const zhipu = createZhipu({
    baseURL: process.env.ZHIPU_BASE_URL,
    apiKey: process.env.ZHIPU_API_KEY,
  });
  const modelName = process.env.ZHIPU_MODEL || "glm-4-plus";

  const result = await generateText({
    model: zhipu(modelName),
    prompt: prompt || "Hello!",
  });

  return new NextResponse(result.text);
}
