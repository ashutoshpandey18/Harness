import { NextResponse } from "next/server";
import { getDocuments, addDocument, saveChunks, ChunkInfo } from "@/lib/db";

export async function GET() {
  try {
    const docs = await getDocuments();
    return NextResponse.json(docs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, content } = body;

    if (!name || !content) {
      return NextResponse.json({ error: "Missing document name or content" }, { status: 400 });
    }

    // Split content into chunks by paragraphs
    const paragraphs = content.split("\n\n").map((p: string) => p.trim()).filter((p: string) => p.length > 0);
    
    // Fallback split if there are no double newlines
    const rawChunks = paragraphs.length > 0 ? paragraphs : content.match(/.{1,400}/g) || [content];

    const newChunks: ChunkInfo[] = rawChunks.map((text: string, idx: number) => ({
      id: `ch-${Date.now()}-${idx}`,
      doc_name: name,
      content: text
    }));

    // Register document in library
    await addDocument({
      name,
      status: "Active",
      chunks: newChunks.length,
      date: new Date().toISOString().split("T")[0]
    });

    // Save document chunks
    await saveChunks(newChunks);

    return NextResponse.json({
      success: true,
      message: "Document indexed successfully",
      chunks: newChunks.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
