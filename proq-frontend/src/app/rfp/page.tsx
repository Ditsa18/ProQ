'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import RFPModal from './RFPModal'

export type RFPStatus = 'All Statuses' | 'Draft' | 'Approved' | 'Pending'

export type BOQItem = {
  slNo: number
  description: string
  unit: string
  quantity: number
  rate: number | null
  amount: number | null
}

export type RFPDocument = {
  id: string
  rfpId: string
  requestId: string
  priority: string
  title: string
  time: string
  rfpStatus: 'Draft' | 'Approved'
  vendorStatus: 'Assigned' | 'Pending'
  vendor: string
  serviceType: string
  dateTime: string
  description: string
  scope: string
  specifications: string[]
  evaluationCriteria: string[]
  customerRecordingUrl: string | null
  assistantRecordingUrl: string | null
  boq: BOQItem[]
}

const PRIORITY_BADGE: Record<string, string> = {
  urgent: 'bg-red-100 text-red-600',
  high:   'bg-orange-100 text-orange-600',
  normal: 'bg-purple-100 text-purple-600',
  low:    'bg-green-100 text-green-600',
  P1:     'bg-red-100 text-red-600',
  P2:     'bg-blue-100 text-blue-600',
  P3:     'bg-teal-100 text-teal-600',
  P4:     'bg-gray-100 text-gray-500',
}

const RFP_STATUS_BADGE: Record<string, string> = {
  Approved: 'bg-green-100 text-green-600',
  Draft:    'bg-gray-100 text-gray-500',
}

const VENDOR_STATUS_BADGE: Record<string, string> = {
  Assigned: 'bg-green-100 text-green-600',
  Pending:  'bg-orange-100 text-orange-500',
}

// ── Mock data — remove when wired to backend ──────────────────────────────────
const MOCK: RFPDocument[] = [
  {
    id: '1',
    rfpId: 'RFP-20260416-001',
    requestId: '20260416T180356Z',
    priority: 'urgent',
    title: 'AC Repair',
    time: '16 Apr 11:33 pm',
    rfpStatus: 'Approved',
    vendorStatus: 'Assigned',
    vendor: 'BreezePro AC Services, MegaMachine Heavy Equipment Gurgaon, DoItPro General Services Vijay Nagar',
    serviceType: 'AC Repair',
    dateTime: '16 Apr 11:33 pm',
    description: 'Request for urgent repair services for a non-functional AC unit in Thane, Mumbai. Technicians are required to inspect and diagnose the issue.',
    scope: 'Inspection, diagnosis, servicing, and repair of AC unit.',
    specifications: [
      'Inspection and fault diagnosis',
      'Cooling coil cleaning',
      'Gas pressure check',
      'Electrical connection check',
      'Condensate tray cleaning'
    ],
    evaluationCriteria: [
      'Experience in AC repair services',
      'Quick response timeline',
      'Availability of technicians'
    ],
    customerRecordingUrl: null,
    assistantRecordingUrl: null,
    boq: [
      { slNo:1, description:'AC inspection & diagnosis', unit:'LS', quantity:1, rate:1000, amount:1000 },
      { slNo:2, description:'Cooling coil cleaning', unit:'Nos', quantity:1, rate:500, amount:500 },
    ],
  },

  {
    id: '2',
    rfpId: 'RFP-20260416-002',
    requestId: '20260416T174627Z',
    priority: 'normal',
    title: 'Kitchen Deep Cleaning',
    time: '16 Apr 11:16 pm',
    rfpStatus: 'Approved',
    vendorStatus: 'Assigned',
    vendor: 'CleanPro Facility Services, Spark Maintenance Group, Urban Hygiene Solutions',
    serviceType: 'Kitchen Cleaning',
    dateTime: '16 Apr 11:16 pm',
    description: 'Commercial kitchen deep cleaning request for restaurant operations before inspection.',
    scope: 'Deep cleaning, degreasing, sanitization, and disposal management.',
    specifications: [
      'Floor scrubbing',
      'Exhaust cleaning',
      'Grease removal',
      'Surface sanitization',
      'Waste disposal'
    ],
    evaluationCriteria: [
      'Commercial cleaning experience',
      'Inspection compliance knowledge',
      'Fast completion'
    ],
    customerRecordingUrl: null,
    assistantRecordingUrl: null,
    boq: [
      { slNo:1, description:'Kitchen floor scrubbing', unit:'LS', quantity:1, rate:1200, amount:1200 },
      { slNo:2, description:'Grease removal service', unit:'Nos', quantity:1, rate:800, amount:800 },
    ],
  },

  {
    id: '3',
    rfpId: 'RFP-20260416-003',
    requestId: '20260416T162845Z',
    priority: 'high',
    title: 'Electrical Maintenance',
    time: '16 Apr 10:39 pm',
    rfpStatus: 'Draft',
    vendorStatus: 'Pending',
    vendor: 'VoltFix Electrical Services, SafeGrid Maintenance, Urban Utility Experts',
    serviceType: 'Electrical Maintenance',
    dateTime: '16 Apr 10:39 pm',
    description: 'Electrical inspection and maintenance request for office premises experiencing voltage fluctuations.',
    scope: 'Inspection, wiring checks, load balancing, and maintenance.',
    specifications: [
      'Circuit inspection',
      'Panel maintenance',
      'Load testing',
      'Safety compliance checks',
      'Power backup testing'
    ],
    evaluationCriteria: [
      'Certified technicians',
      'Commercial maintenance experience',
      'Emergency support availability'
    ],
    customerRecordingUrl: null,
    assistantRecordingUrl: null,
    boq: [
      { slNo:1, description:'Circuit inspection', unit:'LS', quantity:1, rate:900, amount:900 },
      { slNo:2, description:'Panel maintenance', unit:'Nos', quantity:1, rate:700, amount:700 },
    ],
  },

  {
    id: '4',
    rfpId: 'RFP-20260416-004',
    requestId: '20260416T111247Z',
    priority: 'P2',
    title: 'Vehicle Collision Report',
    time: '16 Apr 04:42 pm',
    rfpStatus: 'Approved',
    vendorStatus: 'Assigned',
    vendor: 'Rapid Response Inspection Services, Metro Auto Claims, SafeDrive Assessments',
    serviceType: 'Vehicle Inspection',
    dateTime: '16 Apr 04:42 pm',
    description: 'Vehicle collision assessment request for insurance and damage documentation.',
    scope: 'Damage inspection, reporting, and claim documentation.',
    specifications: [
      'Vehicle inspection',
      'Damage photography',
      'Insurance reporting',
      'Assessment documentation',
      'Claim support'
    ],
    evaluationCriteria: [
      'Automotive assessment expertise',
      'Insurance coordination experience',
      'Quick report turnaround'
    ],
    customerRecordingUrl: null,
    assistantRecordingUrl: null,
    boq: [
      { slNo:1, description:'Vehicle inspection', unit:'LS', quantity:1, rate:1500, amount:1500 },
      { slNo:2, description:'Damage documentation', unit:'Nos', quantity:1, rate:600, amount:600 },
    ],
  },
]

export default function RFPDocumentsPage() {
  const [docs, setDocs]           = useState<RFPDocument[]>([])
  const [statusFilter, setStatus] = useState<string>('All Statuses')
  const [selected, setSelected]   = useState<RFPDocument | null>(null)

  useEffect(() => {
    import('@/lib/api/rfp').then(({ getRfps }) =>
      getRfps()
        .then((data) => {
          const mapped: RFPDocument[] = data.map((d) => ({
            id: d.id,
            rfpId: d.rfpId,
            requestId: d.requestId ?? "",
            priority: d.priority,
            title: d.title,
            time: d.dateTime ? new Date(d.dateTime).toLocaleString() : new Date(d.createdAt).toLocaleString(),
            rfpStatus: (d.rfpStatus as 'Draft' | 'Approved') || 'Draft',
            vendorStatus: (d.vendorStatus as 'Assigned' | 'Pending') || 'Pending',
            vendor: "",
            serviceType: d.serviceType,
            dateTime: d.dateTime ?? d.createdAt,
            description: d.description,
            scope: d.scope,
            specifications: d.specifications,
            evaluationCriteria: d.evaluationCriteria,
            customerRecordingUrl: null,
            assistantRecordingUrl: null,
            boq: d.boq.map((b) => ({
              slNo: b.slNo,
              description: b.description,
              unit: b.unit,
              quantity: b.quantity,
              rate: b.rate,
              amount: b.amount,
            })),
          }))
          setDocs(mapped)
        })
        .catch(() => setDocs(MOCK))
    )
  }, [])

  const filtered = docs.filter(
    (d) => statusFilter === 'All Statuses' || d.rfpStatus === statusFilter
  )

  function exportCSV() {
    const headers = ['RFP ID','Request ID','Priority','Title','Time','RFP Status','Vendor Status','Vendor']
    const rows = filtered.map((d) => [
      d.rfpId, d.requestId, d.priority, d.title, d.time, d.rfpStatus, d.vendorStatus, d.vendor,
    ])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'rfp-documents.csv'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* toolbar */}
      <div className="flex items-center gap-3 px-6 py-4">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value)}
            className="text-[13px] pl-3 pr-8 py-1.5 border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 appearance-none cursor-pointer"
          >
            {['All Statuses','Approved','Draft'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">▼</span>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* grid */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((doc) => (
            <button
  key={doc.id}
  type="button"
  onClick={() => setSelected(doc)}
  className="text-left bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 min-h-[190px] flex flex-col justify-between"
>

  <div>

    {/* TOP ROW */}
    <div className="flex items-start justify-between gap-2">

      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap ${
          PRIORITY_BADGE[doc.priority] ?? "bg-gray-100 text-gray-500"
        }`}
      >
        {doc.priority}
      </span>

      <span className="text-[10px] text-gray-400 whitespace-nowrap">
        {doc.time}
      </span>

    </div>

    {/* REQUEST ID */}
    <p className="mt-3 text-[11px] font-mono font-semibold text-gray-500 truncate">
      {doc.requestId}
    </p>

    {/* TITLE */}
    <p
      className="mt-1 text-[14px] font-semibold text-gray-900 line-clamp-1"
      dir="auto"
    >
      {doc.title}
    </p>

    {/* VENDOR */}
    <p className="mt-3 text-[11px] text-gray-500 leading-relaxed line-clamp-2 min-h-[34px]">
      {doc.vendor || "Vendor assignment pending"}
    </p>

  </div>

  {/* BOTTOM BADGES */}
  <div className="flex items-center gap-2 pt-4">

    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
        RFP_STATUS_BADGE[doc.rfpStatus]
      }`}
    >
      {doc.rfpStatus}
    </span>

    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
        VENDOR_STATUS_BADGE[doc.vendorStatus]
      }`}
    >
      {doc.vendorStatus}
    </span>

  </div>

</button>
          ))}
        </div>
      </div>

      {/* modal */}
      {selected && (
        <RFPModal doc={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}