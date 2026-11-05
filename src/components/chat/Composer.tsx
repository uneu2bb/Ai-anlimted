"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowUp, Paperclip, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Attachment } from "@/types";
import { v4 as uuid } from "uuid";

interface Props {
  onSend: (text: string, attachments: Attachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function Composer({ onSend, disabled, placeholder }: Props) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [text]);

  const handleSend = () => {
    if ((!text.trim() && attachments.length === 0) || disabled) return;
    onSend(text.trim(), attachments);
    setText("");
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newAtts: Attachment[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > 20 * 1024 * 1024) return;
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : "file";
      newAtts.push({
        id: uuid(),
        type,
        name: file.name,
        url,
        mimeType: file.type,
        size: file.size,
        previewUrl: type === "image" ? url : undefined,
      });
    });
    setAttachments((prev) => [...prev, ...newAtts].slice(0, 5));
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const att = prev.find((a) => a.id === id);
      if (att?.url.startsWith("blob:")) URL.revokeObjectURL(att.url);
      return prev.filter((a) => a.id !== id);
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((att) => (
            <div key={att.id} className="relative group">
              {att.type === "image" ? (
                <img src={att.previewUrl} alt={att.name} className="h-20 w-20 object-cover rounded-xl border border-white/10" />
              ) : (
                <div className="h-20 w-28 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-zinc-400 px-2 text-center">
                  {att.name}
                </div>
              )}
              <button
                onClick={() => removeAttachment(att.id)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative rounded-2xl border border-white/10 bg-[#0e1018] focus-within:border-violet-500/50 transition-colors shadow-xl">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "اكتب رسالتك هنا... (Shift+Enter لسطر جديد)"}
          rows={1}
          disabled={disabled}
          className="w-full bg-transparent resize-none outline-none px-4 pt-4 pb-12 text-sm text-zinc-100 placeholder:text-zinc-600 leading-relaxed max-h-40"
        />

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={disabled}
              className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-zinc-300 transition"
              title="رفع صورة أو ملف"
            >
              <Paperclip size={18} />
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.txt,.md,.json,.js,.ts,.tsx,.py"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={disabled || (!text.trim() && attachments.length === 0)}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
              text.trim() || attachments.length
                ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/25 hover:opacity-90"
                : "bg-white/5 text-zinc-600"
            )}
          >
            {disabled ? <Loader2 size={18} className="animate-spin" /> : <ArrowUp size={18} />}
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] text-zinc-600 mt-3">
        AI Unlimited يمكن أن يخطئ. تحقق من المعلومات المهمة.
      </p>
    </div>
  );
}
