'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { getTorneo, saveTorneo } from '@/services/torneo'
import { getTeamsByLeague } from '@/lib/torneo-data'
import type { TorneoState, TorneoPlayer, TorneoGroup, TorneoMatch, TorneoBet, Settlement } from './torneo-types'
import type { LeagueMember, Profile } from '@/types'
import { INIT_STATE } from './torneo-types'

// ── Avatar helpers ─────────────────────────────────────────────────────────────
const AV_COLORS = [
  'from-[#2fff6e] to-[#00d4ff]','from-[#f5c232] to-[#ff6b35]','from-[#ff3d5a] to-[#9b59b6]',
  'from-[#4da8ff] to-[#6c5ce7]','from-[#fd79a8] to-[#e17055]','from-[#00cec9] to-[#55efc4]',
  'from-[#a29bfe] to-[#fd79a8]','from-[#ffeaa7] to-[#b2bec3]','from-[#2fff6e] to-[#f5c232]','from-[#ff3d5a] to-[#4da8ff]',
]
function Avatar({ pid, players, size = 34 }: { pid: string | null; players: TorneoPlayer[]; size?: number }) {
  const p = players.find(x => x.id === pid)
  const idx = p ? players.indexOf(p) : 0
  const letter = p ? p.name.charAt(0).toUpperCase() : '?'
  const color = AV_COLORS[idx % AV_COLORS.length]
  return (
    <div
      className={`rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-black flex-shrink-0`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
    >
      {letter}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
interface Props {
  torneoId: string
  torneoName: string
  gameType: string
  isOwner?: boolean
  embedded?: boolean
  leagueMembers?: (LeagueMember & { profile: Profile | null })[]
}

export function TorneoApp({ torneoId, torneoName, gameType, isOwner = true, embedded = false, leagueMembers }: Props) {
  const [S, setS] = useState<TorneoState>(INIT_STATE)
  const [tab, setTab] = useState<'setup' | 'grupos' | 'partido' | 'bracket' | 'finanzas'>('setup')
  const [toast, setToast] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load from Supabase on mount
  useEffect(() => {
    getTorneo(torneoId).then(row => {
      if (row && row.state && row.state.nid) {
        setS(prev => ({ ...INIT_STATE, ...row.state }))
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [torneoId])

  // Debounced save to Supabase
  const save = useCallback((state: TorneoState) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      try { await saveTorneo(torneoId, state) } catch {}
      setSaving(false)
    }, 600)
  }, [torneoId])

  const update = useCallback((fn: (prev: TorneoState) => TorneoState) => {
    setS(prev => { const next = fn(prev); save(next); return next })
  }, [save])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }

  // Team data for this game type
  const teamsByLeague = getTeamsByLeague(gameType)
  const allTeams = Object.values(teamsByLeague).flat()

  // ── Game Logic ────────────────────────────────────────────────────────────────
  function uid(state: TorneoState): [string, TorneoState] {
    const id = 'x' + state.nid
    return [id, { ...state, nid: state.nid + 1 }]
  }

  function buildGroups(state: TorneoState): TorneoState {
    const n = state.players.length
    const ng = n <= 4 ? 1 : n <= 8 ? 2 : n <= 12 ? 3 : 4
    const groups: TorneoGroup[] = Array.from({ length: ng }, (_, i) => ({
      id: String.fromCharCode(65 + i), pids: [],
    }))
    state.players.forEach((p, i) => groups[i % ng].pids.push(p.id))
    return { ...state, groups }
  }

  function buildGroupMatches(state: TorneoState): TorneoState {
    let s = { ...state, matches: state.matches.filter(m => m.ph !== 'group') }
    const newMatches: TorneoMatch[] = []
    for (const g of s.groups) {
      for (let i = 0; i < g.pids.length; i++) {
        for (let j = i + 1; j < g.pids.length; j++) {
          const [id, ns] = uid(s); s = ns
          newMatches.push({
            id, ph: 'group', gid: g.id,
            p1: g.pids[i], p2: g.pids[j],
            s1: null, s2: null, done: false, pen: null,
            bets: [], settled: false, settlement: null,
          })
        }
      }
    }
    return { ...s, matches: [...s.matches, ...newMatches] }
  }

  function standings(state: TorneoState, gid: string) {
    const g = state.groups.find(g => g.id === gid)!
    const ms = state.matches.filter(m => m.ph === 'group' && m.gid === gid && m.done)
    return g.pids.map(pid => {
      let pts = 0, w = 0, d = 0, l = 0, gf = 0, ga = 0
      ms.forEach(m => {
        if (m.p1 !== pid && m.p2 !== pid) return
        const my = m.p1 === pid ? m.s1! : m.s2!
        const th = m.p1 === pid ? m.s2! : m.s1!
        gf += my; ga += th
        if (my > th) { pts += 3; w++ } else if (my === th) { pts += 1; d++ } else { l++ }
      })
      return { pid, pts, w, d, l, gf, ga, gd: gf - ga }
    }).sort((a, b) => b.pts !== a.pts ? b.pts - a.pts : b.gd !== a.gd ? b.gd - a.gd : b.gf - a.gf)
  }

  function groupsDone(state: TorneoState) {
    const ms = state.matches.filter(m => m.ph === 'group')
    return ms.length > 0 && ms.every(m => m.done)
  }

  function matchWinner(m: TorneoMatch): string | null {
    if (!m || !m.done) return null
    if (m.s1! > m.s2!) return m.p1
    if (m.s2! > m.s1!) return m.p2
    if (m.pen) return m.pen
    return 'draw'
  }

  function seedPairs(advancers: { pid: string; rank: number }[]): [string, string][] {
    const n = advancers.length
    if (n <= 2) return [[advancers[0]?.pid, advancers[1]?.pid ?? advancers[0]?.pid]]
    if (n === 4) {
      const r0 = advancers.filter(a => a.rank === 0)
      const r1 = advancers.filter(a => a.rank === 1)
      return [
        [r0[0]?.pid, r1[1]?.pid ?? r1[0]?.pid],
        [r0[1]?.pid ?? r0[0]?.pid, r1[0]?.pid],
      ]
    }
    return Array.from({ length: Math.floor(n / 2) }, (_, i) => [advancers[i].pid, advancers[n - 1 - i].pid])
  }

  function buildKnockout(state: TorneoState): TorneoState {
    const advancers: { pid: string; rank: number }[] = []
    state.groups.forEach(g => {
      standings(state, g.id).slice(0, 2).forEach((s, rank) => advancers.push({ pid: s.pid, rank }))
    })
    let s = { ...state, matches: state.matches.filter(m => m.ph !== 'knockout') }
    const pairs = seedPairs(advancers)
    const newMatches: TorneoMatch[] = []
    for (let i = 0; i < pairs.length; i++) {
      const [id, ns] = uid(s); s = ns
      newMatches.push({ id, ph: 'knockout', round: 0, slot: i, p1: pairs[i][0], p2: pairs[i][1], s1: null, s2: null, done: false, pen: null, bets: [], settled: false, settlement: null })
    }
    let n = pairs.length, round = 1
    while (n > 1) {
      n = Math.ceil(n / 2)
      for (let i = 0; i < n; i++) {
        const [id, ns] = uid(s); s = ns
        newMatches.push({ id, ph: 'knockout', round, slot: i, tbd: true, p1: null, p2: null, s1: null, s2: null, done: false, pen: null, bets: [], settled: false, settlement: null })
      }
      round++
    }
    return { ...s, matches: [...s.matches, ...newMatches], phase: 'knockout' }
  }

  function settle(state: TorneoState, matchId: string): TorneoState {
    return {
      ...state, matches: state.matches.map(m => {
        if (m.id !== matchId || m.settled || !m.done) return m
        const pot = m.bets.reduce((s, b) => s + b.amt, 0)
        if (!pot) return { ...m, settled: true }
        const winner = matchWinner(m)
        const winnerBonus = winner && winner !== 'draw' ? pot * (state.config.winnerCut / 100) : 0
        const bettersPool = pot - winnerBonus
        const correct = m.bets.filter(b => b.pred === winner)
        const correctSum = correct.reduce((s, b) => s + b.amt, 0)
        return {
          ...m, settled: true,
          settlement: {
            pot, winner, winnerBonus, bettersPool,
            correctBettors: correct.map(b => ({
              bid: b.bid, wagered: b.amt,
              won: correctSum > 0 ? (b.amt / correctSum) * bettersPool : 0,
            })),
            noBettors: correct.length === 0,
          },
        }
      }),
    }
  }

  function advanceKnockout(state: TorneoState, m: TorneoMatch): TorneoState {
    const w = matchWinner(m)
    if (!w || w === 'draw') return state
    const nr = m.round! + 1, ns2 = Math.floor(m.slot! / 2), isFirst = m.slot! % 2 === 0
    return {
      ...state, matches: state.matches.map(x => {
        if (x.ph !== 'knockout' || x.round !== nr || x.slot !== ns2) return x
        const updated = isFirst ? { ...x, p1: w } : { ...x, p2: w }
        return { ...updated, tbd: !(updated.p1 && updated.p2) }
      }),
    }
  }

  function checkEnd(state: TorneoState): TorneoState {
    const kms = state.matches.filter(m => m.ph === 'knockout')
    if (!kms.length) return state
    const maxRound = Math.max(...kms.map(m => m.round!))
    const fin = kms.find(m => m.round === maxRound)
    if (fin && fin.done) {
      const w = matchWinner(fin)
      const champion = (w === 'draw' || !w) ? fin.p1 : w
      const runnerUp = champion === fin.p1 ? fin.p2 : fin.p1
      return { ...state, phase: 'finished', champion, runnerUp }
    }
    return state
  }

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const [addName, setAddName] = useState('')
  const [addTeam, setAddTeam] = useState('')
  const [cfg, setCfg] = useState({ entryFee: '200', maxBet: '100', winnerCut: '10', prize1: '80', prize2: '20' })
  const [scores, setScores] = useState<Record<string, { s1: string; s2: string; pen: string }>>({})
  const [bets, setBets] = useState<Record<string, { pred: string; amt: string }>>({})

  useEffect(() => {
    setCfg({
      entryFee: String(S.config.entryFee), maxBet: String(S.config.maxBet),
      winnerCut: String(S.config.winnerCut), prize1: String(S.config.prize1), prize2: String(S.config.prize2),
    })
  }, [S.config])

  function handleAddPlayer() {
    if (!addName.trim() || !addTeam.trim()) { showToast('⚠️ Ingresa nombre y equipo'); return }
    update(prev => {
      const [id, ns] = uid(prev)
      return { ...ns, players: [...ns.players, { id, name: addName.trim(), team: addTeam.trim() }] }
    })
    setAddName(''); setAddTeam('')
  }

  function handleRemovePlayer(id: string) {
    update(prev => ({ ...prev, players: prev.players.filter(p => p.id !== id) }))
  }

  function handleSaveConfig() {
    update(prev => ({
      ...prev,
      config: {
        entryFee: parseFloat(cfg.entryFee) || 200,
        maxBet: parseFloat(cfg.maxBet) || 100,
        winnerCut: parseFloat(cfg.winnerCut) || 10,
        prize1: parseFloat(cfg.prize1) || 80,
        prize2: parseFloat(cfg.prize2) || 20,
      },
    }))
    showToast('✅ Configuración guardada')
  }

  function handleStartTournament() {
    if (S.players.length < 2) { showToast('⚠️ Necesitas al menos 2 jugadores'); return }
    update(prev => {
      let s = buildGroups(prev)
      s = buildGroupMatches(s)
      return { ...s, phase: 'groups' }
    })
    setTab('grupos')
    showToast('🏆 ¡Torneo iniciado!')
  }

  function handleStartKO() {
    update(prev => buildKnockout(prev))
    setTab('bracket')
    showToast('🏆 ¡Bracket generado!')
  }

  function handleSetResult(matchId: string) {
    const sc = scores[matchId]
    const s1v = parseInt(sc?.s1 ?? '')
    const s2v = parseInt(sc?.s2 ?? '')
    if (isNaN(s1v) || isNaN(s2v)) { showToast('⚠️ Ingresa marcador válido'); return }
    update(prev => {
      let s = {
        ...prev, matches: prev.matches.map(m =>
          m.id !== matchId ? m : { ...m, s1: s1v, s2: s2v, done: true, pen: sc?.pen || null }
        ),
      }
      s = settle(s, matchId)
      const m = s.matches.find(x => x.id === matchId)!
      if (m.ph === 'knockout') s = advanceKnockout(s, m)
      s = checkEnd(s)
      return s
    })
    showToast('✅ Resultado guardado')
  }

  function handleDoBet(matchId: string, bettorId: string) {
    const b = bets[`${matchId}_${bettorId}`]
    const amt = parseFloat(b?.amt ?? '')
    if (!b?.pred || !amt || amt <= 0) { showToast('⚠️ Ingresa predicción y monto'); return }
    const capped = Math.min(amt, S.config.maxBet)
    update(prev => ({
      ...prev, matches: prev.matches.map(m => {
        if (m.id !== matchId || m.done) return m
        const ex = m.bets.find(b => b.bid === bettorId)
        const newBets = ex
          ? m.bets.map(bt => bt.bid === bettorId ? { ...bt, pred: b.pred, amt: capped } : bt)
          : [...m.bets, { bid: bettorId, pred: b.pred, amt: capped }]
        return { ...m, bets: newBets }
      }),
    }))
    showToast('💰 Apuesta registrada')
  }

  function handleClearBet(matchId: string, bettorId: string) {
    update(prev => ({
      ...prev, matches: prev.matches.map(m =>
        m.id !== matchId || m.done ? m : { ...m, bets: m.bets.filter(b => b.bid !== bettorId) }
      ),
    }))
    showToast('🗑️ Apuesta eliminada')
  }

  function handleReset() {
    if (!confirm('¿Seguro que quieres reiniciar el torneo?\nSe perderán TODOS los datos.')) return
    const next: TorneoState = { ...INIT_STATE, config: S.config, nid: S.nid }
    update(() => next); setTab('setup'); showToast('🔄 Torneo reiniciado')
  }

  // ── Finance ───────────────────────────────────────────────────────────────────
  function finances() {
    const fin: Record<string, { p: TorneoPlayer; wagered: number; won: number; bonus: number; prize: number }> = {}
    S.players.forEach(p => { fin[p.id] = { p, wagered: 0, won: 0, bonus: 0, prize: 0 } })
    S.matches.forEach(m => {
      if (!m.settled || !m.settlement) return
      m.bets.forEach(b => { if (fin[b.bid]) fin[b.bid].wagered += b.amt })
      m.settlement.correctBettors.forEach(cb => { if (fin[cb.bid]) fin[cb.bid].won += cb.won })
      if (m.settlement.winner && m.settlement.winner !== 'draw' && fin[m.settlement.winner])
        fin[m.settlement.winner].bonus += m.settlement.winnerBonus
    })
    const pot = S.players.length * S.config.entryFee
    if (S.champion && fin[S.champion]) fin[S.champion].prize = pot * (S.config.prize1 / 100)
    if (S.runnerUp && fin[S.runnerUp]) fin[S.runnerUp].prize = pot * (S.config.prize2 / 100)
    return Object.values(fin).map(f => ({ ...f, net: -S.config.entryFee - f.wagered + f.won + f.bonus + f.prize }))
  }

  const totalPot = S.players.length * S.config.entryFee
  const quinielaPot = S.matches.reduce((s, m) => s + m.bets.reduce((ss, b) => ss + b.amt, 0), 0)
  const locked = S.phase !== 'setup' || !isOwner
  const ng = S.players.length <= 4 ? 1 : S.players.length <= 8 ? 2 : S.players.length <= 12 ? 3 : 4

  const availableMatches = S.matches.filter(m => {
    if (S.phase === 'groups') return m.ph === 'group'
    return m.ph === 'knockout' && m.p1 && m.p2 && !m.tbd
  })
  const curMatch = availableMatches.find(x => x.id === S.selMatch)
    ?? availableMatches.find(x => !x.done)
    ?? availableMatches[availableMatches.length - 1]

  const TABS = [
    { id: 'setup', label: '⚙️ Setup' },
    { id: 'grupos', label: '📊 Grupos' },
    { id: 'partido', label: '⚽ Partido' },
    { id: 'bracket', label: '🏆 Bracket' },
    { id: 'finanzas', label: '💰 Finanzas' },
  ] as const

  const PHASES: Record<string, string> = { setup: 'SETUP', groups: 'GRUPOS', knockout: 'ELIMINATORIA', finished: '🏆 CAMPEÓN' }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Cargando torneo…</p>
        </div>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className={embedded ? 'w-full' : 'min-h-screen -mt-6 -mx-4'}>
      {/* Sub-header */}
      <div className={`${embedded ? 'sticky top-0' : 'sticky top-16'} z-40 bg-background/95 backdrop-blur border-b border-border/40`}>
        <div className="flex items-center justify-between px-4 h-10 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black tracking-widest text-primary text-sm uppercase">⚔️ {torneoName}</span>
            {saving && <span className="text-[10px] text-muted-foreground animate-pulse">guardando…</span>}
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/8">
            {PHASES[S.phase] ?? S.phase.toUpperCase()}
          </span>
        </div>
        <nav className="flex overflow-x-auto scrollbar-none border-t border-border/20">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-bold tracking-widest uppercase transition-colors border-b-2 ${
                tab === t.id
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* SETUP */}
        {tab === 'setup' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-black tracking-widest uppercase text-foreground">⚙️ Configuración</h1>
              <p className="text-sm text-muted-foreground mt-1">Define jugadores y reglas. Una vez iniciado, no se puede modificar.</p>
            </div>

            {locked && (
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm text-yellow-400">🔒 Torneo en curso — fase: <strong>{S.phase.toUpperCase()}</strong></p>
                <button onClick={handleReset} className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-colors">
                  🗑️ Reiniciar todo
                </button>
              </div>
            )}

            {/* Config */}
            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
              <h2 className="text-sm font-black tracking-widest uppercase text-primary">💰 Economía del Torneo</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { key: 'entryFee', label: 'Inscripción ($)' },
                  { key: 'maxBet', label: 'Apuesta máx. ($)' },
                  { key: 'winnerCut', label: '% bonus ganador' },
                  { key: 'prize1', label: '% premio 1°' },
                  { key: 'prize2', label: '% premio 2°' },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
                    <input
                      type="number"
                      value={cfg[key as keyof typeof cfg]}
                      onChange={e => setCfg(prev => ({ ...prev, [key]: e.target.value }))}
                      disabled={locked}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none disabled:opacity-40"
                    />
                  </div>
                ))}
              </div>
              {!locked && (
                <div className="flex justify-end">
                  <button onClick={handleSaveConfig} className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground transition-colors">
                    💾 Guardar config
                  </button>
                </div>
              )}
              <div className="rounded-lg border border-primary/15 bg-primary/4 p-4 space-y-2">
                <p className="text-xs font-bold text-foreground">📋 Reglas de La Quiniela</p>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
                  <li><strong className="text-foreground">Solo espectadores apuestan</strong> — los que juegan NO pueden apostar en su propio partido.</li>
                  <li><strong className="text-foreground">Apuesta máx. ${S.config.maxBet}</strong> por partido.</li>
                  <li>Del bote: <strong className="text-foreground">{S.config.winnerCut}% al ganador</strong> como bonus extra.</li>
                  <li>El <strong className="text-foreground">{100 - S.config.winnerCut}% restante</strong> se reparte entre quienes acertaron el resultado, proporcional a lo apostado.</li>
                  <li>En grupos puedes apostar <strong className="text-foreground">Empate</strong>; en eliminatoria solo el ganador.</li>
                </ul>
              </div>
            </div>

            {/* Players */}
            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
              <h2 className="text-sm font-black tracking-widest uppercase text-primary">👥 Jugadores — {S.players.length} registrados</h2>

              {/* Modo liga: miembros de la liga eligen su club */}
              {leagueMembers ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Los participantes son los miembros de la liga. {isOwner ? 'Asigna el club a cada uno para agregarlo al torneo.' : 'El organizador asigna los clubes.'}
                  </p>
                  {leagueMembers.map(member => (
                    <MemberRow
                      key={member.user_id}
                      member={member}
                      existing={S.players.find(p => p.id === member.user_id)}
                      players={S.players}
                      teamsByLeague={teamsByLeague}
                      locked={locked}
                      onAdd={(name, team) => {
                        update(prev => {
                          const alreadyIn = prev.players.find(p => p.id === member.user_id)
                          if (alreadyIn) return { ...prev, players: prev.players.map(p => p.id === member.user_id ? { ...p, team } : p) }
                          return { ...prev, players: [...prev.players, { id: member.user_id, name, team }] }
                        })
                        showToast(`✅ ${name} agregado`)
                      }}
                      onRemove={() => update(prev => ({ ...prev, players: prev.players.filter(p => p.id !== member.user_id) }))}
                    />
                  ))}
                </div>
              ) : (
                /* Modo standalone: formulario libre */
                <>
                  {!locked && (
                    <div className="flex flex-wrap gap-2 items-end">
                      <div className="flex-1 min-w-[140px] space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nombre del jugador</label>
                        <input
                          value={addName} onChange={e => setAddName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddPlayer()}
                          placeholder="Ej. César"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                        />
                      </div>
                      <div className="flex-1 min-w-[160px] space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Club en el juego</label>
                        {allTeams.length > 0 ? (
                          <select
                            value={addTeam}
                            onChange={e => setAddTeam(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary outline-none"
                          >
                            <option value="">— Selecciona equipo —</option>
                            {Object.entries(teamsByLeague).map(([league, teams]) => (
                              <optgroup key={league} label={league}>
                                {teams.map(t => (
                                  <option key={t.name} value={t.name}>{t.name} {t.rating ? `(${t.rating})` : ''}</option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        ) : (
                          <input
                            value={addTeam} onChange={e => setAddTeam(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddPlayer()}
                            placeholder="Ej. Manchester City"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                          />
                        )}
                      </div>
                      <button onClick={handleAddPlayer} className="px-4 py-2 rounded-lg bg-primary text-black text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors">
                        + Agregar
                      </button>
                    </div>
                  )}
                  {S.players.length === 0
                    ? <div className="text-center py-8 text-muted-foreground text-sm">👤 Agrega mínimo 2 jugadores para iniciar.</div>
                    : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {S.players.map((p) => (
                        <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/7 relative group hover:border-white/14 transition-colors">
                          <Avatar pid={p.id} players={S.players} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{p.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{p.team}</div>
                          </div>
                          {!locked && (
                            <button onClick={() => handleRemovePlayer(p.id)} className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 text-muted-foreground hover:text-red-400 transition-all text-xs">✕</button>
                          )}
                        </div>
                      ))}
                    </div>
                  }
                </>
              )}

              {!locked && S.players.length >= 2 && (
                <>
                  <hr className="border-white/6" />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      {S.players.length} jugadores → <strong className="text-foreground">{ng} grupo{ng > 1 ? 's' : ''}</strong> ·{' '}
                      Pozo: <strong className="text-yellow-400">${(S.players.length * S.config.entryFee).toFixed(0)}</strong> ·{' '}
                      Premio 1°: <strong className="text-primary">${(S.players.length * S.config.entryFee * S.config.prize1 / 100).toFixed(0)}</strong>
                    </p>
                    <button onClick={handleStartTournament} className="px-4 py-2 rounded-lg bg-yellow-500 text-black text-xs font-bold uppercase tracking-widest hover:bg-yellow-400 transition-colors">
                      🏆 Iniciar Torneo →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* GRUPOS */}
        {tab === 'grupos' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-black tracking-widest uppercase">📊 Fase de Grupos</h1>
              <p className="text-sm text-muted-foreground mt-1">Todos contra todos. <span className="text-primary font-bold">Top 2 avanzan</span> a la eliminatoria.</p>
            </div>

            {S.phase === 'setup'
              ? <div className="text-center py-12 text-muted-foreground">⚽ El torneo no ha iniciado. Ve a Configuración.</div>
              : <div className="grid sm:grid-cols-2 gap-4">
                {S.groups.map(g => {
                  const st = standings(S, g.id)
                  const gms = S.matches.filter(m => m.ph === 'group' && m.gid === g.id)
                  const played = gms.filter(m => m.done).length
                  return (
                    <div key={g.id} className="space-y-3">
                      <div className="rounded-xl border border-border/60 bg-card p-4">
                        <h3 className="text-sm font-black tracking-widest uppercase text-primary mb-3">
                          Grupo {g.id} <span className="text-[10px] px-2 py-0.5 rounded bg-white/7 text-muted-foreground normal-case tracking-normal font-bold">{played}/{gms.length} jugados</span>
                        </h3>
                        <table className="w-full text-xs">
                          <thead><tr className="text-muted-foreground">
                            <th className="text-left pb-2 font-bold uppercase tracking-wider">Jugador</th>
                            {['J','G','E','P','GF','GC','Pts'].map(h => <th key={h} className="text-center pb-2 font-bold uppercase tracking-wider">{h}</th>)}
                          </tr></thead>
                          <tbody>
                            {st.map((s, rank) => {
                              const p = S.players.find(x => x.id === s.pid)
                              const q = rank < 2
                              return (
                                <tr key={s.pid} className={q ? 'text-primary' : ''}>
                                  <td className="py-1.5">
                                    <div className="flex items-center gap-2">
                                      <Avatar pid={s.pid} players={S.players} size={24} />
                                      <div>
                                        <span className="font-semibold">{p?.name}</span>
                                        {q && <span className="ml-1 text-[8px] font-bold uppercase tracking-widest px-1 py-0.5 rounded bg-primary/15 text-primary">→KO</span>}
                                        <div className="text-[10px] text-muted-foreground">{p?.team}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="text-center py-1.5">{s.w+s.d+s.l}</td>
                                  <td className="text-center py-1.5">{s.w}</td>
                                  <td className="text-center py-1.5">{s.d}</td>
                                  <td className="text-center py-1.5">{s.l}</td>
                                  <td className="text-center py-1.5">{s.gf}</td>
                                  <td className="text-center py-1.5">{s.ga}</td>
                                  <td className="text-center py-1.5"><strong>{s.pts}</strong></td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-card p-4">
                        <h3 className="text-sm font-black tracking-widest uppercase text-primary mb-3">Partidos — Grupo {g.id}</h3>
                        <div className="space-y-1.5">
                          {gms.map(m => <MatchCard key={m.id} m={m} players={S.players} selMatch={S.selMatch} onSelect={id => { update(prev => ({ ...prev, selMatch: id })); setTab('partido') }} />)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            }

            {groupsDone(S) && S.phase === 'groups' && (
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
                <h3 className="text-sm font-black tracking-widest uppercase text-yellow-400 mb-2">✅ Fase de Grupos Completada</h3>
                <p className="text-xs text-muted-foreground mb-4">Todos los partidos terminaron. ¡Es hora de la eliminatoria!</p>
                <div className="flex justify-end">
                  <button onClick={handleStartKO} className="px-4 py-2 rounded-lg bg-yellow-500 text-black text-xs font-bold uppercase tracking-widest hover:bg-yellow-400 transition-colors">
                    Generar Bracket →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PARTIDO */}
        {tab === 'partido' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-black tracking-widest uppercase">⚽ Partido + Quiniela</h1>
              <p className="text-sm text-muted-foreground mt-1">Registra apuestas antes del partido y el resultado al terminar.</p>
            </div>

            {S.phase === 'setup' || !curMatch
              ? <div className="text-center py-12 text-muted-foreground">⚽ {S.phase === 'setup' ? 'El torneo no ha iniciado.' : 'No hay partidos disponibles.'}</div>
              : <PartidoPanel
                  m={curMatch}
                  state={S}
                  scores={scores}
                  bets={bets}
                  isOwner={isOwner}
                  onSelectMatch={id => update(prev => ({ ...prev, selMatch: id }))}
                  onSetScores={setScores}
                  onSetBets={setBets}
                  onSetResult={handleSetResult}
                  onDoBet={handleDoBet}
                  onClearBet={handleClearBet}
                  availableMatches={availableMatches}
                />
            }
          </div>
        )}

        {/* BRACKET */}
        {tab === 'bracket' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-black tracking-widest uppercase">🏆 Bracket Eliminatorio</h1>
              <p className="text-sm text-muted-foreground mt-1">Eliminación directa. Toca un partido para ir a Partido.</p>
            </div>

            {S.phase === 'setup' || S.phase === 'groups'
              ? <div className="text-center py-12 text-muted-foreground">🏆 La eliminatoria se genera al completar la fase de grupos.</div>
              : <BracketPanel state={S} onSelectMatch={id => { update(prev => ({ ...prev, selMatch: id })); setTab('partido') }} />
            }
          </div>
        )}

        {/* FINANZAS */}
        {tab === 'finanzas' && (
          <FinanzasPanel state={S} finances={finances()} totalPot={totalPot} quinielaPot={quinielaPot} />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-card border border-primary rounded-xl px-4 py-3 text-sm font-semibold text-primary shadow-lg animate-in slide-in-from-right-4 duration-300">
          {toast}
        </div>
      )}
    </div>
  )
}

// ── MatchCard ──────────────────────────────────────────────────────────────────
function MatchCard({ m, players, selMatch, onSelect }: {
  m: TorneoMatch; players: TorneoPlayer[]; selMatch: string | null; onSelect: (id: string) => void
}) {
  const p1 = players.find(x => x.id === m.p1)
  const p2 = players.find(x => x.id === m.p2)
  const sel = selMatch === m.id
  return (
    <div
      onClick={() => onSelect(m.id)}
      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
        m.done ? 'opacity-55 border-white/7 bg-white/2' :
        sel ? 'border-primary bg-primary/6' : 'border-white/7 bg-white/2 hover:border-primary/25 hover:bg-primary/3'
      }`}
    >
      <div className="flex-1">
        <div className="font-semibold">{p1?.name ?? '?'}</div>
        <div className="text-[10px] text-muted-foreground">{p1?.team}</div>
      </div>
      <div className={`font-black text-lg min-w-[50px] text-center ${m.done ? 'text-yellow-400' : 'text-muted-foreground text-sm'}`}>
        {m.done ? `${m.s1}–${m.s2}` : 'vs'}
      </div>
      <div className="flex-1 text-right">
        <div className="font-semibold">{p2?.name ?? '?'}</div>
        <div className="text-[10px] text-muted-foreground">{p2?.team}</div>
      </div>
      {m.bets.length > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400">💰{m.bets.length}</span>}
      <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded min-w-[48px] text-center ${
        m.done ? 'bg-primary/10 text-primary' : sel ? 'bg-red-500/15 text-red-400' : 'bg-white/7 text-muted-foreground'
      }`}>{m.done ? 'LISTO' : sel ? 'LIVE' : 'JUGAR'}</div>
    </div>
  )
}

// ── PartidoPanel ───────────────────────────────────────────────────────────────
function PartidoPanel({ m, state, scores, bets, isOwner, onSelectMatch, onSetScores, onSetBets, onSetResult, onDoBet, onClearBet, availableMatches }: {
  m: TorneoMatch; state: TorneoState; scores: Record<string, {s1:string;s2:string;pen:string}>
  bets: Record<string, {pred:string;amt:string}>; isOwner: boolean
  onSelectMatch: (id:string) => void; onSetScores: React.Dispatch<React.SetStateAction<Record<string, {s1:string;s2:string;pen:string}>>>
  onSetBets: React.Dispatch<React.SetStateAction<Record<string, {pred:string;amt:string}>>>
  onSetResult: (id:string) => void; onDoBet: (matchId:string, bettorId:string) => void
  onClearBet: (matchId:string, bettorId:string) => void; availableMatches: TorneoMatch[]
}) {
  const p1 = state.players.find(x => x.id === m.p1)
  const p2 = state.players.find(x => x.id === m.p2)
  const spectators = state.players.filter(p => p.id !== m.p1 && p.id !== m.p2)
  const pending = availableMatches.filter(x => !x.done)
  const done_ = availableMatches.filter(x => x.done)
  const pot = m.bets.reduce((s, b) => s + b.amt, 0)
  const onP1 = m.bets.filter(b => b.pred === m.p1).reduce((s, b) => s + b.amt, 0)
  const onP2 = m.bets.filter(b => b.pred === m.p2).reduce((s, b) => s + b.amt, 0)
  const sc = scores[m.id] ?? { s1: '0', s2: '0', pen: '' }

  return (
    <div className="space-y-4">
      {/* Match selector */}
      <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Partido seleccionado</label>
          <select
            value={m.id}
            onChange={e => onSelectMatch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          >
            {pending.length > 0 && <optgroup label="⏳ Pendientes">
              {pending.map(x => <option key={x.id} value={x.id}>{state.players.find(p=>p.id===x.p1)?.name ?? '?'} vs {state.players.find(p=>p.id===x.p2)?.name ?? '?'}{x.ph==='knockout'?' 🏆':''}</option>)}
            </optgroup>}
            {done_.length > 0 && <optgroup label="✅ Jugados">
              {done_.map(x => <option key={x.id} value={x.id}>{state.players.find(p=>p.id===x.p1)?.name ?? '?'} {x.s1}-{x.s2} {state.players.find(p=>p.id===x.p2)?.name ?? '?'}</option>)}
            </optgroup>}
          </select>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${m.done ? 'bg-primary/15 text-primary' : m.ph==='knockout' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-white/7 text-muted-foreground'}`}>
          {m.done ? 'COMPLETADO' : m.ph === 'knockout' ? 'ELIMINATORIA' : 'GRUPOS'}
        </span>
      </div>

      {/* Match hero */}
      <div className="rounded-xl border border-border/60 bg-card p-5 space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex-1 flex flex-col items-center gap-2 text-center">
            <Avatar pid={m.p1} players={state.players} size={54} />
            <div className="font-black text-xl tracking-wide">{p1?.name}</div>
            <div className="text-xs text-muted-foreground">{p1?.team}</div>
          </div>
          <div className="text-center min-w-[60px]">
            {m.done
              ? <div>
                  <div className="font-black text-4xl text-yellow-400">{m.s1}–{m.s2}</div>
                  {m.pen && <div className="text-xs text-muted-foreground mt-1">Penales: {state.players.find(x=>x.id===m.pen)?.name}</div>}
                </div>
              : <div className="text-muted-foreground font-bold tracking-widest text-lg">VS</div>
            }
          </div>
          <div className="flex-1 flex flex-col items-center gap-2 text-center">
            <Avatar pid={m.p2} players={state.players} size={54} />
            <div className="font-black text-xl tracking-wide">{p2?.name}</div>
            <div className="text-xs text-muted-foreground">{p2?.team}</div>
          </div>
        </div>

        <hr className="border-white/6" />

        {m.done && m.settlement ? (
          <div className="space-y-3">
            <h3 className="text-sm font-black tracking-widest uppercase text-primary">🏁 Resultado Quiniela</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: `$${m.settlement.pot.toFixed(0)}`, lbl: 'Bote total', color: 'text-yellow-400' },
                { val: `$${m.settlement.bettersPool.toFixed(0)}`, lbl: 'Pool apostadores', color: 'text-primary' },
                { val: `$${m.settlement.winnerBonus.toFixed(0)}`, lbl: 'Bonus ganador', color: 'text-foreground' },
              ].map(({ val, lbl, color }) => (
                <div key={lbl} className="rounded-lg bg-white/3 border border-white/7 p-3 text-center">
                  <div className={`font-black text-xl ${color}`}>{val}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{lbl}</div>
                </div>
              ))}
            </div>
            {m.settlement.noBettors && <p className="text-xs text-yellow-400">⚠️ Nadie acertó — el pool queda en reserva.</p>}
            <div className="space-y-2">
              {m.settlement.correctBettors.map(cb => {
                const bp = state.players.find(x => x.id === cb.bid)
                return (
                  <div key={cb.bid} className="flex items-center justify-between py-2 border-b border-white/5">
                    <div className="flex items-center gap-2"><Avatar pid={cb.bid} players={state.players} size={24} /><strong>{bp?.name}</strong> apostó ${cb.wagered.toFixed(0)} → acertó</div>
                    <span className="font-black text-lg text-primary">+${cb.won.toFixed(0)}</span>
                  </div>
                )
              })}
              {m.settlement.winnerBonus > 0 && m.settlement.winner && m.settlement.winner !== 'draw' && (
                <div className="flex items-center justify-between py-2">
                  <span>🏅 <strong>{state.players.find(x=>x.id===m.settlement?.winner)?.name}</strong> · bonus partido</span>
                  <span className="font-black text-lg text-yellow-400">+${m.settlement.winnerBonus.toFixed(0)}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-black tracking-widest uppercase text-primary mb-3">🎲 La Quiniela</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  { val: String(m.bets.length), lbl: 'Apuestas' },
                  { val: `$${pot.toFixed(0)}`, lbl: 'Bote total' },
                  { val: onP1 > 0 ? `$${onP1.toFixed(0)}` : '—', lbl: `En ${p1?.name ?? '?'}` },
                  { val: onP2 > 0 ? `$${onP2.toFixed(0)}` : '—', lbl: `En ${p2?.name ?? '?'}` },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="rounded-lg bg-white/3 border border-white/7 p-2.5 text-center">
                    <div className="font-black text-base text-yellow-400">{val}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">{lbl}</div>
                  </div>
                ))}
              </div>
              {spectators.length === 0
                ? <p className="text-xs text-muted-foreground">No hay espectadores. Se necesitan más jugadores para La Quiniela.</p>
                : <div className={`space-y-1 ${!isOwner ? 'opacity-40 pointer-events-none select-none' : ''}`}>
                  {spectators.map(sp => {
                    const ex = m.bets.find(b => b.bid === sp.id)
                    const bk = `${m.id}_${sp.id}`
                    const bval = bets[bk] ?? { pred: m.p1 ?? '', amt: '' }
                    return (
                      <div key={sp.id} className="flex items-center gap-3 py-2.5 border-b border-white/5 flex-wrap">
                        <Avatar pid={sp.id} players={state.players} size={28} />
                        <div className="font-semibold text-sm flex-1 min-w-[80px]">{sp.name}</div>
                        {ex && <span className="text-[10px] font-bold px-2 py-1 rounded bg-primary/12 text-primary">${ex.amt} → {ex.pred==='draw' ? 'EMPATE' : ex.pred===m.p1 ? p1?.name : p2?.name}</span>}
                        <div className="flex gap-2 flex-wrap items-center">
                          <select
                            value={bval.pred}
                            onChange={e => onSetBets(prev => ({ ...prev, [bk]: { ...bval, pred: e.target.value } }))}
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs focus:border-primary outline-none min-w-[110px]"
                          >
                            <option value={m.p1 ?? ''}>🏅 {p1?.name}</option>
                            {m.ph === 'group' && <option value="draw">🤝 Empate</option>}
                            <option value={m.p2 ?? ''}>🏅 {p2?.name}</option>
                          </select>
                          <input
                            type="number" placeholder="$" value={bval.amt}
                            onChange={e => onSetBets(prev => ({ ...prev, [bk]: { ...bval, amt: e.target.value } }))}
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs w-20 focus:border-primary outline-none"
                            min="1" max={state.config.maxBet}
                          />
                          <button onClick={() => onDoBet(m.id, sp.id)} className="px-2.5 py-1.5 rounded-lg bg-primary text-black text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors">
                            {ex ? '✏️ Editar' : 'Apostar'}
                          </button>
                          {ex && <button onClick={() => onClearBet(m.id, sp.id)} className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground text-[10px] hover:text-foreground transition-colors">✕</button>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              }
            </div>

            <hr className="border-white/6" />

            {!isOwner && (
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-xs text-blue-400">
                👁 Modo solo lectura — solo el organizador puede registrar resultados y apuestas.
              </div>
            )}

            <div className={`space-y-4 ${!isOwner ? 'opacity-40 pointer-events-none select-none' : ''}`}>
              <h3 className="text-sm font-black tracking-widest uppercase text-primary">📥 Registrar Resultado</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center">
                  <div className="text-sm font-semibold mb-2">{p1?.name}</div>
                  <input
                    type="number" value={sc.s1}
                    onChange={e => onSetScores(prev => ({ ...prev, [m.id]: { ...sc, s1: e.target.value } }))}
                    className="w-16 h-16 bg-white/7 border border-white/15 rounded-xl text-center text-3xl font-black text-yellow-400 outline-none focus:border-primary"
                    min="0" max="20"
                  />
                </div>
                <div className="text-muted-foreground font-bold text-2xl">–</div>
                <div className="flex-1 text-center">
                  <div className="text-sm font-semibold mb-2">{p2?.name}</div>
                  <input
                    type="number" value={sc.s2}
                    onChange={e => onSetScores(prev => ({ ...prev, [m.id]: { ...sc, s2: e.target.value } }))}
                    className="w-16 h-16 bg-white/7 border border-white/15 rounded-xl text-center text-3xl font-black text-yellow-400 outline-none focus:border-primary"
                    min="0" max="20"
                  />
                </div>
              </div>
              {m.ph === 'knockout' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Si hay empate en tiempo regular — ¿Ganó en penales?</label>
                  <select
                    value={sc.pen}
                    onChange={e => onSetScores(prev => ({ ...prev, [m.id]: { ...sc, pen: e.target.value } }))}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full focus:border-primary outline-none"
                  >
                    <option value="">— No hubo penales —</option>
                    <option value={m.p1 ?? ''}>{p1?.name} ganó en penales</option>
                    <option value={m.p2 ?? ''}>{p2?.name} ganó en penales</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end">
                <button onClick={() => onSetResult(m.id)} className="px-5 py-2.5 rounded-lg bg-yellow-500 text-black text-xs font-bold uppercase tracking-widest hover:bg-yellow-400 transition-colors">
                  ✅ Confirmar Resultado
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── BracketPanel ───────────────────────────────────────────────────────────────
function BracketPanel({ state, onSelectMatch }: { state: TorneoState; onSelectMatch: (id: string) => void }) {
  const kms = state.matches.filter(m => m.ph === 'knockout')
  if (!kms.length) return <div className="text-center py-12 text-muted-foreground">No hay partidos de eliminatoria.</div>
  const maxR = Math.max(...kms.map(m => m.round!))
  const numR = maxR + 1
  const rLabels = numR === 1 ? ['Final'] : numR === 2 ? ['Semifinal', 'Final'] : ['Cuartos de Final', 'Semifinal', 'Final'].slice(3 - numR)

  function mWinner(m: TorneoMatch) {
    if (!m.done) return null
    if (m.s1! > m.s2!) return m.p1
    if (m.s2! > m.s1!) return m.p2
    if (m.pen) return m.pen
    return 'draw'
  }

  return (
    <div className="space-y-4">
      {state.phase === 'finished' && (
        <div className="rounded-2xl border border-yellow-500 bg-gradient-to-br from-yellow-500/9 to-primary/4 p-8 text-center">
          <div className="text-6xl mb-3">🏆</div>
          <div className="font-black text-4xl text-yellow-400 tracking-widest">{state.players.find(x=>x.id===state.champion)?.name ?? '?'}</div>
          <div className="text-sm text-muted-foreground mt-2">{state.players.find(x=>x.id===state.champion)?.team} · CAMPEÓN DEL TORNEO</div>
          {state.runnerUp && <div className="text-xs text-muted-foreground mt-3">🥈 Subcampeón: <strong>{state.players.find(x=>x.id===state.runnerUp)?.name}</strong> · {state.players.find(x=>x.id===state.runnerUp)?.team}</div>}
        </div>
      )}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-0 items-stretch min-w-max">
          {Array.from({ length: numR }, (_, r) => {
            const rms = kms.filter(m => m.round === r).sort((a, b) => a.slot! - b.slot!)
            return (
              <div key={r} className="flex flex-col justify-around min-w-[200px] px-4">
                <div className="text-xs font-black tracking-widest uppercase text-yellow-400 text-center mb-3">{rLabels[r] ?? `Ronda ${r + 1}`}</div>
                {rms.map(m => {
                  const p1 = m.p1 ? state.players.find(x => x.id === m.p1) : null
                  const p2 = m.p2 ? state.players.find(x => x.id === m.p2) : null
                  const w = mWinner(m)
                  return (
                    <div key={m.id} onClick={() => !m.tbd && onSelectMatch(m.id)} className="rounded-lg border border-white/10 bg-card overflow-hidden my-1.5 cursor-pointer hover:border-primary/30 transition-colors">
                      {[{ p: p1, pid: m.p1, score: m.s1 }, { p: p2, pid: m.p2, score: m.s2 }].map(({ p, pid, score }, idx) => (
                        <div key={idx} className={`px-3 py-2.5 flex items-center justify-between border-b last:border-b-0 border-white/6 text-sm font-semibold ${m.done && w === pid ? 'text-primary bg-primary/7' : !p ? 'text-muted-foreground italic font-normal' : ''}`}>
                          <div className="flex items-center gap-2">
                            {pid && <Avatar pid={pid} players={state.players} size={18} />}
                            <span>{p ? p.name : 'Por definir'}</span>
                          </div>
                          {m.done && <span className="font-black text-lg text-yellow-400">{score}</span>}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── FinanzasPanel ──────────────────────────────────────────────────────────────
function FinanzasPanel({ state, finances, totalPot, quinielaPot }: {
  state: TorneoState
  finances: { p: TorneoPlayer; wagered: number; won: number; bonus: number; prize: number; net: number }[]
  totalPot: number; quinielaPot: number
}) {
  const settled = state.matches.filter(m => m.settled).length
  const histMatches = state.matches.filter(m => m.done && m.settlement && m.settlement.pot > 0)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black tracking-widest uppercase">💰 Finanzas</h1>
        <p className="text-sm text-muted-foreground mt-1">Balance en tiempo real.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { val: `$${totalPot.toFixed(0)}`, lbl: 'Pozo Torneo', color: 'text-yellow-400' },
          { val: String(state.players.length), lbl: 'Jugadores', color: 'text-foreground' },
          { val: `$${quinielaPot.toFixed(0)}`, lbl: 'En Quiniela', color: 'text-primary' },
          { val: String(settled), lbl: 'Liquidados', color: 'text-foreground' },
          { val: `$${(totalPot * state.config.prize1 / 100).toFixed(0)}`, lbl: 'Premio 1°', color: 'text-yellow-400' },
          { val: `$${(totalPot * state.config.prize2 / 100).toFixed(0)}`, lbl: 'Premio 2°', color: 'text-foreground' },
        ].map(({ val, lbl, color }) => (
          <div key={lbl} className="rounded-xl bg-white/2.5 border border-white/7 p-3.5 text-center">
            <div className={`font-black text-2xl ${color}`}>{val}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{lbl}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h2 className="text-sm font-black tracking-widest uppercase text-primary mb-4">📊 Balance por Jugador</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-white/8">
                {['Jugador','Inscripción','Apostado','Ganado Q.','Bonus','Premio','Neto'].map(h => (
                  <th key={h} className={`pb-2 font-bold ${h==='Jugador'?'text-left':'text-right'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...finances].sort((a, b) => b.net - a.net).map(f => (
                <tr key={f.p.id} className="border-b border-white/4 last:border-b-0">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Avatar pid={f.p.id} players={state.players} size={28} />
                      <div>
                        <div className="font-semibold">{f.p.name}</div>
                        <div className="text-[10px] text-muted-foreground">{f.p.team}</div>
                      </div>
                      {f.p.id === state.champion && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400">🏆</span>}
                      {f.p.id === state.runnerUp && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/7 text-muted-foreground">🥈</span>}
                    </div>
                  </td>
                  <td className="text-right py-3 font-black text-base text-red-400">-${state.config.entryFee.toFixed(0)}</td>
                  <td className="text-right py-3 font-black text-base text-red-400">{f.wagered > 0 ? `-$${f.wagered.toFixed(0)}` : '—'}</td>
                  <td className="text-right py-3 font-black text-base text-primary">{f.won > 0 ? `+$${f.won.toFixed(0)}` : '—'}</td>
                  <td className="text-right py-3 font-black text-base text-yellow-400">{f.bonus > 0 ? `+$${f.bonus.toFixed(0)}` : '—'}</td>
                  <td className="text-right py-3 font-black text-base text-primary">{f.prize > 0 ? `+$${f.prize.toFixed(0)}` : '—'}</td>
                  <td className="text-right py-3">
                    <span className={`font-black text-xl ${f.net > 0 ? 'text-primary' : f.net < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                      {f.net >= 0 ? '+' : ''}${f.net.toFixed(0)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr className="border-white/6 mt-4 mb-3" />
        <p className="text-xs text-muted-foreground">💡 Balance neto = quiniela ganado + bonus partido + premio torneo − inscripción − apostado</p>
      </div>

      {histMatches.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <h2 className="text-sm font-black tracking-widest uppercase text-primary mb-4">📜 Historial de Quiniela</h2>
          <div className="space-y-2">
            {histMatches.map(m => {
              const p1 = state.players.find(x => x.id === m.p1)
              const p2 = state.players.find(x => x.id === m.p2)
              const s = m.settlement!
              return (
                <div key={m.id} className="rounded-lg border border-white/7 bg-white/2 p-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 text-sm font-semibold">{p1?.name}</span>
                    <span className="font-black text-yellow-400">{m.s1} – {m.s2}</span>
                    <span className="flex-1 text-sm font-semibold text-right">{p2?.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/7 text-muted-foreground">💰 ${s.pot.toFixed(0)}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    {s.correctBettors.map(cb => <span key={cb.bid} className="text-primary">+${cb.won.toFixed(0)} → {state.players.find(x=>x.id===cb.bid)?.name}</span>)}
                    {s.winnerBonus > 0 && <span className="text-yellow-400">🏅 Bonus → {state.players.find(x=>x.id===s.winner!)?.name}: +${s.winnerBonus.toFixed(0)}</span>}
                    {s.noBettors && <span className="text-red-400">Nadie acertó</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── MemberRow — componente separado para respetar Rules of Hooks ───────────────
function MemberRow({ member, existing, players, teamsByLeague, locked, onAdd, onRemove }: {
  member: LeagueMember & { profile: Profile | null }
  existing: TorneoPlayer | undefined
  players: TorneoPlayer[]
  teamsByLeague: Record<string, { name: string; rating?: number }[]>
  locked: boolean
  onAdd: (name: string, team: string) => void
  onRemove: () => void
}) {
  const name = member.profile?.full_name || member.profile?.username || member.user_id.slice(0, 8)
  const [teamSel, setTeamSel] = useState(existing?.team ?? '')

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/7 flex-wrap">
      <div className="flex items-center gap-2 flex-1 min-w-[120px]">
        <Avatar pid={existing?.id ?? null} players={players.length ? players : [{ id: member.user_id, name, team: '' }]} size={28} />
        <div>
          <div className="text-sm font-semibold">{name}</div>
          {existing && <div className="text-[10px] text-primary">{existing.team} ✓</div>}
        </div>
      </div>
      {!locked && (
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={teamSel}
            onChange={e => setTeamSel(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-foreground focus:border-primary outline-none min-w-[160px]"
          >
            <option value="">— Club —</option>
            {Object.entries(teamsByLeague).map(([league, teams]) => (
              <optgroup key={league} label={league}>
                {teams.map(t => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            onClick={() => { if (teamSel) onAdd(name, teamSel) }}
            className="px-3 py-1.5 rounded-lg bg-primary text-black text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
          >
            {existing ? '✏️ Actualizar' : '+ Agregar'}
          </button>
          {existing && (
            <button onClick={onRemove} className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-red-400 text-[10px] hover:bg-red-500/10 transition-colors">✕</button>
          )}
        </div>
      )}
      {locked && <span className="text-xs text-muted-foreground">{existing ? existing.team : <em>Sin club</em>}</span>}
    </div>
  )
}
