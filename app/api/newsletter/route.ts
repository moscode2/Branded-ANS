import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Basic validation
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Insert into Supabase — unique constraint handles duplicates
    const { error } = await supabase
      .from("subscribers")
      .insert([{ email: normalized }]);

    if (error) {
      // Unique violation — already subscribed
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "You're already subscribed — we'll keep sending your weekly briefing." },
          { status: 200 }
        );
      }
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Could not save your subscription. Please try again." }, { status: 500 });
    }

    return NextResponse.json(
      { message: "You're subscribed! Your first briefing arrives this Friday." },
      { status: 200 }
    );

  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}