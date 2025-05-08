import { create } from "zustand"

type PromptState = {
  promptType: string
  userInput: string
  generatedPrompt: string | null
  isGenerating: boolean
  setPromptType: (type: string) => void
  setUserInput: (input: string) => void
  setGeneratedPrompt: (prompt: string | null) => void
  setIsGenerating: (loading: boolean) => void
}

export const usePromptStore = create<PromptState>((set) => ({
  promptType: "Select Prompt Type",
  userInput: "",
  generatedPrompt: null,
  isGenerating: false,
  setPromptType: (type) => set({ promptType: type }),
  setUserInput: (input) => set({ userInput: input }),
  setGeneratedPrompt: (prompt) => set({ generatedPrompt: prompt }),
  setIsGenerating: (loading) => set({ isGenerating: loading }),
}))
