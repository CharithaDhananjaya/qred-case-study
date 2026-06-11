'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError((body as { error?: string }).error ?? 'Invalid credentials')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-qred-dark flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[360px]">
        <div className="flex justify-center mb-10">
          <Image src="/qred-logo.png" alt="Qred" width={80} height={32} priority />
        </div>

        <h1 className="text-qred-light text-2xl font-bold mb-1 text-center">Welcome back</h1>
        <p className="text-qred-light/50 text-sm text-center mb-8">Sign in to your Qred account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-xs font-semibold text-qred-light/60 uppercase tracking-wider">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full rounded-xl bg-white/10 border border-white/10 text-qred-light placeholder-qred-light/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-qred-light/30"
              placeholder="Enter your username"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-qred-light/60 uppercase tracking-wider">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-xl bg-white/10 border border-white/10 text-qred-light placeholder-qred-light/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-qred-light/30"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-qred-light text-qred-dark text-sm font-bold rounded-xl py-3.5 disabled:opacity-60 transition-opacity"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-qred-light/30 text-xs text-center mt-8">
          Demo credentials: <span className="text-qred-light/50 font-mono">demo / password</span>
        </p>
      </div>
    </div>
  )
}
