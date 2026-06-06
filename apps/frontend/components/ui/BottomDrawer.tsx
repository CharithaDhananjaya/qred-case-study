'use client'

import { useState, useEffect } from 'react'

export function BottomDrawer({
  onClose,
  title,
  children,
}: {
  onClose: () => void
  title: React.ReactNode
  children: React.ReactNode
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // One rAF so the initial translate-y-full is painted before we flip to translate-y-0
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [visible])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 mx-auto z-50 bg-white rounded-t-2xl transition-transform duration-300 ease-out max-h-[85vh] flex flex-col w-full max-w-[430px] ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-qred-light-muted" />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-qred-light-muted shrink-0">
          <p className="font-semibold text-sm text-qred-dark">{title}</p>
          <button onClick={handleClose} className="text-sm text-qred-dark/60 font-medium">
            Close
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </>
  )
}
