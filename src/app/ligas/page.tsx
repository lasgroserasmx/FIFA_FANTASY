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
const statusLabel: Record<string, string> = {
  draft: 'Borrador',
  active: 'Activa',
  locked: 'Bloqueada',
  finished: 'Finalizada',
}
const modeLabel: Record<string, string> = {
  fantasy: 'Fantasy',
  prediction: 'Quiniela',
  both: 'Fantasy + Quiniela',
}

function TarjetaLiga({ liga }: { liga: League }) {
  const Icon = statusIcon[liga.status] || Play
  return (
    <Link href={`/ligas/${liga.id}`}>
      <Card className="hover:border-primary/40 transition-all cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">{liga.name}</h3>
              {liga.description && <p className="text-sm text-muted-foreground mt-0.5 truncate">{liga.description}</p>}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge variant="outline" className="text-xs">{modeLabel[liga.mode] || liga.mode}</Badge>
                <Badge variant="outline" className={`text-xs ${statusColor[liga.status]}`}>
                  <Icon className="mr-1 h-3 w-3" />{statusLabel[liga.status] || liga.status}
                </Badge>
                {liga.entry_fee > 0 && <Badge variant="outline" className="text-xs">Entrada: ${liga.entry_fee}</Badge>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              {liga.prize_pool > 0 && (
                <>
                  <p className="text-xs text-muted-foreground">Bote</p>
                  <p className="text-lg font-bold text-primary">${liga.prize_pool}</p>
                </>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                <Users className="inline h-3 w-3 mr-1" />Máx. {liga.max_members}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function LigasPage() {
  const { data: ligas, isLoading } = useLeagues()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis Ligas</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestiona y consulta tus ligas de fantasy</p>
        </div>
        <div className="flex gap-2">
          <LinkButton href="/ligas/unirse" variant="outline" size="sm">
            <Zap className="mr-2 h-4 w-4" />Unirme
          </LinkButton>
          <LinkButton href="/ligas/crear" size="sm">
            <Plus className="mr-2 h-4 w-4" />Crear liga
          </LinkButton>
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Card key={i} className="animate-pulse"><CardContent className="p-5 h-32" /></Card>)}
        </div>
      ) : ligas?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Todavía no estás en ninguna liga</h3>
            <p className="text-muted-foreground text-sm mb-4">Crea o únete a una liga para empezar a competir</p>
            <div className="flex gap-3 justify-center">
              <LinkButton href="/ligas/unirse" variant="outline">Unirme con código</LinkButton>
              <LinkButton href="/ligas/crear">Crear liga</LinkButton>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {ligas?.map(l => <TarjetaLiga key={l.id} liga={l} />)}
        </div>
      )}
    </div>
  )
}
