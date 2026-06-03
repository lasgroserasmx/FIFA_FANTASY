'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  getApuesta, getMembers, joinApuesta, getCurrentUserId, getCreatorProfile,
  type ApuestaRow, type ApuestaMember, type ActivityType,
} from '@/services/apuesta'
import { TorneoApp } from './torneo-app'
import { GAME_TYPES } from '@/lib/torneo-data'

const ACTIVITY_LABEL: Record<string, { icon: string; label: string }> = {
  torneo:     { icon: '🏆', label: 'Torneo' },
  prediccion: { icon: '🎯', label: 'Predicciones' },
  fantasy:    { icon: '⭐', label: 'Fantasy' },
}

export function ApuestaDetail({ apuestaId }: { apuestaId: string }) {
  const [apuesta, setApuesta] = useState<ApuestaRow | null>(null)
  const [members, setMembers] = useState<ApuestaMember[]>([])
  const [myId, setMyId] = useState<string | null>(null)
  const [isMember, setIsMember] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [joining, setJoining] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<ActivityType | 'miembros'>('torneo')

  useEffect(() => {
    async function init() {
      const [row, uid] = await Promise.all([getApuesta(apuestaId), getCurrentUserId()])
      if (!row) { setNotFound(true); setLoading(false); return }

      const mems = await getMembers(apuestaId)
      setApuesta(row)
      setMembers(mems)
      setMyId(uid)
      setIsOwner(row.user_id === uid)
      setIsMember(mems.some(m => m.user_id === uid) || row.user_id === uid)

      // Set default tab to first activity
      const acts = row.activities as ActivityType[]
      if (acts.length > 0) setActiveTab(acts[0])

      setLoading(false)
    }
    init()
  }, [apuestaId])

  async function handleJoin() {
    if (!apuesta) return
    setJoining(true)
    try {
      await joinApuesta(apuesta.id)
      const mems = await getMembers(apuesta.id)
      setMembers(mems)
      setIsMember(true)
    } catch {}
    finally { setJoining(false) }
  }

  function copyCode() {
    if (!apuesta) return
    navigator.clipboard.writeText(apuesta.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (notFound || !apuesta) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-5xl">🔍</div>
        <h2 className="text-xl font-black tracking-widest uppercase">Torneo no encontrado</h2>
        <p className="text-sm text-muted-foreground">El código o enlace no es válido.</p>
        <Link href="/torneo" className="px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm uppercase tracking-widest">
          ← Mis torneos
        </Link>
      </div>
    )
  }

  const gt = GAME_TYPES.find(g => g.id === apuesta.tournament_type)
  const activities = apuesta.activities as ActivityType[]
  const tabs: (ActivityType | 'miembros')[] = [...activities, 'miembros']

  return (
    <div className="min-h-screen -mt-6 -mx-4">
      {/* Sub-header sticky */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="flex items-center justify-between px-4 h-11 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/torneo" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
              ←
            </Link>
            <span className="text-muted-foreground/40 flex-shrink-0">·</span>
            <span className="font-black text-sm text-primary truncate">{gt?.emoji} {apuesta.name}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isOwner && (
              <button
                onClick={copyCode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  copied ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'
                }`}
              >
                {copied ? '✅ Copiado' : `🔗 ${apuesta.invite_code}`}
              </button>
            )}
            <span className="text-[10px] text-muted-foreground">
              👥 {members.length + (isOwner ? 1 : 0)}
            </span>
          </div>
        </div>

        {/* Activity tabs */}
        <nav className="flex overflow-x-auto scrollbar-none border-t border-border/20">
          {tabs.map(t => {
            const info = t === 'miembros'
              ? { icon: '👥', label: 'Miembros' }
              : ACTIVITY_LABEL[t] ?? { icon: '•', label: t }
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-bold tracking-widest uppercase transition-colors border-b-2 ${
                  activeTab === t ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {info.icon} {info.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Join banner (if not member) */}
      {!isMember && (
        <div className="mx-4 mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-bold text-sm">¡Te invitaron a <span className="text-primary">{apuesta.name}</span>!</p>
            <p className="text-xs text-muted-foreground mt-0.5">Únete para participar y ver el progreso del torneo.</p>
          </div>
          <button
            onClick={handleJoin}
            disabled={joining}
            className="px-4 py-2 rounded-lg bg-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {joining ? 'Uniéndose…' : '+ Unirme'}
          </button>
        </div>
      )}

      {/* Content */}
      <div className="px-0">
        {/* Torneo tab → bracket manager */}
        {activeTab === 'torneo' && apuesta.torneo_id && (
          <TorneoApp
            torneoId={apuesta.torneo_id}
            torneoName={apuesta.name}
            gameType={apuesta.tournament_type}
            isOwner={isOwner}
          />
        )}

        {activeTab === 'torneo' && !apuesta.torneo_id && (
          <div className="text-center py-16 text-muted-foreground px-4">
            🏆 El bracket del torneo no fue configurado correctamente. Contacta al organizador.
          </div>
        )}

        {/* Prediccion tab */}
        {activeTab === 'prediccion' && (
          <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
            <div className="text-5xl">🎯</div>
            <h2 className="font-black text-xl tracking-widest uppercase">Predicciones</h2>
            <p className="text-sm text-muted-foreground">
              Pronto podrás predecir los resultados de cada partido del torneo <strong>{gt?.label}</strong> y comparar con tus amigos.
            </p>
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-blue-500/15 text-blue-400">
              Próximamente
            </span>
          </div>
        )}

        {/* Fantasy tab */}
        {activeTab === 'fantasy' && (
          <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
            <div className="text-5xl">⭐</div>
            <h2 className="font-black text-xl tracking-widest uppercase">Fantasy</h2>
            <p className="text-sm text-muted-foreground">
              Arma tu equipo ideal con los jugadores del torneo <strong>{gt?.label}</strong> y compite contra tus amigos.
            </p>
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-yellow-500/15 text-yellow-400">
              Próximamente
            </span>
          </div>
        )}

        {/* Miembros tab */}
        {activeTab === 'miembros' && (
          <MembersPanel
            apuesta={apuesta}
            members={members}
            isOwner={isOwner}
            myId={myId}
            onCopyCode={copyCode}
            copied={copied}
          />
        )}
      </div>
    </div>
  )
}

// ── Members Panel ──────────────────────────────────────────────────────────────
function MembersPanel({ apuesta, members, isOwner, myId, onCopyCode, copied }: {
  apuesta: ApuestaRow
  members: ApuestaMember[]
  isOwner: boolean
  myId: string | null
  onCopyCode: () => void
  copied: boolean
}) {
  const totalCount = members.length + 1 // +1 for creator who may not be in members table

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black tracking-widest uppercase">👥 Miembros — {totalCount}</h2>
        {isOwner && (
          <button
            onClick={onCopyCode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors ${
              copied ? 'bg-primary/15 text-primary' : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'
            }`}
          >
            {copied ? '✅ Copiado' : '🔗 Compartir código'}
          </button>
        )}
      </div>

      {/* Invite code box */}
      {isOwner && (
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Código de invitación</p>
          <div className="flex items-center gap-3">
            <span className="font-mono font-black text-3xl text-primary tracking-[0.3em]">{apuesta.invite_code}</span>
            <button onClick={onCopyCode} className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded border border-white/10 hover:border-primary/30">
              {copied ? '✅' : '📋 Copiar'}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">Comparte este código con tus amigos para que se unan.</p>
        </div>
      )}

      {/* Member list */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        {members.length === 0 && !isOwner ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Aún no hay miembros. ¡Sé el primero en unirte!
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {/* Show creator row if available */}
            <MemberRow
              userId={apuesta.user_id}
              isCreator
              isMe={apuesta.user_id === myId}
            />
            {members
              .filter(m => m.user_id !== apuesta.user_id)
              .map(m => (
                <MemberRow
                  key={m.user_id}
                  userId={m.user_id}
                  joinedAt={m.joined_at}
                  isCreator={false}
                  isMe={m.user_id === myId}
                  profile={m.profile}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MemberRow({ userId, isCreator, isMe, joinedAt, profile }: {
  userId: string
  isCreator: boolean
  isMe: boolean
  joinedAt?: string
  profile?: { username: string | null; full_name: string | null; avatar_url: string | null } | null
}) {
  const displayName = profile?.full_name || profile?.username || userId.slice(0, 8)
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-sm flex-shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm truncate">{displayName}</span>
          {isMe && <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/7 text-muted-foreground">Tú</span>}
        </div>
        {joinedAt && (
          <p className="text-[10px] text-muted-foreground">
            Se unió {new Date(joinedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
          </p>
        )}
      </div>
      {isCreator && (
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/15 text-primary">
          Organizador
        </span>
      )}
    </div>
  )
}
