import { AnalysisResult, StockAnalysisInput, ConversionType, StandupFormData, StandupResult } from "./types";

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

// API Response Types
export interface OptimizeResponse {
  optimizedCode: string;
  usedModel: string;
}

export interface AnalyzeResponse {
  analysisResult: string;
  usedModel: string;
  technicalTrends: string;
  volumePatterns: string;
  supportResistance: string;
  shortTermOutlook: string;
  stopLoss: number;
}

export interface ConversionResponse {
  convertedCode: string;
  usedModel: string;
}

// API Request Types
export interface OptimizeRequest {
  code: string;
  optimizationType: "hooks" | "readability" | "linting" | "bugs";
}

export interface ConvertRequest {
  code: string;
  conversionType: ConversionType;
}

// API Service Functions
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
    
    // Validate the response data
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
    // Log the request for debugging
    console.log('Convert code request:', request);
    
    const response = await fetch(`${API_CONFIG.baseURL}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    // Check if the response is ok
    if (!response.ok) {
      console.error('Convert API error status:', response.status);
      let errorMessage = 'Failed to convert code';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.details || errorMessage;
      } catch (jsonError) {
        // If we can't parse the error as JSON, use the default message
        console.error('Error parsing error response:', jsonError);
      }
      
      throw new Error(errorMessage);
    }

    // Try to parse the response as JSON
    try {
      const data = await response.json();
      
      // Validate the response has the expected structure
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

export async function generateStandup(data: StandupFormData): Promise<StandupResult> {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/standup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to generate standup');
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}