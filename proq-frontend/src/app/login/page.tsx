"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error: authError } = await authClient.signIn.email({ email, password })

    if (authError) {
      setError(authError.message ?? "Sign in failed")
      setLoading(false)
      return
    }

    router.push("/call")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e6e3dc]">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="flex flex-col items-center mb-6">

          <div className="w-16 h-16 bg-black rounded-full rounded-br-lg mb-4" />

          <h1 className="text-2xl font-semibold text-gray-900">ProQ</h1>

          <p className="text-gray-600 text-sm">
            AI-Powered Procurement &amp; Home Services
          </p>

        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800">Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Create Account
          </span>
        </p>

      </div>

    </div>
  )
}
