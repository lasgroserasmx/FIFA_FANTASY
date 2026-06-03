'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { INIT_STATE } from './torneo-types'
import type { TorneoState } from './torneo-types'
import { getTeamsByLeague } from '@/lib/torneo-data'

// Importamos el TorneoApp pero con un torneoId ficticio para modo local
// En modo standalone usamos localStorage como fallback
const SK = 'torneo_standalone_v1'

import { TorneoApp } from './torneo-app'
import { createClient } from '@/lib/supabase/client'
import { createTorneo, getTorneo } from '@/services/torneo'
import Link from 'next/link'

export function TorneoStandalone() {
  const [torneoId, setTorneoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un torneo standalone guardado
    const saved = localStorage.getItem(SK)
    if (saved) {
      setTorneoId(saved)
      setLoading(false)
      return
    }
    setLoading(false)
  }, [])

  async function handleCreate(gameType: string) {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const torneo = await createTorneo('Mi Torneo', gameType)
      localStorage.setItem(SK, torneo.id)
      setTorneoId(torneo.id)
    } catch {}
    setLoading(false)
  }

  function handleReset() {
    if (!confirm('¿Reiniciar el torneo standalone? Se perderán todos los datos.')) return
    localStorage.removeItem(SK)
    setTorneoId(null)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!torneoId) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-widest uppercase">⚔️ Torneo</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Bracket eliminatorio local con grupos, quiniela y finanzas.
            Para jugar con amigos en una liga, <Link href="/ligas/crear" className="text-primary underline">crea una liga</Link> e incluye el módulo Torneo.
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-8 space-y-6 text-center">
          <div className="text-5xl">🏆</div>
          <div>
            <p className="font-black text-xl tracking-widest uppercase">Torneo rápido</p>
            <p className="text-sm text-muted-foreground mt-2">Elige el tipo de torneo para empezar. Se guardará en esta sesión.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onClick={() => handleCreate('fc26')}
              className="rounded-xl border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10 transition-colors"
            >
              <div className="text-3xl mb-1">🎮</div>
              <div className="font-black text-sm">EA Sports FC 26</div>
            </button>
            <button
              onClick={() => handleCreate('wc2026')}
              className="rounded-xl border border-border bg-card p-4 hover:border-border/80 transition-colors"
            >
              <div className="text-3xl mb-1">🌍</div>
              <div className="font-black text-sm">FIFA 2026</div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <TorneoApp
        torneoId={torneoId}
        torneoName="Torneo"
        gameType="fc26"
        isOwner={true}
      />
      <div className="px-4 pb-4 flex justify-end">
        <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-red-400 transition-colors">
          🗑️ Reiniciar torneo
        </button>
      </div>
    </div>
  )
}
