import { OpenAI } from 'openai';

export const openai = new OpenAI({
  apiKey: "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",
  baseURL: 'https://openrouter.ai/api/v1',
});

export const AI_MODELS = [
  { name: "deepseek/deepseek-r1-zero:free", maxTokens: 2048, temperature: 0.3 },
  { name: "open-r1/olympiccoder-32b:free", maxTokens: 2048, temperature: 0.3 },
  { name: "mistralai/mistral-small-3.1-24b-instruct", maxTokens: 2048, temperature: 0.3 },
  { name: "qwen/qwq-32b:free", maxTokens: 4096, temperature: 0.3 },
  { name: "anthropic/claude-3-opus", maxTokens: 2048, temperature: 0.3 },
  { name: "openai/gpt-4-turbo", maxTokens: 2048, temperature: 0.3 }
];

export const OPENROUTER_CONFIG = {
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
  referer: "https://github.com/hardikai",
  appName: "Code Zen Optimizer"
};


