import { cookies } from 'next/headers'

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies()
  return store.get('session')?.value
}
