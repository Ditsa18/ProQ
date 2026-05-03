"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

// ── TYPES ────────────────────────────────────────────────────────────────────

type Stage = "analyzing" | "generating" | "awaiting" | "assigned"

interface BOQItem {
  sl: number
  description: string
  unit: string
  qty: number
  rate: number | null
}

// ── DUMMY DATA ────────────────────────────────────────────────────────────────
// TODO (backend team): replace with real data passed from the call page
// e.g. via router state, context, or a shared store.

const SUMMARY = {
  serviceType: "AC Repair",
  priority: "urgent",
  location: "—, Thane, Mumbai",
  budget: "2000 INR",
  specifications: "—",
}

const RFP_TEXT = `REQUEST FOR PROPOSAL (RFP)
Service: AC Repair & Maintenance
Location: Thane, Mumbai
Budget: ₹2,000
Priority: Urgent
Contact: (798) 099-1392

SCOPE OF WORK:
Inspection, diagnosis and repair of non-functional AC unit at the customer's premises.

BILL OF QUANTITY:
Sl | Item Description                    | Unit | Qty
1  | AC inspection & fault diagnosis     | LS   | 1
2  | Cooling coil cleaning               | Nos  | 1
3  | Gas pressure check & top-up if needed | Nos | 1
4  | Filter cleaning & servicing         | Nos  | 1
5  | Condensate tray cleaning            | Nos  | 1
6  | Electrical connection check         | LS   | 1
7  | Spare parts (if required)           | LS   | 1

Terms: Work to be completed within 24 hours of assignment.
Payment: Post-service verification.`

const BOQ_ITEMS: BOQItem[] = [
  { sl: 1, description: "AC inspection & fault diagnosis", unit: "LS", qty: 1, rate: null },
  { sl: 2, description: "Cooling coil cleaning", unit: "Nos", qty: 1, rate: null },
  { sl: 3, description: "Gas pressure check & top-up if needed", unit: "Nos", qty: 1, rate: null },
  { sl: 4, description: "Filter cleaning & servicing", unit: "Nos", qty: 1, rate: null },
  { sl: 5, description: "Condensate tray cleaning", unit: "Nos", qty: 1, rate: null },
  { sl: 6, description: "Electrical connection check", unit: "LS", qty: 1, rate: null },
  { sl: 7, description: "Spare parts (if required)", unit: "LS", qty: 1, rate: null },
]

const VENDORS = [
  {
    id: 1,
    name: "DoItPro General Services Vijay Nagar",
    location: "Vijay Nagar, Indore",
    phone: "+91-8312198819",
    rating: "5/5",
    tags: ["TV mounting", "home inspection", "picture hanging", "minor repairs", "handyman services"],
  },
  {
    id: 2,
    name: "BreezePro AC Services",
    location: "New Town, Kolkata",
    phone: "+91-8148018451",
    rating: "5/5",
    tags: ["window AC service", "AC installation", "AC thermostat repair", "AC maintenance", "AC duct cleaning"],
  },
  {
    id: 3,
    name: "MegaMachine Heavy Equipment Gurgaon",
    location: "Sector 29, Gurgaon",
    phone: "+91-8804335048",
    rating: "5/5",
    tags: ["crane rental", "concrete mixer", "dumper rental", "scaffolding rental", "excavator rental"],
  },
]

// ── STAGE CONFIG ─────────────────────────────────────────────────────────────

const STAGES: { key: Stage; label: string }[] = [
  { key: "analyzing", label: "Analyzing Requirements..." },
  { key: "generating", label: "Generating RFP..." },
  { key: "awaiting", label: "Awaiting Approval" },
  { key: "assigned", label: "Vendor Assignment" },
]

const STAGE_BADGE: Record<Stage, { label: string; className: string }> = {
  analyzing: { label: "Analyzing...", className: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  generating: { label: "Generating RFP...", className: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  awaiting: { label: "Awaiting Approval", className: "bg-amber-50 text-amber-600 border-amber-200" },
  assigned: { label: "Ready to Assign", className: "bg-green-50 text-green-600 border-green-200" },
}

// ── COMPONENT ────────────────────────────────────────────────────────────────

export default function SummaryPage() {
  const router = useRouter()

  const [stage, setStage] = useState<Stage>("analyzing")
  const [activeTab, setActiveTab] = useState<"rfp" | "boq">("rfp")
  const [boqRates, setBoqRates] = useState<(number | null)[]>(BOQ_ITEMS.map((i) => i.rate))
  const [boqSaved, setBoqSaved] = useState(false)
  const [toast, setToast] = useState("")
  const [selectedVendors, setSelectedVendors] = useState<number[]>([1, 2, 3])


  // Auto-progress: analyzing → generating after 3s
  useEffect(() => {
    if (stage !== "analyzing") return
    const t = setTimeout(() => setStage("generating"), 3000)
    return () => clearTimeout(t)
  }, [stage])

  // generating → awaiting after 3 more seconds, and show RFP tab
  useEffect(() => {
    if (stage !== "generating") return
    const t = setTimeout(() => {
      setStage("awaiting")
      setActiveTab("rfp")
    }, 3000)
    return () => clearTimeout(t)
  }, [stage])

  const stageIndex = STAGES.findIndex((s) => s.key === stage)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  const toggleVendor = (id: number) => {
    setSelectedVendors((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  const handleAssignVendors = () => {
    router.push("/history")
  }

  const handleApproveRFP = () => {
    setStage("assigned")
    showToast("RFP Approved!")
  }

  const handleSaveBOQ = () => {
    setBoqSaved(true)
    showToast("BOQ pricing saved")
  }

  const totalAmount = boqRates.reduce<number>((sum, r) => sum + (r ?? 0), 0)

  const rfpAvailable = stage === "awaiting" || stage === "assigned"
  const badge = STAGE_BADGE[stage]

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      {/* NAVBAR */}
      <Navbar isCallActive={false} />

      {/* STATUS BAR */}
      <div className="h-11 flex items-center gap-2.5 px-5 bg-white border-b border-gray-200 flex-shrink-0">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-[11px] font-bold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          LIVE CALL
        </span>
        <span className="text-[15px] font-bold text-gray-900 tabular-nums tracking-widest">
          02:18
        </span>
        <span className="text-gray-300">—</span>

        {/* Service type + priority chips — appear after analyzing */}
        {rfpAvailable && (
          <>
            <span className="flex items-center gap-1 text-[12px] text-gray-600">
              <span className="text-gray-400">△</span> {SUMMARY.serviceType}
            </span>
            <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[11px] font-semibold">
              {SUMMARY.priority}
            </span>
          </>
        )}

        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] font-medium ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Connected
        </span>
        <span className="px-2 py-1 bg-gray-50 text-gray-500 border border-gray-200 rounded-full text-[11px]">
          EN/HI
        </span>

        {/* Toast */}
        {toast && (
          <div className="ml-auto px-3 py-1 bg-gray-800 text-white text-[12px] rounded-full animate-fadeIn">
            {toast}
          </div>
        )}
      </div>

      {/* MAIN GRID */}
      <div className="flex-1 grid grid-cols-[1fr_420px] gap-3 p-3 overflow-hidden min-h-0">

        {/* ── LEFT: SERVICE REQUEST SUMMARY ── */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[15px]">📋</div>
            <div>
              <div className="text-[14px] font-semibold text-gray-900">Service Request Summary</div>
              <div className="text-[11px] text-gray-400">AI-extracted requirements</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Summary fields */}
            <div className="border-b border-gray-100">
              {[
                { label: "Service Type", value: rfpAvailable ? SUMMARY.serviceType : "—" },
                { label: "Priority", value: rfpAvailable ? SUMMARY.priority : "—" },
                { label: "Location", value: rfpAvailable ? SUMMARY.location : "—" },
                { label: "Budget", value: rfpAvailable ? SUMMARY.budget : "—" },
                { label: "Specifications", value: SUMMARY.specifications },
              ].map((f) => (
                <div key={f.label} className="px-5 py-3 border-b border-gray-50 last:border-0">
                  <div className="text-[11px] text-gray-400 font-medium mb-1">{f.label}</div>
                  <div className="text-[13px] text-gray-800">{f.value}</div>
                </div>
              ))}
            </div>

            {/* RFP / BOQ tabs — only after generating */}
            {rfpAvailable && (
              <div className="flex flex-col flex-1">
                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-5 pt-2">
                  {(["rfp", "boq"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 px-1 mr-6 text-[13px] font-medium border-b-2 transition-colors ${
                        activeTab === tab
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {tab === "rfp" ? "RFP Document" : "Bill of Quantity"}
                    </button>
                  ))}
                </div>

                {/* RFP Document tab */}
                {activeTab === "rfp" && (
                  <div className="mx-4 my-3 bg-gray-50 rounded-lg border border-gray-200 p-4 overflow-y-auto max-h-[260px]">
                    <pre className="text-[11px] text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {RFP_TEXT}
                    </pre>
                  </div>
                )}

                {/* Bill of Quantity tab */}
                {activeTab === "boq" && (
                  <div className="px-4 py-3 overflow-y-auto">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-[10px] text-gray-400 font-semibold pb-2 pr-2 w-8">SL NO</th>
                          <th className="text-left text-[10px] text-gray-400 font-semibold pb-2 pr-2">ITEM DESCRIPTION</th>
                          <th className="text-left text-[10px] text-gray-400 font-semibold pb-2 pr-2 w-12">UNIT</th>
                          <th className="text-left text-[10px] text-gray-400 font-semibold pb-2 pr-2 w-16">QUANTITY</th>
                          <th className="text-left text-[10px] text-gray-400 font-semibold pb-2 pr-2 w-28">RATE (₹)</th>
                          <th className="text-right text-[10px] text-gray-400 font-semibold pb-2 w-24">AMOUNT (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {BOQ_ITEMS.map((item, i) => {
                          const rate = boqRates[i]
                          const amount = rate !== null ? rate * item.qty : null
                          return (
                            <tr key={item.sl} className="border-b border-gray-50">
                              <td className="py-2.5 pr-2 text-gray-400">{item.sl}</td>
                              <td className="py-2.5 pr-2 text-gray-800">{item.description}</td>
                              <td className="py-2.5 pr-2 text-gray-500">{item.unit}</td>
                              <td className="py-2.5 pr-2 text-gray-700 text-center">{item.qty}</td>
                              <td className="py-2.5 pr-2">
                                <input
                                  type="number"
                                  placeholder="Enter rate"
                                  value={rate ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value === "" ? null : Number(e.target.value)
                                    setBoqRates((prev) => {
                                      const updated = [...prev]
                                      updated[i] = val
                                      return updated
                                    })
                                    setBoqSaved(false)
                                  }}
                                  className={`w-full px-2.5 py-1 text-[12px] border rounded-md outline-none transition ${
                                    rate !== null
                                      ? "border-blue-300 bg-white text-gray-900 font-medium"
                                      : "border-gray-200 bg-gray-50 text-gray-400 placeholder:text-gray-300"
                                  } focus:border-blue-400 focus:ring-1 focus:ring-blue-100`}
                                />
                              </td>
                              <td className="py-2.5 text-right">
                                {amount !== null ? (
                                  <span className="text-blue-600 font-semibold">
                                    ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                  </span>
                                ) : (
                                  <span className="text-gray-300">—</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>

                    {totalAmount > 0 && (
                      <div className="flex justify-end pt-3 pb-1 border-t border-gray-100 mt-2">
                        <span className="text-[13px] font-semibold text-gray-700">
                          Total: <span className="text-blue-600">₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </span>
                      </div>
                    )}

                    <button
                      onClick={handleSaveBOQ}
                      className={`mt-3 px-4 py-2 rounded-lg text-[12px] font-semibold transition ${
                        boqSaved
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {boqSaved ? "✓ Saved" : "Save BOQ Pricing"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom action buttons — only after RFP is generated */}
          {rfpAvailable && (
            <div className="flex gap-3 px-4 py-3 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={handleApproveRFP}
                disabled={stage === "assigned"}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition ${
                  stage === "assigned"
                    ? "bg-blue-200 text-blue-400 cursor-default"
                    : "bg-blue-700 hover:bg-blue-800 text-white"
                }`}
              >
                ✓ Approve RFP
              </button>
              <button
                disabled={stage === "assigned"}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold border transition ${
                  stage === "assigned"
                    ? "border-gray-200 text-gray-300 cursor-default"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                ✕ Reject &amp; Regenerate
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: VENDOR ASSIGNMENT ── */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[15px]">🤝</div>
              <div>
                <div className="text-[14px] font-semibold text-gray-900">Vendor Assignment</div>
                <div className="text-[11px] text-gray-400">Assign service providers based on AI matching</div>
              </div>
            </div>
            <span className={`text-[11px] font-medium px-3 py-1 rounded-full border ${badge.className}`}>
              {badge.label}
            </span>
          </div>

          {/* Stage pipeline */}
          <div className="px-5 py-4 flex-shrink-0">
            {STAGES.map((s, i) => {
              const done = i < stageIndex
              const active = i === stageIndex
              const pending = i > stageIndex
              const isLast = i === STAGES.length - 1

              return (
                <div key={s.key} className="flex items-start gap-3">
                  {/* Dot + line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-500 ${
                        done
                          ? "bg-green-500 border-green-500"
                          : active
                          ? "bg-cyan-400 border-cyan-400 animate-pulse"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {!isLast && (
                      <div
                        className={`w-0.5 h-7 mt-0.5 transition-all duration-700 ${
                          done ? "bg-green-400" : active ? "bg-cyan-200" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={`text-[13px] pb-1 transition-colors duration-300 ${
                      done
                        ? "text-green-600 font-medium"
                        : active
                        ? "text-cyan-600 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Vendor selection — only at assigned stage */}
          {stage === "assigned" && (
            <div className="flex-1 overflow-y-auto px-4 pb-3 flex flex-col gap-3">

              {/* AI note */}
              <p className="text-[11px] text-gray-500 leading-relaxed pt-1">
                No vendors specifically offering AC repair services were available in Thane, Mumbai. Closest matches were plumbing services in Mumbai that might overlap with some AC repair tasks.
              </p>

              {/* Section title + count + select all */}
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-cyan-600">Select &amp; Assign Vendors</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-gray-500">
                  <span className="font-semibold text-gray-800">{selectedVendors.length}</span> selected
                </span>
                <button
                  onClick={() => setSelectedVendors(VENDORS.map((v) => v.id))}
                  className="text-[11px] text-gray-500 border border-gray-200 rounded-md px-2.5 py-1 hover:bg-gray-50 transition"
                >
                  Select All Recommended
                </button>
              </div>

              {/* Vendor cards with checkboxes */}
              {VENDORS.map((v) => {
                const selected = selectedVendors.includes(v.id)
                return (
                  <div
                    key={v.id}
                    onClick={() => toggleVendor(v.id)}
                    className={`border rounded-xl p-4 cursor-pointer transition ${
                      selected
                        ? "border-blue-400 bg-blue-50/40"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition ${
                        selected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"
                      }`}>
                        {selected && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-gray-900">{v.name}</div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            📍 {v.location}
                          </span>
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            📞 {v.phone}
                          </span>
                        </div>
                        <div className="text-[11px] text-amber-500 font-medium mt-1">★ {v.rating}</div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {v.tags.map((tag) => (
                            <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Assign button */}
              <div className="flex justify-end pt-1 pb-2">
                <button
                  onClick={handleAssignVendors}
                  disabled={selectedVendors.length === 0}
                  className={`px-5 py-2.5 rounded-lg text-[13px] font-semibold transition ${
                    selectedVendors.length > 0
                      ? "bg-blue-700 hover:bg-blue-800 text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Assign Selected Vendors
                </button>
              </div>
            </div>
          )}

          {/* Spacer when no vendors yet */}
          {stage !== "assigned" && <div className="flex-1" />}

          {/* Bottom buttons */}
          <div className="flex gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={() => router.push("/call")}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[12px] text-gray-600 hover:bg-gray-50 transition font-medium"
            >
              ← Back to Call
            </button>
            <button
              onClick={() => router.push("/call")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-[12px] font-semibold transition"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              New Call
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM RIGHT: EN/HI Voice */}
      <div className="fixed bottom-4 right-4">
        <button className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-full px-3 py-1.5 text-[11px] text-gray-600 hover:bg-gray-50 transition">
          🎙 EN/HI Voice
        </button>
      </div>

    </div>
  )
}