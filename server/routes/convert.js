import { Router } from 'express';

export default function (openai, AI_MODELS) {
  const router = Router();

  router.post('/', async (req, res) => {
    const { code, conversionType } = req.body;
    if (!code || !conversionType) {
      return res.status(400).json({ error: 'code and conversionType required' });
    }

    const [from, to] = conversionType.split('-to-');
    if (!from || !to) {
      return res.status(400).json({ error: 'Invalid conversionType format' });
    }

    const systemPrompt = `You are a code converter that converts code from ${from} to ${to}.
                            Instructions:
                            1. Convert the provided code to ${to}
                            2. Return ONLY the converted code without any explanations
                            3. Do not include backticks, language identifiers, or any other text
                            4. Maintain the same functionality as the original code
                            5. Use idiomatic ${to} patterns and best practices
                            6. Include necessary imports/dependencies`;

    let converted = null, usedModel = null;
    for (const model of AI_MODELS) {
      try {
        const { choices } = await openai.chat.completions.create({
          model,
          messages: [
            { 
              role: 'system', 
              content: systemPrompt 
            },
            { 
              role: 'user', 
              content: `Convert this ${from} code to ${to}:\n\n${code}` 
            },
            {
              role: 'assistant',
              content: `I will convert the code to ${to} following the exact requirements.`
            }
          ],
          temperature: 0.2, 
          max_tokens: 2048,
          presence_penalty: -0.5, 
          frequency_penalty: 0.0
        });

        const content = choices[0].message.content.trim();
        
        const cleanedContent = content
          .replace(/^```[\w-]*\n?|```$/gm, '') 
          .replace(/^Here's the converted code:?\s*/i, '') 
          .replace(/^Converting to[\s\S]*?:\s*/i, '') 
          .trim();

        if (cleanedContent && !cleanedContent.toLowerCase().includes('here') && !cleanedContent.toLowerCase().includes('improve')) {
          converted = cleanedContent;
          usedModel = model;
          break;
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        continue;
      }
    }

    if (!converted) {
      return res.status(500).json({ 
        error: 'Code conversion failed', 
        details: 'All models failed to provide valid conversion' 
      });
    }

    res.json({ 
      convertedCode: converted, 
      usedModel 
    });
  });

  return router;
}
