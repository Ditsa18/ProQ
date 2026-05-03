'use client'

import { useState, useEffect, useRef } from 'react'
import type { RFPDocument } from './page'

interface Props {
  doc: RFPDocument
  onClose: () => void
}

type Tab = 'rfp' | 'boq'

const RFP_STATUS_BADGE: Record<string, string> = {
  Approved: 'bg-green-100 text-green-700',
  Draft:    'bg-gray-100 text-gray-500',
}

export default function RFPModal({ doc, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('rfp')
  const overlayRef = useRef<HTMLDivElement>(null)

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const grandTotal = doc.boq.reduce((s, r) => s + (r.amount ?? 0), 0)

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

        {/* ── MODAL HEADER ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-[16px] font-bold text-gray-900">RFP {doc.rfpId}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors text-xl font-light"
          >
            ×
          </button>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── INFO CARD ── */}
          <div className="mx-6 mt-5 mb-4 bg-gray-50 rounded-xl p-5 grid grid-cols-2 gap-x-10 gap-y-4">
            <Field label="Request ID"   value={doc.requestId} mono />
            <Field label="Date & Time"  value={doc.dateTime} />
            <Field label="Service Type" value={doc.serviceType} />
            <div>
              <p className="text-[11px] text-gray-400 mb-1">Priority</p>
              <span className="text-[13px] font-semibold text-gray-800">{doc.priority}</span>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 mb-1">RFP Status</p>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${RFP_STATUS_BADGE[doc.rfpStatus] ?? 'bg-gray-100 text-gray-500'}`}>
                {doc.rfpStatus}
              </span>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 mb-1">Vendor Status</p>
              <p className="text-[13px] font-semibold text-gray-800">{doc.vendorStatus}</p>
            </div>
            {doc.vendor && (
              <div className="col-span-2">
                <p className="text-[11px] text-gray-400 mb-1">Assigned Vendor(s)</p>
                <p className="text-[13px] text-gray-800 leading-relaxed">{doc.vendor}</p>
              </div>
            )}
          </div>

          {/* ── TABS ── */}
          <div className="flex border-b border-gray-200 px-6 shrink-0">
            {(['rfp', 'boq'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  'pb-2.5 pt-1 mr-8 text-[13px] font-medium border-b-2 transition-colors',
                  tab === t
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600',
                ].join(' ')}
              >
                {t === 'rfp' ? 'RFP Document' : 'Bill of Quantity'}
              </button>
            ))}
          </div>

          {/* ── TAB CONTENT ── */}
          <div className="px-6 py-5">

            {/* ════════ RFP DOCUMENT TAB ════════ */}
            {tab === 'rfp' && (
              <div className="space-y-4 text-[13px] text-gray-700 leading-relaxed">

                <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                  <p><span className="font-semibold">RFP ID:</span> {doc.rfpId}</p>
                  <p><span className="font-semibold">Date:</span> {doc.dateTime}</p>
                  <p><span className="font-semibold">Service Category:</span> {doc.serviceType}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                  <p className="font-semibold">Project Overview:</p>
                  <p><span className="font-medium">Service Type:</span> {doc.serviceType}</p>
                  <p><span className="font-medium">Description:</span> {doc.description}</p>
                  {doc.scope && (
                    <p><span className="font-medium">Scope:</span> {doc.scope}</p>
                  )}
                </div>

                {doc.specifications.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold mb-2">Detailed Specifications &amp; Requirements:</p>
                    <ul className="space-y-0.5">
                      {doc.specifications.map((s, i) => (
                        <li key={i}>- {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {doc.evaluationCriteria.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-[13px] font-semibold text-blue-700 mb-2">Evaluation Criteria</p>
                    <ul className="space-y-1.5">
                      {doc.evaluationCriteria.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-gray-700">
                          <span className="text-gray-400 mt-0.5">›</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/*
                  TODO (backend team): populate doc.customerRecordingUrl and
                  doc.assistantRecordingUrl with real signed audio URLs from
                  your call recording storage (e.g. S3, GCS).
                */}
                <AudioSection
                  customerUrl={doc.customerRecordingUrl ?? undefined}
                  assistantUrl={doc.assistantRecordingUrl ?? undefined}
                />

              </div>
            )}

            {/* ════════ BILL OF QUANTITY TAB ════════ */}
            {tab === 'boq' && (
              <div className="space-y-4">

                {doc.vendor && (
                  <p className="text-[13px] text-gray-600 leading-relaxed">{doc.vendor}</p>
                )}

                {doc.boq.length > 0 ? (
                  <>
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2.5 pr-3 text-[11px] font-semibold text-gray-500 w-12">
                            SL<br />NO
                          </th>
                          <th className="text-left py-2.5 pr-3 text-[11px] font-semibold text-gray-500">
                            ITEM DESCRIPTION
                          </th>
                          <th className="text-left py-2.5 pr-3 text-[11px] font-semibold text-gray-500 w-16">
                            UNIT
                          </th>
                          <th className="text-right py-2.5 pr-3 text-[11px] font-semibold text-gray-500 w-20">
                            QUANTITY
                          </th>
                          <th className="text-right py-2.5 pr-3 text-[11px] font-semibold text-gray-500 w-24">
                            RATE (₹)
                          </th>
                          <th className="text-right py-2.5 text-[11px] font-semibold text-gray-500 w-28">
                            AMOUNT (₹)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {doc.boq.map((row) => (
                          <tr key={row.slNo} className="border-b border-gray-100">
                            <td className="py-3 pr-3 text-gray-500">{row.slNo}</td>
                            <td className="py-3 pr-3 text-gray-800">{row.description}</td>
                            <td className="py-3 pr-3 text-gray-600">{row.unit}</td>
                            <td className="py-3 pr-3 text-right text-gray-800">{row.quantity}</td>
                            <td className="py-3 pr-3 text-right text-gray-600">
                              {row.rate != null ? `₹${row.rate.toLocaleString()}` : '—'}
                            </td>
                            <td className="py-3 text-right font-medium text-blue-600">
                              {row.amount != null
                                ? `₹${row.amount.toLocaleString()}.00`
                                : <span className="text-blue-300">—</span>
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="flex justify-end items-center gap-8 pt-2 border-t border-gray-100">
                      <span className="text-[13px] font-semibold text-gray-700">Grand Total</span>
                      <span className="text-[14px] font-bold text-blue-600">
                        ₹{grandTotal.toLocaleString()}.00
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-[13px] text-gray-400 py-6 text-center">No BOQ items available</p>
                )}

                {doc.evaluationCriteria.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-[13px] font-semibold text-blue-700 mb-2">Evaluation Criteria</p>
                    <ul className="space-y-1.5">
                      {doc.evaluationCriteria.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-gray-700">
                          <span className="text-gray-400 mt-0.5">›</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/*
                  TODO (backend team): same audio URLs as RFP tab —
                  from doc.customerRecordingUrl / doc.assistantRecordingUrl.
                */}
                <AudioSection
                  customerUrl={doc.customerRecordingUrl ?? undefined}
                  assistantUrl={doc.assistantRecordingUrl ?? undefined}
                />

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

// ── SHARED AUDIO SECTION ──────────────────────────────────────────────────────

function AudioSection({
  customerUrl,
  assistantUrl,
}: {
  customerUrl?: string | null
  assistantUrl?: string | null
}) {
  return (
    <div className="space-y-3 pt-1">
      <AudioPlayer label="Customer Recording" src={customerUrl ?? ''} />
      <AudioPlayer label="Assistant Recording" src={assistantUrl ?? ''} />
    </div>
  )
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
      <p className={`text-[13px] font-medium text-gray-800 ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  )
}

function AudioPlayer({ label, src }: { label: string; src: string }) {
  return (
    <div>
      <p className="text-[12px] text-gray-500 mb-1.5">{label}:</p>
      {src ? (
        <audio
          controls
          src={src}
          className="w-full h-10 rounded-lg"
          style={{ accentColor: '#3b82f6' }}
        />
      ) : (
        /* Placeholder until backend provides real URL */
        <div className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center px-3 gap-3">
          <span className="text-gray-400 text-sm">▶</span>
          <span className="text-[11px] text-gray-400 tabular-nums">0:00 / --:--</span>
          <div className="flex-1 h-1 bg-gray-200 rounded-full" />
          <span className="text-gray-300 text-sm">🔊</span>
          <span className="text-gray-300 text-sm">⋮</span>
        </div>
      )}
    </div>
  )
}