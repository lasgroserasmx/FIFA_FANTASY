import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { LeagueDetailClient } from '@/components/leagues/league-detail-client'

export default async function LigaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: league }, { data: rawMembers }] = await Promise.all([
    supabase.from('leagues').select('*').eq('id', id).single(),
    supabase.from('league_members').select('user_id, role, league_id').eq('league_id', id),
  ])

  // Traer perfiles por separado
  const userIds = (rawMembers ?? []).map((m: { user_id: string }) => m.user_id)
  const { data: profiles } = userIds.length
    ? await supabase.from('profiles').select('id, username, full_name, avatar_url').in('id', userIds)
    : { data: [] }

  const profileMap = Object.fromEntries((profiles ?? []).map((p: { id: string }) => [p.id, p]))
  const members = (rawMembers ?? []).map((m: { user_id: string; role: string; league_id: string }) => ({
    ...m,
    id: m.user_id,
    total_fantasy_points: 0,
    total_prediction_points: 0,
    profile: profileMap[m.user_id] ?? null,
  }))

  if (!league) notFound()

  return (
    <LeagueDetailClient
      league={league}
      members={members ?? []}
      currentUserId={user.id}
      isMember={!!members?.some(m => m.user_id === user.id)}
      isAdmin={league.admin_id === user.id}
    />
  )
}
