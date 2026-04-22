import { NextResponse } from "next/server";

let reports: any[] = [];

export async function GET() {
  return NextResponse.json(reports);
}

export async function POST(req: Request) {
  const body = await req.json();
  reports.push(body);
  return NextResponse.json({ success: true });
}