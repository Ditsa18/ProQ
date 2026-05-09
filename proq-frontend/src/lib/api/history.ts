import { apiFetch } from './client'

export type ServiceRequest = {
  id: string
  requestId: string
  priority: string
  status: string
  serviceType: string
  location: string | null
  budget: string | null
  contactInfo: string | null
  specifications: string[]
  specialRequirements: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export type SearchParams = {
  priority?: string
  status?: string
  from?: string
  to?: string
}

export const listHistory = () => apiFetch<ServiceRequest[]>('/api/history')

export const searchHistory = (params: SearchParams) => {
  const qs = new URLSearchParams()
  if (params.priority) qs.set('priority', params.priority)
  if (params.status) qs.set('status', params.status)
  if (params.from) qs.set('from', params.from)
  if (params.to) qs.set('to', params.to)
  const query = qs.toString()
  return apiFetch<ServiceRequest[]>(`/api/history/search${query ? `?${query}` : ''}`)
}
