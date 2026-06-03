import { createClient } from '@/lib/supabase/client'

export interface DbGameTeam {
  id: string
  game_type: string
  name: string
  league: string
  country: string
  stars: number | null
  rating: number | null
}

export interface DbGamePlayer {
  id: string
  game_type: string
  name: string
  team: string
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  ovr: number
  price: number
  league: string
}

export interface DbGameFixture {
  id: string
  game_type: string
  home_team: string
  away_team: string
  match_date: string | null
  competition: string
  matchday: number | null
  home_score: number | null
  away_score: number | null
  status: 'scheduled' | 'live' | 'finished'
}

export async function getTeamsByGameType(gameTypeId: string): Promise<DbGameTeam[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('game_teams')
    .select('*')
    .eq('game_type', gameTypeId)
    .order('rating', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getPlayersByGameType(gameTypeId: string): Promise<DbGamePlayer[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('game_players')
    .select('*')
    .eq('game_type', gameTypeId)
    .order('ovr', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getPlayersByTeam(gameTypeId: string, teamName: string): Promise<DbGamePlayer[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('game_players')
    .select('*')
    .eq('game_type', gameTypeId)
    .eq('team', teamName)
    .order('ovr', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getFixturesByGameType(gameTypeId: string): Promise<DbGameFixture[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('game_fixtures')
    .select('*')
    .eq('game_type', gameTypeId)
    .order('match_date', { ascending: true })

  if (error) throw error
  return data ?? []
}

/** Agrupa equipos por liga */
export function groupTeamsByLeague(teams: DbGameTeam[]): Record<string, DbGameTeam[]> {
  return teams.reduce((acc, t) => {
    if (!acc[t.league]) acc[t.league] = []
    acc[t.league].push(t)
    return acc
  }, {} as Record<string, DbGameTeam[]>)
}

/** Agrupa jugadores por equipo */
export function groupPlayersByTeam(players: DbGamePlayer[]): Record<string, DbGamePlayer[]> {
  return players.reduce((acc, p) => {
    if (!acc[p.team]) acc[p.team] = []
    acc[p.team].push(p)
    return acc
  }, {} as Record<string, DbGamePlayer[]>)
}

/** Agrupa fixtures por jornada/competition */
export function groupFixturesByCompetition(fixtures: DbGameFixture[]): Record<string, DbGameFixture[]> {
  return fixtures.reduce((acc, f) => {
    if (!acc[f.competition]) acc[f.competition] = []
    acc[f.competition].push(f)
    return acc
  }, {} as Record<string, DbGameFixture[]>)
}
