"use client";

import { cn } from "@/lib/utils";
import type { Message as MessageType } from "@/types";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  message: MessageType;
}

export function Message({ message }: Props) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group flex gap-4 px-4 py-6", isUser ? "bg-transparent" : "bg-white/[0.02]")}>
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          isUser
            ? "bg-gradient-to-br from-cyan-500 to-blue-600"
            : "bg-gradient-to-br from-violet-600 to-purple-700"
        )}
      >
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-200">
            {isUser ? "أنت" : "AI Unlimited"}
          </span>
          {message.provider && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              {message.provider}
            </span>
          )}
          {message.model && (
            <span className="text-[10px] text-zinc-500">{message.model}</span>
          )}
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map((att) => (
              <div key={att.id} className="relative">
                {att.type === "image" ? (
                  <img
                    src={att.previewUrl || att.url}
                    alt={att.name}
                    className="max-h-48 rounded-xl border border-white/10 object-cover"
                  />
                ) : (
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs">
                    {att.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed">
          {message.isStreaming && !message.content ? (
            <div className="flex items-center gap-2 text-zinc-500">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              جاري التفكير...
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && message.content && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 pt-1">
            <button
              onClick={copy}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-zinc-300"
              title="نسخ"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
