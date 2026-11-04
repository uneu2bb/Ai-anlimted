import { NextRequest, NextResponse } from "next/server";
import { getProviders } from "@/lib/providers";

export const runtime = "nodejs";
export const maxDuration = 60;
type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages as ChatMessage[];
    if (!Array.isArray(messages) || !messages.length) {
      return NextResponse.json({ error: "الرسائل غير صالحة." }, { status: 400 });
    }
    const providers = getProviders();
    if (!providers.length) {
      return NextResponse.json({ error: "لم يتم إعداد أي مزود. أضف مفاتيح API في إعدادات الاستضافة." }, { status: 503 });
    }
    const failures: string[] = [];
    for (const provider of providers) {
      const key = process.env[provider.apiKeyEnv];
      if (!key) continue;
      try {
        const response = await fetch(`${provider.baseUrl.replace(/\/$/, "")}/chat/completions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: provider.model, messages, temperature: 0.7 }),
          signal: AbortSignal.timeout(45000)
        });
        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          failures.push(`${provider.name}: HTTP ${response.status}`);
          if ([408,429,500,502,503,504].includes(response.status)) continue;
          return NextResponse.json({ error: `تعذر الاتصال بمزود ${provider.name}.`, detail: detail.slice(0,500) }, { status: 502 });
        }
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content !== "string" || !content.trim()) { failures.push(provider.name + ": empty response"); continue; }
        return NextResponse.json({ content, provider: provider.name, model: provider.model });
      } catch (e) { failures.push(`${provider.name}: ${(e as Error).message}`); }
    }
    return NextResponse.json({ error: "تعذر الحصول على رد من جميع المزودين.", attempted: failures }, { status: 503 });
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة الطلب." }, { status: 500 });
  }
}