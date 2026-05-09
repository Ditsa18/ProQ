import { apiFetch } from "./client"
import type { ServiceRequest } from "@/types"

export interface CreateServiceRequestBody {
  serviceType: string
  priority: string
  location: string
  budget: string
  contactInfo?: string
  specifications?: string[]
  specialRequirements?: string
  status?: string
}

export const getServiceRequests = (params?: { status?: string; priority?: string }) => {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : ""
  return apiFetch<ServiceRequest[]>(`/api/service-requests${qs}`)
}

export const createServiceRequest = (body: CreateServiceRequestBody) =>
  apiFetch<ServiceRequest>("/api/service-requests", {
    method: "POST",
    body: JSON.stringify(body),
  })

export const updateServiceRequest = (id: string, body: Partial<CreateServiceRequestBody>) =>
  apiFetch<ServiceRequest>(`/api/service-requests/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
