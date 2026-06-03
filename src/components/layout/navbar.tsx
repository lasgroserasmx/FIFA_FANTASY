'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Trophy, LayoutDashboard, Users, Star, Target, Shield, Menu, X, LogOut, User, BookOpen, Swords } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/ligas', label: 'Ligas', icon: Users },
  { href: '/fantasy', label: 'Fantasy', icon: Star },
  { href: '/predicciones', label: 'Predicciones', icon: Target },
  { href: '/como-jugar', label: 'Cómo jugar', icon: BookOpen },
  { href: '/torneo', label: 'Torneo', icon: Swords },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Si el usuario está loggeado pero no tiene username, redirigir a completar perfil
  useEffect(() => {
    if (!mounted || !user || !profile) return
    if (!profile.username && pathname !== '/dashboard/perfil') {
      router.push('/dashboard/perfil')
    }
  }, [mounted, user, profile, pathname])

  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() ||
    profile?.username?.slice(0, 2).toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="hidden sm:block bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Fantasy
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Skeleton mientras carga para evitar mismatch de hidratación */}
            {!mounted ? (
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-9 w-9 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 p-1">
                  {/* Info del perfil */}
                  <div className="px-2 py-1.5 mb-1">
                    <p className="text-sm font-medium">{profile?.full_name || profile?.username || 'Usuario'}</p>
                    {profile?.username
                      ? <p className="text-xs text-muted-foreground">@{profile.username}</p>
                      : <p className="text-xs text-muted-foreground italic">Sin username — <Link href="/dashboard/perfil" className="underline">configurar</Link></p>
                    }
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/perfil')} className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" /> Mi perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/admin')} className="flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4" /> Panel admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/como-jugar')} className="flex items-center gap-2 cursor-pointer">
                    <BookOpen className="h-4 w-4" /> Cómo jugar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LinkButton href="/auth/login" size="sm">Iniciar sesión</LinkButton>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border/40 py-3 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
