import { NextResponse } from "next/server";
import { getUnanswered, ignoreUnanswered, addUnanswered } from "@/lib/db";

export async function GET() {
  try {
    const list = await getUnanswered();
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, question, topic } = body;

    if (action === "ignore") {
      if (!id) {
        return NextResponse.json({ error: "Missing ID for ignore action" }, { status: 400 });
      }
      await ignoreUnanswered(id);
      return NextResponse.json({ success: true });
    }

    if (action === "add") {
      if (!question) {
        return NextResponse.json({ error: "Missing question for add action" }, { status: 400 });
      }
      await addUnanswered(question, topic || "General");
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
