'use client'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Lock, Unlock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useLeague, useUpdateLeague } from '@/hooks/use-leagues'
import { useEffect } from 'react'

type ConfigFields = {
  scoring_goal: number
  scoring_assist: number
  scoring_clean_sheet: number
  scoring_save: number
  scoring_yellow_card: number
  scoring_red_card: number
  scoring_own_goal: number
  pred_correct_outcome: number
  pred_correct_diff: number
  pred_exact_score: number
  predictions_locked: boolean
}

const fantasyFields: { label: string; key: keyof ConfigFields }[] = [
  { label: 'Gol marcado', key: 'scoring_goal' },
  { label: 'Asistencia', key: 'scoring_assist' },
  { label: 'Portería a cero', key: 'scoring_clean_sheet' },
  { label: 'Parada (portero)', key: 'scoring_save' },
  { label: 'Tarjeta amarilla', key: 'scoring_yellow_card' },
  { label: 'Tarjeta roja', key: 'scoring_red_card' },
  { label: 'Gol en propia', key: 'scoring_own_goal' },
]

const predFields: { label: string; key: keyof ConfigFields }[] = [
  { label: 'Resultado correcto', key: 'pred_correct_outcome' },
  { label: 'Diferencia de goles correcta', key: 'pred_correct_diff' },
  { label: 'Marcador exacto', key: 'pred_exact_score' },
]

export default function ConfiguracionLigaPage() {
  const { id } = useParams<{ id: string }>()
  const { data: liga } = useLeague(id)
  const { mutateAsync, isPending } = useUpdateLeague(id)

  const { register, handleSubmit, reset, watch, setValue } = useForm<ConfigFields>({
    defaultValues: {
      scoring_goal: 5, scoring_assist: 3, scoring_clean_sheet: 4,
      scoring_save: 1, scoring_yellow_card: -1, scoring_red_card: -3,
      scoring_own_goal: -2, pred_correct_outcome: 3, pred_correct_diff: 5,
      pred_exact_score: 10, predictions_locked: false,
    },
  })

  useEffect(() => {
    if (liga) reset({
      scoring_goal: liga.scoring_goal,
      scoring_assist: liga.scoring_assist,
      scoring_clean_sheet: liga.scoring_clean_sheet,
      scoring_save: liga.scoring_save,
      scoring_yellow_card: liga.scoring_yellow_card,
      scoring_red_card: liga.scoring_red_card,
      scoring_own_goal: liga.scoring_own_goal,
      pred_correct_outcome: liga.pred_correct_outcome,
      pred_correct_diff: liga.pred_correct_diff,
      pred_exact_score: liga.pred_exact_score,
      predictions_locked: liga.predictions_locked,
    })
  }, [liga, reset])

  const predictionsLocked = watch('predictions_locked')

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/ligas/${id}`} className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Configuración de liga</h1>
          <p className="text-muted-foreground text-sm">{liga?.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(data => mutateAsync(data))} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Puntuación Fantasy</CardTitle>
            <CardDescription>Puntos otorgados por cada acción de un jugador</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {fantasyFields.map(({ label, key }) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-sm">{label}</Label>
                <Input type="number" {...register(key, { valueAsNumber: true })} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Puntuación Quiniela</CardTitle>
            <CardDescription>Puntos por acertar predicciones</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {predFields.map(({ label, key }) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-sm">{label}</Label>
                <Input type="number" {...register(key, { valueAsNumber: true })} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Controles</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Bloquear predicciones</p>
                <p className="text-xs text-muted-foreground">Impide que los participantes envíen nuevas predicciones</p>
              </div>
              <div className="flex items-center gap-2">
                {predictionsLocked ? <Lock className="h-4 w-4 text-red-400" /> : <Unlock className="h-4 w-4 text-emerald-400" />}
                <Switch checked={predictionsLocked} onCheckedChange={(v) => setValue('predictions_locked', v)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Guardando…' : 'Guardar configuración'}
          </Button>
        </div>
      </form>
    </div>
  )
}
