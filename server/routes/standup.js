import { Router } from 'express';

export default function (openai, AI_MODELS) {
  const router = Router();

  async function tryStandup(data, model) {
    const system = `You are a daily standup report generator. Follow this EXACT format with NO additional headers or sections:

                    Yesterday's Progress:
                    {List tasks with exact time durations in (Xh Ym) format}
                    - Each main task should include total time
                    - Break down tasks over 2 hours into subtasks
                    - Include ticket numbers where applicable
                    - Each subtask must show its duration

                    Example format:
                    Yesterday's Progress:
                    Frontend Development (4h 30m)
                    - Implemented user authentication flow (2h 15m)
                      - Login component setup (1h)
                      - Token management integration (45m)
                      - Testing and fixes (30m)
                    - Dashboard layout creation (2h 15m)

                    Learnings & Insights:
                    - {Each learning point with time spent on it}
                    - Example: Improved understanding of React Context API (30m)

                    Blockers:
                    - {List any blocking issues or "No major blockers"}
                    - Must be specific technical issues if any

                    Today's Plan:
                    - {List specific tasks planned, with technical details}
                    - Include estimated time for each task

                    DO NOT add any other sections, dates, or formatting.`;

    try {
      const userPrompt = typeof data === 'string' || data.rawText
        ? `Convert this into a standup report following the format exactly: ${data.rawText || data}`
        : `Generate a standup report from these tasks, ensuring all timings add up to 8 hours total:
${JSON.stringify(data.tasks.map(t => ({
  name: t.name,
  duration: `${t.hours}h ${t.minutes}m`,
  subTasks: t.subTasks,
  blockers: t.blockers
})), null, 2)}`;

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { 
            role: 'system', 
            content: system 
          },
          { 
            role: 'user', 
            content: userPrompt 
          },
          {
            role: 'assistant',
            content: 'I will generate a standup report with the exact format, including precise time durations for all tasks and subtasks, ensuring they sum to 8 hours.'
          }
        ],
        temperature: 0.3, 
        max_tokens: 2048,
        presence_penalty: -0.5, 
        frequency_penalty: 0.3 
      });

      const content = completion.choices[0].message.content.trim();
      
      if (!content.startsWith("Yesterday's Progress:")) {
        throw new Error('Invalid response format');
      }

      return {
        formattedText: content,
        usedModel: model
      };
    } catch (error) {
      console.error(`Error with model ${model}:`, error);
      return null;
    }
  }

  function transformResponse(parsed) {
    if (!parsed || !parsed.yesterdayProgress || !Array.isArray(parsed.yesterdayProgress.tasks)) {
      console.error('Invalid response structure:', parsed);
      return null;
    }
    
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
      
      if (typeof data === 'string' || data.rawText) {
        let standup = null;
        let usedModel = null;
        let modelErrors = [];

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

  router.post('/format', async (req, res) => {
    try {
      const data = req.body;
      
      let standupData;
      
      if (typeof data === 'string' || data.rawText) {
        let standup = null;
        let usedModel = null;
        
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
        standupData = data.standupData;
      } else {
        throw new Error('Invalid input: Provide either raw text or standup data');
      }
      
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
    
    standup.yesterdayProgress.tasks.forEach(task => {
      result += `* **${task.name}:** (${task.duration})\n`;
      task.subTasks.forEach(subtask => {
        result += `  * ${subtask.description} (${subtask.duration})\n`;
      });
    });
    
    result += "\n**Learnings & Insights:**\n";
    standup.learningsAndInsights.forEach(item => {
      result += `* ${item.description} (${item.duration})\n`;
    });
    
    result += "\n**Blockers:**\n";
    standup.blockers.forEach(blocker => {
      result += `* ${blocker}\n`;
    });
    
    result += "\n**Today's Plan:**\n";
    standup.todaysPlan.forEach(plan => {
      result += `* ${plan}\n`;
    });
    
    return result;
  }

  return router;
}