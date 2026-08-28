import { NextResponse } from "next/server";
import { searchChunksLocal, addIncident, addUnanswered, saveMessage } from "@/lib/db";
import { callLLM } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, phone = "+919876543210", confidenceThreshold = 0.75 } = body;

    if (!text) {
      return NextResponse.json({ error: "Missing query text" }, { status: 400 });
    }

    const messageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Save the incoming worker message first
    await saveMessage(phone, "whatsapp", { sender: "Worker", text, time: messageTime });

    // 1. Language Check & Standardisation (Emergency words are safety-gated)
    const normalizedText = text.toLowerCase();
    const safetyKeywords = [
      "smoke", "fire", "leak", "breaker", "shock", "spill", "accident", 
      "emergency", "aag", "gas", "chemical", "boiler", "blast", "danger", 
      "khatra", "explosion"
    ];
    const isEmergency = safetyKeywords.some(kw => normalizedText.includes(kw));

    // 2. Similarity Search using TF-IDF Match
    // Fetch matching chunks down to a broad range (0.1) to show matching metrics in trace logs
    const matches = searchChunksLocal(text, 0.1);
    const topMatch = matches[0];
    const score = topMatch ? topMatch.score : 0;

    // 3. Routing Evaluation
    if (score >= confidenceThreshold) {
      // Assemble context for RAG
      const context = matches
        .slice(0, 3)
        .map((m, idx) => `[Chunk ${idx + 1} (Source: ${m.chunk.doc_name})]: ${m.chunk.content}`)
        .join("\n\n");

      const systemPrompt = `You are MAGS.ai, an agentic safety and operation assistant on the shop floor.
You must answer the worker's query using ONLY the provided Standard Operating Procedure (SOP) context.
Do NOT use outside knowledge. If the context does not contain enough information, explain that you don't know or ask for clarification.
Answer in the same language as the user query.
Keep it simple, clear, and action-oriented for a factory worker. Use bold formatting where appropriate.

SOP Context:
${context}`;

      // Call OpenRouter
      const reply = await callLLM([
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ], { model: "google/gemini-2.5-flash", temperature: 0.2 });

      const trace = {
        Observe: `Worker query: "${text}"`,
        ToolsCalled: "search_knowledge_base()",
        Confidence: score,
        DatabaseSync: `Loaded ${matches.length} chunks from database. Matched context source: ${topMatch.chunk.doc_name}`,
        MatchedChunks: matches.slice(0, 3).map(m => ({ doc: m.chunk.doc_name, text: m.chunk.content, score: m.score })),
        Prompt: `System: [MAGS.ai System Rules & Context]\nUser: ${text}`
      };

      // Save outgoing agent reply
      await saveMessage(phone, "whatsapp", { sender: "Agent", text: reply, time: messageTime }, trace);

      return NextResponse.json({
        text: reply,
        sender: "Agent",
        confidence: score,
        trace
      });

    } else if (isEmergency) {
      // Safety emergency logged immediately
      const incId = `inc-0${Date.now().toString().slice(-4)}`;
      const workerName = phone === "+919876543210" ? "Ramesh Kumar" : "Worker";
      
      const newIncident = {
        id: incId,
        worker: workerName,
        description: text,
        severity: "HIGH" as const,
        status: "open" as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      await addIncident(newIncident);

      // Emergency response
      const baseEscalationText = `[EMERGENCY ALERT] Safety incident logged. Main line breaker and auxiliary valves should be shut off. Supervisor has been notified and is on their way. Please evacuate immediately.`;
      
      const trace = {
        Observe: `Safety emergency detected: "${text}"`,
        ToolsCalled: "log_incident(), route_to_supervisor()",
        Confidence: score,
        DatabaseSync: `Incident logged in Supabase/Local JSON: ${incId}`,
        MatchedChunks: matches.slice(0, 3).map(m => ({ doc: m.chunk.doc_name, text: m.chunk.content, score: m.score })),
        Prompt: `Emergency routing triggered. Score ${score} below threshold ${confidenceThreshold}.`
      };

      // Save outgoing agent reply
      await saveMessage(phone, "whatsapp", { sender: "Agent", text: baseEscalationText, time: messageTime }, trace);

      return NextResponse.json({
        text: baseEscalationText,
        sender: "Agent",
        confidence: score,
        trace
      });

    } else {
      // Low confidence, log to unanswered queries pool
      await addUnanswered(text, "Uncategorized");

      const baseReply = `I'm sorry, I couldn't find a high-confidence answer in our current Standard Operating Procedures. I have logged your query in the supervisor pool so they can update my manual records. (Confidence: ${score})`;

      const trace = {
        Observe: `Query below threshold: "${text}"`,
        ToolsCalled: "log_unanswered_pool()",
        Confidence: score,
        DatabaseSync: "Query added to unanswered queries ledger",
        MatchedChunks: matches.slice(0, 3).map(m => ({ doc: m.chunk.doc_name, text: m.chunk.content, score: m.score })),
        Prompt: `Low confidence threshold escalation. Score ${score} < ${confidenceThreshold}.`
      };

      // Save outgoing agent reply
      await saveMessage(phone, "whatsapp", { sender: "Agent", text: baseReply, time: messageTime }, trace);

      return NextResponse.json({
        text: baseReply,
        sender: "Agent",
        confidence: score,
        trace
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
