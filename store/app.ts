import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { QuickNote } from '../utils/types'

interface AppState {
    notes: QuickNote[];
    setNotes: (notes: QuickNote[]) => void;
    currentNotes: string[];
    setCurrentNotes: (notes: string[]) => void;
}

const useAppStore = create<AppState>()(
  devtools(
      (set) => ({

        notes: [],
        setNotes: (notes) => set((state) => ({ notes })),
        currentNotes: [],
        setCurrentNotes: (currentNotes) => set((state) => ({ currentNotes })),
        
      }),
      {
        name: 'midi-app-storage',
      }
  )
)

export default useAppStore