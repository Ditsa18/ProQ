import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getStats,
  getActivity,
  getPriorityDistribution,
  getVendorWorkload,
  getRecentRequests,
} from "../dashboard"

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

function mockOk(data: unknown) {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ data, error: null }),
  })
}

beforeEach(() => mockFetch.mockReset())

describe("dashboard API", () => {
  it("getStats fetches /api/dashboard/stats", async () => {
    const stats = { totalRequests: 10, urgentRequests: 2, pendingApproval: 3, vendorAssigned: 4 }
    mockOk(stats)
    const result = await getStats()
    expect(result).toEqual(stats)
    expect(mockFetch).toHaveBeenCalledWith("/api/dashboard/stats", expect.any(Object))
  })

  it("getActivity fetches /api/dashboard/activity", async () => {
    const activity = [{ hour: "09:00", count: 5 }]
    mockOk(activity)
    const result = await getActivity()
    expect(result).toEqual(activity)
  })

  it("getPriorityDistribution fetches correct endpoint", async () => {
    mockOk({ urgent: 3, normal: 7 })
    const result = await getPriorityDistribution()
    expect(result).toEqual({ urgent: 3, normal: 7 })
  })

  it("getVendorWorkload fetches correct endpoint", async () => {
    mockOk({ vendor1: 5 })
    const result = await getVendorWorkload()
    expect(result).toEqual({ vendor1: 5 })
  })

  it("getRecentRequests fetches correct endpoint", async () => {
    const requests = [{ id: "abc", serviceType: "AC Repair" }]
    mockOk(requests)
    const result = await getRecentRequests()
    expect(result).toEqual(requests)
  })
})
