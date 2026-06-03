import { createClient } from '@/lib/supabase/client'
import type { League, LeagueMember, CreateLeagueInput } from '@/types'
import { createTorneo } from './torneo'

export async function getLeagues(): Promise<League[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // 1. Traer IDs de ligas del usuario
  const { data: memberships, error } = await supabase
    .from('league_members')
    .select('league_id')
    .eq('user_id', user.id)

  if (error) throw error
  if (!memberships || memberships.length === 0) return []

  // 2. Traer las ligas por sus IDs (sin FK join para evitar errores de relación)
  const leagueIds = memberships.map((m: { league_id: string }) => m.league_id)
  const { data: leagues, error: leaguesError } = await supabase
    .from('leagues')
    .select('*')
    .in('id', leagueIds)

  if (leaguesError) throw leaguesError
  return (leagues ?? []) as League[]
}

export async function getLeague(id: string): Promise<League | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as League
}

export async function getLeagueMembers(leagueId: string): Promise<LeagueMember[]> {
  const supabase = createClient()

  // 1. Traer miembros
  const { data: members, error } = await supabase
    .from('league_members')
    .select('user_id, role, league_id')
    .eq('league_id', leagueId)

  if (error) throw error
  if (!members || members.length === 0) return []

  // 2. Traer perfiles por los user_ids
  const userIds = members.map(m => m.user_id)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .in('id', userIds)

  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]))

  return members.map(m => ({
    ...m,
    total_fantasy_points: 0,
    total_prediction_points: 0,
    profile: profileMap[m.user_id] ?? null,
  })) as LeagueMember[]
}

export async function createLeague(input: CreateLeagueInput): Promise<League> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Si incluye torneo, crear el bracket manager automáticamente
  let torneoId: string | null = null
  const hasTorneo = input.mode === 'torneo' || input.mode === 'all'
  if (hasTorneo && input.tournament_type) {
    const torneo = await createTorneo(input.name, input.tournament_type)
    torneoId = torneo.id
  }

  const { tournament_type, ...rest } = input
  const { data, error } = await supabase
    .from('leagues')
    .insert({
      ...rest,
      admin_id: user.id,
      tournament_type: tournament_type ?? null,
      torneo_id: torneoId,
    })
    .select()
    .single()

  if (error) throw error

  // Auto-join as admin
  await supabase.from('league_members').insert({
    league_id: data.id,
    user_id: user.id,
    role: 'admin',
  })

  return data as League
}

export async function joinLeague(inviteCode: string): Promise<League> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: league, error: leagueError } = await supabase
    .from('leagues')
    .select('*')
    .eq('invite_code', inviteCode)
    .single()

  if (leagueError || !league) throw new Error('League not found')

  const { error } = await supabase.from('league_members').insert({
    league_id: league.id,
    user_id: user.id,
    role: 'member',
  })

  if (error) {
    if (error.code === '23505') throw new Error('Already a member of this league')
    throw error
  }

  return league as League
}

export async function leaveLeague(leagueId: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('league_members')
    .delete()
    .eq('league_id', leagueId)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function updateLeague(id: string, updates: Partial<League>): Promise<League> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('leagues')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as League
}
