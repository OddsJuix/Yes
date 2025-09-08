export async function POST(request: Request) {
  try {
    const { name, email, message, page } = await request.json()

    const webhookUrl =
      "https://discord.com/api/webhooks/1414718013902553172/LHP00oM27C57JmCyxg5olqJbcMDOyhQcMIuNj82XxGK7An_r_Qfg5WhY4GjGhHsCOz9J"

    const embed = {
      title: `New Contact Form Submission - ${page}`,
      color: 0x14b8a6, // Teal color matching the site
      fields: [
        {
          name: "Name",
          value: name,
          inline: true,
        },
        {
          name: "Email",
          value: email,
          inline: true,
        },
        {
          name: "Message",
          value: message,
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Coconutz Contact Form",
      },
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send to Discord")
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return Response.json({ error: "Failed to send message" }, { status: 500 })
  }
}
