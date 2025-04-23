// openaiClient.js
import { OpenAI } from 'openai';

export const openai = new OpenAI({
  apiKey: "ddc-lkY6N38T84NQ8bu838OuNLH5nhY2EO3T7lApFgcQn2OM7C7Krg",
  baseURL: 'https://api.sree.shop/v1',
});

export const AI_MODELS = [
  'gpt-4o-2024-05-13',
  'claude-3-5-sonnet-20240620', 
  'Meta-Llama-3.3-70B-Instruct-Turbo',
  'deepseek-v3',
  'deepseek-r1',
  'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B'
];


