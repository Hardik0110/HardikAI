import { create } from 'zustand'
import  { StockAnalysisState } from '@/lib/types'



export const useStockAnalysisStore = create<StockAnalysisState>()((set) => ({
  isAnalyzing: false,
  analysisResult: null,
  setIsAnalyzing: (value) => set({ isAnalyzing: value }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
}))
