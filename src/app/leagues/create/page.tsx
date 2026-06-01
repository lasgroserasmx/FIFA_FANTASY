'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateLeague } from '@/hooks/use-leagues'
import { createLeagueSchema, type CreateLeagueInput } from '@/lib/validations'

export default function CreateLeaguePage() {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateLeague()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateLeagueInput>({
    resolver: zodResolver(createLeagueSchema),
    defaultValues: { mode: 'both', max_members: 20, entry_fee: 0, budget: 100, squad_size: 15 },
  })

  const mode = watch('mode')

  async function onSubmit(data: CreateLeagueInput) {
    const league = await mutateAsync(data)
    router.push(`/leagues/${league.id}`)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/leagues" className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create League</h1>
          <p className="text-muted-foreground text-sm">Set up a new fantasy competition</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>League Name *</Label>
              <Input {...register('name')} placeholder="World Cup Warriors 2026" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register('description')} placeholder="Friends & family league for World Cup 2026..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Game Mode *</Label>
              <Select value={mode} onValueChange={(v) => setValue('mode', v as CreateLeagueInput['mode'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Fantasy + Predictions</SelectItem>
                  <SelectItem value="fantasy">Fantasy Only</SelectItem>
                  <SelectItem value="prediction">Predictions Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure league rules and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Members</Label>
                <Input type="number" {...register('max_members', { valueAsNumber: true })} min={2} max={100} />
                {errors.max_members && <p className="text-xs text-destructive">{errors.max_members.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Entry Fee ($)</Label>
                <Input type="number" {...register('entry_fee', { valueAsNumber: true })} min={0} step={0.01} />
                {errors.entry_fee && <p className="text-xs text-destructive">{errors.entry_fee.message}</p>}
              </div>
            </div>
            {(mode === 'fantasy' || mode === 'both') && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fantasy Budget (£m)</Label>
                  <Input type="number" {...register('budget', { valueAsNumber: true })} min={50} max={200} />
                  {errors.budget && <p className="text-xs text-destructive">{errors.budget.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Squad Size</Label>
                  <Input type="number" {...register('squad_size', { valueAsNumber: true })} min={11} max={25} />
                  {errors.squad_size && <p className="text-xs text-destructive">{errors.squad_size.message}</p>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <LinkButton href="/leagues" variant="outline">Cancel</LinkButton>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating…' : 'Create League'}
          </Button>
        </div>
      </form>
    </div>
  )
}
