import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { name, email, service, budget, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Konaverse Contact <onboarding@resend.dev>",
      to: "info@kona-verse.com",
      replyTo: email,
      subject: `New inquiry — ${name} · ${service || "General"}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #141414;">
          <h2 style="border-bottom: 2px solid #6B7F62; padding-bottom: 12px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
            <tr><td style="padding: 10px 0; color: #555; width: 120px;">Name</td><td style="padding: 10px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 10px 0; color: #555;">Email</td><td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #6B7F62;">${email}</a></td></tr>
            <tr><td style="padding: 10px 0; color: #555;">Service</td><td style="padding: 10px 0;">${service || "Not specified"}</td></tr>
            <tr><td style="padding: 10px 0; color: #555;">Budget</td><td style="padding: 10px 0;">${budget || "Not specified"}</td></tr>
          </table>
          <div style="margin-top: 24px; padding: 20px; background: #f5f2ed; border-radius: 8px;">
            <p style="margin: 0; color: #555; font-size: 13px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em;">Message</p>
            <p style="margin: 0; line-height: 1.7;">${message.replace(/\n/g, "<br>")}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
