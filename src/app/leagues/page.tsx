'use client'
import Link from 'next/link'
import { Plus, Zap, Users, Trophy, Lock, Play } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LinkButton } from '@/components/ui/link-button'
import { useLeagues } from '@/hooks/use-leagues'
import type { League } from '@/types'

const statusIcon = { draft: Play, active: Play, locked: Lock, finished: Trophy }
const statusColor: Record<string, string> = {
  draft: 'bg-yellow-500/20 text-yellow-400',
  active: 'bg-emerald-500/20 text-emerald-400',
  locked: 'bg-red-500/20 text-red-400',
  finished: 'bg-gray-500/20 text-gray-400',
}

function LeagueCard({ league }: { league: League }) {
  const Icon = statusIcon[league.status] || Play
  return (
    <Link href={`/leagues/${league.id}`}>
      <Card className="hover:border-primary/40 transition-all cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">{league.name}</h3>
              {league.description && <p className="text-sm text-muted-foreground mt-0.5 truncate">{league.description}</p>}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge variant="outline" className="capitalize text-xs">{league.mode}</Badge>
                <Badge variant="outline" className={`text-xs ${statusColor[league.status]}`}>
                  <Icon className="mr-1 h-3 w-3" />{league.status}
                </Badge>
                {league.entry_fee > 0 && <Badge variant="outline" className="text-xs">Entry: ${league.entry_fee}</Badge>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              {league.prize_pool > 0 && (
                <>
                  <p className="text-xs text-muted-foreground">Prize Pool</p>
                  <p className="text-lg font-bold text-primary">${league.prize_pool}</p>
                </>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                <Users className="inline h-3 w-3 mr-1" />Max {league.max_members}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function LeaguesPage() {
  const { data: leagues, isLoading } = useLeagues()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Leagues</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and view your fantasy leagues</p>
        </div>
        <div className="flex gap-2">
          <LinkButton href="/leagues/join" variant="outline" size="sm">
            <Zap className="mr-2 h-4 w-4" />Join
          </LinkButton>
          <LinkButton href="/leagues/create" size="sm">
            <Plus className="mr-2 h-4 w-4" />Create
          </LinkButton>
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Card key={i} className="animate-pulse"><CardContent className="p-5 h-32" /></Card>)}
        </div>
      ) : leagues?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No leagues yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Create or join a league to start competing</p>
            <div className="flex gap-3 justify-center">
              <LinkButton href="/leagues/join" variant="outline">Join with code</LinkButton>
              <LinkButton href="/leagues/create">Create league</LinkButton>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {leagues?.map(l => <LeagueCard key={l.id} league={l} />)}
        </div>
      )}
    </div>
  )
}
