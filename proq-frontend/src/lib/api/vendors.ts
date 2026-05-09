import { apiFetch } from "./client"
import type { Vendor, VendorAssignment } from "@/types"

export const getVendors = (search?: string) => {
  const qs = search ? `?search=${encodeURIComponent(search)}` : ""
  return apiFetch<Vendor[]>(`/api/vendors${qs}`)
}

export const getVendorSuggestions = (serviceType: string) =>
  apiFetch<Vendor[]>(`/api/vendors/suggestions?serviceType=${encodeURIComponent(serviceType)}`)

export const assignVendor = (vendorId: string, body: { requestId: string; rfpId?: string }) =>
  apiFetch<VendorAssignment>(`/api/vendors/${vendorId}/assign`, {
    method: "POST",
    body: JSON.stringify(body),
  })
