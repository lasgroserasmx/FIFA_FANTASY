'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Star, Target, Settings, LogOut, Trophy, Users, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useLeaveLeague } from '@/hooks/use-leagues'
import { toast } from 'sonner'
import type { League, LeagueMember, Profile } from '@/types'
import { formatCurrency } from '@/utils/format'
import { GAME_TYPES } from '@/lib/torneo-data'

const statusLabel: Record<string, string> = {
  draft: 'Borrador', active: 'Activa', locked: 'Bloqueada', finished: 'Finalizada',
}
const statusColors: Record<string, string> = {
  draft: 'bg-yellow-500/20 text-yellow-400',
  active: 'bg-emerald-500/20 text-emerald-400',
  locked: 'bg-red-500/20 text-red-400',
  finished: 'bg-gray-500/20 text-gray-400',
}

interface Props {
  league: League
  members: (LeagueMember & { profile: Profile | null })[]
  currentUserId: string
  isMember: boolean
  isAdmin: boolean
}

export function LeagueDetailClient({ league, members, currentUserId, isMember, isAdmin }: Props) {
  const router = useRouter()
  const { mutateAsync: leaveLeague, isPending } = useLeaveLeague()

  // Determine which activities this league has
  const hasFantasy = ['fantasy', 'both', 'all'].includes(league.mode)
  const hasPrediction = ['prediction', 'both', 'all'].includes(league.mode)
  const hasTorneo = ['torneo', 'all'].includes(league.mode) && !!league.torneo_id

  const gt = GAME_TYPES.find(g => g.id === league.tournament_type)

  // Default tab
  const defaultTab = hasTorneo ? 'torneo' : hasFantasy ? 'fantasy' : 'clasificacion'

  async function handleLeave() {
    if (!confirm('¿Seguro que quieres salir de esta liga?')) return
    await leaveLeague(league.id)
    router.push('/ligas')
  }

  function copyCode() {
    navigator.clipboard.writeText(league.invite_code)
    toast.success('¡Código copiado!')
  }

  // Tabs to show
  const tabs = [
    { id: 'clasificacion', label: '🏅 Clasificación', always: true },
    { id: 'torneo', label: '🏆 Torneo', show: hasTorneo },
    { id: 'fantasy', label: '⭐ Fantasy', show: hasFantasy },
    { id: 'predicciones', label: '🎯 Predicciones', show: hasPrediction },
  ].filter(t => t.always || t.show)

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-start gap-3">
        <Link href="/ligas" className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors mt-1 flex-shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {gt && <span className="text-xl">{gt.emoji}</span>}
            <h1 className="text-2xl font-bold truncate">{league.name}</h1>
            <Badge variant="outline" className={statusColors[league.status]}>{statusLabel[league.status]}</Badge>
            {gt && <Badge variant="outline" className="text-muted-foreground">{gt.label}</Badge>}
          </div>
          {league.description && <p className="text-muted-foreground text-sm mt-1">{league.description}</p>}
          {/* Activity chips */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {hasTorneo && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/15 text-primary">🏆 Torneo</span>}
            {hasFantasy && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400">⭐ Fantasy</span>}
            {hasPrediction && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400">🎯 Predicciones</span>}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {isAdmin && (
            <LinkButton href={`/ligas/${league.id}/configuracion`} variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />Configurar
            </LinkButton>
          )}
          {isMember && !isAdmin && (
            <Button variant="outline" size="sm" onClick={handleLeave} disabled={isPending} className="text-destructive hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />Salir
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Participantes', value: `${members.length} / ${league.max_members}`, icon: Users },
          { label: 'Bote', value: formatCurrency(league.prize_pool), icon: Trophy },
          { label: 'Entrada', value: formatCurrency(league.entry_fee), icon: DollarSign },
          { label: 'Presupuesto', value: `£${league.budget}m`, icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <Icon className="h-5 w-5 text-primary flex-shrink-0" />
              <div><p className="text-xs text-muted-foreground">{label}</p><p className="font-bold text-sm">{value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Código de invitación */}
      {(isAdmin || isMember) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Código de invitación</p>
              <p className="font-mono text-lg font-bold tracking-widest uppercase">{league.invite_code}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Compártelo para que otros se unan</p>
            </div>
            <Button variant="outline" size="sm" onClick={copyCode}>
              <Copy className="mr-2 h-4 w-4" />Copiar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pestañas */}
      <Tabs defaultValue={defaultTab}>
        <TabsList className={`grid w-full grid-cols-${tabs.length}`}>
          {tabs.map(t => (
            <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>
          ))}
        </TabsList>

        {/* Clasificación */}
        <TabsContent value="clasificacion" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Clasificación de la liga</CardTitle></CardHeader>
            <CardContent className="p-0">
              {members.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">Aún no hay miembros. ¡Comparte el código!</div>
              ) : (
                <div className="divide-y divide-border">
                  {members.map((member, idx) => {
                    const isMe = member.user_id === currentUserId
                    const name = member.profile?.full_name || member.profile?.username || '?'
                    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                    const total = member.total_fantasy_points + member.total_prediction_points
                    return (
                      <div key={member.id} className={`flex items-center gap-3 px-4 py-3 ${isMe ? 'bg-primary/5' : ''}`}>
                        <span className={`w-6 text-center font-black text-sm ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                          {idx + 1}
                        </span>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {name}{isMe && <span className="ml-2 text-xs text-primary font-normal">(Tú)</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">@{member.profile?.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{total} pts</p>
                          <div className="flex gap-2 text-xs text-muted-foreground justify-end">
                            {hasFantasy && <span title="Fantasy"><Star className="inline h-3 w-3" /> {member.total_fantasy_points}</span>}
                            {hasPrediction && <span title="Quiniela"><Target className="inline h-3 w-3" /> {member.total_prediction_points}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Torneo (bracket manager) */}
        {hasTorneo && league.torneo_id && (
          <TabsContent value="torneo" className="mt-4">
            <div className="text-center py-10">
              <div className="text-5xl mb-4">⚔️</div>
              <p className="text-muted-foreground mb-4">Gestiona el bracket, grupos, quiniela y finanzas del torneo</p>
              <LinkButton href={`/torneo/liga/${league.id}`}>Ir al Torneo</LinkButton>
            </div>
          </TabsContent>
        )}

        {/* Fantasy */}
        {hasFantasy && (
          <TabsContent value="fantasy" className="mt-4">
            <div className="text-center py-10">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">Gestiona tu equipo Fantasy para esta liga</p>
              <LinkButton href={`/fantasy/${league.id}`}>Ir a mi equipo Fantasy</LinkButton>
            </div>
          </TabsContent>
        )}

        {/* Predicciones */}
        {hasPrediction && (
          <TabsContent value="predicciones" className="mt-4">
            <div className="text-center py-10">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">Envía tus predicciones de partidos</p>
              <LinkButton href={`/predicciones/${league.id}`}>Ir a Quiniela</LinkButton>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
