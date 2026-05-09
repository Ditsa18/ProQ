import { apiFetch } from './client'

export type DashboardStats = {
  totalRequests: number
  urgentRequests: number
  pendingApproval: number
  vendorAssigned: number
}

export type ActivityBucket = { hour: string; count: number }

export type RecentRequest = {
  id: string
  requestId: string
  serviceType: string
  priority: string
  status: string
  location: string | null
  createdAt: string
}

export const getStats = () => apiFetch<DashboardStats>('/api/dashboard/stats')
export const getActivity = () => apiFetch<ActivityBucket[]>('/api/dashboard/activity')
export const getPriorityDistribution = () => apiFetch<Record<string, number>>('/api/dashboard/priority-distribution')
export const getVendorWorkload = () => apiFetch<Record<string, number>>('/api/dashboard/vendor-workload')
export const getRecentRequests = () => apiFetch<RecentRequest[]>('/api/dashboard/recent-requests')
