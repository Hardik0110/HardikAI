import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();

// Configure express to handle larger payloads
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

app.use(cors());

const openai = new OpenAI({
  apiKey: "ddc-lkY6N38T84NQ8bu838OuNLH5nhY2EO3T7lApFgcQn2OM7C7Krg",
  baseURL: "https://api.sree.shop/v1"
});

const AI_MODELS = [
  "deepseek-r1",
  "claude-3-5-sonnet-20240620",
  "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
  "deepseek-v3",
  "gpt-4o-2024-05-13",
  "Meta-Llama-3.3-70B-Instruct-Turbo"
];

async function tryOptimizeWithModel(code, systemPrompt, modelName) {
  try {
    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: code }
      ],
      temperature: 0.3,
      max_tokens: 2048
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(`Error with model ${modelName}:`, error);
    return null;
  }
}

// Code optimization endpoint
app.post('/v1/optimize', async (req, res) => {
  try {
    const { code, optimizationType } = req.body;
    
    let systemPrompt = "You are an expert code optimizer.";
    
    switch (optimizationType) {
      case "hooks":
        systemPrompt += " Convert class components to functional components with modern React hooks.";
        break;
      case "readability":
        systemPrompt += " Format code and improve variable naming for better readability.";
        break;
      case "linting":
        systemPrompt += " Add proper TypeScript types and fix linting issues.";
        break;
      case "bugs":
        systemPrompt += " Identify and fix common bugs and anti-patterns.";
        break;
      default:
        systemPrompt += " Optimize the given code.";
    }

    systemPrompt += " Return only the optimized code without explanations.";
    
    let optimizedCode = null;
    let usedModel = null;

    for (const model of AI_MODELS) {
      optimizedCode = await tryOptimizeWithModel(code, systemPrompt, model);
      if (optimizedCode) {
        usedModel = model;
        break;
      }
    }

    if (!optimizedCode) {
      throw new Error('All models failed to optimize the code');
    }

    res.json({
      optimizedCode,
      usedModel
    });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to optimize code', details: error.message });
  }
});

// Stock chart analysis endpoint
app.post('/v1/analyze', async (req, res) => {
  try {
    const { imageData } = req.body;
    
    if (!imageData || typeof imageData !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid image data', 
        details: 'Image data is required and must be a base64 string' 
      });
    }
    
    // In a real app, you would process the image and send it to an AI model
    // For now, we'll return the mock data from AnalyzePage.tsx
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysisResult = `
# Stock Analysis Report

## Technical Indicators
- **Moving Averages**: Bullish crossover detected (50-day MA crossing above 200-day MA)
- **RSI**: 62.4 (Neutral with bullish momentum)
- **MACD**: Positive and increasing (Bullish signal)
- **Volume**: Above average by 32% (Strong buying interest)

## Pattern Recognition
- **Chart Pattern**: Cup and Handle formation detected
- **Support Level**: $142.30
- **Resistance Level**: $158.75
- **Breakout Potential**: High (80% probability)

## Recommendation
STRONG BUY with a price target of $172.50 within 3 months.
Risk management: Set stop loss at $138.50.
    `;
    
    res.json({
      analysisResult,
      usedModel: AI_MODELS[0] // Using the first model in the list
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze chart', details: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});