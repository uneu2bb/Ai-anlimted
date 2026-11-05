export type Role = "user" | "assistant" | "system";

export type Attachment = {
  id: string;
  type: "image" | "video" | "file";
  name: string;
  url: string;
  mimeType: string;
  size?: number;
  previewUrl?: string;
};

export type Message = {
  id: string;
  role: Role;
  content: string;
  attachments?: Attachment[];
  provider?: string;
  model?: string;
  createdAt: number;
  isStreaming?: boolean;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  modelId: string;
  createdAt: number;
  updatedAt: number;
};

export type AIModel = {
  id: string;
  name: string;
  provider: string;
  description?: string;
  supportsVision?: boolean;
  supportsImageGen?: boolean;
  isFree?: boolean;
  maxTokens?: number;
};

export type ProviderConfig = {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyEnv: string;
  enabled: boolean;
};
