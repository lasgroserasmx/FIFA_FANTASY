'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  listMyApuestas, createApuesta, deleteApuesta,
  getApuestaByCode, joinApuesta, getCurrentUserId,
  type ApuestaRow, type ActivityType,
} from '@/services/apuesta'
import { GAME_TYPES } from '@/lib/torneo-data'

const PHASE_LABEL: Record<string, string> = {
  setup: 'Setup', groups: 'Grupos', knockout: 'Eliminatoria', finished: '🏆 Finalizado',
}
const ACTIVITY_LABEL: Record<string, string> = {
  fantasy: '⭐ Fantasy', prediccion: '🎯 Predicción', torneo: '🏆 Torneo',
}
const ACTIVITY_COLOR: Record<string, string> = {
  fantasy: 'bg-yellow-500/15 text-yellow-400',
  prediccion: 'bg-blue-500/15 text-blue-400',
  torneo: 'bg-primary/15 text-primary',
}

export function ApuestaList() {
  const router = useRouter()
  const [apuestas, setApuestas] = useState<ApuestaRow[]>([])
  const [myId, setMyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Create modal state
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('fc26')
  const [newActivities, setNewActivities] = useState<ActivityType[]>(['torneo'])
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Join state
  const [joinCode, setJoinCode] = useState('')
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const [rows, uid] = await Promise.all([listMyApuestas(), getCurrentUserId()])
      setApuestas(rows)
      setMyId(uid)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function toggleActivity(a: ActivityType) {
    setNewActivities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    )
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim() || newActivities.length === 0) return
    setCreating(true)
    setCreateError(null)
    try {
      const row = await createApuesta(newName.trim(), newType, newActivities)
      setShowCreate(false)
      setNewName(''); setNewType('fc26'); setNewActivities(['torneo'])
      router.push(`/torneo/${row.id}`)
    } catch (e: any) { setCreateError(e.message) }
    finally { setCreating(false) }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    const code = joinCode.trim().toUpperCase()
    if (!code) return
    setJoining(true)
    setJoinError(null)
    try {
      const apuesta = await getApuestaByCode(code)
      if (!apuesta) { setJoinError('Código no encontrado. Verifica con el organizador.'); return }
      await joinApuesta(apuesta.id)
      router.push(`/torneo/${apuesta.id}`)
    } catch (e: any) { setJoinError(e.message) }
    finally { setJoining(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta apuesta? Se perderán todos los datos.')) return
    setDeleting(id)
    try {
      await deleteApuesta(id)
      setApuestas(prev => prev.filter(a => a.id !== id))
    } catch (e: any) { setError(e.message) }
    finally { setDeleting(null) }
  }

  const ownApuestas = apuestas.filter(a => a.user_id === myId)
  const joinedApuestas = apuestas.filter(a => a.user_id !== myId)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black tracking-widest uppercase">⚔️ Torneos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Crea tu grupo o únete al de un amigo. Juega Fantasy, Predicciones y el bracket del torneo.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          + Crear grupo
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">⚠️ {error}</div>
      )}

      {/* Join by code */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
        <div>
          <h2 className="text-sm font-black tracking-widest uppercase text-primary">🔗 Unirse a un torneo</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Pide el código de 8 letras al organizador y pégalo aquí.</p>
        </div>
        <form onSubmit={handleJoin} className="flex gap-2">
          <input
            value={joinCode}
            onChange={e => { setJoinCode(e.target.value.toUpperCase()); setJoinError(null) }}
            placeholder="Ej. ABCD1234"
            maxLength={8}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono uppercase focus:border-primary outline-none tracking-widest"
          />
          <button
            type="submit"
            disabled={joining || joinCode.trim().length < 4}
            className="px-4 py-2 rounded-lg bg-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            {joining ? '…' : 'Entrar'}
          </button>
        </form>
        {joinError && <p className="text-xs text-red-400">⚠️ {joinError}</p>}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div>
              <h2 className="text-xl font-black tracking-widest uppercase">Nuevo Torneo</h2>
              <p className="text-xs text-muted-foreground mt-1">Un grupo privado para tus amigos. Elige el juego y qué actividades incluir.</p>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nombre del grupo</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Ej. Champions de Casa · FC 26"
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none"
                />
              </div>

              {/* Tipo de torneo */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tipo de torneo</label>
                <div className="grid grid-cols-2 gap-3">
                  {GAME_TYPES.map(gt => (
                    <button
                      key={gt.id}
                      type="button"
                      onClick={() => setNewType(gt.id)}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        newType === gt.id ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/3 hover:border-white/20'
                      }`}
                    >
                      <div className="text-2xl mb-1">{gt.emoji}</div>
                      <div className="font-black text-sm">{gt.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{gt.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actividades */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">¿Qué pueden jugar los miembros?</label>
                <div className="space-y-2">
                  {([
                    { id: 'torneo' as ActivityType, icon: '🏆', label: 'Torneo (bracket)', desc: 'Bracket eliminatorio con grupos, marcadores y La Quiniela entre amigos.' },
                    { id: 'prediccion' as ActivityType, icon: '🎯', label: 'Predicciones', desc: 'Cada miembro predice los resultados de los partidos del torneo.' },
                    { id: 'fantasy' as ActivityType, icon: '⭐', label: 'Fantasy', desc: 'Arma tu equipo ideal con los jugadores del torneo seleccionado.' },
                  ] as const).map(a => {
                    const active = newActivities.includes(a.id)
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleActivity(a.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          active ? 'border-primary bg-primary/8' : 'border-white/10 bg-white/2 hover:border-white/20'
                        }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${active ? 'bg-primary border-primary' : 'border-white/20'}`}>
                          {active && <span className="text-black text-xs font-black">✓</span>}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{a.icon} {a.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{a.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {createError && <p className="text-xs text-red-400">⚠️ {createError}</p>}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowCreate(false); setCreateError(null) }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating || !newName.trim() || newActivities.length === 0}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-black font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creando…' : 'Crear →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lists */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : apuestas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-16 text-center space-y-4">
          <div className="text-5xl">⚔️</div>
          <div>
            <p className="font-black text-xl tracking-widest uppercase">Sin torneos aún</p>
            <p className="text-sm text-muted-foreground mt-2">Crea un grupo e invita a tus amigos, o únete con un código.</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
          >
            + Crear mi primer torneo
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {ownApuestas.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-black tracking-widest uppercase text-muted-foreground">Mis torneos</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {ownApuestas.map(a => <ApuestaCard key={a.id} apuesta={a} isOwner onDelete={handleDelete} deleting={deleting === a.id} />)}
              </div>
            </section>
          )}
          {joinedApuestas.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-black tracking-widest uppercase text-muted-foreground">Torneos a los que me uní</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {joinedApuestas.map(a => <ApuestaCard key={a.id} apuesta={a} isOwner={false} onDelete={handleDelete} deleting={false} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────────
function ApuestaCard({ apuesta: a, isOwner, onDelete, deleting }: {
  apuesta: ApuestaRow
  isOwner: boolean
  onDelete: (id: string) => void
  deleting: boolean
}) {
  const [copied, setCopied] = useState(false)
  const gt = GAME_TYPES.find(g => g.id === a.tournament_type)

  function copyCode() {
    navigator.clipboard.writeText(a.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4 hover:border-border transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0">{gt?.emoji ?? '⚽'}</span>
          <div className="min-w-0">
            <h3 className="font-black text-base leading-tight truncate">{a.name}</h3>
            <p className="text-xs text-muted-foreground">{gt?.label ?? a.tournament_type}</p>
          </div>
        </div>
        {isOwner && (
          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/15 text-primary flex-shrink-0">
            Organizador
          </span>
        )}
      </div>

      {/* Activities chips */}
      <div className="flex flex-wrap gap-1.5">
        {(a.activities as ActivityType[]).map(act => (
          <span key={act} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${ACTIVITY_COLOR[act] ?? 'bg-white/7 text-muted-foreground'}`}>
            {ACTIVITY_LABEL[act] ?? act}
          </span>
        ))}
      </div>

      {/* Invite code */}
      <button
        onClick={copyCode}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/7 hover:border-white/15 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Código:</span>
          <span className="font-mono font-black text-sm text-foreground tracking-widest">{a.invite_code}</span>
        </div>
        <span className={`text-[10px] font-bold transition-colors ${copied ? 'text-primary' : 'text-muted-foreground'}`}>
          {copied ? '✅ Copiado' : '📋 Copiar'}
        </span>
      </button>

      <div className="flex gap-2">
        <Link
          href={`/torneo/${a.id}`}
          className="flex-1 text-center px-4 py-2 rounded-lg bg-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          ▶ Entrar
        </Link>
        {isOwner && (
          <button
            onClick={() => onDelete(a.id)}
            disabled={deleting}
            className="px-3 py-2 rounded-lg border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-500/30 text-xs transition-colors disabled:opacity-40"
          >
            {deleting ? '…' : '🗑️'}
          </button>
        )}
      </div>
    </div>
  )
}
