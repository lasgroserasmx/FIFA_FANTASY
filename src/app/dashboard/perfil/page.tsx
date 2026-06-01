'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validations'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function PerfilPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      country: profile?.country || '',
      bio: profile?.bio || '',
    },
  })

  async function onSubmit(data: UpdateProfileInput) {
    if (!profile) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update(data).eq('id', profile.id)
    if (error) toast.error(error.message)
    else toast.success('¡Perfil actualizado correctamente!')
    setLoading(false)
  }

  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || profile?.username?.slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Mi Perfil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
          <CardDescription>Actualiza tus datos de perfil</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{profile?.full_name}</p>
              <p className="text-sm text-muted-foreground">@{profile?.username}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre completo</Label>
                <Input {...register('full_name')} placeholder="Juan Pérez" />
                {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Nombre de usuario</Label>
                <Input {...register('username')} placeholder="jperez10" />
                {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>País</Label>
              <Input {...register('country')} placeholder="España" />
            </div>

            <div className="space-y-2">
              <Label>Biografía</Label>
              <Textarea {...register('bio')} placeholder="Cuéntanos algo sobre ti…" rows={3} />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
