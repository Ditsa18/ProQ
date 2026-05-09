import { apiFetch } from './client'

export type BOQItem = {
  slNo: number
  description: string
  unit: string
  quantity: number
  rate: number | null
  amount: number | null
}

export type RfpDocument = {
  id: string
  rfpId: string
  requestId: string | null
  priority: string | null
  title: string
  serviceType: string | null
  description: string | null
  scope: string | null
  specifications: string[]
  evaluationCriteria: string[]
  rfpStatus: string
  vendorStatus: string
  boq: BOQItem[]
  dateTime: string | null
  createdAt: string
  approvedAt: string | null
}

export const listRfps = (status?: string) => {
  const qs = status && status !== 'All Statuses' ? `?status=${status}` : ''
  return apiFetch<RfpDocument[]>(`/api/rfp${qs}`)
}

export const updateRfp = (id: string, data: Partial<RfpDocument>) =>
  apiFetch<RfpDocument>(`/api/rfp/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const saveBoq = (id: string, boq: BOQItem[]) =>
  apiFetch<RfpDocument>(`/api/rfp/${id}/boq`, { method: 'POST', body: JSON.stringify({ boq }) })
