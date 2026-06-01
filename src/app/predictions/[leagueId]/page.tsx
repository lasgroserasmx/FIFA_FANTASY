'use client'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Target, Trophy, Users, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useMatches } from '@/hooks/use-matches'
import { useLeague } from '@/hooks/use-leagues'
import { upsertPrediction, getPredictions, getLeaderboard } from '@/services/predictions'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formatDate, formatMatchTime, getStatusColor } from '@/utils/format'
import type { Match } from '@/types'

function PredictionRow({ match, leagueId, existingPrediction }: {
  match: Match
  leagueId: string
  existingPrediction?: { predicted_home_score: number | null; predicted_away_score: number | null; points_earned: number }
}) {
  const qc = useQueryClient()
  const [home, setHome] = useState(existingPrediction?.predicted_home_score?.toString() ?? '')
  const [away, setAway] = useState(existingPrediction?.predicted_away_score?.toString() ?? '')

  const { mutate, isPending } = useMutation({
    mutationFn: () => upsertPrediction(leagueId, match.id, parseInt(home), parseInt(away)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['predictions', leagueId] })
      toast.success('Prediction saved!')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const isFinished = match.status === 'finished'

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 text-right">
            <p className="font-semibold text-sm">{match.home_team?.short_name}</p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0} max={20}
              value={home}
              onChange={e => setHome(e.target.value)}
              className="w-14 text-center font-bold"
              disabled={isFinished}
            />
            <span className="text-muted-foreground font-bold">-</span>
            <Input
              type="number"
              min={0} max={20}
              value={away}
              onChange={e => setAway(e.target.value)}
              className="w-14 text-center font-bold"
              disabled={isFinished}
            />
          </div>

          <div className="flex-1">
            <p className="font-semibold text-sm">{match.away_team?.short_name}</p>
          </div>

          <div className="flex flex-col items-end gap-1 ml-2 flex-shrink-0">
            {isFinished ? (
              <Badge variant="outline" className="text-xs">
                +{existingPrediction?.points_earned ?? 0}pts
              </Badge>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => mutate()}
                disabled={isPending || home === '' || away === ''}
                className="h-7 text-xs"
              >
                {isPending ? '…' : <><Check className="h-3 w-3 mr-1" />Save</>}
              </Button>
            )}
            <span className={`text-xs ${getStatusColor(match.status)} px-1.5 py-0.5 rounded`}>
              {match.status === 'finished' ? `${match.home_score}-${match.away_score}` : formatMatchTime(match.match_date)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PredictionLeaguePage() {
  const { leagueId } = useParams<{ leagueId: string }>()
  const { data: league } = useLeague(leagueId)
  const { data: matches } = useMatches()
  const { data: predictions } = useQuery({
    queryKey: ['predictions', leagueId],
    queryFn: () => getPredictions(leagueId),
    enabled: !!leagueId,
  })
  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard', leagueId],
    queryFn: () => getLeaderboard(leagueId),
    enabled: !!leagueId,
  })

  const predMap = new Map(predictions?.map(p => [p.match_id, p]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Predictions</h1>
        <p className="text-muted-foreground text-sm">{league?.name}</p>
      </div>

      {league?.predictions_locked && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4 text-center text-red-400 text-sm font-medium">
            🔒 Predictions are locked by the league admin
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="matches">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matches">Match Predictions</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="mt-4 space-y-6">
          {/* Scoring guide */}
          <Card className="bg-muted/30">
            <CardContent className="p-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400">+{league?.pred_correct_outcome}</Badge>
                <span className="text-muted-foreground">Correct outcome</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-500/20 text-purple-400">+{league?.pred_correct_diff}</Badge>
                <span className="text-muted-foreground">Correct goal diff</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">+{league?.pred_exact_score}</Badge>
                <span className="text-muted-foreground">Exact score</span>
              </div>
            </CardContent>
          </Card>

          {/* Group by date */}
          {matches && (() => {
            const grouped = matches.reduce<Record<string, Match[]>>((acc, m) => {
              const date = formatDate(m.match_date, 'MMM d, yyyy')
              if (!acc[date]) acc[date] = []
              acc[date].push(m)
              return acc
            }, {})

            return Object.entries(grouped).map(([date, dayMatches]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">{date}</h3>
                <div className="space-y-2">
                  {dayMatches.map(m => (
                    <PredictionRow
                      key={m.id}
                      match={m}
                      leagueId={leagueId}
                      existingPrediction={predMap.get(m.id) as { predicted_home_score: number | null; predicted_away_score: number | null; points_earned: number } | undefined}
                    />
                  ))}
                </div>
              </div>
            ))
          })()}
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Prediction Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {leaderboard?.map((member, idx) => {
                  const profile = (member as { profile: { full_name: string | null; username: string | null } | null }).profile
                  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || profile?.username?.slice(0, 2) || '?'
                  return (
                    <div key={(member as { id: string }).id} className="flex items-center gap-3 px-4 py-3">
                      <span className={`w-6 text-center font-bold text-sm ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                        {idx + 1}
                      </span>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{profile?.full_name || profile?.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-primary">{(member as { total_prediction_points: number }).total_prediction_points} pts</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
