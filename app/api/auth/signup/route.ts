import { put } from "@vercel/blob"
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

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    const userData = {
      username,
      password: hashedPassword,
      signupDate: new Date().toISOString(),
      id: crypto.randomUUID(),
    }

    // save to blob
    await put(`users/${userData.id}.json`, JSON.stringify(userData), { access: "private" })

    // send username + email only to discord
    const embed = {
      title: "🆕 New User Signup",
      color: 0x14b8a6,
      fields: [
        { name: "Username", value: username, inline: true },
        { name: "Email", value: email, inline: true },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: "Coconutz Signup System" },
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    })

    if (!res.ok) throw new Error("Failed to send signup to Discord")

    return Response.json({ success: true, userId: userData.id })
  } catch (error) {
    console.error("Signup error:", error)
    return Response.json({ error: "Failed to create account" }, { status: 500 })
  }
}
