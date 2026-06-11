import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const API_URL = process.env.API_URL ?? 'http://localhost:4000'

export async function GET(request: Request) {
  const store   = await cookies()
  const session = store.get('session')

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page  = searchParams.get('page')  ?? '1'
  const limit = searchParams.get('limit') ?? '10'

  const res = await fetch(`${API_URL}/transactions?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${session.value}` },
    cache: 'no-store',
  })

  if (res.status === 401 || res.status === 403) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!res.ok) {
    return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
