import type { ServiceRequest } from "@/types"

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

interface Props {
  data: ServiceRequest[]
}

export default function RecentRequests({ data }: Props) {
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
                <th key={h} className="text-left text-[11px] text-gray-400 font-medium pb-2 pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 last:border-0">
                <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                  {new Date(row.createdAt).toLocaleString()}
                </td>
                <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">{row.serviceType || "—"}</td>
                <td className={`py-3 pr-4 ${PRIORITY_STYLE[row.priority] ?? "text-gray-600"}`}>
                  {row.priority}
                </td>
                <td className="py-3 pr-4">
                  <span className={STATUS_STYLE[row.status] ?? "text-gray-600"}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[12px] text-gray-400">
                  No recent requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
