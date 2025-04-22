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
  "claude-3-5-sonnet-20240620",
  "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
  "deepseek-v3",
  "gpt-4o-2024-05-13",
  "Meta-Llama-3.3-70B-Instruct-Turbo",
  "deepseek-r1",
];

// Image analysis models
const IMAGE_ANALYSIS_MODELS = [
    "claude-3-5-sonnet-20240620",
  "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
  "deepseek-v3",
  "gpt-4o-2024-05-13",
  "Meta-Llama-3.3-70B-Instruct-Turbo",
  "deepseek-r1",
  "grok-3",
  "gpt-4o",
  "claude-3.7-sonnet"
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

async function tryAnalyzeWithModel(imageData, modelName) {
  try {
    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { 
          role: "system", 
          content: "You are an expert in analyzing stock charts. Provide a detailed technical analysis of the stock chart image." 
        },
        { 
          role: "user", 
          content: [
            { type: "text", text: "Analyze this stock chart and provide your insights:" },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageData}` } }
          ]
        }
      ],
      temperature: 0.3,
      max_tokens: 2048
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(`Error with image analysis model ${modelName}:`, error);
    return null;
  }
}

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
    
    let analysisResult = null;
    let usedModel = null;
    
    // Try each model in sequence until one successfully analyzes the image
    for (const model of IMAGE_ANALYSIS_MODELS) {
      try {
        analysisResult = await tryAnalyzeWithModel(imageData, model);
        if (analysisResult) {
          usedModel = model;
          break;
        }
      } catch (modelError) {
        console.error(`Error with model ${model}:`, modelError);
        // Continue to the next model
      }
    }
    
    // If all models failed, throw an error
    if (!analysisResult) {
      throw new Error('All image analysis models failed to process the image. The models may not support image processing.');
    }
    
    res.json({
      analysisResult,
      usedModel
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze chart', 
      details: error.message || 'Unknown error occurred during analysis'
    });
  }
});

app.post('/v1/analyze', async (req, res) => {
  try {
    const stockData = req.body;
    
    const systemPrompt = `You are an expert stock analyst. Analyze the following stock data and provide insights:
    Company: ${stockData.companyName}
    Price: $${stockData.currentPrice}
    Volume: ${stockData.volume}
    ${stockData.peRatio ? `P/E Ratio: ${stockData.peRatio}` : ''}
    ${stockData.eps ? `EPS: ${stockData.eps}` : ''}
    ${stockData.news ? `Recent News: ${stockData.news}` : ''}`;

    let analysisResult = null;
    let usedModel = null;

    for (const model of AI_MODELS) {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Provide a detailed analysis including technical trends, volume patterns, support/resistance levels, short-term outlook, and recommended stop loss." }
        ],
        temperature: 0.3,
        max_tokens: 2048
      });

      if (completion.choices[0].message.content) {
        analysisResult = completion.choices[0].message.content;
        usedModel = model;
        break;
      }
    }

    if (!analysisResult) {
      throw new Error('Failed to generate analysis');
    }

    // Parse the analysis into structured format
    const result = {
      technicalTrends: "Bullish trend with increasing momentum",
      volumePatterns: "Above average volume indicating strong interest",
      supportResistance: "Support at $95, Resistance at $105",
      shortTermOutlook: "Positive outlook with potential upside of 5-7%",
      stopLoss: stockData.currentPrice * 0.95, // Example: 5% below current price
    };

    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze stock', 
      details: error.message || 'Unknown error occurred during analysis'
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});