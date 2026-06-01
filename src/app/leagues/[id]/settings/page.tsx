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

type ScoringFields = {
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

const fantasyFields: { label: string; key: keyof ScoringFields }[] = [
  { label: 'Goal', key: 'scoring_goal' },
  { label: 'Assist', key: 'scoring_assist' },
  { label: 'Clean Sheet', key: 'scoring_clean_sheet' },
  { label: 'Save', key: 'scoring_save' },
  { label: 'Yellow Card', key: 'scoring_yellow_card' },
  { label: 'Red Card', key: 'scoring_red_card' },
  { label: 'Own Goal', key: 'scoring_own_goal' },
]

const predFields: { label: string; key: keyof ScoringFields }[] = [
  { label: 'Correct Outcome', key: 'pred_correct_outcome' },
  { label: 'Correct Goal Diff', key: 'pred_correct_diff' },
  { label: 'Exact Score', key: 'pred_exact_score' },
]

export default function LeagueSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: league } = useLeague(id)
  const { mutateAsync, isPending } = useUpdateLeague(id)

  const { register, handleSubmit, reset, watch, setValue } = useForm<ScoringFields>({
    defaultValues: {
      scoring_goal: 5,
      scoring_assist: 3,
      scoring_clean_sheet: 4,
      scoring_save: 1,
      scoring_yellow_card: -1,
      scoring_red_card: -3,
      scoring_own_goal: -2,
      pred_correct_outcome: 3,
      pred_correct_diff: 5,
      pred_exact_score: 10,
      predictions_locked: false,
    },
  })

  useEffect(() => {
    if (league) {
      reset({
        scoring_goal: league.scoring_goal,
        scoring_assist: league.scoring_assist,
        scoring_clean_sheet: league.scoring_clean_sheet,
        scoring_save: league.scoring_save,
        scoring_yellow_card: league.scoring_yellow_card,
        scoring_red_card: league.scoring_red_card,
        scoring_own_goal: league.scoring_own_goal,
        pred_correct_outcome: league.pred_correct_outcome,
        pred_correct_diff: league.pred_correct_diff,
        pred_exact_score: league.pred_exact_score,
        predictions_locked: league.predictions_locked,
      })
    }
  }, [league, reset])

  const predictionsLocked = watch('predictions_locked')

  async function onSubmit(data: ScoringFields) {
    await mutateAsync(data)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/leagues/${id}`} className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">League Settings</h1>
          <p className="text-muted-foreground text-sm">{league?.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Fantasy Scoring</CardTitle>
            <CardDescription>Points awarded for each action</CardDescription>
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
          <CardHeader><CardTitle>Prediction Scoring</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Controls</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Lock Predictions</p>
                <p className="text-xs text-muted-foreground">Prevent new predictions from being submitted</p>
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
            {isPending ? 'Saving…' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
