import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Thank you for signing up!</CardTitle>
              <CardDescription className="text-gray-300">Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                You&apos;ve successfully signed up. Please check your email to confirm your account before signing in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
