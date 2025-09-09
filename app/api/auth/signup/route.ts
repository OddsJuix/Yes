import { put, get } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import fetch from "node-fetch"

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1414733071139213373/aXvMM6A46vg4Nr0EOh3F4QTHYO-NvlgjAep1Ezthc5TCBX6OIA38axGnwYcmrYsl8k6j"

// signup endpoint
export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json()
    if (!email || !username || !password) {
      return NextResponse.json({ error: "Email, username and password are required" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const userData = {
      email,
      username,
      password: hashedPassword,
      signupDate: new Date().toISOString(),
      id: crypto.randomUUID(),
    }

    await put(`users/${userData.id}.json`, JSON.stringify(userData), { access: "private" })

    return NextResponse.json({ success: true, message: "Account created!", userId: userData.id })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}

// login endpoint
export async function PUT(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const usersList = await get("users", { access: "private" }) // list all files in 'users' folder
    let loggedInUser = null

    for (const file of usersList) {
      const content = await get(file, { access: "private" })
      const user = JSON.parse(new TextDecoder().decode(content))
      if (user.email === email) {
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (passwordMatch) {
          loggedInUser = user
          break
        }
      }
    }

    if (!loggedInUser) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `User login detected!\n**Username:** ${loggedInUser.username}\n**Email:** ${loggedInUser.email}`,
      }),
    })

    return NextResponse.json({ success: true, message: "Logged in!", userId: loggedInUser.id })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
