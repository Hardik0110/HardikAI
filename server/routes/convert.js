import { Router } from 'express';

export default function(OPENROUTER_CONFIG, AI_MODELS) {
  const router = Router();

  async function tryConvert(code, systemPrompt, modelConfig) {
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
    const { code, conversionType } = req.body;
    if (!code || !conversionType) {
      return res.status(400).json({ error: 'code and conversionType required' });
    }

    const [from, to] = conversionType.split('-to-');
    const systemPrompt = `Convert this ${from} code to ${to}. Return ONLY the converted code.`;

    let convertedCode = null;
    let usedModel = null;

    for (const model of AI_MODELS) {
      convertedCode = await tryConvert(code, systemPrompt, model);
      if (convertedCode) {
        usedModel = model.name;
        break;
      }
    }

    if (!convertedCode) {
      return res.status(500).json({ error: 'Failed to convert code' });
    }

    res.json({ convertedCode, usedModel });
  });

  return router;
}
