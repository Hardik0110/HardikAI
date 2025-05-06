import 'dotenv/config';

export const OPENROUTER_CONFIG = {
  apiKey: process.env.OPENROUTER_API_KEY || '',
  referer: process.env.APP_URL || 'http://localhost:3001',
  appName: 'Hardiks AI'
};

export const AI_MODELS = [
  {
    name: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
    temperature: 0.2,
    maxTokens: 4000
  },
  {
    name: "deepseek/deepseek-r1-zero:free",
    temperature: 0.2,
    maxTokens: 8000
  },
  {
    name: "qwen/qwq-32b:free",
    temperature: 0.2,
    maxTokens: 8000
  },
  {
    name: "microsoft/phi-4-reasoning-plus:free",
    temperature: 0.2,
    maxTokens: 8000
  },
  {
    name: "opengvlab/internvl3-14b:free",
    temperature: 0.2,
    maxTokens: 8000
  },
  
];