import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

export interface Worker {
  id: string;
  phone: string;
  name: string;
  language: string;
  department: string;
  active: string;
}

export interface Incident {
  id: string;
  worker: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  status: "open" | "in_progress" | "Resolved";
  time: string;
}

export interface DocumentInfo {
  name: string;
  status: string;
  chunks: number;
  date: string;
}

export interface ChunkInfo {
  id: string;
  doc_name: string;
  content: string;
}

export interface Unanswered {
  id: string;
  question: string;
  asked_count: number;
  cluster_topic: string;
  resolved: boolean;
}

export interface ChatMessage {
  sender: "Worker" | "Agent";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  phone: string;
  channel: string;
  snippet: string;
  messages: ChatMessage[];
  trace: {
    Observe: string;
    ToolsCalled: string;
    Confidence: number;
    DatabaseSync: string;
  };
}

interface LocalDB {
  workers: Worker[];
  incidents: Incident[];
  documents: DocumentInfo[];
  chunks: ChunkInfo[];
  unanswered: Unanswered[];
  conversations: Conversation[];
}

// Default Seed Data
const DEFAULT_DB: LocalDB = {
  workers: [
    { id: "w-01", phone: "+919876543210", name: "Ramesh Kumar", language: "hi", department: "Production", active: "5 mins ago" },
    { id: "w-02", phone: "+919922334455", name: "Rajesh Kumar", language: "hi", department: "Spinning Floor", active: "10 mins ago" },
    { id: "w-03", phone: "+919811223344", name: "Suresh Patil", language: "mr", department: "Warehouse A", active: "1 hour ago" },
    { id: "w-04", phone: "+918811223355", name: "Anil Sharma", language: "hi", department: "Production", active: "Yesterday" }
  ],
  incidents: [
    { id: "inc-01", worker: "Ramesh Kumar", description: "Smoke observed on line 2 main breaker", severity: "HIGH", status: "Resolved", time: "09:03 AM" },
    { id: "inc-02", worker: "Suresh Patil", description: "Forklift hydraulic line leakage near Gate 2", severity: "MEDIUM", status: "in_progress", time: "Yesterday" }
  ],
  documents: [
    { name: "SOP_Fire_Emergency_Safety.pdf", status: "Active", chunks: 3, date: "2026-06-12" },
    { name: "SOP_Machine4_Troubleshooting.docx", status: "Active", chunks: 3, date: "2026-06-15" }
  ],
  chunks: [
    { id: "ch-1", doc_name: "SOP_Fire_Emergency_Safety.pdf", content: "Fire safety regulations state that in case of fire or smoke on Line 2, immediately turn off the main gas valve. Alert supervisor Ramesh Kumar and evacuate the zone immediately. Fire extinguishers are located near Gate 2." },
    { id: "ch-2", doc_name: "SOP_Fire_Emergency_Safety.pdf", content: "For safety helmets, workers can check Store Room B near Gate 2. Supervisor Ramesh keeps extra safety goggles and helmets in Locker 3." },
    { id: "ch-3", doc_name: "SOP_Machine4_Troubleshooting.docx", content: "To reset Machine 4: If Error E-02 red light turns on, switch off the breaker completely. Wait 30 seconds. Turn breaker on and press the green Reset button." }
  ],
  unanswered: [
    { id: "un-01", question: "Store Room keys kis supervisor ke paas hain?", asked_count: 5, cluster_topic: "Keys & Access", resolved: false },
    { id: "un-02", question: "Line 2 reset alarm kaise silience karein?", asked_count: 3, cluster_topic: "Alarm controls", resolved: false }
  ],
  conversations: [
    {
      id: "c-01",
      phone: "+919876543210",
      channel: "whatsapp",
      snippet: "yahan pe line 2 mein smoke...",
      messages: [
        { sender: "Worker", text: "yahan pe line 2 mein smoke aa raha hai jaldi aao", time: "09:03 AM" },
        { sender: "Agent", text: "[EMERGENCY ALERT] Line 2 mein aag/smoke detect kiya gaya hai. Main gas valve band karein. Supervisor Ramesh ji ko notify kar diya gaya hai.", time: "09:03 AM" }
      ],
      trace: {
        Observe: "Worker reported: 'smoke'",
        ToolsCalled: "log_incident(), route_to_supervisor()",
        Confidence: 0.98,
        DatabaseSync: "Logged incident inc-01 successfully"
      }
    },
    {
      id: "c-02",
      phone: "+919922334455",
      channel: "whatsapp",
      snippet: "Safety helmet kahan milega?",
      messages: [
        { sender: "Worker", text: "Safety helmet kahan milega?", time: "09:01 AM" },
        { sender: "Agent", text: "Store Room B mein — Gate 2 ke paas. Supervisor Ramesh ji ke paas extra hain. (SOP Sec 2.1)", time: "09:01 AM" }
      ],
      trace: {
        Observe: "Worker query: 'safety helmet'",
        ToolsCalled: "search_knowledge_base()",
        Confidence: 0.96,
        DatabaseSync: "Cache query hit"
      }
    }
  ]
};

// Ensure database file exists
function initLocalDB(): LocalDB {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf8");
    return DEFAULT_DB;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(data);
    // Backward compatibility check
    let changed = false;
    if (!parsed.unanswered) {
      parsed.unanswered = DEFAULT_DB.unanswered;
      changed = true;
    }
    if (!parsed.conversations) {
      parsed.conversations = DEFAULT_DB.conversations;
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf8");
    }
    return parsed;
  } catch (e) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf8");
    return DEFAULT_DB;
  }
}

function saveLocalDB(data: LocalDB) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

// Supabase Request Helper
async function sbRequest(path: string, options: RequestInit = {}): Promise<any> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase URL or Key not set");
  }

  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const headers = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
    ...(options.headers || {})
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase error: ${response.status} - ${text}`);
  }
  return response.json();
}

// 1. WORKERS
export async function getWorkers(): Promise<Worker[]> {
  try {
    return await sbRequest("harness_workers?select=*");
  } catch (e) {
    console.warn("Supabase fetch failed, falling back to local DB:", e);
    return initLocalDB().workers;
  }
}

export async function addWorker(worker: Worker): Promise<void> {
  const db = initLocalDB();
  db.workers.push(worker);
  saveLocalDB(db);

  try {
    await sbRequest("harness_workers", {
      method: "POST",
      body: JSON.stringify(worker)
    });
  } catch (e) {
    console.warn("Supabase insert failed, saved locally:", e);
  }
}

// 2. INCIDENTS
export async function getIncidents(): Promise<Incident[]> {
  try {
    return await sbRequest("harness_incidents?select=*");
  } catch (e) {
    console.warn("Supabase fetch failed, falling back to local DB:", e);
    return initLocalDB().incidents;
  }
}

export async function addIncident(incident: Incident): Promise<void> {
  const db = initLocalDB();
  db.incidents.push(incident);
  saveLocalDB(db);

  try {
    await sbRequest("harness_incidents", {
      method: "POST",
      body: JSON.stringify(incident)
    });
  } catch (e) {
    console.warn("Supabase insert failed, saved locally:", e);
  }
}

export async function resolveIncident(id: string): Promise<void> {
  const db = initLocalDB();
  db.incidents = db.incidents.map(inc => inc.id === id ? { ...inc, status: "Resolved" } : inc);
  saveLocalDB(db);

  try {
    await sbRequest(`harness_incidents?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Resolved" })
    });
  } catch (e) {
    console.warn("Supabase patch failed, resolved locally:", e);
  }
}

// 3. DOCUMENTS
export async function getDocuments(): Promise<DocumentInfo[]> {
  try {
    return await sbRequest("harness_documents?select=*");
  } catch (e) {
    console.warn("Supabase fetch failed, falling back to local DB:", e);
    return initLocalDB().documents;
  }
}

export async function addDocument(doc: DocumentInfo): Promise<void> {
  const db = initLocalDB();
  db.documents.push(doc);
  saveLocalDB(db);

  try {
    await sbRequest("harness_documents", {
      method: "POST",
      body: JSON.stringify(doc)
    });
  } catch (e) {
    console.warn("Supabase insert failed, saved locally:", e);
  }
}

export async function saveChunks(newChunks: ChunkInfo[]): Promise<void> {
  const db = initLocalDB();
  db.chunks.push(...newChunks);
  saveLocalDB(db);

  try {
    await sbRequest("harness_chunks", {
      method: "POST",
      body: JSON.stringify(newChunks.map(c => ({
        id: c.id,
        doc_name: c.doc_name,
        content: c.content
      })))
    });
  } catch (e) {
    console.warn("Supabase chunks insert failed, saved locally:", e);
  }
}

// 4. UNANSWERED
export async function getUnanswered(): Promise<Unanswered[]> {
  try {
    return await sbRequest("harness_unanswered?select=*");
  } catch (e) {
    console.warn("Supabase fetch failed, falling back to local DB:", e);
    return initLocalDB().unanswered;
  }
}

export async function addUnanswered(question: string, topic = "General"): Promise<void> {
  const db = initLocalDB();
  const existing = db.unanswered.find(u => u.question.toLowerCase() === question.toLowerCase());
  
  if (existing) {
    existing.asked_count += 1;
  } else {
    const newUn: Unanswered = {
      id: `un-0${Date.now()}`,
      question,
      asked_count: 1,
      cluster_topic: topic,
      resolved: false
    };
    db.unanswered.push(newUn);
  }
  saveLocalDB(db);

  try {
    if (existing) {
      await sbRequest(`harness_unanswered?id=eq.${existing.id}`, {
        method: "PATCH",
        body: JSON.stringify({ asked_count: existing.asked_count })
      });
    } else {
      await sbRequest("harness_unanswered", {
        method: "POST",
        body: JSON.stringify({
          id: `un-0${Date.now()}`,
          question,
          asked_count: 1,
          cluster_topic: topic,
          resolved: false
        })
      });
    }
  } catch (e) {
    console.warn("Supabase unanswered sync failed, saved locally:", e);
  }
}

export async function ignoreUnanswered(id: string): Promise<void> {
  const db = initLocalDB();
  db.unanswered = db.unanswered.filter(u => u.id !== id);
  saveLocalDB(db);

  try {
    await sbRequest(`harness_unanswered?id=eq.${id}`, {
      method: "DELETE"
    });
  } catch (e) {
    console.warn("Supabase ignore failed, deleted locally:", e);
  }
}

// 4b. CONVERSATIONS
export async function getConversations(): Promise<Conversation[]> {
  try {
    return await sbRequest("harness_conversations?select=*");
  } catch (e) {
    console.warn("Supabase fetch failed, falling back to local DB:", e);
    return initLocalDB().conversations;
  }
}

export async function saveMessage(
  phone: string,
  channel: string,
  message: ChatMessage,
  trace?: { Observe: string; ToolsCalled: string; Confidence: number; DatabaseSync: string }
): Promise<void> {
  const db = initLocalDB();
  let conv = db.conversations.find(c => c.phone === phone && c.channel === channel);

  if (!conv) {
    conv = {
      id: `c-0${Date.now()}`,
      phone,
      channel,
      snippet: message.text.substring(0, 40) + (message.text.length > 40 ? "..." : ""),
      messages: [],
      trace: trace || {
        Observe: "Initial check",
        ToolsCalled: "none",
        Confidence: 1.0,
        DatabaseSync: "Inited conversation"
      }
    };
    db.conversations.push(conv);
  }

  conv.messages.push(message);
  conv.snippet = message.text.substring(0, 40) + (message.text.length > 40 ? "..." : "");
  if (trace) {
    conv.trace = trace;
  }
  saveLocalDB(db);

  try {
    // Upsert to Supabase
    await sbRequest("harness_conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        id: conv.id,
        phone: conv.phone,
        channel: conv.channel,
        snippet: conv.snippet,
        messages: conv.messages,
        trace: conv.trace
      })
    });
  } catch (e) {
    console.warn("Supabase conversations upsert failed, saved locally:", e);
  }
}

// 5. TF-IDF SIMILARITY MATCH
export function searchChunksLocal(query: string, matchThreshold = 0.25): { chunk: ChunkInfo; score: number }[] {
  const db = initLocalDB();
  const chunks = db.chunks;

  if (chunks.length === 0) return [];

  // TF-IDF Tokenizer Helper
  const tokenize = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      .split(/\s+/)
      .filter(w => w.length > 2); // filter out short stop-words
  };

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  // Compute IDF for each query token
  const idf: Record<string, number> = {};
  const N = chunks.length;

  for (const token of queryTokens) {
    const docFreq = chunks.filter(c => tokenize(c.content).includes(token)).length;
    idf[token] = Math.log((N + 1) / (docFreq + 1)) + 1; // smooth IDF
  }

  // Score each chunk
  const results = chunks.map(chunk => {
    const chunkTokens = tokenize(chunk.content);
    let score = 0;

    for (const token of queryTokens) {
      const termFreq = chunkTokens.filter(t => t === token).length;
      if (termFreq > 0) {
        score += termFreq * idf[token];
      }
    }

    // Normalise score by length of chunk
    const normalizedScore = score / (1 + Math.log(chunkTokens.length + 1));
    return { chunk, score: normalizedScore };
  });

  // Sort and scale scores (max score to around 0.98 scale)
  const sorted = results.sort((a, b) => b.score - a.score);
  const maxScore = sorted[0]?.score || 1;
  
  return sorted
    .map(r => ({
      chunk: r.chunk,
      score: Math.min(0.98, Number((r.score / (maxScore || 1) * 0.95).toFixed(2)))
    }))
    .filter(r => r.score >= matchThreshold);
}

