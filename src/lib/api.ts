import { AnalysisResult, StockAnalysisInput } from "./types";

export interface ConvertRequest {
  code: string;
  conversionType: ConversionType;
}

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

export type ConversionType = 'typescript' | 'javascript' | 'python' | 'java';

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
    const response = await fetch(`${API_CONFIG.baseURL}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    // First check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to convert code');
    }

    const data = await response.json();
    
    // Validate the response structure
    if (!data.convertedCode || typeof data.convertedCode !== 'string') {
      throw new Error('Invalid conversion response format');
    }

    return {
      convertedCode: data.convertedCode,
      usedModel: data.usedModel || 'unknown'
    };
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}