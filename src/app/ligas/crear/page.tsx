'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useCreateLeague } from '@/hooks/use-leagues'
import { GAME_TYPES } from '@/lib/torneo-data'
import type { LeagueMode } from '@/types'

type Activity = 'fantasy' | 'prediction' | 'torneo'

const ACTIVITIES = [
  {
    id: 'torneo' as Activity,
    icon: '🏆',
    label: 'Torneo',
    desc: 'Bracket eliminatorio con grupos, marcadores y La Quiniela entre amigos.',
  },
  {
    id: 'fantasy' as Activity,
    icon: '⭐',
    label: 'Fantasy',
    desc: 'Arma tu equipo ideal con jugadores del torneo. Gana puntos por rendimiento real.',
  },
  {
    id: 'prediction' as Activity,
    icon: '🎯',
    label: 'Predicciones',
    desc: 'Predice los resultados de los partidos. Puntos por exactitud y outcome correcto.',
  },
]

function activitiesToMode(acts: Activity[]): LeagueMode {
  const has = (a: Activity) => acts.includes(a)
  if (has('fantasy') && has('prediction') && has('torneo')) return 'all'
  if (has('fantasy') && has('prediction')) return 'both'
  if (has('fantasy') && has('torneo')) return 'all' // tratamos como all para simplificar
  if (has('prediction') && has('torneo')) return 'all'
  if (has('fantasy')) return 'fantasy'
  if (has('prediction')) return 'prediction'
  if (has('torneo')) return 'torneo'
  return 'both'
}

export default function CrearLigaPage() {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateLeague()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [activities, setActivities] = useState<Activity[]>(['torneo'])
  const [tournamentType, setTournamentType] = useState('fc26')
  const [maxMembers, setMaxMembers] = useState(20)
  const [entryFee, setEntryFee] = useState(0)
  const [budget, setBudget] = useState(100)
  const [squadSize, setSquadSize] = useState(15)
  const [error, setError] = useState<string | null>(null)

  const hasFantasy = activities.includes('fantasy')
  const hasTorneo = activities.includes('torneo')
  const needsTournamentType = hasTorneo || hasFantasy

  function toggleActivity(a: Activity) {
    setActivities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('El nombre es obligatorio'); return }
    if (activities.length === 0) { setError('Elige al menos una actividad'); return }
    setError(null)
    try {
      const league = await mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        mode: activitiesToMode(activities),
        max_members: maxMembers,
        entry_fee: entryFee,
        budget,
        squad_size: squadSize,
        tournament_type: needsTournamentType ? tournamentType : undefined,
      })
      router.push(`/ligas/${league.id}`)
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/ligas" className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Crear Liga</h1>
          <p className="text-muted-foreground text-sm">Configura tu nueva competición privada</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Info básica */}
        <Card>
          <CardHeader><CardTitle>Información básica</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre de la liga *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Champions de Casa · FC 26" />
            </div>
            <div className="space-y-2">
              <Label>Descripción (opcional)</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Liga privada para amigos y familia…" rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* Actividades */}
        <Card>
          <CardHeader>
            <CardTitle>¿Qué se juega en esta liga?</CardTitle>
            <CardDescription>Elige una o más actividades. Puedes combinarlas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ACTIVITIES.map(a => {
              const active = activities.includes(a.id)
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleActivity(a.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                    active ? 'border-primary bg-primary/8' : 'border-border hover:border-border/80 bg-muted/20'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${active ? 'bg-primary border-primary' : 'border-muted-foreground/40'}`}>
                    {active && <span className="text-black text-xs font-black">✓</span>}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{a.icon} {a.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.desc}</div>
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Tipo de torneo (si aplica) */}
        {needsTournamentType && (
          <Card>
            <CardHeader>
              <CardTitle>Tipo de torneo</CardTitle>
              <CardDescription>Los equipos, jugadores y datos se cargarán según tu selección.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {GAME_TYPES.map(gt => (
                  <button
                    key={gt.id}
                    type="button"
                    onClick={() => setTournamentType(gt.id)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      tournamentType === gt.id ? 'border-primary bg-primary/10' : 'border-border bg-muted/20 hover:border-border/80'
                    }`}
                  >
                    <div className="text-2xl mb-1">{gt.emoji}</div>
                    <div className="font-black text-sm">{gt.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{gt.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
            <CardDescription>Ajusta los límites y reglas de tu liga.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Máx. participantes</Label>
                <Input type="number" value={maxMembers} onChange={e => setMaxMembers(+e.target.value)} min={2} max={100} />
              </div>
              <div className="space-y-2">
                <Label>Cuota de entrada ($)</Label>
                <Input type="number" value={entryFee} onChange={e => setEntryFee(+e.target.value)} min={0} step={1} />
              </div>
            </div>
            {hasFantasy && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Presupuesto Fantasy (£m)</Label>
                  <Input type="number" value={budget} onChange={e => setBudget(+e.target.value)} min={50} max={200} />
                </div>
                <div className="space-y-2">
                  <Label>Jugadores en plantilla</Label>
                  <Input type="number" value={squadSize} onChange={e => setSquadSize(+e.target.value)} min={11} max={25} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">⚠️ {error}</p>}

        <div className="flex gap-3 justify-end">
          <Link href="/ligas" className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancelar
          </Link>
          <Button type="submit" disabled={isPending || activities.length === 0}>
            {isPending ? 'Creando…' : 'Crear liga →'}
          </Button>
        </div>
      </form>
    </div>
  )
}
