const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  const json = await res.json()
  if (!res.ok || json.error) throw new Error(json.error ?? 'Request failed')
  return json.data as T
}
