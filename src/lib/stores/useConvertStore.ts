import { create } from "zustand";

interface ConvertState {
  code: string;
  convertedCode: string;
  isConverting: boolean;
  usedModel: string | null;
  setCode: (code: string) => void;
  setConvertedCode: (convertedCode: string) => void;
  setIsConverting: (isConverting: boolean) => void;
  setUsedModel: (usedModel: string | null) => void;
  reset: () => void;
}

export const useConvertStore = create<ConvertState>((set) => ({
  code: "",
  convertedCode: "",
  isConverting: false,
  usedModel: null,
  setCode: (code: string) => set({ code }),
  setConvertedCode: (convertedCode: string) => set({ convertedCode }),
  setIsConverting: (isConverting: boolean) => set({ isConverting }),
  setUsedModel: (usedModel: string | null) => set({ usedModel }),
  reset: () => set({ convertedCode: "", usedModel: null }),
}));