import { NextRequest } from "next/server";
import { getProviderForModel } from "@/lib/ai/providers";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages as ChatMessage[];
    const modelId = body.model || "llama-3.3-70b-versatile";

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "الرسائل غير صالحة" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const provider = getProviderForModel(modelId);
    const apiKey = process.env[provider.apiKeyEnv];

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: `مفتاح ${provider.name} غير موجود. أضفه في متغيرات البيئة.`,
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(
      `${provider.baseUrl.replace(/\/$/, "")}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://ai-unlimited.app",
          "X-Title": "AI Unlimited Pro",
        },
        body: JSON.stringify({
          model: modelId,
          messages,
          temperature: 0.7,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return new Response(
        JSON.stringify({
          error: `خطأ من ${provider.name}: ${response.status}`,
          detail: errText.slice(0, 400),
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "حدث خطأ أثناء معالجة الطلب" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
