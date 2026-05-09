import { describe, it, expect, vi, beforeEach } from "vitest"
import { apiFetch, ApiError } from "../client"

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})

describe("apiFetch", () => {
  it("returns data on success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: "1" }, error: null }),
    })

    const result = await apiFetch<{ id: string }>("/api/test")
    expect(result).toEqual({ id: "1" })
    expect(mockFetch).toHaveBeenCalledWith("/api/test", expect.objectContaining({
      credentials: "include",
    }))
  })

  it("throws ApiError on non-ok response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ data: null, error: "Not found" }),
    })

    await expect(apiFetch("/api/missing")).rejects.toThrow(ApiError)
    await expect(apiFetch("/api/missing")).rejects.toMatchObject({ status: 404 })
  })

  it("throws ApiError on 401", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ data: null, error: "Unauthorized" }),
    })

    const err = await apiFetch("/api/protected").catch((e) => e) as ApiError
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(401)
  })

  it("throws when response contains error field even if ok", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: null, error: "Something failed" }),
    })

    await expect(apiFetch("/api/broken")).rejects.toThrow("Something failed")
  })

  it("sends JSON body correctly", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: "2" }, error: null }),
    })

    await apiFetch("/api/create", {
      method: "POST",
      body: JSON.stringify({ name: "test" }),
    })

    expect(mockFetch).toHaveBeenCalledWith("/api/create", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ name: "test" }),
    }))
  })
})
