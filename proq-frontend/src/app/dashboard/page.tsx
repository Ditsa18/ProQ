"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import StatCard from "@/components/dashboard/StatCard"
import ActivityChart from "@/components/dashboard/ActivityChart"
import PriorityDonut from "@/components/dashboard/PriorityDonut"
import RecentRequests from "@/components/dashboard/RecentRequests"
import VendorWorkload from "@/components/dashboard/VendorWorkload"
import { getStats, type DashboardStats } from "@/lib/api/dashboard"

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.09 2H6.1a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

const DEFAULT_STATS: DashboardStats = { totalRequests: 0, urgentRequests: 0, pendingApproval: 0, vendorAssigned: 0 }

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS)

  useEffect(() => {
    getStats().then(setStats).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex items-start justify-between px-6 py-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Dashboard</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">
            ProQ — Procurement &amp; Services Overview
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 py-5 flex flex-col gap-4 overflow-auto">

        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Requests" value={stats.totalRequests} subLabel="Total Requests" icon={<PhoneIcon />} valueColor="text-gray-900" borderColor="border-t-gray-200" />
          <StatCard label="Urgent Requests" value={stats.urgentRequests} subLabel="Urgent" icon={<AlertIcon />} valueColor="text-gray-900" borderColor="border-t-gray-200" />
          <StatCard label="Pending Approval" value={stats.pendingApproval} subLabel="Pending Approval" icon={<ClockIcon />} valueColor="text-gray-900" borderColor="border-t-gray-200" />
          <StatCard label="Vendor Assigned" value={stats.vendorAssigned} subLabel="Assigned" icon={<CheckIcon />} valueColor="text-gray-900" borderColor="border-t-gray-200" />
        </div>

        <div className="grid grid-cols-[1fr_380px] gap-4">
          <ActivityChart />
          <PriorityDonut />
        </div>

        <div className="grid grid-cols-[1fr_380px] gap-4">
          <RecentRequests />
          <VendorWorkload />
        </div>

      </div>
    </div>
  )
}
