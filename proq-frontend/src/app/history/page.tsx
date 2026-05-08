"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// ── TYPES ────────────────────────────────────────────────────────────────────

type RFPStatus = "Approved" | "Draft" | "Pending"
type VendorStatus = "Assigned" | "Pending" | "Draft"
type Priority = "urgent" | "normal" | "high" | "P2" | "P3" | "P4"

interface HistoryEntry {
  id: number
  time: string
  serviceType: string
  priority: Priority
  location: string
  rfpStatus: RFPStatus
  vendorStatus: VendorStatus
  assignedTo: string
}

// ── DUMMY DATA ────────────────────────────────────────────────────────────────
// TODO (backend team): replace with real API call e.g:
// const { data } = useSWR("/api/history", fetcher)

const HISTORY: HistoryEntry[] = [
  {
    id: 1,
    time: "16 Apr 11:33 pm",
    serviceType: "AC Repair",
    priority: "urgent",
    location: "—",
    rfpStatus: "Approved",
    vendorStatus: "Assigned",
    assignedTo: "BreezePro AC Services, MegaMachine Heavy Equipment Gurgaon, DoItPro General Services Vijay Nagar",
  },
  {
    id: 2,
    time: "16 Apr 11:16 pm",
    serviceType: "AC Repair",
    priority: "normal",
    location: "—",
    rfpStatus: "Approved",
    vendorStatus: "Assigned",
    assignedTo: "BreezePro AC Services, MegaMachine Heavy Equipment Gurgaon, DoItPro General Services Vijay Nagar",
  },
  {
    id: 3,
    time: "16 Apr 10:39 pm",
    serviceType: "Kitchen Deep Cleaning",
    priority: "high",
    location: "Koramangala",
    rfpStatus: "Draft",
    vendorStatus: "Pending",
    assignedTo: "—",
  },
  {
    id: 4,
    time: "16 Apr 04:42 pm",
    serviceType: "حادث سيارة",
    priority: "P2",
    location: "—",
    rfpStatus: "Approved",
    vendorStatus: "Assigned",
    assignedTo: "Sgt. Khalid Al-Suwaidi",
  },
  {
    id: 5,
    time: "16 Apr 04:41 pm",
    serviceType: "غير محدد",
    priority: "P4",
    location: "—",
    rfpStatus: "Draft",
    vendorStatus: "Pending",
    assignedTo: "—",
  },
  {
    id: 6,
    time: "16 Apr 04:30 pm",
    serviceType: "حادث تصادم سيارات",
    priority: "P3",
    location: "المنطقة المحيطة بدبي مول",
    rfpStatus: "Approved",
    vendorStatus: "Assigned",
    assignedTo: "Sgt. Khalid Al-Suwaidi",
  },
  {
    id: 7,
    time: "16 Apr 04:09 pm",
    serviceType: "حادث",
    priority: "P4",
    location: "—",
    rfpStatus: "Approved",
    vendorStatus: "Assigned",
    assignedTo: "Sgt. Khalid Al-Suwaidi",
  },
  {
    id: 8,
    time: "16 Apr 04:02 pm",
    serviceType: "—",
    priority: "P4",
    location: "—",
    rfpStatus: "Pending",
    vendorStatus: "Pending",
    assignedTo: "—",
  },
  {
    id: 9,
    time: "16 Apr 03:58 pm",
    serviceType: "—",
    priority: "P4",
    location: "—",
    rfpStatus: "Approved",
    vendorStatus: "Draft",
    assignedTo: "—",
  },
  {
    id: 10,
    time: "16 Apr 03:46 pm",
    serviceType: "غير محدد",
    priority: "P4",
    location: "—",
    rfpStatus: "Approved",
    vendorStatus: "Assigned",
    assignedTo: "Lt. Fatima Al-Hammadi",
  },
  {
    id: 11,
    time: "16 Apr 03:44 pm",
    serviceType: "—",
    priority: "P4",
    location: "—",
    rfpStatus: "Pending",
    vendorStatus: "Pending",
    assignedTo: "—",
  },
  {
    id: 12,
    time: "16 Apr 03:38 pm",
    serviceType: "غير محدد",
    priority: "P4",
    location: "—",
    rfpStatus: "Draft",
    vendorStatus: "Pending",
    assignedTo: "—",
  },
  {
    id: 13,
    time: "16 Apr 03:09 pm",
    serviceType: "غير محدد",
    priority: "P4",
    location: "—",
    rfpStatus: "Approved",
    vendorStatus: "Assigned",
    assignedTo: "Lt. Fatima Al-Hammadi",
  },
  {
    id: 14,
    time: "16 Apr 02:52 pm",
    serviceType: "حادثة السير",
    priority: "P4",
    location: "الشيخ زيد بجد المخرج 39",
    rfpStatus: "Approved",
    vendorStatus: "Assigned",
    assignedTo: "Lt. Fatima Al-Hammadi",
  },
  {
    id: 15,
    time: "16 Apr 02:41 pm",
    serviceType: "حادث سيارة",
    priority: "P3",
    location: "دبي مول",
    rfpStatus: "Approved",
    vendorStatus: "Assigned",
    assignedTo: "Sgt. Khalid Al-Suwaidi",
  },
]

const ITEMS_PER_PAGE = 15

// ── STYLE HELPERS ─────────────────────────────────────────────────────────────

const RFP_BADGE: Record<RFPStatus, string> = {
  Approved: "bg-slate-100 text-slate-700 border border-slate-200",
  Draft:    "bg-slate-100 text-slate-600 border border-slate-200",
  Pending:  "bg-amber-50 text-amber-700 border border-amber-100",
}

const VENDOR_BADGE: Record<VendorStatus, string> = {
  Assigned: "bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-medium",
  Pending:  "bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded",
  Draft:    "bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded",
}

const PRIORITY_STYLE: Record<Priority, string> = {
  urgent: "bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-medium",
  normal: "bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-medium",
  high:   "bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded text-[10px] font-medium",
  P2:     "bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-medium",
  P3:     "bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-medium",
  P4:     "bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-medium",
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("All Priorities")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [page, setPage] = useState(1)
  const [filtered, setFiltered] = useState<HistoryEntry[]>(HISTORY)

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleSearch = () => {
    // TODO (backend team): replace with real API search/filter call
    let results = HISTORY
    if (search.trim()) {
      const q = search.toLowerCase()
      results = results.filter(
        (r) =>
          r.serviceType.toLowerCase().includes(q) ||
          r.assignedTo.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      )
    }
    if (priorityFilter !== "All Priorities") {
      results = results.filter((r) => r.priority === priorityFilter.toLowerCase())
    }
    if (statusFilter !== "All Statuses") {
      results = results.filter((r) => r.rfpStatus === statusFilter || r.vendorStatus === statusFilter)
    }
    setFiltered(results)
    setPage(1)
  }

  const handleClear = () => {
    setSearch("")
    setPriorityFilter("All Priorities")
    setStatusFilter("All Statuses")
    setDateFrom("")
    setDateTo("")
    setFiltered(HISTORY)
    setPage(1)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="flex-1 px-6 py-5">

        {/* ── FILTER BAR ── */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-blue-300 w-44"
          />

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-600 outline-none focus:border-blue-300 bg-white"
          >
            {["All Priorities", "urgent", "high", "normal", "P2", "P3", "P4"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-600 outline-none focus:border-blue-300 bg-white"
          >
            {["All Statuses", "Approved", "Draft", "Pending", "Assigned"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <div className="relative">

  <Popover>

    <PopoverTrigger asChild>

      <Button
        variant="outline"
        className="w-[140px] justify-start text-left font-normal border-gray-200 bg-white hover:bg-gray-50 text-[13px]"
      >

        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />

        {dateFrom || "From date"}

      </Button>

    </PopoverTrigger>

    <PopoverContent
      className="w-auto p-0 border border-gray-200"
      align="start"
    >

      <Calendar
        mode="single"
        selected={dateFrom ? new Date(dateFrom) : undefined}
        onSelect={(date) =>
          setDateFrom(
            date
              ? date.toISOString().split("T")[0]
              : ""
          )
        }
      />

    </PopoverContent>

  </Popover>

</div>

<div className="relative">

  <Popover>

    <PopoverTrigger asChild>

      <Button
        variant="outline"
        className="w-[140px] justify-start text-left font-normal border-gray-200 bg-white hover:bg-gray-50 text-[13px]"
      >

        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />

        {dateTo || "To date"}

      </Button>

    </PopoverTrigger>

    <PopoverContent
      className="w-auto p-0 border border-gray-200"
      align="start"
    >

      <Calendar
        mode="single"
        selected={dateTo ? new Date(dateTo) : undefined}
        onSelect={(date) =>
          setDateTo(
            date
              ? date.toISOString().split("T")[0]
              : ""
          )
        }
      />

    </PopoverContent>

  </Popover>

</div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition"
          >
            Search
          </button>

          <button
            onClick={handleClear}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-[13px] hover:bg-gray-50 transition"
          >
            Clear
          </button>

        </div>

        {/* ── TABLE ── */}
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Time", "Service Type", "Priority", "Location", "RFP Status", "Vendor Status", "Assigned To", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left text-[12px] text-gray-500 font-medium pb-3 pr-4 last:text-right"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">

                <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{row.time}</td>

                <td className="py-3 pr-4 text-gray-800 font-medium whitespace-nowrap">{row.serviceType}</td>

                <td className="py-3 pr-4">
                  <span className={`text-[12px] ${PRIORITY_STYLE[row.priority]}`}>
                    {row.priority}
                  </span>
                </td>

                <td className="py-3 pr-4 text-gray-500 max-w-[140px] truncate">{row.location}</td>

                <td className="py-3 pr-4">
                  <span className={`text-[12px] px-2 py-0.5 rounded font-medium ${RFP_BADGE[row.rfpStatus]}`}>
                    {row.rfpStatus}
                  </span>
                </td>

                <td className="py-3 pr-4">
                  <span className={`text-[12px] ${VENDOR_BADGE[row.vendorStatus]}`}>
                    {row.vendorStatus}
                  </span>
                </td>

                <td className="py-3 pr-4 text-gray-600 max-w-[260px] leading-relaxed">
                  {row.assignedTo}
                </td>

                <td className="py-3 text-right">
                  <button
                    onClick={() => router.push(`/history/${row.id}`)}
                    className="text-[12px] text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-md px-2.5 py-1 hover:bg-blue-50 transition"
                  >
                    View
                  </button>
                </td>

              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[13px] text-gray-400">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-md text-[12px] font-medium transition ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  )
}