import { apiFetch } from "./client"
import type { RfpDocument, BOQItem } from "@/types"

export interface CreateRfpBody {
  requestId?: string
  title: string
  serviceType: string
  priority: string
  description?: string
  scope?: string
  specifications?: string[]
  evaluationCriteria?: string[]
}

export const getRfps = (params?: { status?: string }) => {
  const qs = params?.status ? `?status=${params.status}` : ""
  return apiFetch<RfpDocument[]>(`/api/rfp${qs}`)
}

export const getRfp = (id: string) =>
  apiFetch<RfpDocument>(`/api/rfp/${id}`)

export const createRfp = (body: CreateRfpBody) =>
  apiFetch<RfpDocument>("/api/rfp", { method: "POST", body: JSON.stringify(body) })

export const updateRfp = (id: string, body: Partial<CreateRfpBody & { rfpStatus?: string }>) =>
  apiFetch<RfpDocument>(`/api/rfp/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })

export const getBOQ = (id: string) =>
  apiFetch<BOQItem[]>(`/api/rfp/${id}/boq`)

export const addBOQ = (id: string, boq: BOQItem[]) =>
  apiFetch<RfpDocument>(`/api/rfp/${id}/boq`, {
    method: "POST",
    body: JSON.stringify({ boq }),
  })
