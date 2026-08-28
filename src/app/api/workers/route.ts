import { NextResponse } from "next/server";
import { getWorkers, addWorker, Worker } from "@/lib/db";

export async function GET() {
  try {
    const workers = await getWorkers();
    return NextResponse.json(workers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newWorker: Worker = {
      id: body.id || `w-0${Date.now()}`,
      phone: body.phone,
      name: body.name,
      language: body.language || "hi",
      department: body.department || "Production",
      active: "Just added"
    };
    
    await addWorker(newWorker);
    return NextResponse.json({ success: true, worker: newWorker });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
