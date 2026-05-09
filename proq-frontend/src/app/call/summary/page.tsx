"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Navbar from "@/components/Navbar"
import { getCall } from "@/lib/api/calls"
import { getVendorSuggestions, assignVendor } from "@/lib/api/vendors"
import { createRfp, updateRfp } from "@/lib/api/rfp"
import type { Call, Vendor, AnalysisData } from "@/types"

type Stage = "analyzing" | "generating" | "awaiting" | "assigned"

interface BOQItem {
  sl: number
  description: string
  unit: string
  qty: number
  rate: number | null
}

const DEFAULT_BOQ: BOQItem[] = [
  { sl: 1, description: "Service inspection & fault diagnosis", unit: "LS", qty: 1, rate: null },
  { sl: 2, description: "Primary service work", unit: "Nos", qty: 1, rate: null },
  { sl: 3, description: "Secondary service work", unit: "Nos", qty: 1, rate: null },
  { sl: 4, description: "Consumables & materials", unit: "LS", qty: 1, rate: null },
  { sl: 5, description: "Labour charges", unit: "LS", qty: 1, rate: null },
]

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

function buildRfpText(analysis: AnalysisData): string {
  return `REQUEST FOR PROPOSAL (RFP)
Service: ${analysis.serviceType || "N/A"}
Location: ${analysis.location || "N/A"}
Budget: ${analysis.budget || "N/A"}
Priority: ${analysis.priority || "Normal"}
Contact: ${analysis.contactInfo || "N/A"}

SCOPE OF WORK:
${analysis.specifications || "To be determined based on site inspection."}

SPECIAL REQUIREMENTS:
${analysis.specialRequirements || "None"}

Terms: Work to be completed within 24 hours of assignment.
Payment: Post-service verification.`
}

function SummaryContent() {
  const router = useRouter()
  const params = useSearchParams()
  const callId = params.get("callId")
  const requestId = params.get("requestId")

  const [stage, setStage] = useState<Stage>("analyzing")
  const [activeTab, setActiveTab] = useState<"rfp" | "boq">("rfp")
  const [call, setCall] = useState<Call | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([])
  const [rfpId, setRfpId] = useState<string | null>(null)
  const [boqItems, setBoqItems] = useState<BOQItem[]>(DEFAULT_BOQ)
  const [boqSaved, setBoqSaved] = useState(false)
  const [toast, setToast] = useState("")

  useEffect(() => {
    if (!callId) return
    getCall(callId).then((c) => {
      setCall(c)
      if (c.analysis) setAnalysis(c.analysis)
    }).catch(() => {})
  }, [callId])

  useEffect(() => {
    if (stage !== "analyzing") return
    const t = setTimeout(() => setStage("generating"), 3000)
    return () => clearTimeout(t)
  }, [stage])

  useEffect(() => {
    if (stage !== "generating") return
    const t = setTimeout(() => {
      setStage("awaiting")
      setActiveTab("rfp")
    }, 3000)
    return () => clearTimeout(t)
  }, [stage])

  useEffect(() => {
    if (!analysis?.serviceType) return
    getVendorSuggestions(analysis.serviceType).then((v) => {
      setVendors(v)
      setSelectedVendorIds(v.map((x) => x.id))
    }).catch(() => {})
  }, [analysis?.serviceType])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  const handleApproveRFP = async () => {
    if (!analysis) return
    try {
      const rfp = await createRfp({
        requestId: requestId ?? undefined,
        title: analysis.serviceType || "Service Request",
        serviceType: analysis.serviceType || "General",
        priority: analysis.priority?.toLowerCase().includes("urgent") ? "urgent" : "normal",
        description: analysis.specifications,
        scope: analysis.specialRequirements,
        specifications: analysis.specifications ? [analysis.specifications] : [],
      })
      setRfpId(rfp.id)
      await updateRfp(rfp.id, { rfpStatus: "Approved" })
      setStage("assigned")
      showToast("RFP Approved!")
    } catch {
      showToast("Failed to approve RFP")
    }
  }

  const handleAssignVendors = async () => {
    if (!requestId || selectedVendorIds.length === 0) {
      router.push("/history")
      return
    }
    try {
      await Promise.all(
        selectedVendorIds.map((vid) =>
          assignVendor(vid, { requestId, rfpId: rfpId ?? undefined })
        )
      )
    } catch {}
    router.push("/history")
  }

  const handleSaveBOQ = () => {
    setBoqSaved(true)
    showToast("BOQ pricing saved")
  }

  const toggleVendor = (id: string) => {
    setSelectedVendorIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  const totalAmount = boqItems.reduce<number>((sum, item) => sum + (item.rate ?? 0) * item.qty, 0)
  const rfpAvailable = stage === "awaiting" || stage === "assigned"
  const stageIndex = STAGES.findIndex((s) => s.key === stage)
  const badge = STAGE_BADGE[stage]
  const displayAnalysis = analysis ?? { serviceType: "—", priority: "—", location: "—", budget: "—", specifications: "—" }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      <Navbar isCallActive={false} />

      <div className="h-11 flex items-center gap-2.5 px-5 bg-white border-b border-gray-200 flex-shrink-0">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-[11px] font-bold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          LIVE CALL
        </span>

        {rfpAvailable && (
          <>
            <span className="flex items-center gap-1 text-[12px] text-gray-600">
              <span className="text-gray-400">△</span> {displayAnalysis.serviceType}
            </span>
            <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[11px] font-semibold">
              {displayAnalysis.priority}
            </span>
          </>
        )}

        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] font-medium ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Connected
        </span>

        {toast && (
          <div className="ml-auto px-3 py-1 bg-gray-800 text-white text-[12px] rounded-full">
            {toast}
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-[1fr_420px] gap-3 p-3 overflow-hidden min-h-0">

        {/* LEFT: Service Request Summary */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">

          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[15px]">📋</div>
            <div>
              <div className="text-[14px] font-semibold text-gray-900">Service Request Summary</div>
              <div className="text-[11px] text-gray-400">AI-extracted requirements</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="border-b border-gray-100">
              {[
                { label: "Service Type", value: rfpAvailable ? displayAnalysis.serviceType : "—" },
                { label: "Priority", value: rfpAvailable ? displayAnalysis.priority : "—" },
                { label: "Location", value: rfpAvailable ? (displayAnalysis.location || "—") : "—" },
                { label: "Budget", value: rfpAvailable ? (displayAnalysis.budget || "—") : "—" },
                { label: "Specifications", value: displayAnalysis.specifications || "—" },
              ].map((f) => (
                <div key={f.label} className="px-5 py-3 border-b border-gray-50 last:border-0">
                  <div className="text-[11px] text-gray-400 font-medium mb-1">{f.label}</div>
                  <div className="text-[13px] text-gray-800">{f.value}</div>
                </div>
              ))}
            </div>

            {rfpAvailable && (
              <div className="flex flex-col flex-1">
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

                {activeTab === "rfp" && (
                  <div className="mx-4 my-3 bg-gray-50 rounded-lg border border-gray-200 p-4 overflow-y-auto max-h-[260px]">
                    <pre className="text-[11px] text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {buildRfpText(displayAnalysis as AnalysisData)}
                    </pre>
                  </div>
                )}

                {activeTab === "boq" && (
                  <div className="px-4 py-3 overflow-y-auto">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-[10px] text-gray-400 font-semibold pb-2 pr-2 w-8">SL NO</th>
                          <th className="text-left text-[10px] text-gray-400 font-semibold pb-2 pr-2">ITEM DESCRIPTION</th>
                          <th className="text-left text-[10px] text-gray-400 font-semibold pb-2 pr-2 w-12">UNIT</th>
                          <th className="text-left text-[10px] text-gray-400 font-semibold pb-2 pr-2 w-16">QTY</th>
                          <th className="text-left text-[10px] text-gray-400 font-semibold pb-2 pr-2 w-28">RATE (₹)</th>
                          <th className="text-right text-[10px] text-gray-400 font-semibold pb-2 w-24">AMOUNT (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {boqItems.map((item, i) => {
                          const amount = item.rate !== null ? item.rate * item.qty : null
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
                                  value={item.rate ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value === "" ? null : Number(e.target.value)
                                    setBoqItems((prev) => {
                                      const updated = [...prev]
                                      updated[i] = { ...updated[i], rate: val }
                                      return updated
                                    })
                                    setBoqSaved(false)
                                  }}
                                  className={`w-full px-2.5 py-1 text-[12px] border rounded-md outline-none transition ${
                                    item.rate !== null
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

        {/* RIGHT: Vendor Assignment */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">

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

          <div className="px-5 py-4 flex-shrink-0">
            {STAGES.map((s, i) => {
              const done = i < stageIndex
              const active = i === stageIndex
              const isLast = i === STAGES.length - 1

              return (
                <div key={s.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-500 ${
                      done ? "bg-green-500 border-green-500" : active ? "bg-cyan-400 border-cyan-400 animate-pulse" : "bg-white border-gray-300"
                    }`} />
                    {!isLast && (
                      <div className={`w-0.5 h-7 mt-0.5 transition-all duration-700 ${
                        done ? "bg-green-400" : active ? "bg-cyan-200" : "bg-gray-200"
                      }`} />
                    )}
                  </div>
                  <div className={`text-[13px] pb-1 transition-colors duration-300 ${
                    done ? "text-green-600 font-medium" : active ? "text-cyan-600 font-medium" : "text-gray-400"
                  }`}>
                    {s.label}
                  </div>
                </div>
              )
            })}
          </div>

          {stage === "assigned" && (
            <div className="flex-1 overflow-y-auto px-4 pb-3 flex flex-col gap-3">

              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-cyan-600">Select &amp; Assign Vendors</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-gray-500">
                  <span className="font-semibold text-gray-800">{selectedVendorIds.length}</span> selected
                </span>
                <button
                  onClick={() => setSelectedVendorIds(vendors.map((v) => v.id))}
                  className="text-[11px] text-gray-500 border border-gray-200 rounded-md px-2.5 py-1 hover:bg-gray-50 transition"
                >
                  Select All
                </button>
              </div>

              {vendors.length === 0 && (
                <p className="text-[12px] text-gray-400 text-center py-4">No vendor suggestions found</p>
              )}

              {vendors.map((v) => {
                const selected = selectedVendorIds.includes(v.id)
                return (
                  <div
                    key={v.id}
                    onClick={() => toggleVendor(v.id)}
                    className={`border rounded-xl p-4 cursor-pointer transition ${
                      selected ? "border-blue-400 bg-blue-50/40" : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
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
                          <span className="text-[11px] text-gray-400">📍 {v.location}</span>
                          <span className="text-[11px] text-gray-400">📞 {v.phone}</span>
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

              <div className="flex justify-end pt-1 pb-2">
                <button
                  onClick={handleAssignVendors}
                  disabled={selectedVendorIds.length === 0}
                  className={`px-5 py-2.5 rounded-lg text-[13px] font-semibold transition ${
                    selectedVendorIds.length > 0
                      ? "bg-blue-700 hover:bg-blue-800 text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Assign Selected Vendors
                </button>
              </div>
            </div>
          )}

          {stage !== "assigned" && <div className="flex-1" />}

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

      <div className="fixed bottom-4 right-4">
        <button className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-full px-3 py-1.5 text-[11px] text-gray-600 hover:bg-gray-50 transition">
          🎙 EN/HI Voice
        </button>
      </div>

    </div>
  )
}

export default function SummaryPage() {
  return (
    <Suspense>
      <SummaryContent />
    </Suspense>
  )
}
