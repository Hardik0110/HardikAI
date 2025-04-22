import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();

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

async function tryAnalyzeStockWithModel(stockData, modelName) {
  try {
    const systemPrompt = `You are an expert stock analyst on Indian Stocks Market and the stocks listed on national stock exchange in india.
    You must respond ONLY with a JSON object containing the analysis results in rupees.
    Analyze this stock data:
    Company: ${stockData.companyName}
    Price: Rupees${stockData.currentPrice}
    Volume: ${stockData.volume}
    ${stockData.peRatio ? `P/E Ratio: ${stockData.peRatio}` : ''}
    ${stockData.eps ? `EPS: ${stockData.eps}` : ''}
    ${stockData.marketCap ? `Market Cap: Rupees${stockData.marketCap}Crores` : ''}
    ${stockData.dividend ? `Dividend: ${stockData.dividend}%` : ''}
    ${stockData.beta ? `Beta: ${stockData.beta}` : ''}
    ${stockData.news ? `Recent News: ${stockData.news}` : ''}`;

    const userPrompt = `Analyze the stock data and return ONLY a JSON object with the following structure:
    {
      "technicalTrends": "detailed analysis of price trends in rupees",
      "volumePatterns": "analysis of trading volume patterns in rupees",
      "supportResistance": "key support and resistance levels in rupees",
      "shortTermOutlook": "outlook for next 1-3 months in rupees",
      "stopLoss": numeric_price_for_stop_loss
    }
    Do not include any other text, markdown formatting, or explanations outside the JSON object.`;

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { 
          role: "system", 
          content: systemPrompt 
        },
        { 
          role: "user", 
          content: userPrompt 
        }
      ],
      temperature: 0.4,
      max_tokens: 2048,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    
    const cleanedContent = content.replace(/```json\s*|\s*```/g, '').trim();
    
    try {
      const parsedResult = JSON.parse(cleanedContent);
      
      if (!parsedResult.technicalTrends || 
          !parsedResult.volumePatterns || 
          !parsedResult.supportResistance || 
          !parsedResult.shortTermOutlook || 
          typeof parsedResult.stopLoss !== 'number') {
        console.error(`Invalid response format from ${modelName}:`, parsedResult);
        return null;
      }
      
      return parsedResult;
    } catch (parseError) {
      console.error(`JSON parsing error from ${modelName}:`, parseError);
      console.error('Raw content:', content);
      return null;
    }
  } catch (error) {
    console.error(`Error with model ${modelName}:`, error);
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

app.post('/v1/analyze', async (req, res) => {
  try {
    const stockData = req.body;
    
    if (!stockData || !stockData.companyName || !stockData.currentPrice || !stockData.volume) {
      return res.status(400).json({ 
        error: 'Invalid stock data', 
        details: 'Company name, current price, and volume are required' 
      });
    }
    
    let analysisResult = null;
    let usedModel = null;
    let modelErrors = [];
    
    for (const model of AI_MODELS) {
      try {
        const result = await tryAnalyzeStockWithModel(stockData, model);
        if (result) {
          analysisResult = result;
          usedModel = model;
          break;
        }
      } catch (modelError) {
        modelErrors.push(`${model}: ${modelError.message}`);
        console.error(`Error with model ${model}:`, modelError);
      }
    }
    
    if (!analysisResult) {
      throw new Error(`Failed to generate analysis. Model errors: ${modelErrors.join('; ')}`);
    }

    res.json({
      ...analysisResult,
      usedModel
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze stock', 
      details: error.message || 'Unknown error occurred during analysis'
    });
  }
});

app.post('/v1/convert', async (req, res) => {
  try {
    const { code, conversionType } = req.body;
    
    if (!code || !conversionType) {
      return res.status(400).json({
        error: 'Invalid request',
        details: 'Both code and conversionType are required'
      });
    }

    let systemPrompt = `You are an expert code converter. You will receive code to convert from one language/framework to another.
    Convert the following code from ${conversionType.split('-')[0]} to ${conversionType.split('-')[2]}.
    Ensure the converted code maintains the same functionality and follows best practices.
    Return only the converted code without any explanations or markdown formatting.`;

    let convertedCode = null;
    let usedModel = null;
    let modelErrors = [];

    for (const model of AI_MODELS) {
      try {
        const completion = await openai.chat.completions.create({
          model: model,
          messages: [
            { 
              role: "system", 
              content: systemPrompt 
            },
            { 
              role: "user", 
              content: code 
            }
          ],
          temperature: 0.3,
          max_tokens: 2048
        });

        const content = completion.choices[0].message.content;
        
        // Clean up any potential markdown formatting
        const cleanedContent = content.replace(/```[\w]*\n?|\n?```/g, '').trim();
        
        if (cleanedContent) {
          convertedCode = cleanedContent;
          usedModel = model;
          break;
        }
      } catch (modelError) {
        modelErrors.push(`${model}: ${modelError.message}`);
        console.error(`Error with model ${model}:`, modelError);
      }
    }

    if (!convertedCode) {
      throw new Error(`Failed to convert code. Model errors: ${modelErrors.join('; ')}`);
    }

    res.json({
      convertedCode,
      usedModel
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ 
      error: 'Failed to convert code', 
      details: error.message || 'Unknown error occurred during conversion'
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});