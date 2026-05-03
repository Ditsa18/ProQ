"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
  userName?: string
  isCallActive?: boolean
}

export default function Navbar({
  userName = "User",
  isCallActive = false
}: Props) {

  const router = useRouter()
  const pathname = usePathname()

  const isCallPage =
    pathname === "/call"

  const [seconds, setSeconds] =
    useState(0)

  const [showLogoutConfirm,
    setShowLogoutConfirm] =
    useState(false)

  // Timer runs only when call is active

  useEffect(() => {

    if (!isCallActive) return

    setSeconds(0)

    const interval =
      setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)

    return () =>
      clearInterval(interval)

  }, [isCallActive])

  const formatTime = () => {

    const mins =
      Math.floor(seconds / 60)

    const secs =
      seconds % 60

    return `${mins
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`

  }

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Call", path: "/call" },
    { name: "Service Map", path: "/service-map" },
    { name: "History", path: "/history" },
    { name: "RFP Documents", path: "/rfp" },
    { name: "Usage", path: "/usage" }
  ]

  const confirmLogout = () => {
    router.push("/login")
  }

  return (
    <>
      <div className="h-16 bg-[#f2f2f2] border-b flex items-center px-6">

        {/* LEFT — LOGO */}

        <div className="flex items-center gap-3">

          <div className="w-8 h-8 bg-black rounded-full rounded-br-md" />

          <span className="text-lg font-semibold text-black">
            ProQ
          </span>

        </div>

        {/* CENTER — NAVIGATION */}

        <div className="flex-1 flex justify-center">

          <div className="flex items-center gap-8">

            {navItems.map((item) => {

              const isActive =
                pathname === item.path

              return (
                <button
                  key={item.name}
                  onClick={() =>
                    router.push(item.path)
                  }
                  className={`
                    text-sm font-medium
                    pb-1
                    transition
                    ${
                      isActive
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }
                  `}
                >
                  {item.name}
                </button>
              )
            })}

          </div>

        </div>

        {/* RIGHT — STATUS */}

        <div className="flex items-center gap-4">

          {/* Live timer only on Call page */}

          {isCallPage && isCallActive && (

            <div className="flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">

              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />

              Live {formatTime()}

            </div>

          )}

          {/* Username */}

          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {userName}
          </div>

          {/* Logout */}

          <button
            onClick={() =>
              setShowLogoutConfirm(true)
            }
            className="px-4 py-1.5 border border-gray-300 rounded-lg bg-white text-black text-sm hover:bg-gray-100 transition"
          >
            Logout
          </button>

        </div>

      </div>

      {/* LOGOUT CONFIRMATION MODAL */}

      {showLogoutConfirm && (

  <div
    className="
    fixed
    inset-0
    z-[9999]
    flex
    items-center
    justify-center
    bg-black/50
    backdrop-blur-sm
    "
  >

    <div
      className="
      bg-white
      rounded-2xl
      shadow-2xl
      border
      border-gray-200
      w-[340px]
      p-6
      "
    >

      <h2
        className="
        text-lg
        font-semibold
        text-gray-900
        mb-3
        "
      >
        Confirm Logout
      </h2>

      <p
        className="
        text-sm
        text-gray-600
        mb-6
        "
      >
        Are you sure you want to logout?
      </p>

      <div className="flex justify-end gap-3">

        <button
          onClick={() =>
            setShowLogoutConfirm(false)
          }
          className="
          px-4
          py-2
          border
          border-gray-300
          rounded-lg
          text-sm
          text-gray-700
          bg-white
          hover:bg-gray-100
          transition
          "
        >
          Cancel
        </button>

        <button
          onClick={confirmLogout}
          className="
          px-4
          py-2
          bg-red-600
          text-white
          rounded-lg
          text-sm
          font-medium
          hover:bg-red-700
          transition
          "
        >
          Logout
        </button>

      </div>

    </div>

  </div>

)}

    </>
  )

}