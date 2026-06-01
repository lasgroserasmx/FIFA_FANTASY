export const dynamic = 'force-dynamic'

import { AppLayout } from '@/components/layout/app-layout'

export default function PrediccionesLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}
