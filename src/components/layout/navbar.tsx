'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Trophy, LayoutDashboard, Users, Star, Target, Shield, Menu, X, LogOut, User, BookOpen, Swords } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navLinks = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/ligas', label: 'Ligas', icon: Users },
  { href: '/fantasy', label: 'Fantasy', icon: Star },
  { href: '/predicciones', label: 'Predicciones', icon: Target },
  { href: '/como-jugar', label: 'Cómo jugar', icon: BookOpen },
  { href: '/torneo', label: 'Torneo FC', icon: Swords },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

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
              FIFA Fantasy
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-9 w-9 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 p-1">
                  <div className="px-2 py-1.5 mb-1">
                    <p className="text-sm font-medium">{profile?.full_name || profile?.username}</p>
                    <p className="text-xs text-muted-foreground">@{profile?.username}</p>
                  </div>
                  <Link href="/dashboard/perfil" className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted">
                    <User className="h-4 w-4" /> Mi perfil
                  </Link>
                  <Link href="/admin" className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted">
                    <Shield className="h-4 w-4" /> Panel admin
                  </Link>
                  <Link href="/como-jugar" className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted">
                    <BookOpen className="h-4 w-4" /> Cómo jugar
                  </Link>
                  <div className="border-t border-border mt-1 pt-1">
                    <button onClick={signOut} className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted w-full text-destructive">
                      <LogOut className="h-4 w-4" /> Cerrar sesión
                    </button>
                  </div>
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
