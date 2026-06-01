import { createClient } from '@/lib/supabase/client'
import type { FantasyTeam, FantasyRoster } from '@/types'

export async function getFantasyTeam(leagueId: string): Promise<FantasyTeam | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('fantasy_teams')
    .select('*, roster:fantasy_rosters(*, player:players(*, team:teams(*)))')
    .eq('league_id', leagueId)
    .eq('user_id', user.id)
    .single()

  if (error) return null
  return data as FantasyTeam
}

export async function getLeagueFantasyTeams(leagueId: string): Promise<FantasyTeam[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('fantasy_teams')
    .select('*, profile:profiles(*)')
    .eq('league_id', leagueId)
    .order('total_points', { ascending: false })

  if (error) throw error
  return (data ?? []) as FantasyTeam[]
}

export async function createFantasyTeam(leagueId: string, name: string): Promise<FantasyTeam> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: league } = await supabase.from('leagues').select('budget').eq('id', leagueId).single()

  const { data, error } = await supabase
    .from('fantasy_teams')
    .insert({ league_id: leagueId, user_id: user.id, name, budget_remaining: league?.budget ?? 100 })
    .select()
    .single()

  if (error) throw error
  return data as FantasyTeam
}

export async function addPlayerToTeam(fantasyTeamId: string, playerId: string, price: number): Promise<FantasyRoster> {
  const supabase = createClient()

  // Deduct budget
  const { data: team } = await supabase.from('fantasy_teams').select('budget_remaining').eq('id', fantasyTeamId).single()
  if (!team || team.budget_remaining < price) throw new Error('Insufficient budget')

  const { data, error } = await supabase
    .from('fantasy_rosters')
    .insert({ fantasy_team_id: fantasyTeamId, player_id: playerId, purchase_price: price })
    .select('*, player:players(*, team:teams(*))')
    .single()

  if (error) throw error

  await supabase
    .from('fantasy_teams')
    .update({ budget_remaining: team.budget_remaining - price })
    .eq('id', fantasyTeamId)

  return data as FantasyRoster
}

export async function removePlayerFromTeam(fantasyTeamId: string, playerId: string): Promise<void> {
  const supabase = createClient()

  const { data: roster } = await supabase
    .from('fantasy_rosters')
    .select('purchase_price')
    .eq('fantasy_team_id', fantasyTeamId)
    .eq('player_id', playerId)
    .single()

  const { error } = await supabase
    .from('fantasy_rosters')
    .delete()
    .eq('fantasy_team_id', fantasyTeamId)
    .eq('player_id', playerId)

  if (error) throw error

  if (roster?.purchase_price) {
    const { data: team } = await supabase.from('fantasy_teams').select('budget_remaining').eq('id', fantasyTeamId).single()
    if (team) {
      await supabase
        .from('fantasy_teams')
        .update({ budget_remaining: team.budget_remaining + roster.purchase_price })
        .eq('id', fantasyTeamId)
    }
  }
}

export async function setCaptain(fantasyTeamId: string, playerId: string, isVice = false): Promise<void> {
  const supabase = createClient()

  const field = isVice ? 'is_vice_captain' : 'is_captain'

  // Clear existing captain
  await supabase
    .from('fantasy_rosters')
    .update({ [field]: false })
    .eq('fantasy_team_id', fantasyTeamId)

  // Set new captain
  await supabase
    .from('fantasy_rosters')
    .update({ [field]: true })
    .eq('fantasy_team_id', fantasyTeamId)
    .eq('player_id', playerId)
}

export async function toggleStarting(rosterId: string, isStarting: boolean): Promise<void> {
  const supabase = createClient()
  await supabase.from('fantasy_rosters').update({ is_starting: isStarting }).eq('id', rosterId)
}
