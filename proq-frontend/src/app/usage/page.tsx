"use client"

import Navbar from "@/components/Navbar"

export default function UsagePage() {

  return (

    <div className="h-screen flex flex-col bg-gray-100">

      {/* Navbar */}

      <Navbar />

      {/* Content */}

      <div className="flex-1 flex items-center justify-center">

        <div className="bg-white border rounded-xl p-8 shadow-sm">

          <h1 className="text-xl font-semibold">
            Usage Page
          </h1>

        </div>

      </div>

    </div>

  )

}