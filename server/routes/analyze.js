import { Router } from 'express';

export default function(OPENROUTER_CONFIG, AI_MODELS) {
  const router = Router();

  async function tryAnalyze(data, modelConfig) {
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

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
          'HTTP-Referer': OPENROUTER_CONFIG.referer,
          'X-Title': OPENROUTER_CONFIG.appName
        },
        body: JSON.stringify({
          model: modelConfig.name,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Analyze this stock with detailed insights for each section.' }
          ],
          temperature: 0.7, // Increased for more natural language
          max_tokens: modelConfig.maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const analysis = result.choices[0].message.content;

      // Parse the analysis into sections
      const sections = {
        technicalAnalysis: extractSection(analysis, "Technical Analysis"),
        marketTrends: extractSection(analysis, "Market Trends"),
        supportResistance: extractSection(analysis, "Support/Resistance"),
        stopLoss: extractSection(analysis, "Stop Loss"),
        outlook: extractSection(analysis, "Overall Outlook")
      };

      return sections;
    } catch (error) {
      console.error(`Error with model ${modelConfig.name}:`, error);
      return null;
    }
  }

  function extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}:(.+?)(?=(?:[12345]\.|$))`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  router.post('/', async (req, res) => {
    const data = req.body;
    if (!data.companyName || !data.currentPrice || !data.volume) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let analysis = null;
    let usedModel = null;

    for (const model of AI_MODELS) {
      analysis = await tryAnalyze(data, model);
      if (analysis) {
        usedModel = model.name;
        break;
      }
    }

    if (!analysis) {
      return res.status(500).json({ error: 'Failed to analyze stock' });
    }

    res.json({ ...analysis, usedModel });
  });

  return router;
}
