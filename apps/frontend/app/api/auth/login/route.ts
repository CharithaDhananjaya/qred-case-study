import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.username !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const validUsername = process.env.DEMO_USERNAME
  const validPassword = process.env.DEMO_PASSWORD
  const token         = process.env.API_TOKEN

  if (!validUsername || !validPassword || !token) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  if (body.username !== validUsername || body.password !== validPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const store = await cookies()
  store.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  return NextResponse.json({ ok: true })
}
