// netlify/functions/scheduled-daily-briefing.mts
// This file is automatically run by Netlify on the cron schedule
// defined in netlify.toml: "0 7 * * 1-5" (07:00 UTC Mon–Fri)

import type { Config } from "@netlify/functions";

export default async function handler() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL;
  const secret  = process.env.CRON_SECRET;

  const res = await fetch(`${siteUrl}/api/cron/daily-briefing`, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${secret}`,
    },
  });

  const body = await res.json();
  console.log("[scheduled-daily-briefing]", body);
}

export const config: Config = {
  schedule: "0 7 * * 1-5",
};