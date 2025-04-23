// server/routes/standup.js
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
      let formattedTasks;
      
      // Check if we're dealing with a simple text input
      if (typeof data === 'string' || data.rawText) {
        const rawText = data.rawText || data;
        // Process raw text input
        const userPrompt = `Generate a detailed standup report from this text description:
${rawText}

Requirements:
1. Extract task names and durations from the text
2. Break down tasks into meaningful subtasks
3. Include technical specifics in descriptions
4. Estimate proper time allocations based on context
5. Generate relevant learnings from the work described
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

        return transformResponse(parsed);
      } else {
        // Process structured task data
        formattedTasks = data.tasks.map(task => ({
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

        return transformResponse(parsed);
      }
    } catch (error) {
      console.error(`Error with model ${model}:`, error);
      return null;
    }
  }

  function transformResponse(parsed) {
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
  }

  router.post('/', async (req, res) => {
    try {
      const data = req.body;
      
      // Handle raw text input
      if (typeof data === 'string' || data.rawText) {
        let standup = null;
        let usedModel = null;
        let modelErrors = [];

        // Try models in sequence until one succeeds
        for (const model of AI_MODELS) {
          try {
            const result = await tryStandup(data, model);
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
        return;
      }
      
      // Handle structured task data
      if (!Array.isArray(data.tasks) || data.tasks.length === 0) {
        return res.status(400).json({
          error: 'Invalid request',
          details: 'Tasks array is required and must not be empty'
        });
      }

      const formattedData = {
        tasks: data.tasks.map(task => ({
          name: task.name,
          hours: task.hours,
          minutes: task.minutes,
          subTasks: task.subTasks
            .filter(st => st.trim()),
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

  // New endpoint for copyable formatted text
  router.post('/format', async (req, res) => {
    try {
      const data = req.body;
      
      // Get the standup data first
      let standupData;
      
      if (typeof data === 'string' || data.rawText) {
        let standup = null;
        let usedModel = null;
        
        // Try models in sequence
        for (const model of AI_MODELS) {
          try {
            const result = await tryStandup(data, model);
            if (result) {
              standup = result;
              usedModel = model;
              break;
            }
          } catch (error) {
            console.error(`Error with model ${model}:`, error);
          }
        }
        
        if (!standup) {
          throw new Error('Failed to generate standup from text');
        }
        
        standupData = { ...standup, usedModel };
      } else if (data.standupData) {
        // If standup data is provided directly
        standupData = data.standupData;
      } else {
        throw new Error('Invalid input: Provide either raw text or standup data');
      }
      
      // Format the standup data into copyable text
      const formattedText = formatStandupForCopy(standupData);
      
      res.json({
        formattedText,
        standupData
      });
    } catch (error) {
      console.error('Standup formatting error:', error);
      res.status(500).json({
        error: 'Failed to format standup',
        details: error.message
      });
    }
  });
  
  function formatStandupForCopy(standup) {
    let result = "**Yesterday's Progress:**\n";
    
    // Add tasks
    standup.yesterdayProgress.tasks.forEach(task => {
      result += `* **${task.name}:** (${task.duration})\n`;
      task.subTasks.forEach(subtask => {
        result += `  * ${subtask.description} (${subtask.duration})\n`;
      });
    });
    
    // Add learnings
    result += "\n**Learnings & Insights:**\n";
    standup.learningsAndInsights.forEach(item => {
      result += `* ${item.description} (${item.duration})\n`;
    });
    
    // Add blockers
    result += "\n**Blockers:**\n";
    standup.blockers.forEach(blocker => {
      result += `* ${blocker}\n`;
    });
    
    // Add today's plan
    result += "\n**Today's Plan:**\n";
    standup.todaysPlan.forEach(plan => {
      result += `* ${plan}\n`;
    });
    
    return result;
  }

  return router;
}