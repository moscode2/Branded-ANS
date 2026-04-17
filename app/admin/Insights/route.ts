import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("articles").select("*");

  if (error) return Response.json({ error }, { status: 500 });

  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabase.from("articles").insert([body]);

  if (error) return Response.json({ error }, { status: 500 });

  return Response.json({ message: "Article created", data });
}