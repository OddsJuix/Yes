import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"
import fs from "fs/promises"
import path from "path"

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1414733071139213373/aXvMM6A46vg4Nr0EOh3F4QTHYO-NvlgjAep1Ezthc5TCBX6OIA38axGnwYcmrYsl8k6j"

const DATA_FILE = path.join(process.cwd(), "user-data.json")

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json()

    if (!email || !username || !password) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 })
    }

    // load existing users
    let users: any[] = []
    try {
      const raw = await fs.readFile(DATA_FILE, "utf-8")
      users = JSON.parse(raw)
    } catch {
      users = []
    }

    // check if email already exists
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        {
          error: "email already in use",
          help: "email support@coconutz.site to reset your username and email (your password stays private)",
          username: existingUser.username,
        },
        { status: 400 }
      )
    }

    // otherwise, create new account
    const passwordHash = await bcrypt.hash(password, 10)
    const userId = randomUUID()

    users.push({ userId, email, username, passwordHash })
    await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf-8")

    // send embed to discord
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
              { name: "UserID", value: userId, inline: false },
            ],
            footer: {
              text: "Coconutz Sign In system",
            },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    })

    return NextResponse.json({ message: "account created successfully", userId })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "server error" }, { status: 500 })
  }
}
