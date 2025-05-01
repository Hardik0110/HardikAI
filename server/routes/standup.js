import { Router } from 'express';

export default function(OPENROUTER_CONFIG, AI_MODELS) {
  const router = Router();

  async function processStandup(modelConfig, data) {
    try {
      const systemPrompt = `You are a precise daily standup generator for a frontend engineer. Generate a clean, concise daily standup report in markdown format.

Rules:
1. Each task must have a duration
2. Break down tasks over 2 hours into subtasks
3. Total duration should not exceed 8 hours
4. Include only relevant technical details

Format your response exactly like this:

**Yesterday's Progress**
- Task 1 (Xh)
  - Subtask A (Yh)
  - Subtask B (Zh)
- Task 2 (Xh)

**Learnings & Insights**
- Key learning point 1
- Key learning point 2

**Blockers**
- List any blockers (or "No major blockers")

**Today's Plan**
- Main goal/task for today

Keep the response focused and technical.`;

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
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.choices?.[0]?.message?.content) {
        console.error('Invalid response structure:', result);
        throw new Error('Invalid response from AI model');
      }

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
      
      if (!data) {
        return res.status(400).json({ error: 'No input provided' });
      }

      let result = null;
      let error = null;

      // Try each model until we get a result
      for (const model of AI_MODELS) {
        try {
          result = await processStandup(model, data);
          if (result?.formattedText) {
            break;
          }
        } catch (e) {
          error = e;
          console.error(`Failed with model ${model.name}:`, e);
          continue;
        }
      }

      if (!result?.formattedText) {
        throw error || new Error('Failed to generate standup with all available models');
      }

      console.log('Successfully generated standup:', {
        modelUsed: result.usedModel,
        outputLength: result.formattedText.length,
        timestamp: new Date().toISOString()
      });

      res.json(result);
    } catch (error) {
      console.error('Standup generation failed:', error);
      res.status(500).json({ 
        error: 'Failed to generate standup', 
        details: error.message 
      });
    }
  });

  return router;
}