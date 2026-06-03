import { createClient } from '@/lib/supabase/client'
import type { League, LeagueMember, CreateLeagueInput } from '@/types'
import { createTorneo } from './torneo'

export async function getLeagues(): Promise<League[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('league_members')
    .select('league:leagues(*)')
    .eq('user_id', user.id)

  if (error) throw error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data?.map((d: any) => d.league) ?? []) as League[]
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

  // Intentar con join a profiles
  const { data, error } = await supabase
    .from('league_members')
    .select('*, profile:profiles(*)')
    .eq('league_id', leagueId)

  if (!error) return (data ?? []) as LeagueMember[]

  // Fallback: sin join (FK no configurada aún)
  const { data: plain, error: err2 } = await supabase
    .from('league_members')
    .select('*')
    .eq('league_id', leagueId)

  if (err2) throw err2
  return (plain ?? []).map(m => ({ ...m, profile: null })) as LeagueMember[]
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
