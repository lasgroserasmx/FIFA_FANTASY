import { createClient } from '@/lib/supabase/client'
import type { Match, PlayerMatchStats } from '@/types'

export async function getMatches(status?: string): Promise<Match[]> {
  const supabase = createClient()
  let query = supabase
    .from('matches')
    .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
    .order('match_date', { ascending: true })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Match[]
}

export async function getMatch(id: string): Promise<Match | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('matches')
    .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Match
}

export async function getUpcomingMatches(limit = 5): Promise<Match[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('matches')
    .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
    .in('status', ['scheduled', 'live'])
    .order('match_date', { ascending: true })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as Match[]
}

export async function getLiveMatches(): Promise<Match[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('matches')
    .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
    .eq('status', 'live')

  if (error) throw error
  return (data ?? []) as Match[]
}

export async function getMatchStats(matchId: string): Promise<PlayerMatchStats[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('player_match_stats')
    .select('*, player:players(*, team:teams(*))')
    .eq('match_id', matchId)

  if (error) throw error
  return (data ?? []) as PlayerMatchStats[]
}
