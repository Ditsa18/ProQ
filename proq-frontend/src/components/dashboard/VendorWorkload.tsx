"use client"

import { useEffect, useState } from "react"
import { getVendorWorkload } from "@/lib/api/dashboard"
import { listVendors, type Vendor } from "@/lib/api/vendors"

const BAR_COLORS = ["bg-blue-500", "bg-cyan-400", "bg-teal-400", "bg-blue-400", "bg-gray-300"]

type WorkloadItem = { name: string; count: number }

export default function VendorWorkload() {
  const [items, setItems] = useState<WorkloadItem[]>([])

  useEffect(() => {
    Promise.all([getVendorWorkload(), listVendors()])
      .then(([workload, vendors]) => {
        const vendorMap = new Map<string, string>(vendors.map((v: Vendor) => [v.id, v.name]))
        const rows = Object.entries(workload)
          .map(([id, count]) => ({ name: vendorMap.get(id) ?? id.slice(0, 8) + "…", count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
        setItems(rows)
      })
      .catch(console.error)
  }, [])

  const max = Math.max(...items.map((v) => v.count), 1)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[14px] font-semibold text-gray-900">Vendor Workload</span>
        <span className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">Workload</span>
      </div>
      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <p className="text-[12px] text-gray-400 text-center py-4">No data</p>
        )}
        {items.map((v, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[12px] text-gray-600 w-36 shrink-0 truncate">{v.name}</span>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${BAR_COLORS[i] ?? "bg-blue-400"}`}
                style={{ width: `${(v.count / max) * 100}%` }}
              />
            </div>
            <span className="text-[12px] text-gray-700 font-semibold w-4 text-right">{v.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
