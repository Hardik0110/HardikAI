export async function makeOpenRouterRequest(config, modelConfig, systemPrompt, userContent) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'HTTP-Referer': config.referer,
          'X-Title': config.appName
        },
        body: JSON.stringify({
          model: modelConfig.name,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
          ],
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error(`Error with model ${modelConfig.name}:`, error);
      return null;
    }
  }
  
  export async function tryMultipleModels(models, processFn, ...args) {
    for (const model of models) {
      const result = await processFn(model, ...args);
      if (result) {
        return { ...result, usedModel: model.name };
      } 
    }
    return null;
  }