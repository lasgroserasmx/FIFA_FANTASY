import { createClient } from '@/lib/supabase/client'
import type { Player } from '@/types'

export async function getPlayers(filters?: { position?: string; teamId?: string; search?: string }): Promise<Player[]> {
  const supabase = createClient()
  let query = supabase
    .from('players')
    .select('*, team:teams(*)')
    .eq('is_available', true)
    .order('price', { ascending: false })

  if (filters?.position) {
    query = query.eq('position', filters.position)
  }
  if (filters?.teamId) {
    query = query.eq('team_id', filters.teamId)
  }
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Player[]
}

export async function getPlayer(id: string): Promise<Player | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('players')
    .select('*, team:teams(*)')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Player
}
