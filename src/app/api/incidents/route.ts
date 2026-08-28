import { NextResponse } from "next/server";
import { getIncidents, addIncident, resolveIncident, Incident } from "@/lib/db";

export async function GET() {
  try {
    const incidents = await getIncidents();
    return NextResponse.json(incidents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.action === "resolve") {
      if (!body.id) {
        return NextResponse.json({ error: "Missing incident ID" }, { status: 400 });
      }
      await resolveIncident(body.id);
      return NextResponse.json({ success: true, message: "Incident resolved" });
    }

    const newIncident: Incident = {
      id: body.id || `inc-0${Date.now()}`,
      worker: body.worker || "System",
      description: body.description,
      severity: body.severity || "MEDIUM",
      status: body.status || "open",
      time: body.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    await addIncident(newIncident);
    return NextResponse.json({ success: true, incident: newIncident });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
