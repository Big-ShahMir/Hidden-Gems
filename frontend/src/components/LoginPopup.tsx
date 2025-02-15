"use client";

import type React from "react";
import { useState } from "react";
import axios from "axios";

interface LoginPopupProps {
  onSuccess: (username: string, password: string) => void;
  onClose: () => void;
}

export default function LoginPopup({ onSuccess, onClose }: LoginPopupProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await axios.post("/api/login", { username, password });
      
      // Check response messageType to determine the message
      const successMessage = response.data.messageType === "signup" ? "Account created!" : "Login successful!";
      
      setMessage({ type: "success", text: successMessage });

      setTimeout(() => {
        onSuccess(username, password);
      }, 1500); // Delay to show message before closing
    } catch (error) {
      console.error("Login failed:", error);
      setMessage({ type: "error", text: "Login failed. Please try again." });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="mb-2 block text-sm font-bold text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {message && (
            <div
              className={`mb-4 rounded-lg p-3 ${
                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 rounded bg-gray-300 px-4 py-2 font-bold text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button type="submit" className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
