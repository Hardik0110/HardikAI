import { Router } from 'express';

export default function(OPENROUTER_CONFIG, AI_MODELS) {
  const router = Router();

  async function tryOptimize(code, systemPrompt, modelConfig) {
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
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (error) {
      console.error(`Error with model ${modelConfig.name}:`, error);
      return null;
    }
  }

  router.post('/', async (req, res) => {
    const { code, options } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const systemPrompt = `You are an expert code optimizer. ${
      options?.increaseReadability ? 'Improve readability. ' : ''
    }${options?.useHighLevelFunctions ? 'Use modern functions and hooks. ' : ''
    }${options?.optimizeImports ? 'Organize and optimize imports. ' : ''
    }${options?.improveNaming ? 'Improve variable and function naming. ' : ''
    }Return only the optimized code without explanations.`;

    let optimizedCode = null;
    let usedModel = null;

    for (const model of AI_MODELS) {
      optimizedCode = await tryOptimize(code, systemPrompt, model);
      if (optimizedCode) {
        usedModel = model.name;
        break;
      }
    }

    if (!optimizedCode) {
      return res.status(500).json({ error: 'Failed to optimize code' });
    }

    res.json({ optimizedCode, usedModel });
  });

  return router;
}
