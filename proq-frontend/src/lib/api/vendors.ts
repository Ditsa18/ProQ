import { apiFetch } from './client'

export type Vendor = {
  id: string
  name: string
  location: string | null
  phone: string | null
  rating: string | null
  tags: string[]
  createdAt: string
}

export const listVendors = (search?: string) => {
  const qs = search ? `?search=${encodeURIComponent(search)}` : ''
  return apiFetch<Vendor[]>(`/api/vendors${qs}`)
}
