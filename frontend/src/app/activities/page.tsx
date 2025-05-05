"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Polaroid from "@/components/Polaroid"
import { useRouter } from "next/navigation"

interface Activity {
  activity_name: string
  description: string
  approximate_price: string
}

interface ActivityData {
  descs: Activity[]
}

export default function SuspenseActivitiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActivitiesPage />
    </Suspense>
  )
}


function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  let [userName, setUserName] = useState("")
  let [interests, setInterests] = useState("")
  let [budget, setBudget] = useState("")
  let [location, setLocation] = useState("")
  
  useEffect(() => {

    if (typeof window !== "undefined"){    
    const storedUsername = localStorage.getItem("username")
    
    setUserName(searchParams.get("user_name") || storedUsername || "")
    setInterests(searchParams.get("interests")??"")
    setBudget(searchParams.get("budget")??"")
    setLocation(searchParams.get("location")??"")
    }

    const data = searchParams.get("data")
    if (data) {
      try {
        const parsedData: ActivityData = JSON.parse(decodeURIComponent(data))
        if (Array.isArray(parsedData.descs) && parsedData.descs.length > 0) {
          setActivities(parsedData.descs)
        } else {
          setError("No activities found. Please try different preferences.")
          setTimeout(() => {
            router.push(`/?preferences=True&user_name=${userName}`)
          }, 3000)
        }
      } catch (error) {
        console.error("Error:", error)

        // Show an error message to the user (you might want to set this in state and display it in your component)
        alert("An error occurred. Redirecting to preferences page...")
  
        // Redirect immediately instead of using setTimeout
        router.push(`/?preferences=True&user_name=${userName}`)
      }
      
    } else {
      setError("No data provided. Please set your preferences first.")
    }
    setLoading(false)
  }, [searchParams, userName, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-200 to-blue-400">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-200 to-blue-400">
        <div className="text-white text-2xl">{error}</div>
      </div>
    )
  }

  const handleChangePreferences = () => {
    const user_name = searchParams.get("user_name")
    if (user_name) {
      router.push(`/?preferences=True&user_name=${encodeURIComponent(user_name)}`)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-blue-200 to-blue-400">
        <div className="flex justify-between items-center p-4 bg-white bg-opacity-20 backdrop-blur-md">
        <div className="text-blue-800">
          <h2 className="text-xl font-bold">{userName}</h2>
          <p className="text-sm">
            <span className="font-semibold">Interests:</span> {interests}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Location:</span> {location}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Budget:</span> {budget}
          </p>
        </div>
        <div>
          <button
            onClick={handleChangePreferences}
            className="bg-white text-blue-800 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition-colors duration-200 shadow-md mr-2"
          >
            Change Preferences
          </button>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
              localStorage.removeItem("username")
              }
              router.push("/")}}
            className="bg-white text-blue-800 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition-colors duration-200 shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
      {/* <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-blue-200 to-transparent pt-4 pb-8 z-10">
        <h1 className="text-4xl font-bold text-white text-center">Suggested Activities</h1>
      </div> */}
      {/* <div className="relative w-full h-full pt-0">
        {activities.map((activity, index) => {
          // Calculate position in a circular pattern
          const totalItems = activities.length
          const angleStep = (2 * Math.PI) / totalItems
          const angle = index * angleStep

          // Adjust radius based on viewport size
          const radius = Math.min(window.innerWidth, window.innerHeight) * 0.25

          // Calculate center position (adjusted to account for title)
          const centerX = window.innerWidth / 2
          const centerY = window.innerHeight / 2 // offset for title

          // Calculate position
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)

          return (
            <div
              key={index}
              className="absolute transform transition-all duration-300 ease-in-out hover:z-20"
              style={{
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${Math.random() * 20 - 10}deg)`,
              }}
            >
              <Polaroid
                title={activity.activity_name}
                description={activity.description}
                price={activity.approximate_price}
              />
            </div>
          )
        })}
      </div> */}
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-h-full overflow-y-auto p-3 z-25">
        {activities.map((activity, index) => (
          <div key={index} className="flex justify-center">
            <Polaroid
              title={activity.activity_name}
              description={activity.description}
              price={activity.approximate_price}
            />
          </div>
        ))}
      </div>
      
    </div>
  )
}

