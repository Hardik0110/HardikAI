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
    const prompt = `
You are a code converter. Convert from ${from} to ${to}.
Return ONLY the converted code.
`;

    let converted = null, usedModel = null;
    for (const model of AI_MODELS) {
      try {
        const { choices } = await openai.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: code },
          ],
          temperature: 0.3,
          max_tokens: 2048,
        });
        const content = choices[0].message.content
          .replace(/```[^\n]*\n?|```/g, '')
          .trim();
        if (content) {
          converted = content;
          usedModel = model;
          break;
        }
      } catch {}
    }
    if (!converted) return res.status(500).json({ error: 'All models failed' });

    res.json({ convertedCode: converted, usedModel });
  });

  return router;
}
