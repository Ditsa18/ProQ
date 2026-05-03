import { VENDOR_WORKLOAD } from "@/lib/dashboardData"

const MAX = Math.max(...VENDOR_WORKLOAD.map((v) => v.count))

// Alternate bar colors like in screenshot (teal/blue shades)
const BAR_COLORS = [
  "bg-blue-500",
  "bg-cyan-400",
  "bg-teal-400",
  "bg-blue-400",
  "bg-gray-300",
]

export default function VendorWorkload() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[14px] font-semibold text-gray-900">Vendor Workload</span>
        <span className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">Workload</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-3">
        {VENDOR_WORKLOAD.map((v, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[12px] text-gray-600 w-36 shrink-0 truncate">{v.name}</span>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${BAR_COLORS[i] ?? "bg-blue-400"}`}
                style={{ width: `${(v.count / MAX) * 100}%` }}
              />
            </div>
            <span className="text-[12px] text-gray-700 font-semibold w-4 text-right">
              {v.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}