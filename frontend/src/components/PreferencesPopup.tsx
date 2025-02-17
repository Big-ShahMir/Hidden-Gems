"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios";
import { UserData } from "@/app/page";


export const fastApiURL = "http://127.0.0.1:8000"

interface PreferencesPopupProps {
  onSubmit: (interests: string, budget: number, location: string) => void
  onClose: () => void
  userData: UserData | null // Added userData prop
}

export default function PreferencesPopup({ onSubmit, onClose, userData }: PreferencesPopupProps) {
  const [interests, setInterests] = useState("")
  const [budget, setBudget] = useState<number>(0)
  const [location, setLocation] = useState("")
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Send preferences to the API route using Axios
      const response = await axios.post('/api/savePreferences', {
        username: userData?.username, // Added username to the request body
        interests,
        budget,
        location,
      })

      if (response.status === 200) {
        const data = response.data
        onSubmit(interests, budget, location)
        console.log('Preference saved:', data)
      } else {
        console.error('Failed to save preference')
      }

      const descriptions = await axios.post(`${fastApiURL}/process`, {
        interest: interests,
        budget,
        loc: location,
      })

      

    console.log(descriptions.data)

    router.push(`/activities?data=${encodeURIComponent(JSON.stringify(descriptions.data))}&user_name=${userData?.username}`)


    } catch (error) {
      console.error('Error saving preference:', error)
          setTimeout(() => {
            router.push(`/?preferences=True&user_name=${userData?.username}`)
          }, 3000)
    }



  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Set Your Preferences</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="interests" className="mb-2 block text-sm font-bold text-gray-700">
              Interests
            </label>
            <input
              type="text"
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="budget" className="mb-2 block text-sm font-bold text-gray-700">
              Budget
            </label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(Number.parseFloat(e.target.value))}
              className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              step="0.01"
              min="0"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="location" className="mb-2 block text-sm font-bold text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
