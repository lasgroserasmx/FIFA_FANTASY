'use client'
import Link from 'next/link'
import { Trophy, Target, Star, TrendingUp, Users, Calendar, ArrowRight, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LinkButton } from '@/components/ui/link-button'
import { StatCard } from '@/components/shared/stat-card'
import { MatchCard } from '@/components/shared/match-card'
import type { Profile, LeagueMember, Match } from '@/types'
import dynamic from 'next/dynamic'

// Recharts usa window/ResizeObserver — deshabilitar SSR para evitar hydration error #418
const PointsChart = dynamic(() => import('./points-chart').then(m => ({ default: m.PointsChart })), {
  ssr: false,
  loading: () => <div className="h-full min-h-[280px] rounded-xl bg-muted/30 animate-pulse" />,
})

const modeLabel: Record<string, string> = {
  fantasy: 'Fantasy', prediction: 'Quiniela', both: 'Fantasy + Quiniela',
}
const roleLabel: Record<string, string> = { admin: 'Admin', member: 'Miembro' }

interface DashboardClientProps {
  profile: Profile | null
  memberships: (LeagueMember & { league: { id: string; name: string; mode: string; prize_pool: number } | null })[]
  upcomingMatches: Match[]
}

export function DashboardClient({ profile, memberships, upcomingMatches }: DashboardClientProps) {
  const totalFantasyPts = memberships.reduce((s, m) => s + (m.total_fantasy_points || 0), 0)
  const totalPredPts = memberships.reduce((s, m) => s + (m.total_prediction_points || 0), 0)
  const totalBote = memberships.reduce((s, m) => s + (m.league?.prize_pool || 0), 0)

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            ¡Hola, <span className="text-primary">{profile?.full_name?.split(' ')[0] || profile?.username}</span>! 👋
          </h1>
          <p className="text-muted-foreground mt-1">Resumen de tu FIFA Fantasy Challenge</p>
        </div>
        <div className="flex gap-2">
          <LinkButton href="/ligas" variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />Mis ligas
          </LinkButton>
          <LinkButton href="/predicciones" size="sm">
            <Target className="mr-2 h-4 w-4" />Predecir ahora
          </LinkButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Puntos Fantasy" value={totalFantasyPts} icon={Star} subtitle="En todas las ligas" iconClassName="bg-yellow-500/10" />
        <StatCard title="Puntos Quiniela" value={totalPredPts} icon={Target} subtitle="Puntuación total" iconClassName="bg-blue-500/10" />
        <StatCard title="Ligas" value={memberships.length} icon={Users} subtitle="Competiciones activas" iconClassName="bg-purple-500/10" />
        <StatCard title="Bote total" value={`$${totalBote}`} icon={Trophy} subtitle="Premio disponible" iconClassName="bg-emerald-500/10" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><PointsChart /></div>

        {/* Acciones rápidas */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Acciones rápidas</h2>
          <div className="space-y-2">
            {[
              { href: '/fantasy', icon: Star, label: 'Mi equipo Fantasy', desc: 'Fichajes y transferencias', color: 'text-yellow-400' },
              { href: '/predicciones', icon: Target, label: 'Enviar predicciones', desc: 'Adivina los marcadores', color: 'text-blue-400' },
              { href: '/ligas/crear', icon: Trophy, label: 'Crear una liga', desc: 'Empieza una competición', color: 'text-purple-400' },
              { href: '/ligas/unirse', icon: Zap, label: 'Unirme a una liga', desc: 'Introduce el código de invitación', color: 'text-emerald-400' },
              { href: '/como-jugar', icon: Calendar, label: 'Cómo jugar', desc: 'Aprende las reglas del juego', color: 'text-orange-400' },
            ].map(({ href, icon: Icon, label, desc, color }) => (
              <Link key={href} href={href}>
                <Card className="hover:border-primary/40 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Próximos partidos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />Próximos partidos
            </h2>
          </div>
          {upcomingMatches.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No hay partidos programados próximamente</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {upcomingMatches.map(m => <MatchCard key={m.id} match={m} compact />)}
            </div>
          )}
        </div>

        {/* Mis ligas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />Mis ligas
            </h2>
            <LinkButton href="/ligas" variant="ghost" size="sm">
              Ver todas <ArrowRight className="ml-1 h-3 w-3" />
            </LinkButton>
          </div>
          {memberships.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-3">Todavía no estás en ninguna liga</p>
                <LinkButton href="/ligas/unirse" size="sm">Unirme a una liga</LinkButton>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {memberships.map(m => (
                <Link key={m.id} href={`/ligas/${m.league_id}`}>
                  <Card className="hover:border-primary/40 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{m.league?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{modeLabel[m.league?.mode || ''] || m.league?.mode}</Badge>
                          <span className="text-xs text-muted-foreground">{roleLabel[m.role] || m.role}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-primary">
                          {m.total_fantasy_points + m.total_prediction_points} pts
                        </p>
                        {m.rank && <p className="text-xs text-muted-foreground">Posición #{m.rank}</p>}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
