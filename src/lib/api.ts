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
    "gpt-4o-2024-05-13",
    "claude-3-5-sonnet-20240620",
    "deepseek-r1",
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    "deepseek-v3",
    "Meta-Llama-3.3-70B-Instruct-Turbo"
  ],
  maxRequestSize: 1024 * 1024 // 1MB max size
};

export async function optimizeCode(request: OptimizeRequest): Promise<OptimizeResponse> {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to optimize code');
    }

    return await response.json();
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
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to analyze stock');
    }

    const responseData = await response.json();
    
    if (!responseData.technicalTrends || !responseData.volumePatterns || 
        !responseData.supportResistance || !responseData.shortTermOutlook || 
        typeof responseData.stopLoss !== 'number') {
      throw new Error('Invalid analysis response format');
    }

    return {
      technicalTrends: responseData.technicalTrends,
      volumePatterns: responseData.volumePatterns,
      supportResistance: responseData.supportResistance,
      shortTermOutlook: responseData.shortTermOutlook,
      stopLoss: responseData.stopLoss,
      text: responseData.analysisText || null
    };
  } catch (error) {
    console.error('API error:', error);
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