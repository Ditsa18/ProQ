"use client"

import { useEffect, useRef } from "react"
import { ClipboardList, Music2 } from "lucide-react"

interface Message {
  role: "assistant" | "customer"
  text: string
  typing?: boolean
}

interface TranscriptPanelProps {
  // TODO (backend team): messages will come from your WebSocket stream.
  // Replace with a hook that subscribes to the live audio/transcript feed.
  messages: Message[]
  isProcessing?: boolean
}

export default function TranscriptPanel({ messages, isProcessing }: TranscriptPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const lastMsg = messages.filter((m) => !m.typing).at(-1)
  const status = lastMsg?.role === "assistant" ? "AI Speaking" : "Processing"

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-100 flex-shrink-0">

        <div className="flex items-center gap-2">

          <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
            <ClipboardList size={14} className="text-gray-600" />
          </div>

          <div>
            <div className="text-[13px] font-semibold text-gray-900">
              Live Transcript
            </div>

            <div className="text-[10px] text-gray-400">
              Real-time speech to text
            </div>
          </div>

        </div>

        <div className="flex items-center gap-2">

          <button className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-[11px] text-gray-600">

            <Music2 size={12} />

            Audio

          </button>

          {isProcessing && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />

              <span className="text-[11px] text-gray-400">
                Status: {status}
              </span>
            </>
          )}

        </div>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col overflow-x-hidden">

        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[12px] text-gray-300">
              Waiting for call to start...
            </span>
          </div>
        )}

        {messages.map((msg, i) => {

          const isAssistant = msg.role === "assistant"

          return (
            <div
              key={i}
              className={`flex items-start gap-3 px-3 py-2.5 border-l-[3px] ${
                isAssistant
                  ? "border-l-amber-400 bg-amber-50"
                  : "border-l-blue-400 bg-blue-50"
              }`}
            >

              {/* Role badge */}
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ${
                  isAssistant
                    ? "bg-amber-200 text-amber-800"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {isAssistant ? "Assistant" : "Customer"}
              </span>

              {/* Text or typing dots */}
              {msg.typing ? (
                <div className="flex gap-1 items-center mt-1">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-gray-800 leading-relaxed">
                  {msg.text}
                </p>
              )}

            </div>
          )
        })}

        <div ref={bottomRef} />

      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 flex-shrink-0">

        <div className="flex items-end gap-[2px] h-3">

          <span
            className="w-[2px] h-[4px] bg-blue-400 rounded-sm animate-pulse"
            style={{ animationDelay: "0ms" }}
          />

          <span
            className="w-[2px] h-[10px] bg-blue-500 rounded-sm animate-pulse"
            style={{ animationDelay: "100ms" }}
          />

          <span
            className="w-[2px] h-[6px] bg-blue-400 rounded-sm animate-pulse"
            style={{ animationDelay: "200ms" }}
          />

          <span
            className="w-[2px] h-[10px] bg-blue-500 rounded-sm animate-pulse"
            style={{ animationDelay: "300ms" }}
          />

          <span
            className="w-[2px] h-[4px] bg-blue-400 rounded-sm animate-pulse"
            style={{ animationDelay: "400ms" }}
          />

        </div>

        <span className="text-[11px] text-gray-400">
          {isProcessing
            ? "Processing incoming audio..."
            : "Call not started"}
        </span>

      </div>

    </div>
  )
}