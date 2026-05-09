import { describe, it, expect, vi, beforeEach } from "vitest"
import { getRfps, getRfp, createRfp, addBOQ } from "../rfp"

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

function mockOk(data: unknown) {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ data, error: null }),
  })
}

beforeEach(() => mockFetch.mockReset())

const MOCK_RFP = {
  id: "rfp-1",
  rfpId: "RFP-001",
  requestId: null,
  priority: "normal",
  title: "Test RFP",
  serviceType: "AC Repair",
  description: "",
  scope: "",
  specifications: [],
  evaluationCriteria: [],
  rfpStatus: "Draft",
  vendorStatus: "Pending",
  boq: [],
  dateTime: null,
  createdAt: "2026-05-09T00:00:00Z",
  approvedAt: null,
}

describe("rfp API", () => {
  it("getRfps fetches /api/rfp", async () => {
    mockOk([MOCK_RFP])
    const result = await getRfps()
    expect(result).toEqual([MOCK_RFP])
    expect(mockFetch).toHaveBeenCalledWith("/api/rfp", expect.any(Object))
  })

  it("getRfps passes status filter", async () => {
    mockOk([])
    await getRfps({ status: "Approved" })
    expect(mockFetch).toHaveBeenCalledWith("/api/rfp?status=Approved", expect.any(Object))
  })

  it("getRfp fetches single RFP by id", async () => {
    mockOk(MOCK_RFP)
    const result = await getRfp("rfp-1")
    expect(result).toEqual(MOCK_RFP)
    expect(mockFetch).toHaveBeenCalledWith("/api/rfp/rfp-1", expect.any(Object))
  })

  it("createRfp posts to /api/rfp", async () => {
    mockOk(MOCK_RFP)
    const body = { title: "Test RFP", serviceType: "AC Repair", priority: "normal" }
    const result = await createRfp(body)
    expect(result).toEqual(MOCK_RFP)
    expect(mockFetch).toHaveBeenCalledWith("/api/rfp", expect.objectContaining({
      method: "POST",
      body: JSON.stringify(body),
    }))
  })

  it("addBOQ posts to /api/rfp/:id/boq", async () => {
    mockOk(MOCK_RFP)
    const boq = [{ slNo: 1, description: "test", unit: "LS", quantity: 1, rate: 100, amount: 100 }]
    await addBOQ("rfp-1", boq)
    expect(mockFetch).toHaveBeenCalledWith("/api/rfp/rfp-1/boq", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ boq }),
    }))
  })
})
