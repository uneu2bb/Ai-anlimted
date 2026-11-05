"use client";

import { useChatStore } from "@/lib/store/chat-store";
import { Message } from "./Message";
import { Composer } from "./Composer";
import { ModelSelector } from "./ModelSelector";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import type { Attachment } from "@/types";
import { getModelById } from "@/lib/ai/models";

const STARTERS = [
  "اكتب لي خطة مشروع احترافية",
  "اشرح لي مفهوم الذكاء الاصطناعي ببساطة",
  "ساعدني في كتابة كود React",
  "لخص هذا النص بطريقة منظمة",
];

export function ChatInterface() {
  const {
    chats, activeChatId, isStreaming,
    createChat, setActiveChat, addMessage, updateMessage, appendToMessage, setStreaming,
  } = useChatStore();

  const [modelId, setModelId] = useState("llama-3.3-70b-versatile");
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const messages = activeChat?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (activeChat) setModelId(activeChat.modelId);
  }, [activeChatId]);

  const handleSend = async (text: string, attachments: Attachment[]) => {
    let chatId = activeChatId;
    if (!chatId) chatId = createChat(modelId);

    addMessage(chatId, {
      role: "user",
      content: text,
      attachments: attachments.length ? attachments : undefined,
    });

    const assistantId = addMessage(chatId, {
      role: "assistant",
      content: "",
      isStreaming: true,
      model: modelId,
    });

    setStreaming(true);

    try {
      const chat = useChatStore.getState().chats.find((c) => c.id === chatId);
      const apiMessages = (chat?.messages || [])
        .filter((m) => m.id !== assistantId)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, model: modelId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `خطأ ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("لا يوجد stream");

      const decoder = new TextDecoder();
      let full = "";
      const provider = getModelById(modelId)?.provider || "AI";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                full += delta;
                appendToMessage(chatId!, assistantId, delta);
              }
            } catch {}
          }
        }
      }

      updateMessage(chatId!, assistantId, {
        content: full || "لم أستطع توليد رد.",
        isStreaming: false,
        provider,
        model: modelId,
      });
    } catch (err: any) {
      updateMessage(chatId!, assistantId, {
        content: `حدث خطأ: ${err.message}\n\nتأكد من إعداد مفاتيح API في Vercel (GROQ_API_KEY أو OPENROUTER_API_KEY).`,
        isStreaming: false,
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <ModelSelector
            value={modelId}
            onChange={(id) => {
              setModelId(id);
              if (activeChatId) {
                useChatStore.setState((s) => ({
                  chats: s.chats.map((c) =>
                    c.id === activeChatId ? { ...c, modelId: id } : c
                  ),
                }));
              }
            }}
            disabled={isStreaming}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          جاهز
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center mb-6">
              <Sparkles size={28} className="text-violet-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              ذكاء اصطناعي{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                بلا حدود
              </span>
            </h1>
            <p className="text-zinc-500 max-w-md mb-10 text-sm leading-relaxed">
              منصة واحدة تجمع أفضل نماذج الذكاء الاصطناعي مع دعم الصور والملفات والتبديل التلقائي.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s, [])}
                  className="text-right px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 hover:bg-white/[0.05] transition text-sm text-zinc-300"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-4">
            {messages.map((m) => (
              <Message key={m.id} message={m} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <Composer onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
