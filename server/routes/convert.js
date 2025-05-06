import { Router } from 'express';

export default function(OPENROUTER_CONFIG, AI_MODELS) {
  const router = Router();

  async function processConversion(modelConfig, code, fromLang, toLang) {
    try {
      const systemPrompt = `You are an expert code converter. Convert the given code from ${fromLang} to ${toLang}.
      Rules:
      1. Maintain the same functionality
      2. Use idiomatic ${toLang} patterns
      3. Include necessary imports/dependencies
      4. Return ONLY the converted code without explanations
      5. Ensure the code is complete and valid
      
      Convert this ${fromLang} code to ${toLang}:`;

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
            { role: 'user', content: code }
          ],
          temperature: 0.3,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const convertedCode = result.choices?.[0]?.message?.content;

      if (!convertedCode) {
        console.error('No converted code in response:', result);
        return null;
      }

      return {
        convertedCode: convertedCode.trim(),
        usedModel: modelConfig.name
      };
    } catch (error) {
      console.error(`Error converting with ${modelConfig.name}:`, error);
      return null;
    }
  }

  router.post('/', async (req, res) => {
    const { code, conversionType } = req.body;
    
    if (!code || !conversionType) {
      return res.status(400).json({ error: 'code and conversionType required' });
    }

    try {
      const [fromLang, toLang] = conversionType.split('-to-');
      
      // Try each model until we get a valid result
      let result = null;
      let error = null;

      for (const model of AI_MODELS) {
        try {
          result = await processConversion(model, code, fromLang, toLang);
          if (result?.convertedCode) {
            break;
          }
        } catch (e) {
          error = e;
          console.error(`Failed with model ${model.name}:`, e);
          continue;
        }
      }

      if (!result?.convertedCode) {
        throw error || new Error('Failed to convert code with all available models');
      }

      console.log('Conversion successful:', {
        fromLang,
        toLang,
        modelUsed: result.usedModel,
        outputLength: result.convertedCode.length
      });

      res.json({
        convertedCode: result.convertedCode,
        usedModel: result.usedModel
      });
    } catch (error) {
      console.error('Conversion error:', error);
      res.status(500).json({
        error: 'Error processing request',
        details: error.message
      });
    }
  });

  return router;
}