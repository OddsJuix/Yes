import { put, list, get } from "@vercel/blob"
import bcrypt from "bcryptjs"

const webhookUrl =
  "https://discord.com/api/webhooks/1414733071139213373/aXvMM6A46vg4Nr0EOh3F4QTHYO-NvlgjAep1Ezthc5TCBX6OIA38axGnwYcmrYsl8k6j"

// signup
export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json()
    if (!email || !username || !password) {
      return Response.json({ error: "Email, username, and password are required" }, { status: 400 })
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

    // embed for Discord
    const embed = {
      title: "🆕 New User Signup",
      color: 0x14b8a6,
      fields: [
        { name: "Username", value: username, inline: true },
        { name: "Email", value: email, inline: true },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: "Coconutz User System" },
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    })

    if (!response.ok) throw new Error("Failed to send signup to Discord")

    return Response.json({ success: true, userId: userData.id })
  } catch (error) {
    console.error("Signup error:", error)
    return Response.json({ error: "Failed to create account" }, { status: 500 })
  }
}

// login
export async function PUT(request: Request) {
  try {
    const { email, username, password } = await request.json()
    if (!email || !username || !password) {
      return Response.json({ error: "Email, username, and password are required" }, { status: 400 })
    }

    const files = await list({ prefix: "users/" })
    let loggedInUser = null

    for (const file of files.blobs) {
      const blob = await get(file.pathname)
      const text = await blob.text()
      const user = JSON.parse(text)

      if (user.username === username) {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
          loggedInUser = user
          break
        }
      }
    }

    if (!loggedInUser) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // embed for Discord
    const embed = {
      title: "🔑 User Login",
      color: 0xf59e0b, // amber
      fields: [
        { name: "Username", value: username, inline: true },
        { name: "Email", value: email, inline: true },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: "Coconutz User System" },
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    })

    if (!response.ok) throw new Error("Failed to send login to Discord")

    return Response.json({ success: true, userId: loggedInUser.id })
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ error: "Failed to login" }, { status: 500 })
  }
}
