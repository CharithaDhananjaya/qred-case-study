'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

function HamburgerIcon() {
  return (
    <div className="flex flex-col gap-[5px] p-1">
      <div className="w-5 h-0.5 bg-qred-dark rounded-full" />
      <div className="w-5 h-0.5 bg-qred-dark rounded-full" />
      <div className="w-3.5 h-0.5 bg-qred-dark rounded-full" />
    </div>
  )
}

export function Header() {
  const router    = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center justify-between py-3 relative" ref={ref}>
      <Image
        src="/qred-logo.png"
        alt="Qred"
        width={40}
        height={40}
        className="rounded-lg"
      />

      <div className="relative">
        <button onClick={() => setMenuOpen((o) => !o)} className="cursor-pointer">
          <HamburgerIcon />
        </button>

        {menuOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-qred-light rounded-2xl shadow-lg z-30 min-w-[220px] overflow-hidden">
            <a
              href="https://my.qred.se/login"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-qred-dark hover:bg-qred-light transition-colors"
            >
              Login to business loan
            </a>
            <a
              href="https://sparkonto.qred.se/authentication/auth"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-qred-dark hover:bg-qred-light transition-colors border-t border-qred-light"
            >
              Login to savings account
            </a>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-qred-light"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
