import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  // Security: only allow calls with the cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch all active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from("subscriptions")
      .select("email, plan_id")
      .eq("status", "active");

    if (subError || !subscribers?.length) {
      return NextResponse.json({ sent: 0, message: "No active subscribers" });
    }

    // 2. Get today's briefing content from Supabase
    const today = new Date().toISOString().slice(0, 10);
    const { data: briefing } = await supabase
      .from("daily_briefings")
      .select("content, subject")
      .eq("date", today)
      .single();

    // Fall back to auto-generated content if no manual briefing exists
    const content = briefing?.content ?? generateDefaultContent();
    const subject = briefing?.subject ?? `ANS Daily Briefing — ${formatDate(today)}`;

    // 3. Send emails in batches of 50
    const BATCH = 50;
    let sent = 0;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    for (let i = 0; i < subscribers.length; i += BATCH) {
      const batch = subscribers.slice(i, i + BATCH);
      await Promise.allSettled(
        batch.map(async (sub) => {
          const res = await fetch(`${siteUrl}/api/email/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type:    "daily_briefing",
              to:      sub.email,
              subject,
              content,
              date:    formatDate(today),
            }),
          });
          if (res.ok) sent++;
          else console.error(`Failed to send to ${sub.email}`);
        })
      );
    }

    // 4. Log the send
    await supabase.from("briefing_logs").insert({
      date:            today,
      recipients_sent: sent,
      total_active:    subscribers.length,
      sent_at:         new Date().toISOString(),
    });

    console.log(`[Daily Briefing] Sent to ${sent}/${subscribers.length} subscribers`);
    return NextResponse.json({ sent, total: subscribers.length });
  } catch (err) {
    console.error("[cron/daily-briefing]", err);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}

// Allow GET for manual health-check triggers
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, message: "Cron route reachable" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  });
}

function generateDefaultContent() {
  return `
    <p>Good morning. Here is today's ANS Intelligence snapshot.</p>
    <h2 style="color:#e8f4f8;font-size:18px;margin:28px 0 10px;">Narrative Watch</h2>
    <p>Our monitoring teams are tracking evolving political narratives across
    <strong style="color:#e8f4f8;">West, East, and Southern Africa</strong>.
    Today's key themes include election-cycle messaging, platform policy enforcement gaps,
    and cross-border disinformation campaigns.</p>
    <h2 style="color:#e8f4f8;font-size:18px;margin:28px 0 10px;">Signal of the Day</h2>
    <p>Full briefing content is populated by your editorial team via the ANS Admin dashboard
    under <strong style="color:#e8f4f8;">Daily Briefings → New Entry</strong>.
    This is a placeholder sent because no briefing was scheduled for today.</p>
    <p style="margin-top:24px;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/insights"
         style="color:#00d4ff;text-decoration:none;">→ Read the latest ANS insights</a>
    </p>
  `;
}