'use client'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Check, Users, Info, Lock } from 'lucide-react'
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

const stageLabel: Record<string, string> = {
  group: 'Fase de grupos',
  round_of_16: 'Octavos de final',
  quarter_final: 'Cuartos de final',
  semi_final: 'Semifinal',
  final: 'Final',
}

function FilaPrediccion({ match, ligaId, prediccionExistente }: {
  match: Match
  ligaId: string
  prediccionExistente?: { predicted_home_score: number | null; predicted_away_score: number | null; points_earned: number }
}) {
  const qc = useQueryClient()
  const [local, setLocal] = useState(prediccionExistente?.predicted_home_score?.toString() ?? '')
  const [visitante, setVisitante] = useState(prediccionExistente?.predicted_away_score?.toString() ?? '')

  const { mutate, isPending } = useMutation({
    mutationFn: () => upsertPrediction(ligaId, match.id, parseInt(local), parseInt(visitante)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['predictions', ligaId] }); toast.success('¡Predicción guardada!') },
    onError: (e: Error) => toast.error(e.message),
  })

  const finalizado = match.status === 'finished'
  const enVivo = match.status === 'live'

  return (
    <Card className={enVivo ? 'border-red-500/30' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className={`text-xs ${getStatusColor(match.status)}`}>
            {enVivo ? '● EN VIVO' : finalizado ? 'FINALIZADO' : 'PROGRAMADO'}
          </Badge>
          <span className="text-xs text-muted-foreground">{stageLabel[match.stage] || match.stage}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 text-right">
            <p className="font-semibold text-sm">{match.home_team?.name}</p>
            <p className="text-xs text-muted-foreground">{match.home_team?.country}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Input
              type="number" min={0} max={20}
              value={local}
              onChange={e => setLocal(e.target.value)}
              className="w-14 text-center font-bold text-lg"
              disabled={finalizado}
            />
            <span className="text-muted-foreground font-bold text-lg">-</span>
            <Input
              type="number" min={0} max={20}
              value={visitante}
              onChange={e => setVisitante(e.target.value)}
              className="w-14 text-center font-bold text-lg"
              disabled={finalizado}
            />
          </div>

          <div className="flex-1">
            <p className="font-semibold text-sm">{match.away_team?.name}</p>
            <p className="text-xs text-muted-foreground">{match.away_team?.country}</p>
          </div>

          <div className="flex flex-col items-end gap-1 ml-1 flex-shrink-0 min-w-[70px]">
            {finalizado ? (
              <>
                <span className="text-xs text-muted-foreground">Real: {match.home_score}-{match.away_score}</span>
                <Badge variant="outline" className={`text-xs ${prediccionExistente?.points_earned ? 'bg-emerald-500/20 text-emerald-400' : ''}`}>
                  +{prediccionExistente?.points_earned ?? 0} pts
                </Badge>
              </>
            ) : (
              <>
                <span className="text-xs text-muted-foreground">{formatDate(match.match_date, 'dd/MM')} {formatMatchTime(match.match_date)}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => mutate()}
                  disabled={isPending || local === '' || visitante === ''}
                  className="h-7 text-xs"
                >
                  {isPending ? '…' : <><Check className="h-3 w-3 mr-1" />Guardar</>}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PrediccionesLigaPage() {
  const { ligaId } = useParams<{ ligaId: string }>()
  const { data: liga } = useLeague(ligaId)
  const { data: partidos } = useMatches()
  const { data: predicciones } = useQuery({
    queryKey: ['predictions', ligaId],
    queryFn: () => getPredictions(ligaId),
    enabled: !!ligaId,
  })
  const { data: clasificacion } = useQuery({
    queryKey: ['leaderboard', ligaId],
    queryFn: () => getLeaderboard(ligaId),
    enabled: !!ligaId,
  })

  const predMap = new Map(predicciones?.map(p => [p.match_id, p]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quiniela</h1>
        <p className="text-muted-foreground text-sm">{liga?.name}</p>
      </div>

      {liga?.predictions_locked && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4 flex items-center gap-3 text-red-400">
            <Lock className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">Las predicciones están bloqueadas por el administrador de la liga</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="partidos">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="partidos">Predicciones de partidos</TabsTrigger>
          <TabsTrigger value="clasificacion">Clasificación</TabsTrigger>
        </TabsList>

        <TabsContent value="partidos" className="mt-4 space-y-6">
          {/* Guía de puntuación */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Sistema de puntuación</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400">+{liga?.pred_correct_outcome} pts</Badge>
                  <span className="text-xs text-muted-foreground">Resultado correcto</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400">+{liga?.pred_correct_diff} pts</Badge>
                  <span className="text-xs text-muted-foreground">Diferencia exacta</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">+{liga?.pred_exact_score} pts</Badge>
                  <span className="text-xs text-muted-foreground">Marcador exacto</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partidos agrupados por fecha */}
          {partidos && (() => {
            const agrupados = partidos.reduce<Record<string, Match[]>>((acc, m) => {
              const fecha = formatDate(m.match_date, "EEEE d 'de' MMMM")
              if (!acc[fecha]) acc[fecha] = []
              acc[fecha].push(m)
              return acc
            }, {})

            return Object.entries(agrupados).map(([fecha, partidosDia]) => (
              <div key={fecha}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 capitalize">{fecha}</h3>
                <div className="space-y-2">
                  {partidosDia.map(m => (
                    <FilaPrediccion
                      key={m.id}
                      match={m}
                      ligaId={ligaId}
                      prediccionExistente={predMap.get(m.id) as { predicted_home_score: number | null; predicted_away_score: number | null; points_earned: number } | undefined}
                    />
                  ))}
                </div>
              </div>
            ))
          })()}
        </TabsContent>

        <TabsContent value="clasificacion" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />Clasificación Quiniela
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {clasificacion?.map((miembro, idx) => {
                  const profile = (miembro as { profile: { full_name: string | null; username: string | null } | null }).profile
                  const nombre = profile?.full_name || profile?.username || '?'
                  const iniciales = nombre.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                  return (
                    <div key={(miembro as { id: string }).id} className="flex items-center gap-3 px-4 py-3">
                      <span className={`w-6 text-center font-black text-sm ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                      </span>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">{iniciales}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{nombre}</p>
                        <p className="text-xs text-muted-foreground">@{profile?.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{(miembro as { total_prediction_points: number }).total_prediction_points}</p>
                        <p className="text-xs text-muted-foreground">puntos</p>
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
