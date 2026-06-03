import { createClient } from '@/lib/supabase/client'
import { createTorneo } from './torneo'

export type ActivityType = 'fantasy' | 'prediccion' | 'torneo'

export interface ApuestaRow {
  id: string
  user_id: string
  name: string
  tournament_type: string
  activities: ActivityType[]
  invite_code: string
  torneo_id: string | null
  created_at: string
  updated_at: string
}

export interface ApuestaMember {
  apuesta_id: string
  user_id: string
  joined_at: string
  profile?: {
    username: string | null
    full_name: string | null
    avatar_url: string | null
  }
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function listMyApuestas(): Promise<ApuestaRow[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Apuestas que creé
  const { data: owned } = await supabase
    .from('apuestas')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  // Apuestas donde soy miembro (pero no creador)
  const { data: memberOf } = await supabase
    .from('apuesta_members')
    .select('apuesta_id')
    .eq('user_id', user.id)

  const memberIds = (memberOf ?? []).map(m => m.apuesta_id)
  let joined: ApuestaRow[] = []
  if (memberIds.length > 0) {
    const { data } = await supabase
      .from('apuestas')
      .select('*')
      .in('id', memberIds)
      .neq('user_id', user.id)
      .order('updated_at', { ascending: false })
    joined = (data ?? []) as ApuestaRow[]
  }

  return [...(owned ?? []), ...joined] as ApuestaRow[]
}

export async function getApuesta(id: string): Promise<ApuestaRow | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('apuestas')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as ApuestaRow
}

export async function getApuestaByCode(code: string): Promise<ApuestaRow | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('apuestas')
    .select('*')
    .eq('invite_code', code.toUpperCase().trim())
    .single()
  if (error) return null
  return data as ApuestaRow
}

export async function createApuesta(
  name: string,
  tournamentType: string,
  activities: ActivityType[]
): Promise<ApuestaRow> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  // Si incluye torneo, crear el registro del bracket manager
  let torneoId: string | null = null
  if (activities.includes('torneo')) {
    const torneo = await createTorneo(name, tournamentType)
    torneoId = torneo.id
  }

  const { data, error } = await supabase
    .from('apuestas')
    .insert({
      user_id: user.id,
      name,
      tournament_type: tournamentType,
      activities,
      torneo_id: torneoId,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as ApuestaRow
}

export async function joinApuesta(apuestaId: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { error } = await supabase
    .from('apuesta_members')
    .insert({ apuesta_id: apuestaId, user_id: user.id })

  // Si ya es miembro, ignorar el error de duplicado
  if (error && !error.message.includes('duplicate')) throw new Error(error.message)
}

export async function deleteApuesta(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('apuestas').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getMembers(apuestaId: string): Promise<ApuestaMember[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('apuesta_members')
    .select(`
      apuesta_id, user_id, joined_at,
      profile:profiles(username, full_name, avatar_url)
    `)
    .eq('apuesta_id', apuestaId)
    .order('joined_at', { ascending: true })
  if (error) return []
  return (data ?? []) as unknown as ApuestaMember[]
}

export async function getCreatorProfile(userId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('id', userId)
    .single()
  return data
}

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}
