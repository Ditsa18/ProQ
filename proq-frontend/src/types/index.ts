export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface AnalysisData {
  serviceType: string
  priority: string
  location: string
  budget: string
  contactInfo?: string
  specifications?: string
  specialRequirements?: string
}

export interface ServiceRequest {
  id: string
  requestId: string
  priority: string
  status: string
  serviceType: string
  location: string
  budget: string
  contactInfo: string
  specifications: string[]
  specialRequirements: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Call {
  id: string
  requestId: string | null
  startTime: string | null
  endTime: string | null
  duration: number | null
  transcript: Message[]
  analysis: AnalysisData | null
  customerRecordingUrl: string | null
  assistantRecordingUrl: string | null
  status: string
  createdAt: string
}

export interface BOQItem {
  slNo: number
  description: string
  unit: string
  quantity: number
  rate: number | null
  amount: number | null
}

export interface RfpDocument {
  id: string
  rfpId: string
  requestId: string | null
  priority: string
  title: string
  serviceType: string
  description: string
  scope: string
  specifications: string[]
  evaluationCriteria: string[]
  rfpStatus: string
  vendorStatus: string
  boq: BOQItem[]
  dateTime: string | null
  createdAt: string
  approvedAt: string | null
}

export interface Vendor {
  id: string
  name: string
  location: string
  phone: string
  rating: string
  tags: string[]
  createdAt: string
}

export interface VendorAssignment {
  id: string
  vendorId: string
  requestId: string
  rfpId: string | null
  createdAt: string
}

export interface DashboardStats {
  totalRequests: number
  urgentRequests: number
  pendingApproval: number
  vendorAssigned: number
}

export interface ActivityBucket {
  hour: string
  count: number
}

export type PriorityDistribution = Record<string, number>
export type VendorWorkload = Record<string, number>
