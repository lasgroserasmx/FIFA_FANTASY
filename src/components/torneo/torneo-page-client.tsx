'use client'
import Link from 'next/link'
import { useLeagues } from '@/hooks/use-leagues'
import { GAME_TYPES } from '@/lib/torneo-data'

export function TorneoPageClient() {
  const { data: leagues, isLoading } = useLeagues()

  const torneoLeagues = (leagues ?? []).filter(l => l.torneo_id && (l.mode === 'torneo' || l.mode === 'all'))

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-widest uppercase">⚔️ Torneo</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Bracket eliminatorio con grupos, quiniela y finanzas. El torneo se gestiona dentro de cada liga.
        </p>
      </div>

      {torneoLeagues.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mis ligas con torneo</p>
          {torneoLeagues.map(league => {
            const gt = GAME_TYPES.find(g => g.id === league.tournament_type)
            return (
              <Link
                key={league.id}
                href={`/torneo/liga/${league.id}`}
                className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:bg-primary/3 transition-all group"
              >
                <div className="text-3xl">{gt?.emoji ?? '🏆'}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base truncate group-hover:text-primary transition-colors">{league.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{gt?.label ?? 'Torneo'}</p>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver →
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card p-8 text-center space-y-4">
          <div className="text-5xl">🏆</div>
          <p className="text-muted-foreground text-sm">
            No estás en ninguna liga con torneo activo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/ligas/crear"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              ⚔️ Crear liga con Torneo
            </Link>
            <Link
              href="/ligas/unirse"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-bold hover:bg-muted transition-colors"
            >
              Unirse a una liga
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
