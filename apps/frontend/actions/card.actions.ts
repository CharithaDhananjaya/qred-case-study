'use server'

import type { Card } from '@qred/shared'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

type ActionResult<T> = { ok: true; data: T } | { ok: false; message: string }

export async function activateCard(cardId: string): Promise<ActionResult<Card>> {
  const token = process.env.NEXT_PUBLIC_API_TOKEN
  try {
    const res = await fetch(`${API_URL}/cards/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
      body: JSON.stringify({ cardId }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { ok: false, message: (body as { error?: string }).error ?? `Request failed (${res.status})` }
    }

    const data: Card = await res.json()
    return { ok: true, data }
  } catch {
    return { ok: false, message: 'Could not reach the server. Please try again.' }
  }
}
