import { AppLayout } from '@/components/layout/app-layout'
import { TorneoLigaPage } from '@/components/torneo/torneo-liga-page'

interface Props {
  params: { ligaId: string }
}

export default function TorneoLigaRoute({ params }: Props) {
  return (
    <AppLayout>
      <TorneoLigaPage ligaId={params.ligaId} />
    </AppLayout>
  )
}
