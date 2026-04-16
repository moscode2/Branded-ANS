import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // ── Production: plug in your newsletter provider here ────────────────────
    // e.g. Mailchimp, ConvertKit, Buttondown, Loops
    //
    // Mailchimp example:
    // const response = await fetch(
    //   `https://us1.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email_address: email, status: "subscribed" }),
    //   }
    // );
    // ─────────────────────────────────────────────────────────────────────────

    console.log("[ANS Newsletter Signup]", {
      email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "You're subscribed. Welcome to the ANS Intelligence Briefing." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
