"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import axios from "axios"

import { fastApiURL } from "./PreferencesPopup"

interface PolaroidProps {
  title: string
  description: string
  price: string
}

export default function Polaroid({ title, description, price }: PolaroidProps) {
  const [expanded, setExpanded] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    generateImage()
  }, [])

  const generateImage = async () => {
    try {
      const response = await axios.post(`${fastApiURL}/image`, {prompt: title})
      if (response.status === 200 && response.data.imageURL) {
        setImageUrl(response.data.imageURL)
      } else {
        console.error("Image URL not found in response.")
      }
    } catch (error) {
      console.error("Error generating image:", error)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  return (
    <>
      <div className="cursor-pointer transition-all duration-300" onClick={handleClick}>
        <div
          className={`bg-white p-4 shadow-lg w-64 transform transition-all duration-300 ${
            expanded ? "scale-0 opacity-0" : "scale-100 opacity-100 hover:rotate-0 hover:scale-105"
          }`}
        >
          <div className="relative aspect-square mb-4">
            {imageUrl ? (
              <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover rounded-lg" />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
            )}
          </div>
          <h3 className="text-center font-bold text-lg mb-2">{title}</h3>
          <p className="text-center font-semibold">{price}</p>
        </div>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleClick}
        >
          <div
            className="bg-white rounded-xl p-8 m-4 max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[50vh] mb-6">
              {imageUrl ? (
                <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover rounded-lg" />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
            <p className="text-2xl font-semibold mb-6 text-center">{price}</p>
            <p className="text-lg leading-relaxed">{description}</p>
          </div>
        </div>
      )}
    </>
  )
}

