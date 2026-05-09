import { apiFetch } from "./client"
import type { DashboardStats, ActivityBucket, PriorityDistribution, VendorWorkload, ServiceRequest } from "@/types"

export const getStats = () =>
  apiFetch<DashboardStats>("/api/dashboard/stats")

export const getActivity = () =>
  apiFetch<ActivityBucket[]>("/api/dashboard/activity")

export const getPriorityDistribution = () =>
  apiFetch<PriorityDistribution>("/api/dashboard/priority-distribution")

export const getVendorWorkload = () =>
  apiFetch<VendorWorkload>("/api/dashboard/vendor-workload")

export const getRecentRequests = () =>
  apiFetch<ServiceRequest[]>("/api/dashboard/recent-requests")
