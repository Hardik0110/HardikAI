import { Router } from 'express';

export default function(OPENROUTER_CONFIG, AI_MODELS) {
  const router = Router();

  async function generatePrompt(input, type, modelConfig) {
    const systemPrompt = `You are an expert prompt engineer. Generate a ${type} prompt based on the user's input. 
    For short prompts: Be concise and direct.
    For detailed prompts: Include comprehensive context and specific requirements.
    For precise prompts: Focus on technical accuracy and explicit constraints.`;

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
            { role: 'user', content: input }
          ],
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.choices[0].message.content;
    } catch (error) {
      console.error(`Error with model ${modelConfig.name}:`, error);
      return null;
    }
  }

  router.post('/', async (req, res) => {
    try {
      const { input, type } = req.body;
      
      if (!input || !type) {
        return res.status(400).json({ error: 'Input and type are required' });
      }

      let generatedPrompt = null;
      let usedModel = null;

      for (const model of AI_MODELS) {
        generatedPrompt = await generatePrompt(input, type, model);
        if (generatedPrompt) {
          usedModel = model.name;
          break;
        }
      }

      if (!generatedPrompt) {
        return res.status(500).json({ error: 'Failed to generate prompt' });
      }

      res.json({ generatedPrompt, usedModel });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}