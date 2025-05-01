import { Router } from 'express';
import { makeOpenRouterRequest, tryMultipleModels } from '../utils.js';

export default function(OPENROUTER_CONFIG, AI_MODELS) {
  const router = Router();

  function extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}:(.+?)(?=(?:[12345]\.|$))`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  async function processAnalysis(modelConfig, data) {
    const systemPrompt = `You are a professional Indian stock market analyst. Analyze this stock and provide the following details:
      1. Technical Analysis: Key technical indicators and patterns
      2. Market Trends: Current trend direction and strength
      3. Support/Resistance: Key price levels and zones
      4. Stop Loss Recommendation: Based on volatility and risk
      5. Overall Outlook: Short to medium term perspective

      Company Details:
      - Name: ${data.companyName}
      - Price: ₹${data.currentPrice}
      - Volume: ${data.volume}
      ${data.peRatio ? `- P/E: ${data.peRatio}` : ''}
      ${data.eps ? `- EPS: ${data.eps}` : ''}
      ${data.marketCap ? `- Market Cap: ₹${data.marketCap} Crores` : ''}

      Provide detailed insights for each section.`;

    const result = await makeOpenRouterRequest(
      OPENROUTER_CONFIG, 
      modelConfig, 
      systemPrompt, 
      'Analyze this stock with detailed insights for each section.'
    );
    
    if (!result) return null;
    
    const analysis = result.choices[0].message.content;

    // Parse the analysis into sections
    return {
      technicalAnalysis: extractSection(analysis, "Technical Analysis"),
      marketTrends: extractSection(analysis, "Market Trends"),
      supportResistance: extractSection(analysis, "Support/Resistance"),
      stopLoss: extractSection(analysis, "Stop Loss"),
      outlook: extractSection(analysis, "Overall Outlook")
    };
  }

  router.post('/', async (req, res) => {
    const data = req.body;
    if (!data.companyName || !data.currentPrice || !data.volume) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const result = await tryMultipleModels(AI_MODELS, processAnalysis, data);
      
      if (!result) {
        return res.status(500).json({ error: 'Failed to analyze stock' });
      }

      res.json(result);
    } catch (error) {
      console.error('API error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({ 
        error: 'Error processing request', 
        details: error.message 
      });
    }
  });

  return router;
}