import { 
  AnalysisResult, 
  StockAnalysisInput, 
  StandupFormData, 
  StandupResult, 
  OptimizeResponse, 
  ConversionResponse, 
  OptimizeRequest, 
  ConvertRequest,
} from "./types";

export const API_CONFIG = {
  baseURL: "http://localhost:3001/v1",
  models: [
    "deepseek/deepseek-r1-zero:free",
    "open-r1/olympiccoder-32b:free",
    "mistralai/mistral-small-3.1-24b-instruct",
    "qwen/qwq-32b:free",
    "anthropic/claude-3-opus",
    "openai/gpt-4-turbo"
  ],
  maxRequestSize: 5 * 1024 * 1024 // Updated to 5MB to match server
};

export async function optimizeCode(request: OptimizeRequest): Promise<OptimizeResponse> {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Add this line
      body: JSON.stringify({
        code: request.code,
        options: {
          increaseReadability: request.optimizationType === 'readability',
          useHighLevelFunctions: request.optimizationType === 'hooks',
          optimizeImports: request.optimizationType === 'linting',
          improveNaming: true
        }
      }),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      let errorMessage = 'Failed to optimize code';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.details || errorData.error || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    try {
      const data = JSON.parse(responseText);
      return {
        optimizedCode: data.optimizedCode,
        usedModel: data.usedModel || 'unknown'
      };
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function analyzeStock(data: StockAnalysisInput): Promise<AnalysisResult> {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to analyze stock';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.details || errorData.error || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', responseText);
      throw new Error('Invalid JSON response from server');
    }

    // Validate all required fields exist
    const requiredFields = [
      'technicalAnalysis',
      'marketTrends',
      'supportResistance',
      'stopLoss',
      'outlook'
    ];

    const missingFields = requiredFields.filter(field => !responseData[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing fields in response:', {
        missingFields,
        receivedData: responseData
      });
      throw new Error(`Invalid analysis response format. Missing: ${missingFields.join(', ')}`);
    }

    return {
      technicalAnalysis: responseData.technicalAnalysis,
      marketTrends: responseData.marketTrends,
      supportResistance: responseData.supportResistance,
      stopLoss: responseData.stopLoss,
      outlook: responseData.outlook,
      usedModel: responseData.usedModel || 'unknown'
    };
  } catch (error) {
    console.error('API error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export async function convertCode(request: ConvertRequest): Promise<ConversionResponse> {
  try {
    console.log('Convert code request:', request);
    
    const response = await fetch(`${API_CONFIG.baseURL}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error('Convert API error status:', response.status);
      let errorMessage = 'Failed to convert code';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.details || errorMessage;
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
      }
      
      throw new Error(errorMessage);
    }

    try {
      const data = await response.json();
      
      if (!data || !data.convertedCode || typeof data.convertedCode !== 'string') {
        console.error('Invalid conversion response:', data);
        throw new Error('Invalid conversion response format');
      }

      return {
        convertedCode: data.convertedCode,
        usedModel: data.usedModel || 'unknown'
      };
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Error parsing conversion response');
    }
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function generateStandup(data: StandupFormData | string): Promise<{ formattedText: string; usedModel: string }> {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/standup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: typeof data === 'string' 
        ? JSON.stringify({ rawText: data }) 
        : JSON.stringify({
            tasks: data.tasks.map(task => ({
              ...task,
              subTasks: task.subTasks.filter(st => st.trim()),
              blockers: task.blockers?.trim() || 'No major blockers'
            }))
          }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || 'Failed to generate standup');
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function getFormattedStandup(data: StandupResult | string): Promise<{ formattedText: string; standupData: StandupResult }> {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/standup/format`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: typeof data === 'string'
        ? JSON.stringify({ rawText: data })
        : JSON.stringify({ standupData: data }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || 'Failed to format standup');
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}