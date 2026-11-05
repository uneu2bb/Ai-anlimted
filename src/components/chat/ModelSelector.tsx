"use client";

import { AVAILABLE_MODELS } from "@/lib/ai/models";
import { cn } from "@/lib/utils";
import { ChevronDown, Sparkles, Eye, Zap } from "lucide-react";
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

  const freeModels = AVAILABLE_MODELS.filter((m) => m.isFree);
  const proModels = AVAILABLE_MODELS.filter((m) => !m.isFree);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const renderModel = (model: (typeof AVAILABLE_MODELS)[0]) => (
    <button
      key={model.id}
      onClick={() => {
        onChange(model.id);
        setOpen(false);
      }}
      className={cn(
        "w-full text-right px-3 py-2.5 rounded-lg flex flex-col gap-0.5 transition-colors",
        value === model.id
          ? "bg-violet-500/20 text-violet-200"
          : "hover:bg-white/5 text-zinc-300"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-sm">{model.name}</span>
        <div className="flex items-center gap-1 shrink-0">
          {model.supportsVision && (
            <span title="يدعم الصور">
              <Eye size={12} className="text-cyan-400" />
            </span>
          )}
          {model.isFree && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              مجاني
            </span>
          )}
        </div>
      </div>
      <span className="text-xs text-zinc-500">
        {model.provider} · {model.description}
      </span>
    </button>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors max-w-[280px]"
      >
        <Sparkles size={14} className="text-violet-400 shrink-0" />
        <span className="font-medium truncate">{current.name}</span>
        <span className="text-xs text-zinc-500 shrink-0 hidden sm:inline">
          {current.provider}
        </span>
        <ChevronDown
          size={14}
          className={cn("text-zinc-500 transition shrink-0", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-[#12141c] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] text-emerald-400 font-medium">
              <Zap size={12} />
              مجاني / سريع ({freeModels.length})
            </div>
            {freeModels.map(renderModel)}

            <div className="border-t border-white/5 my-2" />

            <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] text-violet-400 font-medium">
              <Sparkles size={12} />
              قوي / متقدم ({proModels.length})
            </div>
            {proModels.map(renderModel)}
          </div>
        </div>
      )}
    </div>
  );
}
