import { put, get } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1414733071139213373/aXvMM6A46vg4Nr0EOh3F4QTHYO-NvlgjAep1Ezthc5TCBX6OIA38axGnwYcmrYsl8k6j"

// signup endpoint
export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json()
    if (!email || !username || !password) {
      return NextResponse.json({ error: "Email, username, and password are required" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const userData = {
      username,
      password: hashedPassword,
      signupDate: new Date().toISOString(),
      id: crypto.randomUUID(),
    }

    // store in blob
    await put(`users/${userData.id}.json`, JSON.stringify(userData), { access: "private" })

    // send email + username to Discord
    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `New user signed up!\n**Username:** ${username}\n**Email:** ${email}`,
        }),
      })
    } catch (err) {
      console.error("Failed to send webhook:", err)
    }

    return NextResponse.json({ success: true, message: "Account created!", userId: userData.id })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}

// login endpoint
export async function PUT(request: NextRequest) {
  try {
    const { email, username, password } = await request.json()
    if (!email || !username || !password) {
      return NextResponse.json({ error: "Email, username, and password are required" }, { status: 400 })
    }

    const usersList = await get("users", { access: "private" })
    let loggedInUser = null

    for (const file of usersList) {
      const content = await get(file, { access: "private" })
      const user = JSON.parse(new TextDecoder().decode(content))
      if (user.username === username) {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
          loggedInUser = user
          break
        }
      }
    }

    if (!loggedInUser) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // log username + email to Discord
    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `User login detected!\n**Username:** ${username}\n**Email:** ${email}`,
        }),
      })
    } catch (err) {
      console.error("Failed to send webhook:", err)
    }

    return NextResponse.json({ success: true, message: "Logged in!", userId: loggedInUser.id })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
