import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("date", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from("reports").insert([body]).select();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ message: "Report created", data });
}