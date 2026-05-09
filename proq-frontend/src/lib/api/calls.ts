import { apiFetch } from "./client"
import type { Call, AnalysisData, Message } from "@/types"

export const createCall = (body: { requestId?: string; status?: string } = {}) =>
  apiFetch<Call>("/api/calls", { method: "POST", body: JSON.stringify(body) })

export const getCall = (id: string) =>
  apiFetch<Call>(`/api/calls/${id}`)

export const addCallAnalysis = (
  id: string,
  body: { analysis: AnalysisData; transcript?: Message[]; status?: string }
) =>
  apiFetch<Call>(`/api/calls/${id}/analysis`, {
    method: "POST",
    body: JSON.stringify(body),
  })
