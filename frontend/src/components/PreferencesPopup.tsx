"use client"

import type React from "react"

import { useState } from "react"

interface PreferencesPopupProps {
  onSubmit: (pref1: string, pref2: string) => void
  onClose: () => void
}

export default function PreferencesPopup({ onSubmit, onClose }: PreferencesPopupProps) {
  const [pref1, setPref1] = useState("")
  const [pref2, setPref2] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(pref1, pref2)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Set Your Preferences</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="pref1" className="mb-2 block text-sm font-bold text-gray-700">
              Preference 1
            </label>
            <input
              type="text"
              id="pref1"
              value={pref1}
              onChange={(e) => setPref1(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="pref2" className="mb-2 block text-sm font-bold text-gray-700">
              Preference 2
            </label>
            <input
              type="text"
              id="pref2"
              value={pref2}
              onChange={(e) => setPref2(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 rounded bg-gray-300 px-4 py-2 font-bold text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button type="submit" className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

