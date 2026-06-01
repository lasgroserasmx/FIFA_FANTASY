'use client'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Star, Search, Filter, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlayerCard } from '@/components/shared/player-card'
import { useFantasyTeam, useAddPlayer, useRemovePlayer, useSetCaptain, useCreateFantasyTeam } from '@/hooks/use-fantasy'
import { usePlayers } from '@/hooks/use-players'
import { useLeague } from '@/hooks/use-leagues'
import { getPositionColor } from '@/utils/format'

const positionLabel: Record<string, string> = { GK: 'Porteros', DEF: 'Defensas', MID: 'Centrocampistas', FWD: 'Delanteros' }

export default function FantasyLigaPage() {
  const { leagueId } = useParams<{ leagueId: string }>()
  const [busqueda, setBusqueda] = useState('')
  const [filtroPosicion, setFiltroPosicion] = useState<string>('all')
  const [nombreEquipo, setNombreEquipo] = useState('')

  const { data: liga } = useLeague(leagueId)
  const { data: miEquipo, isLoading } = useFantasyTeam(leagueId)
  const { data: jugadores } = usePlayers({
    position: filtroPosicion === 'all' ? undefined : filtroPosicion,
    search: busqueda || undefined,
  })

  const { mutate: añadirJugador, isPending: añadiendo } = useAddPlayer(leagueId, miEquipo?.id ?? '')
  const { mutate: eliminarJugador } = useRemovePlayer(leagueId, miEquipo?.id ?? '')
  const { mutate: setCapitan } = useSetCaptain(leagueId, miEquipo?.id ?? '')
  const { mutateAsync: crearEquipo, isPending: creando } = useCreateFantasyTeam(leagueId)

  const idsPlantilla = new Set(miEquipo?.roster?.map(r => r.player_id) ?? [])
  const capitan = miEquipo?.roster?.find(r => r.is_captain)
  const viceCapitan = miEquipo?.roster?.find(r => r.is_vice_captain)

  const porPosicion = (pos: string) => miEquipo?.roster?.filter(r => r.player?.position === pos) ?? []

  if (isLoading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Cargando…</div>

  if (!miEquipo) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-4">
        <Star className="h-16 w-16 text-primary mx-auto" />
        <h2 className="text-xl font-bold">Crea tu equipo Fantasy</h2>
        <p className="text-muted-foreground text-sm">Ponle un nombre a tu equipo para empezar a fichar jugadores en <strong>{liga?.name}</strong></p>
        <div className="flex gap-2">
          <Input value={nombreEquipo} onChange={e => setNombreEquipo(e.target.value)} placeholder="Ej. Los Cracks" />
          <Button onClick={() => crearEquipo(nombreEquipo)} disabled={!nombreEquipo.trim() || creando}>
            {creando ? '…' : 'Crear'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{miEquipo.name}</h1>
          <p className="text-muted-foreground text-sm">{liga?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{miEquipo.total_points}</p>
          <p className="text-xs text-muted-foreground">Puntos totales</p>
        </div>
      </div>

      {/* Barra de presupuesto */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Presupuesto restante</p>
              <p className="text-xl font-bold text-primary">£{miEquipo.budget_remaining}m</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Jugadores</p>
              <p className="text-xl font-bold">{miEquipo.roster?.length ?? 0} / {liga?.squad_size ?? 15}</p>
            </div>
          </div>
          {capitan && (
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">
              <Crown className="mr-1 h-3 w-3" />
              Capitán: {capitan.player?.short_name || capitan.player?.name}
            </Badge>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="plantilla">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plantilla">Mi plantilla</TabsTrigger>
          <TabsTrigger value="mercado">Mercado de fichajes</TabsTrigger>
        </TabsList>

        {/* Plantilla */}
        <TabsContent value="plantilla" className="mt-4 space-y-4">
          {['GK', 'DEF', 'MID', 'FWD'].map(pos => {
            const rosRoster = porPosicion(pos)
            if (rosRoster.length === 0) return null
            return (
              <div key={pos}>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline" className={getPositionColor(pos)}>{positionLabel[pos]}</Badge>
                  <span className="text-muted-foreground">{rosRoster.length} jugadores</span>
                </h3>
                <div className="space-y-2">
                  {rosRoster.map(r => r.player && (
                    <PlayerCard
                      key={r.player_id}
                      player={r.player}
                      isInTeam
                      isCaptain={r.player_id === capitan?.player_id}
                      isViceCaptain={r.player_id === viceCapitan?.player_id}
                      onRemove={() => eliminarJugador(r.player_id)}
                      onSetCaptain={(p) => setCapitan({ playerId: p.id })}
                    />
                  ))}
                </div>
              </div>
            )
          })}
          {(miEquipo.roster?.length ?? 0) === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Tu plantilla está vacía. Ve al Mercado de fichajes para añadir jugadores.</p>
            </div>
          )}
        </TabsContent>

        {/* Mercado de fichajes */}
        <TabsContent value="mercado" className="mt-4 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar jugador…"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
            <Select value={filtroPosicion} onValueChange={(v) => v && setFiltroPosicion(v)}>
              <SelectTrigger className="w-36">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="GK">Porteros</SelectItem>
                <SelectItem value="DEF">Defensas</SelectItem>
                <SelectItem value="MID">Centrocampistas</SelectItem>
                <SelectItem value="FWD">Delanteros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {jugadores?.map(jugador => (
              <PlayerCard
                key={jugador.id}
                player={jugador}
                isInTeam={idsPlantilla.has(jugador.id)}
                onAdd={() => añadirJugador({ playerId: jugador.id, price: jugador.price })}
                onRemove={() => eliminarJugador(jugador.id)}
              />
            ))}
            {jugadores?.length === 0 && (
              <p className="text-center text-muted-foreground py-6">No se encontraron jugadores</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
