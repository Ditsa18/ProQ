const BAR_COLORS = [
  "bg-blue-500",
  "bg-cyan-400",
  "bg-teal-400",
  "bg-blue-400",
  "bg-gray-300",
]

interface Props {
  data: Record<string, number>
}

export default function VendorWorkload({ data }: Props) {
  const entries = Object.entries(data)
  const max = Math.max(...entries.map(([, v]) => v), 1)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[14px] font-semibold text-gray-900">Vendor Workload</span>
        <span className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">Workload</span>
      </div>

      <div className="flex flex-col gap-3">
        {entries.length === 0 && (
          <p className="text-[12px] text-gray-400 text-center py-4">No data</p>
        )}
        {entries.map(([vendorId, count], i) => (
          <div key={vendorId} className="flex items-center gap-3">
            <span className="text-[12px] text-gray-600 w-36 shrink-0 truncate">{vendorId}</span>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="text-[12px] text-gray-700 font-semibold w-4 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
