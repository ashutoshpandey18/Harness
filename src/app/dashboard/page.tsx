"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PhoneSimulator from "@/components/PhoneSimulator";

/* ─── Custom Designed Logo Component ─── */
const Logo = () => (
  <span className="logo-brand" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", gap: "6px", verticalAlign: "middle" }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" style={{ color: "var(--text)" }}>
      <path d="M5 4v16M19 4v16M5 12h14" />
      <circle cx="12" cy="12" r="3.5" fill="var(--bg)" stroke="var(--orange)" strokeWidth="3" />
    </svg>
    <span style={{ fontWeight: 900, fontSize: "18px", color: "var(--text)", letterSpacing: "-0.03em" }}>
      Harness<span style={{ color: "var(--orange)", fontWeight: 500 }}>.ai</span>
    </span>
  </span>
);

// Mock types
interface Worker {
  id: string;
  phone: string;
  name: string;
  language: string;
  department: string;
  active: string;
}

interface Incident {
  id: string;
  worker: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  status: "open" | "in_progress" | "Resolved";
  time: string;
}

interface Unanswered {
  id: string;
  question: string;
  asked_count: number;
  cluster_topic: string;
  resolved: boolean;
}

interface ChatMessage {
  sender: "Worker" | "Agent";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  phone: string;
  snippet: string;
  messages: ChatMessage[];
  trace: {
    Observe: string;
    ToolsCalled: string;
    Confidence: number;
    DatabaseSync: string;
  };
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  /* Theme initialisation */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark";
    setTheme(isDark ? "dark" : "light");
    document.body.classList.toggle("dark-theme", isDark);
    document.body.classList.toggle("light-theme", !isDark);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.body.classList.toggle("dark-theme", next === "dark");
    document.body.classList.toggle("light-theme", next === "light");
  };

  // Roster State
  const [workers, setWorkers] = useState<Worker[]>([
    { id: "w-01", phone: "+919876543210", name: "Ramesh Kumar", language: "hi", department: "Production", active: "5 mins ago" },
    { id: "w-02", phone: "+919922334455", name: "Rajesh Kumar", language: "hi", department: "Spinning Floor", active: "10 mins ago" },
    { id: "w-03", phone: "+919811223344", name: "Suresh Patil", language: "mr", department: "Warehouse A", active: "1 hour ago" },
    { id: "w-04", phone: "+918811223355", name: "Anil Sharma", language: "hi", department: "Production", active: "Yesterday" }
  ]);

  // Incidents State
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: "inc-01", worker: "Ramesh Kumar", description: "Smoke observed on line 2 main breaker", severity: "HIGH", status: "Resolved", time: "09:03 AM" },
    { id: "inc-02", worker: "Suresh Patil", description: "Forklift hydraulic line leakage near Gate 2", severity: "MEDIUM", status: "in_progress", time: "Yesterday" }
  ]);

  // Unanswered Pool State
  const [unanswered, setUnanswered] = useState<Unanswered[]>([
    { id: "un-01", question: "Store Room keys kis supervisor ke paas hain?", asked_count: 5, cluster_topic: "Keys & Access", resolved: false },
    { id: "un-02", question: "Line 2 reset alarm kaise silience karein?", asked_count: 3, cluster_topic: "Alarm controls", resolved: false }
  ]);

  // Selected Draft Item for Claude SOP
  const [draftItem, setDraftItem] = useState<Unanswered | null>(null);

  // Conversations State
  const [conversations] = useState<Conversation[]>([
    {
      id: "c-01",
      phone: "+919876543210",
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
  ]);
  const [selectedConvId, setSelectedConvId] = useState<string>("c-01");

  // Knowledge base Documents state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [documents, setDocuments] = useState([
    { name: "SOP_Fire_Emergency_Safety.pdf", status: "Active", chunks: 14, date: "2026-06-12" },
    { name: "SOP_Machine4_Troubleshooting.docx", status: "Active", chunks: 28, date: "2026-06-15" }
  ]);

  // Shift briefing textarea value
  const [briefingText, setBriefingText] = useState("");

  // Settings Slider
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.75);

  // Auto-run chart animation hook
  useEffect(() => {
    if (activeTab === "overview") {
      const path = document.querySelector(".chart-line") as SVGPathElement;
      if (path) {
        path.style.animation = "none";
        path.getBoundingClientRect(); /* trigger reflow */
        path.style.animation = "drawChartLine 2s cubic-bezier(0.4, 0, 0.2, 1) forwards";
      }
    }
  }, [activeTab]);

  // Upload Simulation handler
  const runUploadSimulation = () => {
    if (isUploading) return;
    setIsUploading(true);
    setUploadPercent(0);
    setUploadStatus("Uploading PDF to Supabase Storage...");

    let pct = 0;
    const statuses = [
      { pct: 10, msg: "Uploading PDF to Supabase Storage..." },
      { pct: 30, msg: "Mammoth parsing document headers..." },
      { pct: 50, msg: "Splitting text into 500-token chunks (50 overlap)..." },
      { pct: 75, msg: "Computing 1536-dimensional embeddings (OpenAI API)..." },
      { pct: 90, msg: "Writing vectors to pgvector Supabase catalog..." },
      { pct: 100, msg: "Indexing finished. SOP Active!" }
    ];

    const interval = setInterval(() => {
      pct += 2;
      setUploadPercent(pct);

      const matched = statuses.find(s => pct <= s.pct);
      if (matched) {
        setUploadStatus(matched.msg);
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setDocuments(prev => [
            ...prev,
            { name: "SOP_Electrical_Safety_v2.pdf", status: "Active", chunks: 18, date: "Just now" }
          ]);
        }, 800);
      }
    }, 80);
  };

  // Add mock worker
  const handleAddWorker = () => {
    const nextIdNum = workers.length + 1;
    const newW: Worker = {
      id: `w-0${nextIdNum}`,
      phone: `+91987541${Math.floor(1000 + Math.random() * 9000)}`,
      name: "Satish Patil",
      language: "hi",
      department: "Production",
      active: "Just added"
    };
    setWorkers(prev => [...prev, newW]);
  };

  // Resolve incident
  const handleResolveIncident = (id: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, status: "Resolved" } : inc))
    );
  };

  // Ignore unanswered question
  const handleIgnoreQuestion = (id: string) => {
    setUnanswered(prev => prev.filter(item => item.id !== id));
  };

  // Confirm Claude SOP addition
  const handleConfirmSop = (id: string) => {
    setUnanswered(prev => prev.filter(item => item.id !== id));
    setDraftItem(null);
    alert("SOP document successfully re-chunked and vectors updated in pgvector!");
  };

  // Generate shift briefing
  const handleGenerateBriefing = () => {
    setBriefingText(
      "[ALERT] VELVET GARMENTS - MORNING BRIEFING - 19 JUNE 2026\n\n1. SAFETY COMPLIANCE: Kal line 2 breaker mein short circuit/smoke dekha gaya tha. Aaj work shuru karne se pehle valve check karein.\n2. PRODUCTION GOALS: Line 1 targets are 2,400 pieces today. Let's maintain safety regulations.\n3. HELMETS: Extra safety helmets are in Store Room B next to Gate 2."
    );
  };

  // Broadcast briefing
  const handleBroadcastBriefing = () => {
    if (!briefingText.trim()) {
      alert("Please generate or draft a briefing first!");
      return;
    }
    alert("Morning briefing broadcasted successfully to all 142 worker lines!");
    setBriefingText("");
  };

  // Active Conversations helper
  const selectedConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  return (
    <div id="admin-dashboard-view">
      <div className="dashboard-wrapper">
        <main className="db-main">
          {/* Header */}
          <header className="db-header">
            <div className="db-header-top">
              <div className="logo" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <Logo />{" "}
                <span className="badge db-badge" style={{ verticalAlign: "middle" }}>
                  Console
                </span>
              </div>
              <h2 id="db-view-title" className="db-view-title">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "documents" && "Knowledge Base (SOP Vault)"}
                {activeTab === "conversations" && "Chat Monitor & Traces"}
                {activeTab === "unanswered" && "Unanswered Questions Pool"}
                {activeTab === "incidents" && "Incident Resolution Log"}
                {activeTab === "workers" && "Roster & Employee Catalog"}
                {activeTab === "analytics" && "Usage Analytics & Logs"}
                {activeTab === "briefings" && "Shift Briefing Broadcaster"}
                {activeTab === "settings" && "Console Settings & Sliders"}
              </h2>
              <div className="db-user-meta">
                <span className="db-company-tag">Velvet Garments Ltd.</span>
                <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle theme" style={{ padding: "8px", display: "flex", alignItems: "center" }}>
                  {theme === "light"
                    ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
                    : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                  }
                </button>
                <Link href="/" className="btn-g" style={{ padding: "6px 14px", fontSize: "11.5px" }}>
                  Return to Site
                </Link>
                <span className="db-avatar">A</span>
              </div>
            </div>

            <div className="db-top-nav-scroll">
              <ul className="db-top-nav">
                <li className={activeTab === "overview" ? "active" : ""} onClick={() => { setActiveTab("overview"); setDraftItem(null); }}>Overview</li>
                <li className={activeTab === "documents" ? "active" : ""} onClick={() => { setActiveTab("documents"); setDraftItem(null); }}>Knowledge Base</li>
                <li className={activeTab === "conversations" ? "active" : ""} onClick={() => { setActiveTab("conversations"); setDraftItem(null); }}>Conversations</li>
                <li className={activeTab === "unanswered" ? "active" : ""} onClick={() => { setActiveTab("unanswered"); setDraftItem(null); }}>Unanswered Qs</li>
                <li className={activeTab === "incidents" ? "active" : ""} onClick={() => { setActiveTab("incidents"); setDraftItem(null); }}>Incident Log</li>
                <li className={activeTab === "workers" ? "active" : ""} onClick={() => { setActiveTab("workers"); setDraftItem(null); }}>Workers</li>
                <li className={activeTab === "analytics" ? "active" : ""} onClick={() => { setActiveTab("analytics"); setDraftItem(null); }}>Analytics</li>
                <li className={activeTab === "briefings" ? "active" : ""} onClick={() => { setActiveTab("briefings"); setDraftItem(null); }}>Shift Briefings</li>
                <li className={activeTab === "settings" ? "active" : ""} onClick={() => { setActiveTab("settings"); setDraftItem(null); }}>Settings</li>
              </ul>
            </div>
          </header>

          {/* Sub-views content area */}
          <div className="db-content-area" id="db-content">
            
            {/* 1. OVERVIEW */}
            {activeTab === "overview" && (
              <>
                <div className="db-grid-spacious">
                  {/* Column 1: Simulator Dock */}
                  <div id="db-phone-dock" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <PhoneSimulator isDashboardDocked={true} />
                  </div>

                  {/* Column 2: Stacked Stats Cards */}
                  <div className="metrics-column">
                    <div className="metric-card">
                      <div className="metric-info">
                        <h5>Active Workers</h5>
                        <div className="num">4,812</div>
                      </div>
                      <span className="trend-badge tag-v1">+12.47%</span>
                    </div>
                    <div className="metric-card">
                      <div className="metric-info">
                        <h5>Jobs Fulfilled</h5>
                        <div className="num">21,509</div>
                      </div>
                      <span className="trend-badge tag-v1">+7%</span>
                    </div>
                    <div className="metric-card">
                      <div className="metric-info">
                        <h5>Job Matching Rate</h5>
                        <div className="num">94.2%</div>
                      </div>
                      <span className="trend-badge tag-v1">+1.5%</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Panel: SVG Chart */}
                <div className="chart-panel-spacious" style={{ marginTop: "32px" }}>
                  <h4 style={{ fontWeight: 600 }}>Monthly Growth</h4>
                  <p style={{ fontSize: "12px", color: "var(--muted)", margin: "-8px 0 8px" }}>
                    Candidate sign-ups over months
                  </p>
                  <div className="chart-container-svg" style={{ height: "200px" }}>
                    <svg viewBox="0 0 800 200" width="100%" height="100%" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.25"></stop>
                          <stop offset="100%" stopColor="var(--orange)" stopOpacity="0.00"></stop>
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="160" x2="800" y2="160" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4" />
                      <line x1="0" y1="100" x2="800" y2="100" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4" />
                      <line x1="0" y1="40" x2="800" y2="40" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4" />
                      
                      <path d="M 0 180 Q 150 160 300 130 T 450 120 T 600 70 T 800 30 L 800 200 L 0 200 Z" fill="url(#chart-grad)" />
                      <path className="chart-line" d="M 0 180 Q 150 160 300 130 T 450 120 T 600 70 T 800 30" />
                      
                      <text x="5" y="152" fontSize="9" fill="var(--muted2)" fontFamily="var(--font-mono)">300</text>
                      <text x="5" y="92" fontSize="9" fill="var(--muted2)" fontFamily="var(--font-mono)">600</text>
                      <text x="5" y="32" fontSize="9" fill="var(--muted2)" fontFamily="var(--font-mono)">1,200</text>
                    </svg>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px", fontSize: "10px", fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-sans)", marginTop: "8px" }}>
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </div>
              </>
            )}

            {/* 2. KNOWLEDGE BASE */}
            {activeTab === "documents" && (
              <>
                <div className="upload-dropzone" onClick={runUploadSimulation} style={{ cursor: "pointer" }}>
                  <svg className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: "40px", height: "40px", margin: "0 auto 12px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p>Drag and drop SOP manuals (PDF, DOCX, TXT) here, or <b>browse files</b></p>
                </div>

                {isUploading && (
                  <div className="upload-progress-container" style={{ display: "block", marginTop: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 500 }}>
                      <span>SOP_Electrical_Safety_v2.pdf</span>
                      <span>{uploadPercent}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fg" style={{ width: `${uploadPercent}%` }}></div>
                    </div>
                    <div className="progress-status-text">{uploadStatus}</div>
                  </div>
                )}

                <h4 style={{ margin: "24px 0 12px", fontWeight: 600 }}>Document Files</h4>
                <div className="tbl-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Filename</th>
                        <th>Status</th>
                        <th>Chunks</th>
                        <th>Upload Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, idx) => (
                        <tr key={idx}>
                          <td>{doc.name}</td>
                          <td><span className="tag tag-v1">{doc.status}</span></td>
                          <td>{doc.chunks} chunks</td>
                          <td>{doc.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* 3. CONVERSATIONS */}
            {activeTab === "conversations" && (
              <div className="conv-grid">
                <div className="conv-thread-list">
                  {conversations.map(conv => (
                    <div
                      key={conv.id}
                      className={`conv-card ${conv.id === selectedConvId ? "active" : ""}`}
                      onClick={() => setSelectedConvId(conv.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="conv-card-meta">
                        <span className="conv-card-phone">{conv.phone}</span>
                        <span>Just now</span>
                      </div>
                      <div className="conv-card-snippet">{conv.snippet}</div>
                    </div>
                  ))}
                </div>

                <div className="conv-thread-detail">
                  <div style={{ borderBottom: "0.5px solid var(--border)", paddingBottom: "12px", marginBottom: "16px" }}>
                    <h4>{selectedConv.phone}</h4>
                    <span style={{ fontSize: "11px", color: "var(--muted2)" }}>Agentic Memory Trace · ID: {selectedConv.id}</span>
                  </div>
                  <div className="conv-messages" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {selectedConv.messages.map((m, idx) => (
                      <div key={idx} className={`msg ${m.sender === "Worker" ? "msg-in" : "msg-out"}`}>
                        {m.text}
                        <span className="msg-time">{m.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="conv-meta-sidebar" style={{ display: "block", marginTop: "24px" }}>
                    <h5>Agent Tool execution log</h5>
                    <div className="trace-log" style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                      <div><b>Observe:</b> {selectedConv.trace.Observe}</div>
                      <div><b>Tools Called:</b> <span className="td-orange">{selectedConv.trace.ToolsCalled}</span></div>
                      <div><b>Confidence:</b> {selectedConv.trace.Confidence}</div>
                      <div><b>DB Sync:</b> {selectedConv.trace.DatabaseSync}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. UNANSWERED POOL */}
            {activeTab === "unanswered" && (
              <>
                {draftItem ? (
                  /* Claude AI Draft Section View */
                  <div style={{ background: "var(--white)", border: "0.5px solid var(--border)", borderRadius: "var(--border-radius)", padding: "28px" }}>
                    <h4 style={{ color: "var(--orange)", marginBottom: "12px", fontWeight: 600 }}>
                      Claude AI Draft Section: {draftItem.cluster_topic}
                    </h4>
                    <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "20px" }}>
                      Review Claude Sonnet&apos;s suggested updates derived from worker query history:
                    </p>
                    
                    <pre className="json-code" style={{ marginBottom: "24px", maxHeight: "280px", textAlign: "left", whiteSpace: "pre-wrap" }}>
{`## SOP Section 8.4: Keys & Supervisor Allocations
Keys for the main Store Rooms (A, B and C) are kept on-site in Supervisor Ramesh's locking cabinet.
In the event that Ramesh is off-shift, backup access overrides can be requested from the Duty Coordinator at safety gate 2.
Emergency keys for fire control lockers must not be locked and are situated in Gate 2 locker.`}
                    </pre>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn-p" onClick={() => handleConfirmSop(draftItem.id)}>
                        Approve & Push to SOP Vault
                      </button>
                      <button className="btn-g" onClick={() => setDraftItem(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Unanswered List View */
                  <>
                    <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "24px" }}>
                      Below-threshold queries clustered automatically by semantic topic. Click &quot;Draft SOP Section&quot; to let Claude automatically write documentation based on these logs.
                    </p>
                    <div id="unanswered-list">
                      {unanswered.length === 0 ? (
                        <p style={{ color: "var(--muted2)", fontSize: "13px", fontStyle: "italic" }}>
                          No unanswered queries in the pool.
                        </p>
                      ) : (
                        unanswered.map(item => (
                          <div key={item.id} className="unanswered-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--white)", padding: "16px 20px", border: "0.5px solid var(--border)", borderRadius: "var(--border-radius-s)", marginBottom: "12px" }}>
                            <div className="unanswered-info">
                              <span className="unanswered-text" style={{ fontSize: "14px", fontWeight: 500 }}>&quot;{item.question}&quot;</span>
                              <div className="unanswered-meta-line" style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
                                Asked: <b>{item.asked_count} times</b> · Topic Cluster: <span>{item.cluster_topic}</span>
                              </div>
                            </div>
                            <div className="unanswered-actions" style={{ display: "flex", gap: "8px" }}>
                              <button className="btn-p" style={{ padding: "6px 12px", fontSize: "11.5px" }} onClick={() => setDraftItem(item)}>
                                Draft SOP Section
                              </button>
                              <button className="btn-g" style={{ padding: "6px 12px", fontSize: "11.5px" }} onClick={() => handleIgnoreQuestion(item.id)}>
                                Ignore
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {/* 5. INCIDENTS */}
            {activeTab === "incidents" && (
              <div className="tbl-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Reporter</th>
                      <th>Description</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Logged Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map(inc => (
                      <tr key={inc.id}>
                        <td><code className="route-code">{inc.id}</code></td>
                        <td><b>{inc.worker}</b></td>
                        <td>{inc.description}</td>
                        <td>
                          <span className={`tag ${inc.severity === "HIGH" ? "tag-v4" : "tag-v3"}`}>
                            {inc.severity}
                          </span>
                        </td>
                        <td>
                          <span className={`tag ${inc.status === "Resolved" ? "tag-v1" : "tag-v3"}`}>
                            {inc.status === "in_progress" ? "In Progress" : inc.status}
                          </span>
                        </td>
                        <td>{inc.time}</td>
                        <td>
                          {inc.status !== "Resolved" ? (
                            <button className="btn-p" style={{ padding: "4px 10px", fontSize: "11px" }} onClick={() => handleResolveIncident(inc.id)}>
                              Resolve
                            </button>
                          ) : (
                            <span style={{ color: "var(--muted2)", fontSize: "11.5px" }}>No action</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 6. WORKERS */}
            {activeTab === "workers" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <p style={{ fontSize: "13.5px", color: "var(--muted)" }}>
                    Registered factory floor roster linked directly with active WhatsApp webhooks.
                  </p>
                  <button className="btn-p" style={{ padding: "8px 16px", fontSize: "12.5px" }} onClick={handleAddWorker}>
                    + Add Worker
                  </button>
                </div>

                <div className="tbl-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Language</th>
                        <th>Department</th>
                        <th>Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workers.map(w => (
                        <tr key={w.id}>
                          <td><code className="route-code">{w.id}</code></td>
                          <td><b>{w.name}</b></td>
                          <td>{w.phone}</td>
                          <td><code className="route-code">{w.language}</code></td>
                          <td>{w.department}</td>
                          <td>{w.active}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* 7. ANALYTICS */}
            {activeTab === "analytics" && (
              <>
                <div className="metrics-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                  <div className="metric-card" style={{ background: "var(--white)", padding: "16px 20px", border: "0.5px solid var(--border)", borderRadius: "var(--border-radius)" }}>
                    <h5 style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>Total API Calls</h5>
                    <div className="num" style={{ fontSize: "24px", fontWeight: 700, marginTop: "4px" }}>18.4K</div>
                  </div>
                  <div className="metric-card" style={{ background: "var(--white)", padding: "16px 20px", border: "0.5px solid var(--border)", borderRadius: "var(--border-radius)" }}>
                    <h5 style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>Voice vs. Text split</h5>
                    <div className="num" style={{ fontSize: "24px", fontWeight: 700, marginTop: "4px" }}>62% Voice</div>
                  </div>
                  <div className="metric-card" style={{ background: "var(--white)", padding: "16px 20px", border: "0.5px solid var(--border)", borderRadius: "var(--border-radius)" }}>
                    <h5 style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>Avg Agent Confidence</h5>
                    <div className="num" style={{ fontSize: "24px", fontWeight: 700, marginTop: "4px" }}>0.91</div>
                  </div>
                  <div className="metric-card" style={{ background: "var(--white)", padding: "16px 20px", border: "0.5px solid var(--border)", borderRadius: "var(--border-radius)" }}>
                    <h5 style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>Supervisor Escapes</h5>
                    <div className="num" style={{ fontSize: "24px", fontWeight: 700, marginTop: "4px" }}>4.2%</div>
                  </div>
                </div>
                <p style={{ textAlign: "center", color: "var(--muted2)", fontSize: "13px", marginTop: "40px" }}>
                  [Simulated Analytics Module Loaded successfully]
                </p>
              </>
            )}

            {/* 8. SHIFT BRIEFINGS */}
            {activeTab === "briefings" && (
              <div style={{ background: "var(--white)", border: "0.5px solid var(--border)", borderRadius: "var(--border-radius)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ fontWeight: 600 }}>Draft Shift Broadcast (7:55 AM)</h4>
                <p style={{ fontSize: "13px", color: "var(--muted)" }}>
                  Auto-generate briefings summarizing incidents and safety reminders, ready to post to all workers&apos; WhatsApp chats.
                </p>
                
                <textarea
                  value={briefingText}
                  onChange={(e) => setBriefingText(e.target.value)}
                  style={{ width: "100%", height: "160px", background: "var(--bg)", border: "0.5px solid var(--border2)", borderRadius: "var(--border-radius-s)", padding: "12px", fontFamily: "inherit", fontSize: "13.5px", color: "var(--text)", outline: "none" }}
                  placeholder="Type briefing or click auto-generate..."
                />
                
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn-g" onClick={handleGenerateBriefing}>
                    Auto-Generate from Floor Logs
                  </button>
                  <button className="btn-p" onClick={handleBroadcastBriefing}>
                    Approve & Broadcast to 142 Lines
                  </button>
                </div>
              </div>
            )}

            {/* 9. SETTINGS */}
            {activeTab === "settings" && (
              <div style={{ background: "var(--white)", border: "0.5px solid var(--border)", borderRadius: "var(--border-radius)", padding: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: "4px" }}>Agent Settings</h4>
                  <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "12px" }}>
                    Adjust the minimum similarity threshold score required for Claude to respond automatically without routing to a supervisor.
                  </p>
                  <label style={{ fontSize: "13px", fontWeight: 500 }}>
                     Confidence Threshold: <span style={{ fontWeight: 700, color: "var(--orange)" }}>{confidenceThreshold}</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="0.95"
                    step="0.05"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--orange)", marginTop: "8px" }}
                  />
                </div>

                <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: "20px" }}>
                  <h4 style={{ fontWeight: 600, marginBottom: "12px" }}>WhatsApp API Configuration</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)" }}>Meta Phone Number ID</label>
                      <input
                        type="text"
                        value="109284204918204"
                        style={{ width: "100%", background: "var(--bg)", border: "0.5px solid var(--border2)", borderRadius: "var(--border-radius-s)", padding: "8px 12px", fontSize: "13px", color: "var(--text)", outline: "none", marginTop: "4px" }}
                        disabled
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)" }}>Temporary Token Auth</label>
                      <input
                        type="password"
                        value="mock_meta_whatsapp_temporary_token_auth_key"
                        style={{ width: "100%", background: "var(--bg)", border: "0.5px solid var(--border2)", borderRadius: "var(--border-radius-s)", padding: "8px 12px", fontSize: "13px", color: "var(--text)", outline: "none", marginTop: "4px" }}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
