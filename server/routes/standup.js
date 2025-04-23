import { Router } from 'express';

export default function (openai, AI_MODELS) {
  const router = Router();

  async function tryStandup(data, model) {
    const system = `You are a daily standup report generator. Create a detailed standup report following this structure:
{
  "yesterdayProgress": {
    "tasks": [
      {
        "name": "Major Task Category (e.g., Frontend Development)",
        "duration": "Total time in Xh format",
        "subTasks": [
          {
            "description": "Detailed technical work done with specifics",
            "duration": "Time spent in Xh format"
          }
        ]
      }
    ]
  },
  "learningsAndInsights": [
    {
      "description": "Technical insight or learning from the work",
      "duration": "Time spent learning in Xh format"
    }
  ],
  "blockers": [
    "Specific blocking issues or 'No major blockers'"
  ],
  "todaysPlan": [
    "Concrete next steps with technical details"
  ]
}

Rules:
1. Group related tasks under meaningful categories
2. Include actual technical details from the input
3. Break down tasks over 2 hours into subtasks
4. All durations must be in Xh format (e.g., 2.5h)
5. Generate specific learnings based on the work done
6. Create actionable next steps for today's plan
7. Use the provided blockers or default to "No major blockers"`;

    try {
      // Format input data for better prompting
      const formattedTasks = data.tasks.map(task => ({
        name: task.name,
        timeSpent: `${task.hours}h ${task.minutes}m`,
        details: task.subTasks.filter(st => st.trim()),
        blockers: task.blockers?.trim() || 'No major blockers'
      }));

      const userPrompt = `Generate a detailed standup report for these tasks:
${JSON.stringify(formattedTasks, null, 2)}

Requirements:
1. Use the actual task names and timings provided
2. Break down tasks into meaningful subtasks
3. Include technical specifics in descriptions
4. Calculate proper time allocations
5. Generate relevant learnings from the work
6. Create specific next steps based on current progress`;

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        max_tokens: 2048,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0].message.content.trim();
      const parsed = JSON.parse(content);

      // Transform and validate the response
      return {
        yesterdayProgress: {
          tasks: parsed.yesterdayProgress?.tasks?.map(task => ({
            name: task.name || 'Task Category',
            duration: task.duration || '0h',
            subTasks: (task.subTasks || []).map(st => ({
              description: st.description || '',
              duration: st.duration || '0h'
            }))
          })) || []
        },
        learningsAndInsights: (parsed.learningsAndInsights || []).map(item => ({
          description: item.description || '',
          duration: item.duration || '0h'
        })),
        blockers: parsed.blockers?.length ? 
          parsed.blockers.map(String) : 
          ['No major blockers'],
        todaysPlan: (parsed.todaysPlan || []).map(String)
      };
    } catch (error) {
      console.error(`Error with model ${model}:`, error);
      return null;
    }
  }

  // Keep existing router.post handler but update the error handling
  router.post('/', async (req, res) => {
    try {
      const data = req.body;
      
      if (!Array.isArray(data.tasks) || data.tasks.length === 0) {
        return res.status(400).json({
          error: 'Invalid request',
          details: 'Tasks array is required and must not be empty'
        });
      }

      const formattedData = {
        tasks: data.tasks.map(task => ({
          name: task.name,
          duration: `${task.hours}h ${task.minutes}m`,
          subTasks: task.subTasks
            .filter(st => st.trim())
            .map(st => ({ description: st })),
          blockers: task.blockers?.trim() || 'No major blockers'
        }))
      };

      let standup = null;
      let usedModel = null;
      let modelErrors = [];

      // Try models in sequence until one succeeds
      for (const model of AI_MODELS) {
        try {
          const result = await tryStandup(formattedData, model);
          if (result) {
            standup = result;
            usedModel = model;
            break;
          }
        } catch (modelError) {
          modelErrors.push(`${model}: ${modelError.message}`);
        }
      }

      if (!standup) {
        throw new Error(`Failed to generate standup. Errors: ${modelErrors.join('; ')}`);
      }

      res.json({
        ...standup,
        usedModel
      });
    } catch (error) {
      console.error('Standup generation error:', error);
      res.status(500).json({
        error: 'Failed to generate standup',
        details: error.message
      });
    }
  });

  return router;
}
