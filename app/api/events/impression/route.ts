import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, user_agent } = await req.json();

    const token = process.env.ETKINLIK_API_TOKEN?.trim();

    const res = await fetch(
      `https://etkinlik.io/api/v2/events/${id}/impressions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Etkinlik-Token": token || "",
        },
        body: JSON.stringify({
          user_agent,
        }),
      }
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Impression gönderilemedi." },
      { status: 500 }
    );
  }
}