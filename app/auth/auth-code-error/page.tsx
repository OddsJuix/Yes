"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="w-full max-w-sm">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <CardTitle className="text-2xl text-white">Authentication Error</CardTitle>
            <CardDescription className="text-gray-300">
              There was a problem with your Discord authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 mb-4">
                <p className="text-sm text-red-400 font-mono">{error}</p>
              </div>
            )}
            <p className="text-gray-300 text-sm">
              The authentication process was interrupted or failed. This could be due to:
            </p>
            <ul className="text-gray-400 text-sm text-left space-y-1">
              <li>• Canceling the Discord authorization</li>
              <li>• Network connectivity issues</li>
              <li>• Temporary Discord service problems</li>
              <li>• Incorrect redirect URL configuration</li>
            </ul>
            <div className="flex flex-col gap-3 pt-4">
              <Link href="/auth/login">
                <Button className="w-full bg-teal-500 hover:bg-teal-600">Try Again</Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
