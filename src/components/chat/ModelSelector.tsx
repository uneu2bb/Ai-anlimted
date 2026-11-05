"use client";

import { AVAILABLE_MODELS } from "@/lib/ai/models";
import { cn } from "@/lib/utils";
import { ChevronDown, Sparkles, Eye } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (modelId: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = AVAILABLE_MODELS.find((m) => m.id === value) || AVAILABLE_MODELS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors"
      >
        <Sparkles size={14} className="text-violet-400" />
        <span className="font-medium">{current.name}</span>
        <span className="text-xs text-zinc-500">{current.provider}</span>
        <ChevronDown size={14} className={cn("text-zinc-500 transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-72 bg-[#12141c] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 max-h-80 overflow-y-auto">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onChange(model.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-right px-3 py-2.5 rounded-lg flex flex-col gap-0.5 transition-colors",
                  value === model.id ? "bg-violet-500/20 text-violet-200" : "hover:bg-white/5 text-zinc-300"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm">{model.name}</span>
                  <div className="flex items-center gap-1">
                    {model.supportsVision && (
                      <span title="يدعم الصور"><Eye size={12} className="text-cyan-400" /></span>
                    )}
                    {model.isFree && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">مجاني</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-zinc-500">{model.provider} · {model.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
