import { OpenAI } from 'openai';

export const openai = new OpenAI({
  apiKey: "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",
  baseURL: 'https://openrouter.ai/api/v1',
});

export const AI_MODELS = [
  { name: "deepseek/deepseek-r1-zero:free", maxTokens: 2048, temperature: 0.3 },
  { name: "open-r1/olympiccoder-32b:free", maxTokens: 2048, temperature: 0.3 },
  { name: "tngtech/deepseek-r1t-chimera:free", maxTokens: 2048, temperature: 0.3 },
  { name: "qwen/qwq-32b:free", maxTokens: 4096, temperature: 0.3 },
  { name: "anthropic/claude-3-opus", maxTokens: 2048, temperature: 0.3 },
  { name: "openai/gpt-4-turbo", maxTokens: 2048, temperature: 0.3 }
];

export const OPENROUTER_CONFIG = {
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
  referer: "https://github.com/Hardik0110/HardikAI",
  appName: "Hardik's AI"
};


