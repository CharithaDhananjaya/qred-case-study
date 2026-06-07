export default function PresentationPage() {
  return (
    <main className="min-h-screen bg-qred-dark flex flex-col">
      <div className="flex items-center px-6 py-4 shrink-0">
        <h1 className="text-qred-light text-sm font-semibold">
          Strategy &amp; Collaboration Proposal
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-5xl">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              src="https://www.canva.com/design/DAHL18D4Gmw/0grPfTYL0CuKKs2bkkAB_A/view?embed"
              className="absolute inset-0 w-full h-full rounded-xl border-0"
              allowFullScreen
              loading="lazy"
              title="Strategy & Collaboration Proposal"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
