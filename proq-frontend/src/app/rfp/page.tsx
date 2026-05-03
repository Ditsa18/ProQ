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
    id: '1', rfpId: 'RFP-20260416-001', requestId: '20260416T180356Z',
    priority: 'urgent', title: 'AC Repair', time: '16 Apr 11:33 pm',
    rfpStatus: 'Approved', vendorStatus: 'Assigned',
    vendor: 'BreezePro AC Services, MegaMachine Heavy Equipment Gurgaon, DoItPro General Services Vijay Nagar',
    serviceType: 'AC Repair', dateTime: '16 Apr 11:33 pm',
    description: 'Request for urgent repair services for a non-functional AC unit in Thane, Mumbai. Technicians are required to inspect and diagnose the issue.',
    scope: 'The service includes inspection, diagnosis, and repair of the AC unit.',
    specifications: ['Inspection and fault diagnosis of the AC unit','Cleaning of cooling coil and filters','Gas pressure check and top-up if needed','Electrical connection check','Cleaning of condensate tray'],
    evaluationCriteria: ['Experience in AC repair services','Ability to respond quickly and meet urgent timelines'],
    customerRecordingUrl: null, assistantRecordingUrl: null,
    boq: [
      { slNo:1, description:'AC inspection & fault diagnosis', unit:'LS', quantity:1, rate:1000, amount:1000 },
      { slNo:2, description:'Cooling coil cleaning', unit:'Nos', quantity:1, rate:null, amount:null },
      { slNo:3, description:'Gas pressure check & top-up if needed', unit:'Nos', quantity:1, rate:null, amount:null },
      { slNo:4, description:'Filter cleaning & servicing', unit:'Nos', quantity:1, rate:null, amount:null },
      { slNo:5, description:'Condensate tray cleaning', unit:'Nos', quantity:1, rate:null, amount:null },
      { slNo:6, description:'Electrical connection check', unit:'LS', quantity:1, rate:null, amount:null },
      { slNo:7, description:'Spare parts (if required)', unit:'LS', quantity:1, rate:null, amount:null },
      { slNo:8, description:'Labour charges for repair', unit:'Hrs', quantity:2, rate:null, amount:null },
      { slNo:9, description:'Testing & commissioning', unit:'LS', quantity:1, rate:null, amount:null },
    ],
  },
  {
    id: '2', rfpId: 'RFP-20260416-002', requestId: '20260416T174627Z',
    priority: 'normal', title: 'AC Repair', time: '16 Apr 11:16 pm',
    rfpStatus: 'Approved', vendorStatus: 'Assigned',
    vendor: 'BreezePro AC Services, MegaMachine Heavy Equipment Gurgaon, DoItPro General Services Vijay Nagar',
    serviceType: 'AC Repair', dateTime: '16 Apr 11:16 pm',
    description: 'Routine AC repair request.',
    scope: 'Inspection and repair of AC unit.',
    specifications: ['Inspection','Cleaning','Repair'],
    evaluationCriteria: ['Experience','Response time'],
    customerRecordingUrl: null, assistantRecordingUrl: null, boq: [],
  },
  {
    id: '3', rfpId: 'RFP-20260416-003', requestId: 'SMOKE-TEST-001',
    priority: 'high', title: 'Kitchen Deep Cleaning', time: '16 Apr 10:39 pm',
    rfpStatus: 'Draft', vendorStatus: 'Pending',
    vendor: '', serviceType: 'Kitchen Cleaning', dateTime: '16 Apr 10:39 pm',
    description: 'Deep cleaning of commercial kitchen.', scope: 'Full kitchen cleaning.',
    specifications: ['Degreasing','Floor scrubbing'], evaluationCriteria: ['Experience'],
    customerRecordingUrl: null, assistantRecordingUrl: null, boq: [],
  },
  {
    id: '4', rfpId: 'RFP-20260416-004', requestId: '20260416T111247Z',
    priority: 'P2', title: 'حادث سيارة', time: '16 Apr 04:42 pm',
    rfpStatus: 'Approved', vendorStatus: 'Assigned',
    vendor: 'Sgt. Khalid Al-Suwaidi', serviceType: 'حادث سيارة', dateTime: '16 Apr 04:42 pm',
    description: 'تقرير حادث سيارة.', scope: 'المعاينة والتوثيق.',
    specifications: ['فحص السيارة'], evaluationCriteria: ['الخبرة'],
    customerRecordingUrl: null, assistantRecordingUrl: null, boq: [],
  },
  {
    id: '5', rfpId: 'RFP-20260416-005', requestId: '20260416T111126Z',
    priority: 'P4', title: 'غير محدد', time: '16 Apr 04:41 pm',
    rfpStatus: 'Draft', vendorStatus: 'Pending',
    vendor: '', serviceType: 'غير محدد', dateTime: '16 Apr 04:41 pm',
    description: '', scope: '', specifications: [], evaluationCriteria: [],
    customerRecordingUrl: null, assistantRecordingUrl: null, boq: [],
  },
  {
    id: '6', rfpId: 'RFP-20260416-006', requestId: '20260416T110026Z',
    priority: 'P3', title: 'حادث تصادم سيارات', time: '16 Apr 04:30 pm',
    rfpStatus: 'Approved', vendorStatus: 'Assigned',
    vendor: 'Sgt. Khalid Al-Suwaidi', serviceType: 'حادث تصادم', dateTime: '16 Apr 04:30 pm',
    description: 'تصادم مركبتين.', scope: 'المعاينة.', specifications: [], evaluationCriteria: [],
    customerRecordingUrl: null, assistantRecordingUrl: null, boq: [],
  },
]

export default function RFPDocumentsPage() {
  const [docs, setDocs]           = useState<RFPDocument[]>([])
  const [statusFilter, setStatus] = useState<string>('All Statuses')
  const [selected, setSelected]   = useState<RFPDocument | null>(null)

  useEffect(() => {
    fetch('/api/rfp-documents')
      .then((r) => r.json())
      .then(setDocs)
      .catch(() => setDocs(MOCK))
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
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-gray-200">
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
              className="text-left bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {/* top row: priority + requestId + time */}
              <div className="flex items-center gap-2 min-w-0">
                <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded ${PRIORITY_BADGE[doc.priority] ?? 'bg-gray-100 text-gray-500'}`}>
                  {doc.priority}
                </span>
                <span className="flex-1 text-[11px] font-mono text-blue-600 font-semibold truncate">
                  {doc.requestId}
                </span>
                <span className="shrink-0 text-[10px] text-gray-400">{doc.time}</span>
              </div>

              {/* title */}
              <p className="mt-2 text-[13px] font-semibold text-gray-800" dir="auto">
                {doc.title}
              </p>

              {/* divider */}
              <div className="my-2.5 border-t border-gray-100" />

              {/* status badges + vendor */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${RFP_STATUS_BADGE[doc.rfpStatus]}`}>
                  {doc.rfpStatus}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${VENDOR_STATUS_BADGE[doc.vendorStatus]}`}>
                  {doc.vendorStatus}
                </span>
              </div>

              {doc.vendor && (
                <p className="mt-2 text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                  {doc.vendor}
                </p>
              )}
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