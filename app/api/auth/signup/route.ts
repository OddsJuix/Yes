import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1414733071139213373/aXvMM6A46vg4Nr0EOh3F4QTHYO-NvlgjAep1Ezthc5TCBX6OIA38axGnwYcmrYsl8k6j"

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json()

    if (!email || !username || !password) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Create auth user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/editor`,
        data: {
          username: username,
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "failed to create user" }, { status: 500 })
    }

    // Create user profile in public.users table
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      username: username,
      email: email,
    })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Don't fail the signup if profile creation fails, user can still authenticate
    }

    // Send notification to Discord
    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "📩 New Signup",
              color: 0x1abc9c,
              fields: [
                { name: "Username", value: username, inline: true },
                { name: "Email", value: email, inline: true },
                { name: "UserID", value: authData.user.id, inline: false },
              ],
              footer: {
                text: "Coconutz Sign In system",
              },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      })
    } catch (discordError) {
      console.error("Discord webhook error:", discordError)
      // Don't fail signup if Discord notification fails
    }

    return NextResponse.json({
      message: "account created successfully! check your email to confirm.",
      userId: authData.user.id,
    })
  } catch (err) {
    console.error("Signup error:", err)
    return NextResponse.json({ error: "server error" }, { status: 500 })
  }
}
