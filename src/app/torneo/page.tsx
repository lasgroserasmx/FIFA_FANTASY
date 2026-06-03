import { AppLayout } from '@/components/layout/app-layout'
import Link from 'next/link'

export default function TorneoPage() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto py-16 space-y-8 text-center">
        <div className="text-6xl">🏆</div>
        <div>
          <h1 className="text-3xl font-black tracking-widest uppercase">Torneo</h1>
          <p className="text-muted-foreground mt-3 text-base">
            El módulo de Torneo forma parte de las ligas. Crea o únete a una liga con el modo Torneo activado para gestionar el bracket eliminatorio con tus amigos.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/ligas/crear"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            ⚔️ Crear liga con Torneo
          </Link>
          <Link
            href="/ligas"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-bold hover:bg-muted transition-colors"
          >
            Ver mis ligas
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
