import { Router } from 'express';

export default function(OPENROUTER_CONFIG, AI_MODELS) {
  const router = Router();

  async function tryStandup(data, modelConfig) {
    const systemPrompt = `You are a precise daily standup generator for a frontend engineer. Based on structured input, you must generate a clean, concise daily standup report in this strict format.

1. Divide tasks across 8 hours.
2. If any task exceeds 2 hours, break it into subtasks with durations.
3. Include only relevant content, avoid unnecessary descriptions.
4. Structure your output in this exact markdown format:

**Yesterday's Progress**  
- **[Task Title] ([Total Time]h)**  
  - [Subtask if any]. ([Duration]h)  
  - [Subtask if any]. ([Duration]h)  

**Learnings & Insights**  
- [Insight #1]. ([Duration]h)  
- [Insight #2]. ([Duration]h)  

**Blockers**  
- [If none, say “No major blockers.”]  

**Today's Plan**  
- [Brief one-liner of today’s goal, no duration.]

Only output the markdown standup text — no extra commentary or explanations. Your responses must match the user's past style exactly.
`;

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
            { role: 'user', content: typeof data === 'string' ? data : JSON.stringify(data.tasks) }
          ],
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        formattedText: result.choices[0].message.content,
        usedModel: modelConfig.name
      };
    } catch (error) {
      console.error(`Error with model ${modelConfig.name}:`, error);
      return null;
    }
  }

  router.post('/', async (req, res) => {
    try {
      const data = req.body;
      let standup = null;

      for (const model of AI_MODELS) {
        standup = await tryStandup(data, model);
        if (standup) break;
      }

      if (!standup) {
        return res.status(500).json({ error: 'Failed to generate standup' });
      }

      res.json(standup);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}