"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { getHistory, searchHistory } from "@/lib/api/history"
import type { ServiceRequest } from "@/types"

const RFP_BADGE: Record<string, string> = {
  Approved: "bg-green-100 text-green-700",
  Draft:    "bg-blue-100 text-blue-600",
  Pending:  "bg-orange-100 text-orange-600",
}

const VENDOR_BADGE: Record<string, string> = {
  Assigned: "text-gray-700 font-medium",
  Pending:  "bg-orange-100 text-orange-600 px-2 py-0.5 rounded",
}

const PRIORITY_STYLE: Record<string, string> = {
  urgent: "text-red-600 font-semibold",
  normal: "text-gray-600",
  high:   "text-orange-500 font-semibold",
  low:    "text-green-600 font-semibold",
}

const ITEMS_PER_PAGE = 15

export default function HistoryPage() {
  const router = useRouter()

  const [all, setAll] = useState<ServiceRequest[]>([])
  const [filtered, setFiltered] = useState<ServiceRequest[]>([])
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("All Priorities")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then((data) => {
        setAll(data)
        setFiltered(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = async () => {
    const hasFilters =
      priorityFilter !== "All Priorities" ||
      statusFilter !== "All Statuses" ||
      dateFrom ||
      dateTo

    if (hasFilters) {
      const params: Record<string, string> = {}
      if (priorityFilter !== "All Priorities") params.priority = priorityFilter
      if (statusFilter !== "All Statuses") params.status = statusFilter
      if (dateFrom) params.from = dateFrom
      if (dateTo) params.to = dateTo

      try {
        const results = await searchHistory(params)
        let data = results
        if (search.trim()) {
          const q = search.toLowerCase()
          data = data.filter(
            (r) =>
              (r.serviceType ?? "").toLowerCase().includes(q) ||
              (r.location ?? "").toLowerCase().includes(q)
          )
        }
        setFiltered(data)
      } catch {
        setFiltered([])
      }
    } else {
      if (search.trim()) {
        const q = search.toLowerCase()
        setFiltered(
          all.filter(
            (r) =>
              (r.serviceType ?? "").toLowerCase().includes(q) ||
              (r.location ?? "").toLowerCase().includes(q)
          )
        )
      } else {
        setFiltered(all)
      }
    }

    setPage(1)
  }

  const handleClear = () => {
    setSearch("")
    setPriorityFilter("All Priorities")
    setStatusFilter("All Statuses")
    setDateFrom("")
    setDateTo("")
    setFiltered(all)
    setPage(1)
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="flex-1 px-6 py-5">

        <div className="flex items-center gap-2 mb-5 flex-wrap">

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-blue-300 w-44"
          />

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-600 outline-none focus:border-blue-300 bg-white"
          >
            {["All Priorities", "urgent", "high", "normal", "low"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-600 outline-none focus:border-blue-300 bg-white"
          >
            {["All Statuses", "Draft", "Assigned", "Pending"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-500 outline-none focus:border-blue-300"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-500 outline-none focus:border-blue-300"
          />

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition"
          >
            Search
          </button>

          <button
            onClick={handleClear}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-[13px] hover:bg-gray-50 transition"
          >
            Clear
          </button>

        </div>

        {loading ? (
          <p className="text-[13px] text-gray-400 py-12 text-center">Loading...</p>
        ) : (
          <>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Time", "Service Type", "Priority", "Location", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[12px] text-gray-500 font-medium pb-3 pr-4 last:text-right"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">

                    <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>

                    <td className="py-3 pr-4 text-gray-800 font-medium whitespace-nowrap">
                      {row.serviceType || "—"}
                    </td>

                    <td className="py-3 pr-4">
                      <span className={`text-[12px] ${PRIORITY_STYLE[row.priority] ?? "text-gray-600"}`}>
                        {row.priority}
                      </span>
                    </td>

                    <td className="py-3 pr-4 text-gray-500 max-w-[140px] truncate">
                      {row.location || "—"}
                    </td>

                    <td className="py-3 pr-4">
                      <span className={`text-[12px] px-2 py-0.5 rounded font-medium ${RFP_BADGE[row.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {row.status}
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <button
                        onClick={() => router.push(`/history/${row.requestId}`)}
                        className="text-[12px] text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-md px-2.5 py-1 hover:bg-blue-50 transition"
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[13px] text-gray-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-md text-[12px] font-medium transition ${
                      p === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}
