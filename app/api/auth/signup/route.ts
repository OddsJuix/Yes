import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"
import { Blob } from "node:buffer"
import fs from "fs/promises"
import path from "path"

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1414733071139213373/aXvMM6A46vg4Nr0EOh3F4QTHYO-NvlgjAep1Ezthc5TCBX6OIA38axGnwYcmrYsl8k6j"

const DATA_FILE = path.join(process.cwd(), "user-data.json")

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json()

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const userId = randomUUID()

    // load existing file
    let existing: any[] = []
    try {
      const raw = await fs.readFile(DATA_FILE, "utf-8")
      existing = JSON.parse(raw)
    } catch {
      existing = []
    }

    existing.push({ userId, email, username, passwordHash })

    await fs.writeFile(DATA_FILE, JSON.stringify(existing, null, 2), "utf-8")

    // send notification to discord (no password)
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📩 new signup\nusername: ${username}\nemail: ${email}\nuserId: ${userId}`,
      }),
    })

    return NextResponse.json({ message: "account created successfully", userId })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "server error" }, { status: 500 })
  }
}
