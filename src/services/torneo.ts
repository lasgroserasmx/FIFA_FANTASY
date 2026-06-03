import { createClient } from '@/lib/supabase/client'
import type { TorneoState } from '@/components/torneo/torneo-types'

export interface TorneoRow {
  id: string
  user_id: string
  name: string
  game_type: string
  phase: string
  player_count: number
  state: TorneoState
  created_at: string
  updated_at: string
}

export async function listTorneos(): Promise<TorneoRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('torneo_tournaments')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as TorneoRow[]
}

export async function getTorneo(id: string): Promise<TorneoRow | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('torneo_tournaments')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as TorneoRow
}

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function createTorneo(name: string, gameType: string): Promise<TorneoRow> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data, error } = await supabase
    .from('torneo_tournaments')
    .insert({
      user_id: user.id,
      name,
      game_type: gameType,
      phase: 'setup',
      player_count: 0,
      state: {},
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as TorneoRow
}

export async function saveTorneo(id: string, state: TorneoState): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('torneo_tournaments')
    .update({
      phase: state.phase,
      player_count: state.players.length,
      state,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteTorneo(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('torneo_tournaments')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}
