export interface TorneoPlayer { id: string; name: string; team: string }
export interface TorneoGroup  { id: string; pids: string[] }
export interface TorneoBet    { bid: string; pred: string; amt: number }
export interface Settlement {
  pot: number; winner: string | null; winnerBonus: number; bettersPool: number
  correctBettors: { bid: string; wagered: number; won: number }[]
  noBettors: boolean
}
export interface TorneoMatch {
  id: string; ph: 'group' | 'knockout'
  gid?: string; round?: number; slot?: number; tbd?: boolean
  p1: string | null; p2: string | null
  s1: number | null; s2: number | null
  done: boolean; pen: string | null
  bets: TorneoBet[]; settled: boolean; settlement: Settlement | null
}
export interface TorneoConfig { entryFee: number; maxBet: number; winnerCut: number; prize1: number; prize2: number }
export interface TorneoState {
  config: TorneoConfig
  players: TorneoPlayer[]; groups: TorneoGroup[]; matches: TorneoMatch[]
  phase: 'setup' | 'groups' | 'knockout' | 'finished'
  selMatch: string | null; champion: string | null; runnerUp: string | null; nid: number
}

export const INIT_STATE: TorneoState = {
  config: { entryFee: 200, maxBet: 100, winnerCut: 10, prize1: 80, prize2: 20 },
  players: [], groups: [], matches: [],
  phase: 'setup', selMatch: null, champion: null, runnerUp: null, nid: 1,
}
