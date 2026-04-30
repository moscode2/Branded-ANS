import { NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL     = process.env.FROM_EMAIL ?? "briefings@africanarrativesignals.org";

type EmailPayload =
  | { type: "confirmation"; to: string; subject: string; planName: string }
  | { type: "daily_briefing"; to: string; subject: string; content: string; date: string };

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as EmailPayload;

    let html = "";

    if (payload.type === "confirmation") {
      html = confirmationTemplate(payload.planName);
    } else if (payload.type === "daily_briefing") {
      html = briefingTemplate(payload.content, payload.date);
    } else {
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:    FROM_EMAIL,
        to:      payload.to,
        subject: payload.subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Resend]", err);
      return NextResponse.json({ error: "Email send failed" }, { status: 500 });
    }

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("[email/send]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// email templates

function confirmationTemplate(planName: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#060a12;font-family:'DM Sans',Arial,sans-serif;color:#e8f4f8;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0d1b2e;border-bottom:1px solid rgba(0,212,255,0.15);padding:28px 40px;">
              <span style="font-family:monospace;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#00d4ff;">ANS</span>
              <span style="font-size:11px;color:#7a9bb5;margin-left:12px;letter-spacing:1px;text-transform:uppercase;">Africa Narrative Signals</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#080d18;padding:48px 40px;">
              <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#00d4ff;margin:0 0 16px;">Subscription Confirmed</p>
              <h1 style="font-size:32px;font-weight:700;color:#e8f4f8;margin:0 0 20px;line-height:1.2;">Welcome to ANS Intelligence.</h1>
              <p style="font-size:15px;color:#7a9bb5;line-height:1.7;margin:0 0 24px;">
                Your <strong style="color:#e8f4f8;">${planName}</strong> subscription is now active.
                Daily briefings will arrive each weekday morning at <strong style="color:#e8f4f8;">07:00 UTC</strong>.
              </p>
              <p style="font-size:15px;color:#7a9bb5;line-height:1.7;margin:0 0 32px;">
                Each briefing covers the day's key developments in African political narratives,
                disinformation incidents, and digital democracy signals — curated by our research team.
              </p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/insights"
                 style="display:inline-block;background:#00d4ff;color:#060a12;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:14px 32px;text-decoration:none;">
                Read Latest Insights →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#060a12;border-top:1px solid rgba(255,255,255,0.05);padding:24px 40px;">
              <p style="font-size:11px;color:#3d5a73;margin:0;line-height:1.6;">
                You can manage or cancel your subscription at any time via the
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/subscribe" style="color:#7a9bb5;">ANS subscription portal</a>.
                · © ${new Date().getFullYear()} Africa Narrative Signals
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function briefingTemplate(content: string, date: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#060a12;font-family:'DM Sans',Arial,sans-serif;color:#e8f4f8;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0d1b2e;border-bottom:1px solid rgba(0,212,255,0.15);padding:28px 40px;">
              <span style="font-family:monospace;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#00d4ff;">ANS</span>
              <span style="font-size:11px;color:#7a9bb5;margin-left:12px;letter-spacing:1px;text-transform:uppercase;">Daily Intelligence Briefing</span>
              <p style="font-size:11px;color:#3d5a73;margin:6px 0 0;font-family:monospace;">${date}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="background:#080d18;padding:48px 40px;">
              <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#00d4ff;margin:0 0 20px;">Today's Signals</p>
              <div style="font-size:15px;color:#7a9bb5;line-height:1.8;">
                ${content}
              </div>
              <div style="margin-top:40px;padding-top:28px;border-top:1px solid rgba(0,212,255,0.08);">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/insights"
                   style="display:inline-block;background:#00d4ff;color:#060a12;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:14px 32px;text-decoration:none;">
                  Full Insights Archive →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#060a12;border-top:1px solid rgba(255,255,255,0.05);padding:24px 40px;">
              <p style="font-size:11px;color:#3d5a73;margin:0;line-height:1.6;">
                You're receiving this because you hold an active ANS Intelligence subscription.
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/subscribe" style="color:#7a9bb5;">Manage subscription</a>
                · © ${new Date().getFullYear()} Africa Narrative Signals
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}