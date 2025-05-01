import { Router } from 'express';
import { makeOpenRouterRequest, tryMultipleModels } from '../utils.js';

export default function(OPENROUTER_CONFIG, AI_MODELS) {
  const router = Router();

  async function processConversion(modelConfig, code, systemPrompt) {
    const result = await makeOpenRouterRequest(
      OPENROUTER_CONFIG, 
      modelConfig, 
      systemPrompt, 
      code
    );
    
    if (!result) return null;
    return { convertedCode: result.choices[0].message.content };
  }

  router.post('/', async (req, res) => {
    const { code, conversionType } = req.body;
    if (!code || !conversionType) {
      return res.status(400).json({ error: 'code and conversionType required' });
    }

    try {
      const [from, to] = conversionType.split('-to-');
      const systemPrompt = `Convert this ${from} code to ${to}. Return ONLY the converted code.`;

      const result = await tryMultipleModels(AI_MODELS, processConversion, code, systemPrompt);
      
      if (!result) {
        return res.status(500).json({ error: 'Failed to convert code' });
      }

      res.json({ 
        convertedCode: result.convertedCode, 
        usedModel: result.usedModel 
      });
    } catch (error) {
      console.error('API error:', error);
      res.status(500).json({ 
        error: 'Error processing request', 
        details: error.message 
      });
    }
  });

  return router;
}