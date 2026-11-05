import type { AIModel } from "@/types";

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    provider: "Groq",
    description: "سريع جداً ومجاني نسبياً",
    supportsVision: false,
    isFree: true,
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat",
    provider: "OpenRouter",
    description: "ذكي وقوي في البرمجة",
    supportsVision: false,
    isFree: true,
  },
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    provider: "OpenRouter",
    description: "يدعم الصور + سريع",
    supportsVision: true,
    isFree: true,
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "OpenRouter",
    description: "من أفضل النماذج حالياً",
    supportsVision: true,
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenRouter",
    description: "رؤية ممتازة + ذكاء عالي",
    supportsVision: true,
  },
  {
    id: "x-ai/grok-beta",
    name: "Grok Beta",
    provider: "OpenRouter",
    description: "نموذج xAI",
    supportsVision: false,
  },
  {
    id: "meta-llama/llama-3.2-90b-vision-instruct",
    name: "Llama 3.2 90B Vision",
    provider: "OpenRouter",
    description: "رؤية قوية من Meta",
    supportsVision: true,
  },
];

export const DEFAULT_MODEL_ID = "llama-3.3-70b-versatile";

export function getModelById(id: string): AIModel | undefined {
  return AVAILABLE_MODELS.find((m) => m.id === id);
}
