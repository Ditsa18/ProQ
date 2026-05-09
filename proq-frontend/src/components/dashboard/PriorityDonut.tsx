"use client"

import { useEffect, useState } from "react"
import { getPriorityDistribution } from "@/lib/api/dashboard"

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "#ef4444",
  high: "#f97316",
  normal: "#3b82f6",
  low: "#22c55e",
}

const CX = 110
const CY = 110
const OUTER_R = 90
const INNER_R = 55
const GAP_DEG = 2

type Slice = { label: string; value: number; color: string; start: number; end: number }

function toRad(deg: number) {
  return (deg - 90) * (Math.PI / 180)
}

function point(cx: number, cy: number, r: number, deg: number) {
  const rad = toRad(deg)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function slicePath(cx: number, cy: number, outerR: number, innerR: number, startDeg: number, endDeg: number) {
  const o1 = point(cx, cy, outerR, startDeg)
  const o2 = point(cx, cy, outerR, endDeg)
  const i2 = point(cx, cy, innerR, endDeg)
  const i1 = point(cx, cy, innerR, startDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i1.x} ${i1.y}`,
    "Z",
  ].join(" ")
}

export default function PriorityDonut() {
  const [distribution, setDistribution] = useState<{ label: string; value: number; color: string }[]>([])
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    getPriorityDistribution()
      .then((raw) => {
        const mapped = Object.entries(raw).map(([key, value]) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1),
          value,
          color: PRIORITY_COLORS[key] ?? "#94a3b8",
        }))
        setDistribution(mapped)
      })
      .catch(console.error)
    const t = setTimeout(() => setAnimated(true), 150)
    return () => clearTimeout(t)
  }, [])

  const total = distribution.reduce((s, d) => s + d.value, 0)

  let cursor = 0
  const slices: Slice[] = distribution.map((d) => {
    const sweep = total > 0 ? (d.value / total) * 360 : 0
    const start = cursor + GAP_DEG / 2
    const end = cursor + sweep - GAP_DEG / 2
    cursor += sweep
    return { ...d, start, end }
  })

  const SIZE = 220

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[14px] font-semibold text-gray-900">Priority Distribution</span>
        <span className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">Priority</span>
      </div>
      <div className="flex flex-col items-center">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{
            opacity: animated ? 1 : 0,
            transform: animated ? "scale(1) rotate(-5deg)" : "scale(0.7) rotate(-90deg)",
            transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.1, 0.64, 1)",
          }}
        >
          {slices.map((s, i) => (
            <path key={i} d={slicePath(CX, CY, OUTER_R, INNER_R, s.start, s.end)} fill={s.color} />
          ))}
        </svg>
        <div className="flex items-center gap-4 flex-wrap justify-center mt-1">
          {distribution.map((d) => (
            <div key={d.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
              <span className="text-[12px] text-gray-600">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
