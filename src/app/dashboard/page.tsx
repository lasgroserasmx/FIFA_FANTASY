import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('league_members')
      .select('*, league:leagues(*)')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false })
      .limit(5),
  ])

  const { data: upcomingMatches } = await supabase
    .from('matches')
    .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
    .in('status', ['scheduled', 'live'])
    .order('match_date', { ascending: true })
    .limit(4)

  return (
    <DashboardClient
      profile={profile}
      memberships={memberships ?? []}
      upcomingMatches={upcomingMatches ?? []}
    />
  )
}
