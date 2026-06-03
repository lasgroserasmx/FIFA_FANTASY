'use client'
import { useState, useEffect } from 'react'
import { getTorneo } from '@/services/torneo'
import type { TorneoRow } from '@/services/torneo'
import { TorneoApp } from './torneo-app'
import Link from 'next/link'
import { GAME_TYPES } from '@/lib/torneo-data'

export function TorneoDetailPage({ torneoId }: { torneoId: string }) {
  const [torneo, setTorneo] = useState<TorneoRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getTorneo(torneoId).then(row => {
      if (!row) setNotFound(true)
      else setTorneo(row)
      setLoading(false)
    })
  }, [torneoId])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (notFound || !torneo) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-5xl">🔍</div>
        <h2 className="text-xl font-black tracking-widest uppercase">Torneo no encontrado</h2>
        <p className="text-sm text-muted-foreground">No tienes acceso a este torneo o no existe.</p>
        <Link href="/torneo" className="px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
          ← Mis torneos
        </Link>
      </div>
    )
  }

  const gameType = GAME_TYPES.find(g => g.id === torneo.game_type)

  return (
    <div>
      {/* Back link */}
      <div className="flex items-center gap-3 mb-2 -mt-2">
        <Link href="/torneo" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          ← Mis torneos
        </Link>
        <span className="text-muted-foreground/40">·</span>
        <span className="text-xs text-muted-foreground">{gameType?.emoji} {gameType?.label}</span>
      </div>
      <TorneoApp
        torneoId={torneo.id}
        torneoName={torneo.name}
        gameType={torneo.game_type}
      />
    </div>
  )
}
