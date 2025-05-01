import 'dotenv/config';

export const OPENROUTER_CONFIG = {
  apiKey: process.env.OPENROUTER_API_KEY || '',
  referer: process.env.APP_URL || 'http://localhost:3001',
  appName: 'Hardiks AI'
};

export const AI_MODELS = [
  {
    name: "deepseek/deepseek-r1-zero:free",
    temperature: 0.2,
    maxTokens: 4000
  },
  {
    name: "open-r1/olympiccoder-32b:free",
    temperature: 0.2,
    maxTokens: 4000
  },
  {
    name: "mistralai/mistral-small-3.1-24b-instruct",
    temperature: 0.2,
    maxTokens: 4000
  },
  {
    name: "qwen/qwq-32b:free",
    temperature: 0.2,
    maxTokens: 4000
  },
  {
    name: "anthropic/claude-3-opus",
    temperature: 0.2,
    maxTokens: 4000
  },
  {
    name: "openai/gpt-4-turbo",
    temperature: 0.2,
    maxTokens: 4000
  }
];