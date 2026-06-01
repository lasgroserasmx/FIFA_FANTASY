import { create } from 'zustand'
import type { League, LeagueMember } from '@/types'

interface LeagueState {
  currentLeague: League | null
  members: LeagueMember[]
  setCurrentLeague: (league: League | null) => void
  setMembers: (members: LeagueMember[]) => void
}

export const useLeagueStore = create<LeagueState>((set) => ({
  currentLeague: null,
  members: [],
  setCurrentLeague: (currentLeague) => set({ currentLeague }),
  setMembers: (members) => set({ members }),
}))
