// TODO (backend team): replace all exports here with real API calls

export const STATS = {
  totalRequests: 85,
  urgentRequests: 1,
  pendingApproval: 25,
  vendorAssigned: 2,
}

export const ACTIVITY_DATA = [
  { time: "0:30", value: 0 },
  { time: "1:00", value: 0 },
  { time: "2:00", value: 0 },
  { time: "3:00", value: 0 },
  { time: "4:00", value: 0 },
  { time: "5:00", value: 0 },
  { time: "6:00", value: 0 },
  { time: "7:00", value: 0 },
  { time: "8:00", value: 0 },
  { time: "9:00", value: 0 },
  { time: "10:00", value: 0 },
  { time: "11:00", value: 0 },
  { time: "12:00", value: 2 },
  { time: "13:00", value: 3 },
  { time: "14:00", value: 2 },
  { time: "15:00", value: 5 },
  { time: "16:00", value: 7 },
  { time: "17:00", value: 4 },
  { time: "18:00", value: 2 },
  { time: "19:00", value: 1 },
  { time: "20:00", value: 2 },
  { time: "21:00", value: 1 },
  { time: "22:00", value: 0 },
  { time: "23:00", value: 3 },
]

export const PRIORITY_DISTRIBUTION = [
  { label: "Urgent", value: 15, color: "#ef4444" },
  { label: "High", value: 30, color: "#f97316" },
  { label: "Normal", value: 45, color: "#3b82f6" },
  { label: "Low", value: 10, color: "#22c55e" },
]

export const RECENT_REQUESTS = [
  {
    time: "16 Apr 11:33 pm",
    serviceType: "AC Repair",
    priority: "urgent",
    status: "Assigned",
    vendor: "BreezePro AC Services, MegaMachine Heavy Equipment Gurgaon, DoItPro General Services Vijay Nagar",
  },
  {
    time: "16 Apr 10:39 pm",
    serviceType: "Kitchen Deep Cleaning",
    priority: "high",
    status: "Pending",
    vendor: "—",
  },
]

export const VENDOR_WORKLOAD = [
  { name: "Sgt. Khalid Al-Suwaidi", count: 11 },
  { name: "Lt. Fatima Al-Hamm...", count: 7 },
  { name: "BreezePro AC Servic...", count: 2 },
  { name: "Capt. Ahmed Al-Man...", count: 2 },
  { name: "Sgt. Mariam Al-Falasi", count: 1 },
]