import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const { error } = await supabase.from("subscribers").insert([{ email }]);

    if (error) throw error;

    return Response.json({ message: "Subscribed successfully!" });
  } catch {
    return Response.json(
      { error: "Subscription failed" },
      { status: 500 }
    );
  }
}