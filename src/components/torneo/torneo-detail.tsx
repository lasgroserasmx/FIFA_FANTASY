'use client'
import { useState, useEffect } from 'react'
import { getTorneo, getCurrentUserId } from '@/services/torneo'
import type { TorneoRow } from '@/services/torneo'
import { TorneoApp } from './torneo-app'
import Link from 'next/link'
import { GAME_TYPES } from '@/lib/torneo-data'

export function TorneoDetailPage({ torneoId }: { torneoId: string }) {
  const [torneo, setTorneo] = useState<TorneoRow | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    Promise.all([getTorneo(torneoId), getCurrentUserId()]).then(([row, uid]) => {
      if (!row) { setNotFound(true) }
      else {
        setTorneo(row)
        setIsOwner(row.user_id === uid)
      }
      setLoading(false)
    })
  }, [torneoId])

  function handleCopyLink() {
    const url = `${window.location.origin}/torneo/${torneoId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(torneoId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

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
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 mb-2 -mt-2 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/torneo" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            ← Mis torneos
          </Link>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-xs text-muted-foreground">{gameType?.emoji} {gameType?.label}</span>
          {!isOwner && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 uppercase tracking-widest">
                👁 Solo lectura
              </span>
            </>
          )}
        </div>

        {/* Share button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="text-[10px] font-mono px-2 py-1 rounded border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors truncate max-w-[120px]"
            title="Copiar código del torneo"
          >
            {torneoId.slice(0, 8)}…
          </button>
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors ${
              copied
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20'
            }`}
          >
            {copied ? '✅ Copiado' : '🔗 Compartir'}
          </button>
        </div>
      </div>

      <TorneoApp
        torneoId={torneo.id}
        torneoName={torneo.name}
        gameType={torneo.game_type}
        isOwner={isOwner}
      />
    </div>
  )
}
