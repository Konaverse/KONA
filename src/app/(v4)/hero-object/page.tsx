import type { Metadata } from 'next'
import HeroStage from '@/components/v4/HeroStage'
import '../home.css'

/**
 * Hero VARIANT A — the 3D object cut — parked here on 2026-08-18 when the
 * user asked to try the staircase wireframe (variant B, live on `/`)
 * without deleting this one. Compare live, side by side. Not linked from
 * anywhere; delete the folder when the A/B is decided.
 */
export const metadata: Metadata = {
  title: 'Hero A — the object',
  robots: { index: false, follow: false },
}

export default function HeroObjectPage() {
  return (
    <main className="hm">
      <HeroStage />
    </main>
  )
}
