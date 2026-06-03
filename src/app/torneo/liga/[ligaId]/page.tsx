import { AppLayout } from '@/components/layout/app-layout'
import { TorneoLigaPage } from '@/components/torneo/torneo-liga-page'

interface Props {
  params: Promise<{ ligaId: string }>
}

export default async function TorneoLigaRoute({ params }: Props) {
  const { ligaId } = await params
  return (
    <AppLayout>
      <TorneoLigaPage ligaId={ligaId} />
    </AppLayout>
  )
}
