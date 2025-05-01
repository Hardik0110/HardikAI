import { Router } from 'express';
import { makeOpenRouterRequest, tryMultipleModels } from '../utils.js';

export default function(OPENROUTER_CONFIG, AI_MODELS) {
  const router = Router();

  async function processOptimize(modelConfig, code, systemPrompt) {
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
            { role: 'user', content: code }
          ],
          temperature: modelConfig.temperature || 0.3,
          max_tokens: modelConfig.maxTokens || 4000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const optimizedCode = result.choices?.[0]?.message?.content;

      if (!optimizedCode) {
        console.error('No optimized code in response:', result);
        return null;
      }

      return { 
        optimizedCode,
        usedModel: modelConfig.name
      };
    } catch (error) {
      console.error(`Error optimizing with ${modelConfig.name}:`, error);
      return null;
    }
  }

  router.post('/', async (req, res) => {
    const { code, optimizationType } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const systemPrompt = `You are an expert code optimizer. Your task is to optimize the given code.
    
    If optimizationType is:
    - hooks: Modernize code using latest React hooks and patterns
    - readability: Improve code readability with better formatting and structure
    - linting: Fix code style and potential issues
    - bugs: Identify and fix potential bugs

    Current optimization type: ${optimizationType}

    Rules:
    1. Return ONLY the optimized code
    2. Preserve core functionality
    3. Add comments for significant changes
    4. Use modern JavaScript/TypeScript features
    5. Ensure code is complete and runnable

    Original code to optimize:
    ${code}`;

    try {
      const result = await tryMultipleModels(AI_MODELS, processOptimize, code, systemPrompt);
      
      if (!result || !result.optimizedCode) {
        return res.status(500).json({ 
          error: 'Failed to optimize code',
          details: 'No valid optimization result received'
        });
      }

      console.log('Optimization successful:', {
        originalLength: code.length,
        optimizedLength: result.optimizedCode.length,
        usedModel: result.usedModel
      });

      res.json({ 
        optimizedCode: result.optimizedCode, 
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