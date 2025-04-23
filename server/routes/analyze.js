import { Router } from 'express';

export default function (openai, AI_MODELS) {
  const router = Router();

  async function tryAnalyze(data, model) {
    const sys = `
You are an expert Indian stock analyst.
Respond ONLY with JSON (no markdown).

Company: ${data.companyName}
Price: ₹${data.currentPrice}
Volume: ${data.volume}
${data.peRatio ? `P/E: ${data.peRatio}` : ''}
${data.eps ? `EPS: ${data.eps}` : ''}
${data.marketCap ? `Market Cap: ₹${data.marketCap} Crores` : ''}
${data.dividend ? `Dividend: ${data.dividend}%` : ''}
${data.beta ? `Beta: ${data.beta}` : ''}
${data.news ? `News: ${data.news}` : ''}
`;
    const user = `
Return ONLY JSON:
{
  "technicalTrends": "...",
  "volumePatterns": "...",
  "supportResistance": "...",
  "shortTermOutlook": "...",
  "stopLoss": number
}`;
    try {
      const { choices } = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: user },
        ],
        temperature: 0.4,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
      });
      return JSON.parse(
        choices[0].message.content
          .replace(/```json|```/g, '')
          .trim()
      );
    } catch {
      return null;
    }
  }

  router.post('/', async (req, res) => {
    const data = req.body;
    if (!data.companyName || !data.currentPrice || !data.volume) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let result = null, usedModel = null;
    for (const model of AI_MODELS) {
      const r = await tryAnalyze(data, model);
      if (r) { result = r; usedModel = model; break; }
    }
    if (!result) return res.status(500).json({ error: 'All models failed' });

    res.json({ ...result, usedModel });
  });

  return router;
}
