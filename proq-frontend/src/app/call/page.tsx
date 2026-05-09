"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnalysisData } from "@/types/analysis"
import Navbar from "@/components/Navbar"
import TranscriptPanel from "@/components/TranscriptPanel"
import AnalysisPanel from "@/components/AnalysisPanel"
import { Phone, Mic } from "lucide-react"

// ── DEMO SCRIPT ──────────────────────────────────────────────────────────────
// TODO (backend team): remove this and replace with real WebSocket stream.
// Each entry: role, text, delay in ms after previous message, and optional
// analysis fields to update when this message appears.

interface ScriptEntry {
  role: "assistant" | "customer"
  text: string
  delay: number
  analysis?: Partial<AnalysisData>
}

const DEMO_SCRIPT: ScriptEntry[] = [
  {
    role: "assistant",
    text: "Hello! Welcome to ProQ. I can help you with any procurement or home service needs. How can I assist you today?",
    delay: 800,
  },
  {
    role: "customer",
    text: "Yeah. My AC is not working. And I stay in Thane, Mumbai.",
    delay: 2200,
    analysis: { location: "Thane, Mumbai" },
  },
  {
    role: "assistant",
    text: "I'm sorry to hear that your AC isn't working! Can you tell me if you need a repair, installation, or maintenance service?",
    delay: 1800,
    analysis: { serviceType: "AC (type TBD)" },
  },
  {
    role: "customer",
    text: "Yeah. Maybe it's a repair service but I'm not sure. I need technicians to check on that.",
    delay: 2400,
    analysis: { serviceType: "AC Repair" },
  },
  {
    role: "assistant",
    text: "Got it! We'll arrange for technicians to check your AC. What's your budget range for this repair service?",
    delay: 1800,
  },
  {
    role: "customer",
    text: "Yeah. It's kind of flexible but around 2 thousand.",
    delay: 2600,
    analysis: { budget: "₹2,000", priority: "Normal" },
  },
  {
    role: "assistant",
    text: "No problem! And when would you like the service to be done?",
    delay: 1600,
  },
  {
    role: "customer",
    text: "I need it as soon as possible.",
    delay: 2000,
    analysis: { priority: "High / Urgent", specialRequirements: "ASAP scheduling" },
  },
  {
    role: "assistant",
    text: "Thank you! I'll mark this as urgent. Can I have your contact details to arrange the service?",
    delay: 1800,
  },
  {
    role: "customer",
    text: "(798) 099-1392",
    delay: 2000,
    analysis: {
      contactInfo: "(798) 099-1392",
      specifications: "Check & repair AC unit",
    },
  },
  {
    role: "assistant",
    text: "Perfect! I've noted all your details. A technician will be assigned shortly. Is there anything else you'd like to add?",
    delay: 1800,
  },
  {
    role: "customer",
    text: "No, that's all. Thank you.",
    delay: 2000,
  },
  {
    role: "assistant",
    text: "You're welcome! We'll get back to you very soon. Have a great day!",
    delay: 1600,
  },
]
// ─────────────────────────────────────────────────────────────────────────────

export default function CallPage() {
  const router = useRouter()

  const [analysis, setAnalysis] = useState<AnalysisData>({
    serviceType: "",
    priority: "",
    location: "",
    budget: "",
    contactInfo: "",
    specifications: "",
    specialRequirements: "",
  })

  const [messages, setMessages] = useState<
    { role: "assistant" | "customer"; text: string; typing?: boolean }[]
  >([])

  const [seconds, setSeconds] = useState(0)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const scriptTimers = useRef<NodeJS.Timeout[]>([])

  // ── Live timer ──
  useEffect(() => {
    if (!isCallActive) return
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isCallActive])

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  // ── Start call: replay demo script ──
  const startCall = () => {
    setSeconds(0)
    setMessages([])
    setAnalysis({
      serviceType: "", priority: "", location: "", budget: "",
      contactInfo: "", specifications: "", specialRequirements: "",
    })
    setIsCallActive(true)
    setIsProcessing(true)

    let cumDelay = 0

    DEMO_SCRIPT.forEach((entry, i) => {
      cumDelay += entry.delay

      // Show typing indicator just before this message appears
      const typingTimer = setTimeout(() => {
        setMessages((prev) => {
          // Remove any existing typing bubble
          const filtered = prev.filter((m) => !m.typing)
          return [...filtered, { role: entry.role, text: "", typing: true }]
        })
      }, cumDelay - 600)

      // Show the actual message
      const msgTimer = setTimeout(() => {
        setMessages((prev) => {
          const filtered = prev.filter((m) => !m.typing)
          return [...filtered, { role: entry.role, text: entry.text }]
        })

        // Update analysis if this message carries new data
        if (entry.analysis) {
          setAnalysis((prev) => ({ ...prev, ...entry.analysis }))
        }
      }, cumDelay)

      scriptTimers.current.push(typingTimer, msgTimer)
    })
  }

  // ── End call: clear everything and go to post-call page ──
  const endCall = () => {
    setIsCallActive(false)
    setIsProcessing(false)
    scriptTimers.current.forEach(clearTimeout)
    scriptTimers.current = []
    if (timerRef.current) clearInterval(timerRef.current)

    // TODO (backend team): pass real analysis data via query params, context, or API
    // For now we navigate to the post-call summary page
    router.push("/call/summary")
  }

  const liveTime = formatTime(seconds)

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">

      {/* NAVBAR */}
      <Navbar isCallActive={isCallActive} />

      {/* CALL STATUS BAR */}
<div className="h-11 flex items-center gap-4 px-5 bg-[#f6f6f7] border-b border-gray-200 flex-shrink-0">

  <div className="flex items-center gap-1.5 text-red-600 text-[11px] font-bold tracking-wide">

    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />

    LIVE CALL

  </div>

  <span className="text-[15px] font-bold text-gray-900 tabular-nums tracking-widest">
    {liveTime}
  </span>

  <span className="text-gray-300 text-sm">—</span>

  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
    <Phone size={12} />
    <Mic size={12} />
  </div>

  <span className="text-gray-300 text-sm">—</span>

  <div className="flex items-center gap-1.5 text-[11px] font-medium text-green-700">

    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />

    {isCallActive ? "Connected" : "Idle"}

  </div>

  <div className="text-[11px] text-gray-500 font-medium">
    EN/HI
  </div>

</div>

      {/* MAIN CONTENT */}
      <div className="flex-1 grid grid-cols-2 gap-3 p-3 overflow-hidden min-h-0">

        <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
          <TranscriptPanel messages={messages} isProcessing={isProcessing} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
          <AnalysisPanel data={analysis} isActive={isCallActive} />
        </div>

      </div>

      {/* FOOTER BAR */}
      <div className="h-11 flex items-center justify-between px-4 bg-white border-t border-gray-200 flex-shrink-0">

        <div className="flex items-center gap-3">

          {!isCallActive && (
            <button
              onClick={startCall}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-1.5 text-[12px] font-bold transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Start Call
            </button>
          )}

          {isCallActive && (
            <button
              onClick={endCall}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-1.5 text-[12px] font-bold transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              End Call
            </button>
          )}

          {isCallActive && (
            <div className="flex items-center gap-1.5 text-[12px] text-red-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Live
            </div>
          )}

        </div>

        {/* Waveform + voice */}
        <div className="flex items-center gap-3">

          

          <button className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-[11px] text-gray-600 hover:bg-gray-100 transition">
            🎙 EN/HI Voice
          </button>

        </div>

      </div>
    </div>
  )
}