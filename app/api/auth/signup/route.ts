import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, username } = await request.json()

    if (!email || !username) {
      return NextResponse.json({ error: "Email and username are required" }, { status: 400 })
    }

    // Store user data in blob storage for manual processing
    const userData = {
      email,
      username,
      signupDate: new Date().toISOString(),
      id: crypto.randomUUID(),
    }

    const blob = await put(`users/${userData.id}.json`, JSON.stringify(userData), {
      access: "public",
    })

    // Also store in a master list for easy access
    try {
      const existingUsers = await fetch(
        `${process.env.BLOB_READ_WRITE_TOKEN ? "https://blob.vercel-storage.com" : ""}/users/list.json`,
      )
      let usersList = []
      if (existingUsers.ok) {
        usersList = await existingUsers.json()
      }

      usersList.push(userData)

      await put("users/list.json", JSON.stringify(usersList), {
        access: "public",
      })
    } catch (error) {
      console.log("Could not update user list, but user was created")
    }

    return NextResponse.json({
      success: true,
      message: "Account created! You will receive an email confirmation shortly.",
      userId: userData.id,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
