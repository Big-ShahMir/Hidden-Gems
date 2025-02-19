"use client"

import { useState, useEffect } from "react"
import LoginPopup from "@/components/LoginPopup"
import { useSearchParams } from "next/navigation"
import PreferencesPopup from "@/components/PreferencesPopup"

export interface UserData {
  username: string
  password: string
}

interface Preferences {
  interests: string
  budget: number
  location: string
}

export default function Home() {

  localStorage.clear()

  const [showLogin, setShowLogin] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const searchParams = useSearchParams()
  const [preferences, setPreferences] = useState<Preferences | null>(null)

  const handleLoginSuccess = (username: string, password: string) => {
    setUserData({ username, password })
    setShowLogin(false)
    localStorage.setItem("username", username)
    setShowPreferences(true)
  }

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUserData({ username: storedUsername, password: "" })
    }

    const data = searchParams.get("preferences")
    if (data === "True") {
      const username = searchParams.get("user_name") || storedUsername
      if (username) {
        setUserData({ username, password: "" })
        localStorage.setItem("username", username)
        setShowPreferences(true)
      }
    }
  }, [searchParams])

  const handlePreferencesSubmit = (interests: string, budget: number, location: string) => {
    setPreferences({ interests, budget, location })
    setShowPreferences(false)
  }

  const showWelcomeScreen = !userData

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-200 to-blue-400 p-24">
      {showWelcomeScreen ? (
        <>
          <h1 className="mb-8 text-4xl font-bold text-white">Hidden Gems</h1>
          <button
            onClick={() => setShowLogin(true)}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Get Started
          </button>
        </>
      ) : (
        <h1 className="mb-8 text-4xl font-bold text-white">Hidden Gems</h1>
      )}

      {showLogin && <LoginPopup onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />}
      {showPreferences && (
        <PreferencesPopup onSubmit={handlePreferencesSubmit} onClose={() => setShowPreferences(false)} userData={userData} setShowPreferences={setShowPreferences} />
      )}

      {userData && preferences && (
        <div className="mt-8 text-white flex">
          <h2 className="text-2xl font-bold items-center justify-center">Loading...</h2>
        </div>
      )}

      {/* {preferences && (
        <div className="mt-8 text-white">
          <h2 className="text-2xl font-bold">Preferences:</h2>
          <p>Interests: {preferences.interests}</p>
          <p>Budget: ${preferences.budget.toFixed(2)}</p>
          <p>Location: {preferences.location}</p>
        </div>
      )} */}
    </main>
  )
}

