'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'

type ServiceRequest = {
  id: string
  title: string
  priority: string
  status: 'Assigned' | 'Pending'
  vendor: string
  locationName: string
  lat: number
  lng: number
  time: string
}

const MapView = dynamic(() => import('./MapView'), { ssr: false })

const PRIORITY_BADGE: Record<string, string> = {
  urgent: 'bg-red-100 text-red-600',
  high:   'bg-orange-100 text-orange-600',
  normal: 'bg-purple-100 text-purple-600',
  low:    'bg-green-100 text-green-600',
  P2:     'bg-blue-100 text-blue-600',
  P3:     'bg-teal-100 text-teal-600',
  P4:     'bg-gray-100 text-gray-500',
}

const STATUS_BADGE: Record<string, string> = {
  Assigned: 'bg-green-100 text-green-600',
  Pending:  'bg-red-100 text-red-500',
}

export default function ServiceMapPage() {
  const [requests, setRequests]       = useState<ServiceRequest[]>([])
  const [selected, setSelected]       = useState<ServiceRequest | null>(null)
  const [priorityFilter, setPriority] = useState('')
  const [statusFilter, setStatus]     = useState('')

  const filtered = requests.filter((r) =>
    (!priorityFilter || r.priority === priorityFilter) &&
    (!statusFilter   || r.status   === statusFilter)
  )

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        {/* ── MAP ── */}
        <div className="flex-1">
          <MapView
            requests={filtered}
            setRequests={setRequests}
            selected={selected}
            setSelected={setSelected}
          />
        </div>

        {/* ── SIDEBAR ── */}
        <div className="w-[420px] bg-white border-l border-gray-200 flex flex-col shrink-0">

          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
              <span className="text-[13px] font-semibold text-gray-800">
                Active Service Requests
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5 ml-5">
              Click a request to view on map
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 px-4 py-2.5 border-b border-gray-100">
            <select
              value={priorityFilter}
              onChange={(e) => setPriority(e.target.value)}
              className="flex-1 text-[12px] px-2 py-1.5 border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">All Priorities</option>
              <option value="urgent">urgent</option>
              <option value="high">high</option>
              <option value="normal">normal</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
              <option value="P4">P4</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 text-[12px] px-2 py-1.5 border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">All Statuses</option>
              <option value="Assigned">Assigned</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filtered.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-10">
                No requests
              </p>
            )}

            {filtered.map((req) => {
              const isActive = selected?.id === req.id
              return (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => setSelected(req)}
                  className={[
                    'w-full text-left px-4 py-3 transition-colors duration-100',
                    'hover:bg-gray-50 focus:outline-none',
                    isActive
                      ? 'bg-blue-50 border-l-[3px] border-l-blue-500'
                      : 'border-l-[3px] border-l-transparent',
                  ].join(' ')}
                >
                  {/* Row 1: priority badge + title + time */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded ${PRIORITY_BADGE[req.priority] ?? 'bg-gray-100 text-gray-500'}`}>
                      {req.priority}
                    </span>
                    <span className="flex-1 text-[13px] font-semibold text-gray-900 truncate" dir="auto">
                      {req.title}
                    </span>
                    <span className="shrink-0 text-[11px] text-gray-400 ml-1">
                      {req.time}
                    </span>
                  </div>

                  {/* Row 2: status badge */}
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${STATUS_BADGE[req.status] ?? ''}`}>
                      {req.status}
                    </span>
                    {req.vendor && (
                      <span className="text-[11px] text-gray-500 truncate">
                        {req.vendor}{req.locationName ? `, ${req.locationName}` : ''}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}