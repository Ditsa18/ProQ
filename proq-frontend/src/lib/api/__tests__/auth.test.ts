import { describe, it, expect, vi, beforeEach } from "vitest"
import { ApiError } from "../client"

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

beforeEach(() => mockFetch.mockReset())

describe("auth via better-auth client", () => {
  it("ApiError carries status code", () => {
    const err = new ApiError(401, "Unauthorized")
    expect(err.status).toBe(401)
    expect(err.message).toBe("Unauthorized")
    expect(err).toBeInstanceOf(Error)
  })

  it("ApiError is distinguishable from generic Error", () => {
    const err = new ApiError(403, "Forbidden")
    expect(err.name).toBe("ApiError")
  })

  it("fetch with credentials=include sends cookies", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: "user-1" }, error: null }),
    })

    const { apiFetch } = await import("../client")
    await apiFetch("/api/auth/get-session")

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/get-session",
      expect.objectContaining({ credentials: "include" })
    )
  })
})
