import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1414733071139213373/aXvMM6A46vg4Nr0EOh3F4QTHYO-NvlgjAep1Ezthc5TCBX6OIA38axGnwYcmrYsl8k6j"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  console.log("[v0] Auth callback received:", { code: code ? "present" : "missing", origin, next })

  if (code) {
    try {
      const supabase = await createClient()
      console.log("[v0] Exchanging code for session...")

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      console.log("[v0] Exchange result:", {
        success: !error,
        hasUser: !!data?.user,
        error: error?.message,
      })

      if (error) {
        console.error("[v0] Session exchange error:", error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
      }

      if (data.user) {
        console.log("[v0] User authenticated:", data.user.id)

        // Check if user profile exists, create if not
        const { data: existingUser } = await supabase.from("users").select("*").eq("id", data.user.id).single()

        if (!existingUser) {
          console.log("[v0] Creating new user profile...")

          // Create user profile for Discord user
          const username = data.user.user_metadata?.full_name || data.user.user_metadata?.user_name || "Discord User"
          const { error: profileError } = await supabase.from("users").insert({
            id: data.user.id,
            username: username,
            email: data.user.email || "",
          })

          if (profileError) {
            console.error("Profile creation error:", profileError)
          } else {
            console.log("User profile created successfully")
          }

          // Send Discord notification for new Discord signup
          try {
            await fetch(DISCORD_WEBHOOK_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                embeds: [
                  {
                    title: "🎮 New Discord Signup",
                    color: 0x5865f2,
                    fields: [
                      { name: "Username", value: username, inline: true },
                      { name: "Email", value: data.user.email || "N/A", inline: true },
                      { name: "UserID", value: data.user.id, inline: false },
                      { name: "Provider", value: "Discord OAuth", inline: true },
                    ],
                    footer: {
                      text: "Coconutz Discord Auth",
                    },
                    timestamp: new Date().toISOString(),
                  },
                ],
              }),
            })
            console.log("Discord webhook notification sent")
          } catch (discordError) {
            console.error("Discord webhook error:", discordError)
          }
        } else {
          console.log("Existing user found, skipping profile creation")
        }

        console.log("[Redirecting to:", `${origin}${next}`)
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (error) {
      console.error("Unexpected error in callback:", error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=unexpected`)
    }
  }

  console.log("No code provided, redirecting to error page")
  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`)
}
