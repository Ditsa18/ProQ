import { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: number | string
  subLabel: string
  icon: ReactNode
  valueColor?: string
  borderColor?: string
}

export default function StatCard({
  label,
  value,
  subLabel,
  icon,
  valueColor = "text-gray-900",
  borderColor = "border-t-blue-400",
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 border-t-2 ${borderColor} p-5 flex flex-col gap-3`}>
      <div className="flex items-start justify-between">
        <span className="text-[13px] text-gray-500 font-medium">{label}</span>
        <span className="text-gray-400 text-lg">{icon}</span>
      </div>
      <div>
        <div className={`text-[40px] font-bold leading-none ${valueColor}`}>{value}</div>
        <div className="text-[12px] text-gray-400 mt-1">{subLabel}</div>
      </div>
    </div>
  )
}