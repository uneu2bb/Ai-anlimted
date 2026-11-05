"use client";

import { useChatStore } from "@/lib/store/chat-store";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus, Trash2, Sparkles, Menu, X, Shield } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const { chats, activeChatId, createChat, setActiveChat, deleteChat, clearChats } = useChatStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-40 p-2 rounded-xl bg-[#12141c] border border-white/10"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 right-0 z-50 w-72 bg-[#0a0c12] border-l border-white/5 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide">
                AI <span className="text-violet-400">UNLIMITED</span>
              </div>
              <div className="text-[10px] text-zinc-500 tracking-widest">PRO</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={() => { createChat(); setOpen(false); }}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-violet-600/20 to-cyan-500/10 border border-violet-500/30 text-violet-200 hover:from-violet-600/30 transition-all font-medium text-sm"
          >
            <Plus size={17} />
            محادثة جديدة
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <div className="text-[11px] text-zinc-600 px-2 py-2">محادثاتك</div>
          {chats.length === 0 && (
            <div className="text-center text-zinc-600 text-xs py-8">لا توجد محادثات بعد</div>
          )}
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors",
                activeChatId === chat.id ? "bg-white/10 text-white" : "hover:bg-white/5 text-zinc-400"
              )}
              onClick={() => { setActiveChat(chat.id); setOpen(false); }}
            >
              <MessageSquare size={15} className="shrink-0 opacity-60" />
              <span className="flex-1 text-sm truncate">{chat.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 space-y-2">
          {chats.length > 0 && (
            <button
              onClick={() => { if (confirm("هل تريد حذف جميع المحادثات؟")) clearChats(); }}
              className="w-full text-xs text-zinc-500 hover:text-red-400 transition py-1"
            >
              حذف الكل
            </button>
          )}
          <div className="flex items-center gap-2 text-[11px] text-zinc-600">
            <Shield size={13} className="text-emerald-500" />
            المفاتيح تبقى على السيرفر
          </div>
        </div>
      </aside>
    </>
  );
}
