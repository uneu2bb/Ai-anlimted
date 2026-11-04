export type ProviderConfig = {
  name: string;
  baseUrl: string;
  model: string;
  apiKeyEnv: string;
  enabled?: boolean;
};

export function getProviders(): ProviderConfig[] {
  const raw = process.env.AI_PROVIDERS_JSON;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ProviderConfig[];
    return parsed.filter(p =>
      p.enabled !== false &&
      p.name && p.baseUrl && p.model && p.apiKeyEnv &&
      Boolean(process.env[p.apiKeyEnv])
    );
  } catch {
    console.error("AI_PROVIDERS_JSON is not valid JSON.");
    return [];
  }
}
