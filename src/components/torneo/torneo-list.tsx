'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { listTorneos, createTorneo, deleteTorneo, getTorneo } from '@/services/torneo'
import type { TorneoRow } from '@/services/torneo'
import { GAME_TYPES } from '@/lib/torneo-data'

const PHASE_LABEL: Record<string, string> = {
  setup: 'Setup',
  groups: 'Grupos',
  knockout: 'Eliminatoria',
  finished: '🏆 Finalizado',
}

const PHASE_COLOR: Record<string, string> = {
  setup: 'text-muted-foreground bg-white/7',
  groups: 'text-blue-400 bg-blue-500/15',
  knockout: 'text-yellow-400 bg-yellow-500/15',
  finished: 'text-primary bg-primary/15',
}

export function TorneoListPage() {
  const router = useRouter()
  const [torneos, setTorneos] = useState<TorneoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('cwc2025')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Join by code
  const [joinCode, setJoinCode] = useState('')
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const rows = await listTorneos()
      setTorneos(rows)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    setError(null)
    try {
      const row = await createTorneo(newName.trim(), newType)
      setShowCreate(false)
      setNewName('')
      setNewType('cwc2025')
      router.push(`/torneo/${row.id}`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este torneo? No se puede deshacer.')) return
    setDeleting(id)
    try {
      await deleteTorneo(id)
      setTorneos(prev => prev.filter(t => t.id !== id))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setDeleting(null)
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    const code = joinCode.trim()
    if (!code) return
    setJoining(true)
    setJoinError(null)
    try {
      // El código puede ser el UUID completo o solo los primeros 8 chars
      // Intentamos navegar directamente — getTorneo validará acceso
      const row = await getTorneo(code)
      if (!row) {
        setJoinError('No se encontró ningún torneo con ese código.')
        return
      }
      router.push(`/torneo/${row.id}`)
    } catch {
      setJoinError('Código inválido o torneo no encontrado.')
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black tracking-widest uppercase">⚔️ Torneo</h1>
          <p className="text-sm text-muted-foreground mt-1">Crea tu torneo o únete al de un amigo con su código.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          + Nuevo torneo
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Join by code */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
        <div>
          <h2 className="text-sm font-black tracking-widest uppercase text-primary">🔗 Unirse a un torneo</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Pide el código o enlace al organizador y pégalo aquí.</p>
        </div>
        <form onSubmit={handleJoin} className="flex gap-2">
          <input
            value={joinCode}
            onChange={e => { setJoinCode(e.target.value); setJoinError(null) }}
            placeholder="Pega el código o ID del torneo…"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none font-mono"
          />
          <button
            type="submit"
            disabled={joining || !joinCode.trim()}
            className="px-4 py-2 rounded-lg bg-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            {joining ? '…' : 'Entrar'}
          </button>
        </form>
        {joinError && <p className="text-xs text-red-400">⚠️ {joinError}</p>}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-5">
            <div>
              <h2 className="text-xl font-black tracking-widest uppercase">Nuevo Torneo</h2>
              <p className="text-xs text-muted-foreground mt-1">Elige el tipo de juego para cargar los equipos correspondientes.</p>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nombre del torneo</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Ej. Champions de Casa 2026"
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tipo de torneo</label>
                <div className="grid grid-cols-2 gap-3">
                  {GAME_TYPES.map(gt => (
                    <button
                      key={gt.id}
                      type="button"
                      onClick={() => setNewType(gt.id)}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        newType === gt.id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/10 bg-white/3 hover:border-white/20'
                      }`}
                    >
                      <div className="text-2xl mb-1">{gt.emoji}</div>
                      <div className="font-black text-sm">{gt.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{gt.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowCreate(false); setError(null) }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating || !newName.trim()}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-black font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creando…' : 'Crear torneo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My tournaments */}
      <div className="space-y-4">
        <h2 className="text-sm font-black tracking-widest uppercase text-muted-foreground">Mis torneos</h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : torneos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 p-16 text-center space-y-4">
            <div className="text-5xl">⚔️</div>
            <div>
              <p className="font-black text-xl tracking-widest uppercase">Sin torneos aún</p>
              <p className="text-sm text-muted-foreground mt-2">Crea tu primer torneo y agrega a tus amigos con su equipo favorito.</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
            >
              + Crear mi primer torneo
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {torneos.map(t => {
              const gameType = GAME_TYPES.find(g => g.id === t.game_type)
              return (
                <div key={t.id} className="rounded-2xl border border-border/60 bg-card p-5 space-y-4 hover:border-border transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{gameType?.emoji ?? '⚽'}</div>
                      <div>
                        <h3 className="font-black text-lg leading-tight">{t.name}</h3>
                        <p className="text-xs text-muted-foreground">{gameType?.label ?? t.game_type}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full flex-shrink-0 ${PHASE_COLOR[t.phase] ?? PHASE_COLOR.setup}`}>
                      {PHASE_LABEL[t.phase] ?? t.phase}
                    </span>
                  </div>

                  {/* Share code */}
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/3 border border-white/7">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex-shrink-0">Código:</span>
                    <span className="font-mono text-xs text-foreground flex-1 truncate">{t.id}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/torneo/${t.id}`)}
                      className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                      title="Copiar enlace"
                    >
                      📋
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>👥 {t.player_count} jugadores</span>
                    <span>🕐 {format(parseISO(t.updated_at), 'd MMM', { locale: es })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/torneo/${t.id}`}
                      className="flex-1 text-center px-4 py-2 rounded-lg bg-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
                    >
                      ▶ Jugar
                    </Link>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={deleting === t.id}
                      className="px-3 py-2 rounded-lg border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-500/30 text-xs transition-colors disabled:opacity-40"
                    >
                      {deleting === t.id ? '…' : '🗑️'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
