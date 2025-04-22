// src/lib/api.ts

import { AnalysisResult } from "./types";

// API Configuration
export const API_CONFIG = {
  baseURL: "http://localhost:3001/v1",
  models: [
    "deepseek-r1",
    "claude-3-5-sonnet-20240620",
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    "deepseek-v3",
    "gpt-4o-2024-05-13",
    "Meta-Llama-3.3-70B-Instruct-Turbo"
  ],
  imageAnalysisModels: [
    "grok-3",
    "gpt-4o",
    "claude-3.7-sonnet"
  ],
  maxImageSize: 1024 * 1024 // 1MB max size
};

// API Response Types
export interface OptimizeResponse {
  optimizedCode: string;
  usedModel: string;
}

export interface AnalyzeResponse {
  analysisResult: string;
  usedModel: string;
}

// API Request Types
export interface OptimizeRequest {
  code: string;
  optimizationType: "hooks" | "readability" | "linting" | "bugs";
}

export interface AnalyzeRequest {
  imageData: string;
}

export interface StockAnalysisInput {
  symbol: string;
  timeframe?: string;
  indicators?: string[];
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

// Helper for image processing
export function resizeImage(dataUrl: string, maxWidth = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Use a lower quality (0.7) to reduce file size
      const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      resolve(resizedDataUrl);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

export async function analyzeChart(imageData: string): Promise<AnalysisResult> {
  try {
    // Resize the image to prevent 413 Payload Too Large errors
    const resizedImageData = await resizeImage(imageData);
    
    // Extract only the base64 data part (remove the data:image/jpeg;base64, prefix)
    const base64Data = resizedImageData.split(',')[1];
    
    const response = await fetch(`${API_CONFIG.baseURL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        imageData: base64Data 
      }),
    });

    if (!response.ok) {
      if (response.status === 413) {
        throw new Error('Image file is too large. Please use a smaller image (under 1MB).');
      }
      
      try {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to analyze chart');
      } catch (jsonError) {
        throw new Error(`Failed to analyze chart: ${response.statusText}`);
      }
    }

    const data = await response.json();
    return {
      text: data.analysisResult,
      technicalTrends: data.technicalTrends || [],
      volumePatterns: data.volumePatterns || [],
      supportResistance: data.supportResistance || [],
      shortTermOutlook: data.shortTermOutlook || '',
      stopLoss: data.stopLoss || null
    };
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

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}