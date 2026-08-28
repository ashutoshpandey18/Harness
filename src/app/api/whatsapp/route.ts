import { NextRequest, NextResponse } from "next/server";

// GET: Handshake verification from Meta developers dashboard
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "harness_verify_token_123";

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    console.log("WhatsApp Webhook handshake verified successfully.");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("WhatsApp Webhook handshake verification failed.");
  return new NextResponse("Forbidden", { status: 403 });
}

// POST: Handles incoming WhatsApp messages from workers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received WhatsApp payload:", JSON.stringify(body, null, 2));

    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    // If it's not a message event, ignore it (Meta sends read receipts, statuses, etc.)
    if (!message) {
      return NextResponse.json({ status: "ignored" });
    }

    const from = message.from; // Sender's phone number without plus (e.g., "919876543210")
    let text = "";

    if (message.type === "text") {
      text = message.text.body;
    } else if (message.type === "audio") {
      // Audio note received
      text = "[Audio Note Received] Safety helmet location query"; // Default placeholder if downloading media binary is not enabled
    } else {
      text = `[Unsupported message type: ${message.type}]`;
    }

    // Call the core RAG matching API logically:
    // We query our internal chat API route to perform full text embeddings matching, confidence scoring, translation, and logging.
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${APP_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        phone: `+${from}`,
        confidenceThreshold: 0.75
      })
    });

    if (!response.ok) {
      throw new Error(`RAG API failed with status ${response.status}`);
    }

    const replyData = await response.json();
    const replyText = replyData.text;

    // Send the reply back to the worker's WhatsApp chat using Meta Graph API
    const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

    if (WHATSAPP_PHONE_NUMBER_ID && WHATSAPP_ACCESS_TOKEN) {
      const metaRes = await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: replyText }
        })
      });

      if (!metaRes.ok) {
        const metaErr = await metaRes.text();
        console.error("Meta API delivery failed:", metaErr);
      } else {
        console.log(`Reply successfully delivered to +${from} via Meta WhatsApp API.`);
      }
    } else {
      console.warn("Meta credentials missing in env variables. Response logged to console/DB locally only.");
    }

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("WhatsApp webhook route handling error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
