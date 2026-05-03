"use client"

import { useEffect, useState } from "react"
import { ACTIVITY_DATA } from "@/lib/dashboardData"

const MAX_VAL = 7
const Y_LABELS = [7, 6, 5, 4, 3, 2, 1, 0]
const CHART_H = 200

export default function ActivityChart() {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-semibold text-gray-900">Activity — Last 24 Hours</span>
        <span className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">Activity</span>
      </div>

      <div className="flex gap-2">
        {/* Y-axis */}
        <div
          className="flex flex-col justify-between text-[11px] text-gray-400 shrink-0 select-none"
          style={{ height: CHART_H }}
        >
          {Y_LABELS.map((n) => (
            <span key={n} className="leading-none">{n}</span>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 flex flex-col">
          {/* Bar + grid area */}
          <div className="relative" style={{ height: CHART_H }}>
            {/* Grid lines */}
            {Y_LABELS.map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-gray-100"
                style={{ top: `${(i / (Y_LABELS.length - 1)) * 100}%` }}
              />
            ))}

            {/* Bars container */}
            <div className="absolute inset-0 flex items-end" style={{ gap: "3px" }}>
              {ACTIVITY_DATA.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-[3px]"
                  style={{
                    height: animated ? `${(d.value / MAX_VAL) * 100}%` : "0%",
                    backgroundColor: d.value > 0 ? "#7dd3e8" : "transparent",
                    transition: `height 0.5s cubic-bezier(0.34, 1.1, 0.64, 1)`,
                    transitionDelay: `${i * 0.02}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex mt-2" style={{ gap: "3px" }}>
            {ACTIVITY_DATA.map((d, i) => (
              <div
                key={i}
                className="flex-1 text-center text-[9px] text-gray-400 truncate leading-none"
              >
                {d.time}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}