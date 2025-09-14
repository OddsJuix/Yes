"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

interface SignupFormProps {
  onSignupSuccess: (userId: string) => void
}

export function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/editor`,
          data: {
            username: username,
          },
        },
      })

      if (error) {
        setMessage(error.message)
        return
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          username: username,
          email: email,
        })

        if (profileError) {
          console.error("Profile creation error:", profileError)
        }

        // Send notification via API
        try {
          await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password: "***" }),
          })
        } catch (notificationError) {
          console.error("Notification error:", notificationError)
        }

        setMessage("account created successfully! check your email to confirm.")
        localStorage.setItem("coconutz_user_id", data.user.id)
        localStorage.setItem("coconutz_username", username)

        setTimeout(() => onSignupSuccess(data.user.id), 1500)
      }
    } catch (error) {
      console.error("Signup error:", error)
      setMessage("network error. please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">join coconutz editor</CardTitle>
          <CardDescription className="text-gray-300">create your account to start editing videos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-white">
                password
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 hover:text-white"
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>
            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white" disabled={isLoading}>
              {isLoading ? "creating account..." : "create account"}
            </Button>
            {message && (
              <p
                className={`text-center text-sm ${message.includes("success") || message.includes("created") ? "text-green-400" : "text-red-400"}`}
              >
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
