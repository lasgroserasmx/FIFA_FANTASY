import { createClient } from '@/lib/supabase/client'
import type { Prediction } from '@/types'

export async function getPredictions(leagueId: string): Promise<Prediction[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('predictions')
    .select('*, match:matches(*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*))')
    .eq('league_id', leagueId)
    .eq('user_id', user.id)

  if (error) throw error
  return (data ?? []) as Prediction[]
}

export async function upsertPrediction(
  leagueId: string,
  matchId: string,
  homeScore: number,
  awayScore: number
): Promise<Prediction> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const predictedWinnerId = homeScore > awayScore
    ? (await supabase.from('matches').select('home_team_id').eq('id', matchId).single()).data?.home_team_id
    : awayScore > homeScore
    ? (await supabase.from('matches').select('away_team_id').eq('id', matchId).single()).data?.away_team_id
    : null

  const { data, error } = await supabase
    .from('predictions')
    .upsert({
      league_id: leagueId,
      user_id: user.id,
      match_id: matchId,
      predicted_home_score: homeScore,
      predicted_away_score: awayScore,
      predicted_winner_id: predictedWinnerId,
    }, { onConflict: 'league_id,user_id,match_id' })
    .select()
    .single()

  if (error) throw error
  return data as Prediction
}

export async function setChampionPrediction(leagueId: string, teamId: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Find or create a special "champion" prediction (match_id is null for champion)
  await supabase.from('predictions').upsert({
    league_id: leagueId,
    user_id: user.id,
    match_id: '00000000-0000-0000-0000-000000000000', // sentinel for champion prediction
    champion_team_id: teamId,
  }, { onConflict: 'league_id,user_id,match_id' })
}

export async function getLeaderboard(leagueId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('league_members')
    .select('*, profile:profiles(*)')
    .eq('league_id', leagueId)
    .order('total_prediction_points', { ascending: false })

  if (error) throw error
  return data ?? []
}
