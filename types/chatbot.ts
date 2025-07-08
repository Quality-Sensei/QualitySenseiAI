export enum Role {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  isError?: boolean;
}

export interface GenerationConfig {
  temperature: number;
  maxOutputTokens: number;
  isThinkingEnabled: boolean;
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
}