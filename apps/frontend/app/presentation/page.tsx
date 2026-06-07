'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PresentationPage() {
  const [loaded, setLoaded] = useState(false)

  return (
    <main className="min-h-screen bg-qred-dark flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <h1 className="text-qred-light text-xl font-light">
          Strategy &amp; Collaboration Proposal
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-5xl">
          <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: '56.25%' }}>
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-qred-dark/80">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-qred-light/30 border-t-qred-light rounded-full animate-spin" />
                  <span className="text-qred-light/60 text-xs">Loading presentation…</span>
                </div>
              </div>
            )}
            <iframe
              src="https://www.canva.com/design/DAHL18D4Gmw/0grPfTYL0CuKKs2bkkAB_A/view?embed"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              title="Strategy & Collaboration Proposal"
              onLoad={() => setLoaded(true)}
            />
          </div>

          <p className="text-center text-qred-light/50 text-md mt-4">
            Use ← → arrow keys or click on slides to switch slides
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-3 px-6 py-6 shrink-0">
        <Link
          href="/"
          className="px-6 py-3 rounded-full border border-qred-light/30 text-qred-light text-sm font-medium hover:border-qred-light/60 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-full bg-qred-light text-qred-dark text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  )
}
