"use client"

import { useEffect, useState } from "react"
import { getRecentRequests, type RecentRequest } from "@/lib/api/dashboard"

const PRIORITY_STYLE: Record<string, string> = {
  urgent: "text-red-600 font-semibold",
  high: "text-orange-500 font-semibold",
  normal: "text-blue-500 font-semibold",
  low: "text-green-600 font-semibold",
}

const STATUS_STYLE: Record<string, string> = {
  Assigned: "text-gray-700 font-medium",
  Pending: "bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[11px] font-medium",
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true,
  })
}

export default function RecentRequests() {
  const [requests, setRequests] = useState<RecentRequest[]>([])

  useEffect(() => {
    getRecentRequests().then(setRequests).catch(console.error)
  }, [])

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-semibold text-gray-900">Recent Urgent Requests</span>
        <span className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">Recent</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Time", "Service Type", "Priority", "Status"].map((h) => (
                <th key={h} className="text-left text-[11px] text-gray-400 font-medium pb-2 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-[12px] text-gray-400">No urgent requests</td>
              </tr>
            )}
            {requests.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 last:border-0">
                <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{formatTime(row.createdAt)}</td>
                <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">{row.serviceType}</td>
                <td className={`py-3 pr-4 ${PRIORITY_STYLE[row.priority] ?? ""}`}>{row.priority}</td>
                <td className="py-3 pr-4">
                  <span className={STATUS_STYLE[row.status] ?? "text-gray-600"}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
