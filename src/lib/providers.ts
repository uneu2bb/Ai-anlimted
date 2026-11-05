export type ProviderConfig = {
  name: string;
  baseUrl: string;
  model: string;
  apiKeyEnv: string;
  enabled?: boolean;
};

export function getProviders(): ProviderConfig[] {
  const raw = process.env.AI_PROVIDERS_JSON;
  if (!raw) {
    return [
      {
        name: "Groq",
        baseUrl: "https://api.groq.com/openai/v1",
        model: "llama-3.3-70b-versatile",
        apiKeyEnv: "GROQ_API_KEY",
        enabled: true,
      },
      {
        name: "OpenRouter",
        baseUrl: "https://openrouter.ai/api/v1",
        model: "deepseek/deepseek-chat",
        apiKeyEnv: "OPENROUTER_API_KEY",
        enabled: true,
      },
      {
        name: "DeepSeek",
        baseUrl: "https://api.deepseek.com",
        model: "deepseek-chat",
        apiKeyEnv: "DEEPSEEK_API_KEY",
        enabled: true,
      },
    ].filter((p) => Boolean(process.env[p.apiKeyEnv]));
  }

  try {
    const parsed = JSON.parse(raw) as ProviderConfig[];
    return parsed.filter(
      (p) =>
        p.enabled !== false &&
        p.name &&
        p.baseUrl &&
        p.model &&
        p.apiKeyEnv &&
        Boolean(process.env[p.apiKeyEnv])
    );
  } catch {
    console.error("AI_PROVIDERS_JSON is not valid JSON");
    return [];
  }
}

export {
  getProviderForModel,
  getConfiguredProviders,
  isProviderConfigured,
  PROVIDERS,
} from "./ai/providers";
