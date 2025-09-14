"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("coconutz_cookie_consent")
    if (!hasConsented) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("coconutz_cookie_consent", "accepted")
    setShowBanner(false)
  }

  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="bg-gray-800/95 border-gray-700 backdrop-blur-sm shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">We use cookies</h3>
                <p className="text-gray-300 text-sm">
                  We use cookies to enhance your experience, save your video editing progress, and remember your
                  preferences. By continuing to use our site, you agree to our use of cookies.
                </p>
              </div>
            </div>

            {showInfo && (
              <div className="bg-gray-700/50 rounded-lg p-3 text-sm text-gray-300">
                <h4 className="font-semibold text-white mb-2">Why do we ask?</h4>
                <p className="mb-2">
                  We're required by US law (specifically CCPA and similar regulations) to inform you about our cookie
                  usage and obtain your consent.
                </p>
                <p className="mb-2">
                  <strong>What we use cookies for:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Saving your video editing progress locally</li>
                  <li>Remembering your login status</li>
                  <li>Storing your preferences and settings</li>
                  <li>Analytics to improve our service</li>
                </ul>
                <p className="mt-2 text-xs text-gray-400">
                  We don't sell your data or use cookies for advertising purposes.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleInfo}
                className="text-teal-400 hover:text-teal-300 hover:bg-gray-700/50 flex items-center gap-1"
              >
                <Info className="w-4 h-4" />
                {showInfo ? "Hide details" : "Why do we ask?"}
              </Button>

              <div className="flex gap-2">
                <Button onClick={handleAccept} className="bg-teal-500 hover:bg-teal-600 text-white px-6">
                  Accept Cookies
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
