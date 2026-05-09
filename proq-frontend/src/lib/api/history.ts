import { apiFetch } from "./client"
import type { ServiceRequest, Call, RfpDocument } from "@/types"

export interface HistorySearchParams {
  priority?: string
  status?: string
  from?: string
  to?: string
}

export interface HistoryDetail {
  request: ServiceRequest
  calls: Call[]
  rfps: RfpDocument[]
}

export const getHistory = () =>
  apiFetch<ServiceRequest[]>("/api/history")

export const searchHistory = (params: HistorySearchParams) => {
  const qs = "?" + new URLSearchParams(params as Record<string, string>).toString()
  return apiFetch<ServiceRequest[]>(`/api/history/search${qs}`)
}

export const getHistoryDetail = (requestId: string) =>
  apiFetch<HistoryDetail>(`/api/history/${requestId}`)
