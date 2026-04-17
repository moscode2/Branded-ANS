import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { error } = await supabase.from("contacts").insert([
      {
        name: body.name,
        email: body.email,
        organization: body.organization,
        inquiry_type: body.inquiryType,
        message: body.message,
        subscribe: body.subscribe,
      },
    ]);

    if (error) throw error;

    return Response.json({ message: "Message sent successfully!" });
  } catch (err) {
    return Response.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}