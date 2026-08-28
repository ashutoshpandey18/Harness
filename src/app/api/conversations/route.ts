import { NextResponse } from "next/server";
import { getConversations, saveMessage } from "../../../lib/db";

export async function GET() {
  try {
    const list = await getConversations();
    return NextResponse.json(list);
  } catch (err) {
    console.error("Failed to fetch conversations:", err);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { phone, text } = await req.json();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    await saveMessage(phone, "whatsapp", {
      sender: "Agent",
      text,
      time: timestamp
    }, {
      Observe: "Manual override reply from safety supervisor Console",
      ToolsCalled: "none",
      Confidence: 1.0,
      DatabaseSync: "Console override"
    });

    const list = await getConversations();
    return NextResponse.json(list);
  } catch (err) {
    console.error("Failed to save supervisor override:", err);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
