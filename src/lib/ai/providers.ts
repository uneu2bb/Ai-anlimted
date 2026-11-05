export type ProviderInfo = {
  name: string;
  baseUrl: string;
  apiKeyEnv: string;
};

const PROVIDERS: Record<string, ProviderInfo> = {
  Groq: {
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKeyEnv: "GROQ_API_KEY",
  },
  OpenRouter: {
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
  },
  DeepSeek: {
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    apiKeyEnv: "DEEPSEEK_API_KEY",
  },
  OpenAI: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    apiKeyEnv: "OPENAI_API_KEY",
  },
  xAI: {
    name: "xAI",
    baseUrl: "https://api.x.ai/v1",
    apiKeyEnv: "XAI_API_KEY",
  },
  Together: {
    name: "Together",
    baseUrl: "https://api.together.xyz/v1",
    apiKeyEnv: "TOGETHER_API_KEY",
  },
  Fireworks: {
    name: "Fireworks",
    baseUrl: "https://api.fireworks.ai/inference/v1",
    apiKeyEnv: "FIREWORKS_API_KEY",
  },
  Google: {
    name: "Google",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKeyEnv: "GOOGLE_API_KEY",
  },
};

export function getProviderForModel(modelId: string): ProviderInfo {
  const groqModels = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "llama-3.1-70b-versatile",
    "gemma2-9b-it",
    "mixtral-8x7b-32768",
  ];
  if (groqModels.includes(modelId)) return PROVIDERS.Groq;

  if (modelId === "deepseek-chat" || modelId === "deepseek-reasoner") {
    return PROVIDERS.DeepSeek;
  }

  if (
    modelId.startsWith("gpt-") ||
    modelId.startsWith("o1") ||
    modelId.startsWith("o3") ||
    modelId.startsWith("o4")
  ) {
    if (process.env.OPENAI_API_KEY) return PROVIDERS.OpenAI;
    return PROVIDERS.OpenRouter;
  }

  if (modelId.startsWith("grok-") && !modelId.includes("/")) {
    if (process.env.XAI_API_KEY) return PROVIDERS.xAI;
    return PROVIDERS.OpenRouter;
  }

  if (modelId.includes("Meta-Llama") || modelId.includes("together")) {
    if (process.env.TOGETHER_API_KEY) return PROVIDERS.Together;
    return PROVIDERS.OpenRouter;
  }

  if (modelId.includes("accounts/fireworks") || modelId.includes("fireworks")) {
    if (process.env.FIREWORKS_API_KEY) return PROVIDERS.Fireworks;
    return PROVIDERS.OpenRouter;
  }

  if (modelId.includes("/")) {
    return PROVIDERS.OpenRouter;
  }

  if (process.env.OPENROUTER_API_KEY) return PROVIDERS.OpenRouter;
  if (process.env.GROQ_API_KEY) return PROVIDERS.Groq;
  return PROVIDERS.OpenRouter;
}

export function getConfiguredProviders(): ProviderInfo[] {
  return Object.values(PROVIDERS).filter((p) => Boolean(process.env[p.apiKeyEnv]));
}

export function isProviderConfigured(name: string): boolean {
  const p = PROVIDERS[name];
  return p ? Boolean(process.env[p.apiKeyEnv]) : false;
}

export { PROVIDERS };
