'use client'
import { useState } from 'react'
import { Shield, Star, Activity, Check, X, Edit, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDateTime, formatDate } from '@/utils/format'
import type { Match, Player, Team } from '@/types'

const statusLabel: Record<string, string> = {
  scheduled: 'Programado', live: 'En vivo', finished: 'Finalizado', postponed: 'Aplazado',
}
const stageLabel: Record<string, string> = {
  group: 'Grupos', round_of_16: 'Octavos', quarter_final: 'Cuartos', semi_final: 'Semifinal', final: 'Final',
}
const positionLabel: Record<string, string> = { GK: 'Portero', DEF: 'Defensa', MID: 'Centrocampista', FWD: 'Delantero' }

function AdminPartidos() {
  const qc = useQueryClient()
  const supabase = createClient()
  const { data: partidos } = useQuery({
    queryKey: ['admin-matches'],
    queryFn: async () => {
      const { data } = await supabase
        .from('matches')
        .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
        .order('match_date', { ascending: true })
      return data as Match[]
    },
  })

  const { mutate: actualizarPartido } = useMutation({
    mutationFn: async ({ id, home, away, status }: { id: string; home: number; away: number; status: string }) => {
      const { error } = await supabase.from('matches').update({ home_score: home, away_score: away, status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-matches'] }); toast.success('Partido actualizado') },
    onError: () => toast.error('Error al actualizar el partido'),
  })

  const { mutate: sincronizarAPI, isPending: sincronizando } = useMutation({
    mutationFn: async (mode: 'live' | 'all') => {
      const res = await fetch(`/api/sync-matches?mode=${mode}`, { method: 'POST' })
      if (!res.ok) throw new Error('Error al sincronizar')
      return res.json()
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['admin-matches'] })
      toast.success(`Sincronizados: ${data.matchesUpdated} partidos, ${data.eventsAdded} eventos`)
    },
    onError: () => toast.error('Error al conectar con API-Football. ¿Tienes la API key configurada?'),
  })

  const { mutate: recalcularPuntos, isPending: recalculando } = useMutation({
    mutationFn: async (matchId: string) => {
      const res = await fetch(`/api/calculate-points?match_id=${matchId}`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al recalcular')
      return data
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['admin-matches'] })
      toast.success(
        `Puntos calculados ✓ — ${data.predicciones_puntuadas ?? 0} predicciones, ${data.rosters_fantasy_puntuados ?? 0} rosters fantasy`
      )
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const [editando, setEditando] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ home: string; away: string; status: string }>({ home: '0', away: '0', status: 'scheduled' })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-semibold">Gestión de partidos ({partidos?.length ?? 0})</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={sincronizando} onClick={() => sincronizarAPI('live')}>
            <RefreshCw className={`h-3 w-3 mr-1 ${sincronizando ? 'animate-spin' : ''}`} />
            Sync en vivo
          </Button>
          <Button size="sm" variant="outline" disabled={sincronizando} onClick={() => sincronizarAPI('all')}>
            <RefreshCw className={`h-3 w-3 mr-1 ${sincronizando ? 'animate-spin' : ''}`} />
            Sync completo
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {partidos?.map(m => (
          <Card key={m.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {m.home_team?.name} vs {m.away_team?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(m.match_date)} · {stageLabel[m.stage] || m.stage}
                  </p>
                </div>

                {editando === m.id ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Input value={editData.home} onChange={e => setEditData(p => ({ ...p, home: e.target.value }))} className="w-14 text-center" type="number" min={0} />
                    <span className="font-bold">-</span>
                    <Input value={editData.away} onChange={e => setEditData(p => ({ ...p, away: e.target.value }))} className="w-14 text-center" type="number" min={0} />
                    <Select value={editData.status} onValueChange={s => s && setEditData(p => ({ ...p, status: s }))}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabel).map(([val, lab]) => (
                          <SelectItem key={val} value={val}>{lab}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-400"
                      onClick={() => { actualizarPartido({ id: m.id, home: +editData.home, away: +editData.away, status: editData.status }); setEditando(null) }}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400" onClick={() => setEditando(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{statusLabel[m.status]}</Badge>
                    {m.home_score !== null && <span className="font-bold text-sm">{m.home_score} - {m.away_score}</span>}
                    <Button size="icon" variant="ghost" className="h-8 w-8"
                      onClick={() => { setEditando(m.id); setEditData({ home: m.home_score?.toString() ?? '0', away: m.away_score?.toString() ?? '0', status: m.status }) }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {m.status === 'finished' && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-400"
                        title="Recalcular puntos de quiniela y fantasy"
                        disabled={recalculando}
                        onClick={() => recalcularPuntos(m.id)}>
                        <Star className={`h-4 w-4 ${recalculando ? 'animate-pulse' : ''}`} />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AdminJugadores() {
  const supabase = createClient()
  const { data: jugadores } = useQuery({
    queryKey: ['admin-players'],
    queryFn: async () => {
      const { data } = await supabase.from('players').select('*, team:teams(*)').order('name')
      return data as Player[]
    },
  })

  return (
    <div className="space-y-3">
      <h2 className="font-semibold">Jugadores ({jugadores?.length ?? 0})</h2>
      <div className="space-y-2">
        {jugadores?.map(j => (
          <Card key={j.id}>
            <CardContent className="p-3 flex items-center gap-3">
              <Badge variant="outline" className="text-xs w-24 justify-center flex-shrink-0">{positionLabel[j.position] || j.position}</Badge>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{j.name}</p>
                <p className="text-xs text-muted-foreground">{j.team?.name}</p>
              </div>
              <span className="text-sm font-bold text-primary">£{j.price}m</span>
              <Badge variant={j.is_available ? 'outline' : 'secondary'} className="text-xs flex-shrink-0">
                {j.is_available ? 'Disponible' : 'No disponible'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AdminEquipos() {
  const supabase = createClient()
  const { data: equipos } = useQuery({
    queryKey: ['admin-teams'],
    queryFn: async () => {
      const { data } = await supabase.from('teams').select('*').order('group_name').order('name')
      return data as Team[]
    },
  })

  const grupos = equipos?.reduce<Record<string, Team[]>>((acc, t) => {
    const g = t.group_name || 'Otro'
    if (!acc[g]) acc[g] = []
    acc[g].push(t)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Selecciones ({equipos?.length ?? 0})</h2>
      {Object.entries(grupos ?? {}).map(([grupo, equiposGrupo]) => (
        <div key={grupo}>
          <h3 className="text-sm text-muted-foreground mb-2 font-medium">Grupo {grupo}</h3>
          <div className="grid grid-cols-2 gap-2">
            {equiposGrupo.map(e => (
              <Card key={e.id}>
                <CardContent className="p-3 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    {e.short_name}
                  </div>
                  <p className="font-medium text-sm truncate">{e.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AdminLigas() {
  const supabase = createClient()
  const { data: ligas } = useQuery({
    queryKey: ['admin-leagues-all'],
    queryFn: async () => {
      const { data } = await supabase.from('leagues').select('*').order('created_at', { ascending: false })
      return data
    },
  })

  const modeLabel: Record<string, string> = { fantasy: 'Fantasy', prediction: 'Quiniela', both: 'Fantasy + Quiniela' }
  const statusLabel2: Record<string, string> = { draft: 'Borrador', active: 'Activa', locked: 'Bloqueada', finished: 'Finalizada' }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold">Todas las ligas ({ligas?.length ?? 0})</h2>
      <div className="space-y-2">
        {ligas?.map((l) => (
          <Card key={l.id}>
            <CardContent className="p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{l.name}</p>
                <p className="text-xs text-muted-foreground">
                  {modeLabel[l.mode] || l.mode} · {statusLabel2[l.status] || l.status} · {formatDate(l.created_at)}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Badge variant="outline" className="text-xs font-mono">{l.invite_code}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground text-sm">Gestiona el FIFA Fantasy Challenge</p>
        </div>
      </div>

      <Tabs defaultValue="partidos">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="partidos"><Activity className="h-4 w-4 mr-1" />Partidos</TabsTrigger>
          <TabsTrigger value="jugadores"><Star className="h-4 w-4 mr-1" />Jugadores</TabsTrigger>
          <TabsTrigger value="equipos">🏴 Equipos</TabsTrigger>
          <TabsTrigger value="ligas">🏆 Ligas</TabsTrigger>
        </TabsList>

        <TabsContent value="partidos" className="mt-4"><AdminPartidos /></TabsContent>
        <TabsContent value="jugadores" className="mt-4"><AdminJugadores /></TabsContent>
        <TabsContent value="equipos" className="mt-4"><AdminEquipos /></TabsContent>
        <TabsContent value="ligas" className="mt-4"><AdminLigas /></TabsContent>
      </Tabs>
    </div>
  )
}
