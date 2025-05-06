import { Router } from 'express';

export default function(OPENROUTER_CONFIG, AI_MODELS) {
  const router = Router();

  const timeoutPromise = (ms) => new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), ms)
  );

  async function processOptimize(modelConfig, code, systemPrompt) {
    try {
      const response = await Promise.race([
        fetch('https://openrouter.ai/api/v1/chat/completions', {
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
              { role: 'user', content: code }
            ],
            temperature: 0.2,
            max_tokens: modelConfig.maxTokens || 4000,
            stream: false 
          })
        }),
        timeoutPromise(15000) 
      ]);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const optimizedCode = result.choices?.[0]?.message?.content?.trim();

      if (!optimizedCode) {
        throw new Error('No optimized code in response');
      }

      return { 
        optimizedCode,
        usedModel: modelConfig.name 
      };
    } catch (error) {
      console.error(`Error with ${modelConfig.name}:`, error.message);
      return null;
    }
  }

  router.post('/', async (req, res) => {
    const { code, optimizationType } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const systemPrompt = `You are an expert code optimizer. Optimize this ${optimizationType} code.
    IMPORTANT: Return ONLY the optimized code without any explanations.
    
    For ${optimizationType}:
    ${optimizationType === 'hooks' ? '- Use modern React hooks and patterns\n- Convert class components to functional\n- Implement proper hook dependencies' :
      optimizationType === 'readability' ? '- Improve formatting and structure\n- Add meaningful variable names\n- Break down complex logic' :
      optimizationType === 'linting' ? '- Fix code style issues\n- Remove unused imports\n- Follow best practices' :
      optimizationType === 'bugs' ? '- Identify and fix potential bugs\n- Add error handling\n- Fix edge cases' :
      '- Identify and fix potential performance issues\n- Add make the code faster\n- Fix edge cases'}

    Code to optimize:\n${code}`;

    try {
      const modelPromises = AI_MODELS.map(model => 
        processOptimize(model, code, systemPrompt)
      );

      const results = await Promise.allSettled(modelPromises);
      const successfulResult = results.find(
        r => r.status === 'fulfilled' && r.value?.optimizedCode
      )?.value;

      if (!successfulResult) {
        return res.status(500).json({ 
          error: 'Failed to optimize code',
          details: 'All models failed to provide valid output'
        });
      }

      console.log('Optimization successful:', {
        modelUsed: successfulResult.usedModel,
        outputLength: successfulResult.optimizedCode.length
      });

      res.json(successfulResult);
    } catch (error) {
      console.error('Optimization error:', error);
      res.status(500).json({ 
        error: 'Error processing request', 
        details: error.message 
      });
    }
  });

  return router;
}