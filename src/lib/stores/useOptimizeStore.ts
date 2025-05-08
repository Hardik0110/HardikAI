import { create } from 'zustand';

interface OptimizeState {
  code: string;
  optimizedCode: string;
  isOptimizing: boolean;
  usedModel: string | null;
  setCode: (c: string) => void;
  setOptimizedCode: (c: string) => void;
  setIsOptimizing: (v: boolean) => void;
  setUsedModel: (m: string | null) => void;
}

export const useOptimizeStore = create<OptimizeState>((set) => ({
  code: '',
  optimizedCode: '',
  isOptimizing: false,
  usedModel: null,
  setCode: (code) => set({ code }),
  setOptimizedCode: (optimizedCode) => set({ optimizedCode }),
  setIsOptimizing: (isOptimizing) => set({ isOptimizing }),
  setUsedModel: (usedModel) => set({ usedModel }),
}));