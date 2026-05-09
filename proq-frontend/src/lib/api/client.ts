import type { ApiResponse } from "@/types"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  })

  const json: ApiResponse<T> = await res.json()

  if (!res.ok || json.error) {
    throw new ApiError(res.status, json.error ?? `Request failed: ${res.status}`)
  }

  return json.data as T
}
