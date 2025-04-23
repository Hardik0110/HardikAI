import { Router } from 'express';

export default function (openai, AI_MODELS) {
  const router = Router();

  async function tryOptimize(code, prompt, model) {
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
      return choices?.[0]?.message?.content || null;
    } catch {
      return null;
    }
  }

  router.post('/', async (req, res) => {
    const { code, optimizationType } = req.body;
    let systemPrompt = 'You are an expert code optimizer.';
    switch (optimizationType) {
      case 'hooks':
        systemPrompt += ' Convert class components to functional ones with hooks.';
        break;
      case 'readability':
        systemPrompt += ' Improve formatting and naming for readability.';
        break;
      case 'linting':
        systemPrompt += ' Add TS types and fix lint issues.';
        break;
      case 'bugs':
        systemPrompt += ' Identify and fix bugs.';
        break;
      default:
        systemPrompt += ' Optimize the code.';
    }
    systemPrompt += ' Return only the optimized code.';

    let optimized = null, usedModel = null;
    for (const model of AI_MODELS) {
      optimized = await tryOptimize(code, systemPrompt, model);
      if (optimized) { usedModel = model; break; }
    }
    if (!optimized) return res.status(500).json({ error: 'All models failed' });

    res.json({ optimizedCode: optimized, usedModel });
  });

  return router;
}
