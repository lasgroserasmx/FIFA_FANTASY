'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useJoinLeague } from '@/hooks/use-leagues'
import { joinLeagueSchema, type JoinLeagueInput } from '@/lib/validations'

export default function UnirseLigaPage() {
  const router = useRouter()
  const { mutateAsync, isPending } = useJoinLeague()

  const { register, handleSubmit, formState: { errors } } = useForm<JoinLeagueInput>({
    resolver: zodResolver(joinLeagueSchema),
  })

  async function onSubmit(data: JoinLeagueInput) {
    const liga = await mutateAsync(data.invite_code)
    router.push(`/ligas/${liga.id}`)
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/ligas" className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Unirme a una liga</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-2">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Introduce el código de invitación</CardTitle>
          <CardDescription>Pide el código de 8 caracteres al administrador de la liga</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Código de invitación</Label>
              <Input
                {...register('invite_code')}
                placeholder="ej. a1b2c3d4"
                className="text-center text-lg tracking-widest uppercase font-mono"
                maxLength={8}
              />
              {errors.invite_code && <p className="text-xs text-destructive">El código debe tener 8 caracteres</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Uniéndome…' : 'Unirme a la liga'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
