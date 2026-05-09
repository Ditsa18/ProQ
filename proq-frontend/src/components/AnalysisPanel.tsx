"use client"

import { AnalysisData } from "@/types/analysis"
import { Bot, Loader2 } from "lucide-react"

interface AnalysisPanelProps {
  data: AnalysisData
  isActive?: boolean // true only when call is running
}

const FIELDS: { key: keyof AnalysisData; label: string }[] = [
  { key: "serviceType", label: "Service Type" },
  { key: "priority", label: "Priority" },
  { key: "location", label: "Location" },
  { key: "budget", label: "Budget Range" },
  { key: "contactInfo", label: "Contact Info" },
  { key: "specifications", label: "Specifications" },
  { key: "specialRequirements", label: "Special Requirements" },
]

function Skeleton({ width = "70%" }: { width?: string }) {
  return (
    <div
      className="h-2 rounded bg-gray-100 animate-pulse"
      style={{ width }}
    />
  )
}

export default function AnalysisPanel({ data, isActive = false }: AnalysisPanelProps) {
  const hasAnyData = Object.values(data).some((v) => !!v)

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-100 flex-shrink-0">
        
        <div className="flex items-center gap-2">

          <div className="w-7 h-7 bg-violet-50 rounded-md flex items-center justify-center">
            <Bot size={15} className="text-violet-600" />
          </div>

          <div>
            <div className="text-[13px] font-semibold text-gray-900">
              A2A AI Analysis
            </div>

            <div className="text-[10px] text-gray-400">
              Real-time requirement extraction
            </div>
          </div>

        </div>

        {isActive ? (
          <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 rounded-full px-2.5 py-1 text-[11px] font-medium">

            <Loader2 size={12} className="animate-spin" />

            Analyzing

          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 text-gray-400 rounded-full px-2.5 py-1 text-[11px] font-medium">
            Idle
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">

        {/* Empty state before call starts */}
        {!isActive && !hasAnyData ? (

          <div className="h-full flex flex-col items-center justify-center gap-3 px-6 text-center">

            <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center">
              <Bot size={24} className="text-violet-600" />
            </div>

            <p className="text-[12px] text-gray-400 leading-relaxed">
              AI analysis will begin automatically once the call starts.
            </p>

          </div>

        ) : (

          FIELDS.map((field, i) => {

            const value = data[field.key]

            return (
              <div
                key={field.key}
                className="px-4 py-2.5 border-b border-gray-50 flex flex-col gap-1.5"
              >

                <div className="text-[11px] text-gray-400 font-medium tracking-wide">
                  {field.label}
                </div>

                {value ? (

                  <div className="text-[13px] text-gray-900">
                    {value}
                  </div>

                ) : isActive ? (

                  <Skeleton width={`${55 + i * 7}%`} />

                ) : (

                  <span className="text-[12px] text-gray-300">—</span>

                )}

              </div>
            )
          })

        )}

      </div>
    </div>
  )
}