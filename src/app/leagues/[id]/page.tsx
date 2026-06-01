import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { LeagueDetailClient } from '@/components/leagues/league-detail-client'

export default async function LeaguePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: league }, { data: members }] = await Promise.all([
    supabase.from('leagues').select('*').eq('id', id).single(),
    supabase.from('league_members').select('*, profile:profiles(*)').eq('league_id', id).order('total_fantasy_points', { ascending: false }),
  ])

  if (!league) notFound()

  const isMember = members?.some(m => m.user_id === user.id)
  const isAdmin = league.admin_id === user.id

  return (
    <LeagueDetailClient
      league={league}
      members={members ?? []}
      currentUserId={user.id}
      isMember={!!isMember}
      isAdmin={isAdmin}
    />
  )
}
