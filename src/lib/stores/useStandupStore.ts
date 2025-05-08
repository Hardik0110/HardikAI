import { create } from 'zustand'
import type { StandupResult } from '../types'

interface StandupState {
  // State
  rawText: string
  isLoading: boolean
  standupResult: StandupResult | null

  // Actions
  setRawText: (text: string) => void
  setIsLoading: (loading: boolean) => void
  setStandupResult: (result: StandupResult | null) => void
  reset: () => void
}

export const useStandupStore = create<StandupState>((set) => ({
  // Initial state
  rawText: '',
  isLoading: false,
  standupResult: null,

  // Actions
  setRawText: (text) => set({ rawText: text }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setStandupResult: (result) => set({ standupResult: result }),
  reset: () => set({ rawText: '', isLoading: false, standupResult: null })
}))