"use client"

import { useState } from "react"
import LoginPopup from "@/components/LoginPopup"
import PreferencesPopup from "@/components/PreferencesPopup"

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [userData, setUserData] = useState<[string, string] | null>(null)
  const [preferences, setPreferences] = useState<[string, string] | null>(null)

  const handleLoginSuccess = (username: string, password: string) => {
    setUserData([username, password])
    setShowLogin(false)
    setShowPreferences(true)
  }

  const handlePreferencesSubmit = (pref1: string, pref2: string) => {
    setPreferences([pref1, pref2])
    setShowPreferences(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-200 to-blue-400 p-24">
      <h1 className="mb-8 text-4xl font-bold text-white">Welcome to Our Service</h1>
      <button
        onClick={() => setShowLogin(true)}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Get Started
      </button>

      {showLogin && <LoginPopup onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />}
      {showPreferences && (
        <PreferencesPopup onSubmit={handlePreferencesSubmit} onClose={() => setShowPreferences(false)} />
      )}

      {userData && (
        <div className="mt-8 text-white">
          <h2 className="text-2xl font-bold">User Data:</h2>
          <p>Username: {userData[0]}</p>
          <p>Password: {userData[1]}</p>
        </div>
      )}

      {preferences && (
        <div className="mt-8 text-white">
          <h2 className="text-2xl font-bold">Preferences:</h2>
          <p>Preference 1: {preferences[0]}</p>
          <p>Preference 2: {preferences[1]}</p>
        </div>
      )}
    </main>
  )
}

