"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PhoneSimulator from "@/components/PhoneSimulator";
import ComplianceScanner from "@/components/ComplianceScanner";

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

// Types
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

interface DocumentInfo {
  name: string;
  status: "Active" | "Inactive";
  chunks: number;
  date: string;
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

  // State
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [unanswered, setUnanswered] = useState<Unanswered[]>([]);
  const [draftItem, setDraftItem] = useState<Unanswered | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>("");
  const [inboxReplyText, setInboxReplyText] = useState("");
  const [selectedCompliancePart, setSelectedCompliancePart] = useState<string>("helmet");

  // Interactive 3D mouse tilt states
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const card = containerRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Cap rotation to 18 degrees maximum
    const factorX = 18 / (box.height / 2);
    const factorY = 18 / (box.width / 2);
    
    setRotateX(-y * factorX);
    setRotateY(x * factorY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Telemetry real-time logs feed state
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    "[04:39:02] Database: Successfully loaded 14 vector documents",
    "[04:39:15] Webhook: Meta API WhatsApp channel synchronized",
    "[04:39:30] Safety Engine: Standby mode listening for worker questions",
    "[04:40:08] Configuration: Auto-response confidence set to 75%"
  ]);

  useEffect(() => {
    const events = [
      "Safety Engine: Auto-response sent to Ramesh Kumar (Confidence 88%)",
      "Vector Search: Matched SOP Section 2.1 (Safety Helmets)",
      "Supervisor Feed: Live override channel established",
      "Network Status: Meta webhook latency stable at 12ms",
      "Database: Incident record logged in local DB",
      "Alert Center: Supervisor resolved Category 2 alert on Line 3",
      "Webhook Sync: Live ping received from WhatsApp channel",
      "Backlog Update: Checked unresolved queries queue"
    ];
    const interval = setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setTelemetryLogs(prev => [...prev.slice(-4), `[${timeStr}] ${randomEvent}`]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Knowledge base Documents state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadFilename, setUploadFilename] = useState("");
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Briefing state
  const [briefingText, setBriefingText] = useState("");

  // Settings
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.75);

  // Playground State
  const [playgroundQuery, setPlaygroundQuery] = useState("");
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [playgroundResponse, setPlaygroundResponse] = useState<any>(null);

  // Data loaders
  const loadWorkers = () => {
    fetch("/api/workers")
      .then(res => res.json())
      .then(data => setWorkers(data))
      .catch(err => console.error("Error loading roster:", err));
  };

  const loadIncidents = () => {
    fetch("/api/incidents")
      .then(res => res.json())
      .then(data => setIncidents(data))
      .catch(err => console.error("Error loading incidents:", err));
  };

  const loadUnanswered = () => {
    fetch("/api/unanswered")
      .then(res => res.json())
      .then(data => setUnanswered(data))
      .catch(err => console.error("Error loading unanswered:", err));
  };

  const loadDocuments = () => {
    fetch("/api/upload")
      .then(res => res.json())
      .then(data => setDocuments(data))
      .catch(err => console.error("Error loading documents:", err));
  };

  const loadConversations = () => {
    fetch("/api/conversations")
      .then(res => res.json())
      .then(data => {
        setConversations(data);
        if (data.length > 0 && !selectedConvId) {
          setSelectedConvId(data[0].id);
        }
      })
      .catch(err => console.error("Error loading conversations:", err));
  };

  useEffect(() => {
    loadWorkers();
    loadIncidents();
    loadUnanswered();
    loadDocuments();
    loadConversations();

    const interval = setInterval(loadConversations, 3500);
    return () => clearInterval(interval);
  }, []);

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

  // File picker upload
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadPercent(0);
    setUploadFilename(file.name);
    setUploadStatus("Uploading file context to storage...");

    let pct = 0;
    const progressInterval = setInterval(() => {
      pct = Math.min(pct + 8, 95);
      setUploadPercent(pct);
      if (pct === 32) setUploadStatus("Parsing document contents...");
      if (pct === 56) setUploadStatus("Splitting text into overlapping chunks...");
      if (pct === 80) setUploadStatus("Computing vector embeddings via Gemini...");
    }, 100);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const textContent = event.target?.result as string;
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: file.name,
              content: textContent || ""
            })
          });

          clearInterval(progressInterval);
          if (res.ok) {
            setUploadPercent(100);
            setUploadStatus("Indexing finished. Document RAG Active!");
            setTimeout(() => {
              setIsUploading(false);
              loadDocuments();
            }, 800);
          } else {
            throw new Error("Upload failed");
          }
        } catch (err) {
          clearInterval(progressInterval);
          setUploadStatus("Upload failed. Verify credentials in .env.local.");
          setTimeout(() => setIsUploading(false), 2000);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      clearInterval(progressInterval);
      setUploadStatus("Failed to read file.");
      setTimeout(() => setIsUploading(false), 2000);
    }
  };

  // Add mock worker
  const handleAddWorker = async () => {
    const nextIdNum = workers.length + 1;
    const newW: Worker = {
      id: `w-0${nextIdNum}`,
      phone: `+91987541${Math.floor(1000 + Math.random() * 9000)}`,
      name: "Satish Patil",
      language: "hi",
      department: "Production",
      active: "Just added"
    };

    try {
      const res = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newW)
      });
      if (res.ok) {
        loadWorkers();
      }
    } catch (err) {
      console.error("Failed to add worker:", err);
    }
  };

  // Resolve incident
  const handleResolveIncident = async (id: string) => {
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resolve", id })
      });
      if (res.ok) {
        loadIncidents();
        const now = new Date();
        const timeStr = now.toTimeString().split(" ")[0];
        setTelemetryLogs(prev => [...prev.slice(-4), `[${timeStr}] resolved priority incident id: ${id}`]);
      }
    } catch (err) {
      console.error("Failed to resolve incident:", err);
    }
  };

  // Ignore unanswered question
  const handleIgnoreQuestion = async (id: string) => {
    try {
      const res = await fetch("/api/unanswered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ignore", id })
      });
      if (res.ok) {
        loadUnanswered();
      }
    } catch (err) {
      console.error("Failed to ignore question:", err);
    }
  };

  // Confirm Claude SOP addition
  const handleConfirmSop = async (id: string, topic = "General Info") => {
    const draftText = `## SOP Section 8.4: ${topic}
Keys for the main Store Rooms (A, B and C) are kept on-site in Supervisor Ramesh's locking cabinet.
In the event that Ramesh is off-shift, backup access overrides can be requested from the Duty Coordinator at safety gate 2.`;

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `SOP_${topic.replace(/\s+/g, "_")}.md`,
          content: draftText
        })
      });
      if (res.ok) {
        await fetch("/api/unanswered", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "ignore", id })
        });
        loadUnanswered();
        loadDocuments();
        setDraftItem(null);
        alert("SOP document successfully re-chunked and vectors updated!");
      }
    } catch (err) {
      console.error("Failed to confirm SOP:", err);
    }
  };

  // Shift briefing compilers
  const handleGenerateBriefing = () => {
    setBriefingText(
      `[ALERT] VELVET GARMENTS - MORNING BRIEFING - ${new Date().toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}\n\n1. SAFETY COMPLIANCE: Kal line 2 breaker mein short circuit/smoke dekha gaya tha. Aaj work shuru karne se pehle valve check karein.\n2. PRODUCTION GOALS: Line 1 targets are 2,400 pieces today. Let's maintain safety regulations.\n3. HELMETS: Extra safety helmets are in Store Room B next to Gate 2.`
    );
  };

  const handleBroadcastBriefing = () => {
    if (!briefingText.trim()) {
      alert("Please generate or draft a briefing first!");
      return;
    }
    alert("Morning briefing broadcasted successfully to all 142 worker lines!");
    setBriefingText("");
  };

  // Sandbox RAG tester
  const handlePlaygroundSubmit = async (queryText = playgroundQuery) => {
    if (!queryText.trim()) return;
    setPlaygroundLoading(true);
    setPlaygroundResponse(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: queryText,
          phone: "+919876543210",
          confidenceThreshold
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPlaygroundResponse(data);
      }
    } catch (err) {
      console.error("Playground query failed:", err);
    } finally {
      setPlaygroundLoading(false);
    }
  };

  // Send manual reply override in Inbox
  const handleSendInboxReply = async (phone: string) => {
    if (!inboxReplyText.trim()) return;
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, text: inboxReplyText.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        setInboxReplyText("");
      }
    } catch (err) {
      console.error("Failed to send override reply:", err);
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  return (
    <div id="admin-dashboard-view">
      <div className="dashboard-wrapper">
        
        {/* Left Sidebar Navigation */}
        <aside className="db-sidebar">
          <div>
            <div className="db-logo">
              <Logo />
              <span className="badge db-badge">Console</span>
            </div>
            
            <ul className="db-menu">
              <li className={activeTab === "overview" ? "active" : ""} onClick={() => { setActiveTab("overview"); setDraftItem(null); }}>
                <svg className="db-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
                Overview
              </li>
              
              <li className={activeTab === "inbox" ? "active" : ""} onClick={() => { setActiveTab("inbox"); setDraftItem(null); }}>
                <svg className="db-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Live Inbox
              </li>
              
              <li className={activeTab === "documents" ? "active" : ""} onClick={() => { setActiveTab("documents"); setDraftItem(null); }}>
                <svg className="db-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                </svg>
                SOP Vault
              </li>
              
              <li className={activeTab === "workers" ? "active" : ""} onClick={() => { setActiveTab("workers"); setDraftItem(null); }}>
                <svg className="db-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Floor Roster
              </li>
              
              <li className={activeTab === "briefings" ? "active" : ""} onClick={() => { setActiveTab("briefings"); setDraftItem(null); }}>
                <svg className="db-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Shift Briefings
              </li>
              
              <li className={activeTab === "settings" ? "active" : ""} onClick={() => { setActiveTab("settings"); setDraftItem(null); }}>
                <svg className="db-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings & Playground
              </li>
            </ul>
          </div>
          
          <div>
            <Link href="/" className="btn-g" style={{ width: "100%", padding: "10px 0", textAlign: "center", display: "block", fontSize: "12px", border: "1px solid var(--border)", borderRadius: "6px" }}>
              Exit to Site
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="db-main">
          
          {/* Header */}
          <header className="db-header" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>
              {activeTab === "overview" && "Safety Overview Dashboard"}
              {activeTab === "inbox" && "Supervisor Live Inbox"}
              {activeTab === "documents" && "SOP Safety Guidelines"}
              {activeTab === "workers" && "Floor Employees Directory"}
              {activeTab === "briefings" && "Shift Announcements"}
              {activeTab === "settings" && "Safety System Settings"}
            </h3>
            
            <div className="db-user-meta">
              <div className="telemetry-hud-header" style={{ display: "flex", alignItems: "center", gap: "16px", marginRight: "16px", paddingRight: "16px", borderRight: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--muted)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="chat-pulse-ring" style={{ width: "6px", height: "6px", background: "#06b6d4", borderRadius: "50%", display: "inline-block" }}></span>
                  <span style={{ fontWeight: 700, color: "#06b6d4" }}>SYNC: OK</span>
                </div>
                <div>PING: <span style={{ color: "var(--text)" }}>24ms</span></div>
                <div>LATENCY: <span style={{ color: "var(--text)" }}>180ms</span></div>
                <div>AI ACCURACY: <span style={{ color: "var(--orange)" }}>92.4%</span></div>
              </div>

              <span className="db-company-tag" style={{ border: "1px solid var(--border)", background: "transparent" }}>
                Velvet Garments Ltd.
              </span>
              
              <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle theme" style={{ padding: "8px", border: "1px solid var(--border)", borderRadius: "6px", background: "transparent", color: "var(--text)" }}>
                {theme === "light" ? (
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                  </svg>
                )}
              </button>
              
              <span className="db-avatar" style={{ width: "28px", height: "28px", fontSize: "11px", fontWeight: 700 }}>A</span>
            </div>
          </header>

          {/* Sub-views content area */}
          <div className="db-content-area">
             {/* 1. OVERVIEW */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* Row 1: High-Density HUD Metrics Bar (4 Columns) */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                  <div className="metric-card" style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                    <h5 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", margin: "0 0 6px" }}>Active Workers</h5>
                    <div className="num" style={{ fontSize: "24px", fontWeight: 800 }}>{workers.length}</div>
                    <div style={{ fontSize: "11px", color: "#06b6d4", marginTop: "4px" }}>● online & monitored</div>
                  </div>
                  
                  <div className="metric-card" style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                    <h5 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", margin: "0 0 6px" }}>Active Incidents</h5>
                    <div className="num" style={{ fontSize: "24px", fontWeight: 800, color: incidents.filter(i => i.status !== "Resolved").length > 0 ? "var(--red)" : "inherit" }}>
                      {incidents.filter(i => i.status !== "Resolved").length}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--muted2)", marginTop: "4px" }}>escalations pending</div>
                  </div>
                  
                  <div className="metric-card" style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                    <h5 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", margin: "0 0 6px" }}>Unresolved Queries</h5>
                    <div className="num" style={{ fontSize: "24px", fontWeight: 800, color: unanswered.length > 0 ? "var(--orange)" : "inherit" }}>
                      {unanswered.length}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--muted2)", marginTop: "4px" }}>requires SOP check</div>
                  </div>

                  <div className="metric-card" style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                    <h5 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", margin: "0 0 6px" }}>Safety AI Match Rate</h5>
                    <div className="num" style={{ fontSize: "24px", fontWeight: 800, color: "var(--orange)" }}>
                      {(confidenceThreshold * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--muted2)", marginTop: "4px" }}>confidence cutoff</div>
                  </div>
                </div>

                {/* Row 2: Diagnostics Scanner & Checklist vs Incidents Table & Simulator */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
                  
                  {/* Left Column: Scanner Terminal & Checklist */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    
                    {/* Scanner Terminal */}
                    <div style={{ display: "flex", gap: "24px", background: "var(--white)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", minHeight: "420px" }}>
                      
                      {/* Left: Holographic 3D compliance scanner */}
                      <ComplianceScanner
                        activePart={selectedCompliancePart}
                        onPartSelect={setSelectedCompliancePart}
                      />

                      {/* Right: Selected part compliance content */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <h4 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--orange)", margin: "0 0 12px" }}>
                          PPE Safety Checker
                        </h4>
                        
                        {selectedCompliancePart === "helmet" && (
                          <div>
                            <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>SOP Section 2.1: Safety Helmets</h3>
                            <p style={{ fontSize: "12.5px", lineHeight: "1.5", color: "var(--muted2)" }}>
                              All personnel on the spinning floor and weaving zone must wear safety helmets at all times. Backup helmets are locked in Store Room B next to Gate 2.
                            </p>
                            <span className="tag tag-v1" style={{ marginTop: "12px", display: "inline-block", fontSize: "10px" }}>Active SOP Standard</span>
                          </div>
                        )}
                        
                        {selectedCompliancePart === "goggles" && (
                          <div>
                            <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>SOP Section 12.1: Safety Goggles</h3>
                            <p style={{ fontSize: "12.5px", lineHeight: "1.5", color: "var(--muted2)" }}>
                              Mandatory eye protection during electrical checks on Line 2 breakers and cutting. Bare wires checks require rubber gloves.
                            </p>
                            <span className="tag tag-v1" style={{ marginTop: "12px", display: "inline-block", fontSize: "10px" }}>Active SOP Standard</span>
                          </div>
                        )}

                        {selectedCompliancePart === "vest" && (
                          <div>
                            <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>SOP Section 4.3: High-Vis Apparel</h3>
                            <p style={{ fontSize: "12.5px", lineHeight: "1.5", color: "var(--muted2)" }}>
                              High-visibility vests are required shift-wide. Forklift corridors near Warehouse A require reflective gear to pass.
                            </p>
                            <span className="tag tag-v1" style={{ marginTop: "12px", display: "inline-block", fontSize: "10px" }}>Active SOP Standard</span>
                          </div>
                        )}

                        {selectedCompliancePart === "boots" && (
                          <div>
                            <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>SOP Section 12.1: High-Voltage Footwear</h3>
                            <p style={{ fontSize: "12.5px", lineHeight: "1.5", color: "var(--muted2)" }}>
                              Rubber insulated boots must be worn near high-voltage lines. Short-circuit response overrides require pressing main E-stop breaker.
                            </p>
                            <span className="tag tag-v1" style={{ marginTop: "12px", display: "inline-block", fontSize: "10px" }}>Active SOP Standard</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sensor Diagnostics Checklist Card */}
                    <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px" }}>
                      <h4 style={{ fontSize: "12px", fontWeight: 700, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Shift Diagnostics Checklist</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "0.5px solid var(--border)", paddingBottom: "8px" }}>
                          <span style={{ color: "var(--muted2)" }}>Safety Helmets (SOP 2.1)</span>
                          <span style={{ color: "#06b6d4", fontWeight: 700 }}>✓ COMPLIANT</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "0.5px solid var(--border)", paddingBottom: "8px" }}>
                          <span style={{ color: "var(--muted2)" }}>Eye Protection Goggles (SOP 12.1)</span>
                          <span style={{ color: "#06b6d4", fontWeight: 700 }}>✓ COMPLIANT</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "0.5px solid var(--border)", paddingBottom: "8px" }}>
                          <span style={{ color: "var(--muted2)" }}>High-Vis Reflective vest (SOP 4.3)</span>
                          <span style={{ color: "#06b6d4", fontWeight: 700 }}>✓ COMPLIANT</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--muted2)" }}>High-Voltage Insulated Boots (SOP 12.1)</span>
                          <span style={{ color: "var(--orange)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <span className="recording-dot-flat" style={{ width: "6px", height: "6px" }}></span>
                            WARNING - MONITORING
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Incidents Registry Feed & Simulator */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    
                    {/* Incidents Registry Feed */}
                    <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", minHeight: "220px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 style={{ fontSize: "12px", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Active Incidents Registry
                        </h4>
                        <span style={{ fontSize: "11px", color: "var(--muted2)" }}>
                          {incidents.filter(i => i.status !== "Resolved").length} active alerts
                        </span>
                      </div>
                      
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)", paddingBottom: "6px" }}>
                              <th style={{ padding: "6px 0", fontWeight: 600 }}>Worker</th>
                              <th style={{ padding: "6px 0", fontWeight: 600 }}>Details</th>
                              <th style={{ padding: "6px 0", fontWeight: 600 }}>Severity</th>
                              <th style={{ padding: "6px 0", fontWeight: 600, textAlign: "right" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {incidents.length === 0 ? (
                              <tr>
                                <td colSpan={4} style={{ padding: "20px 0", textAlign: "center", color: "var(--muted2)" }}>
                                  No incidents logged on this shift.
                                </td>
                              </tr>
                            ) : (
                              incidents.slice(0, 4).map(inc => (
                                <tr key={inc.id} style={{ borderBottom: "0.5px solid var(--border)" }}>
                                  <td style={{ padding: "10px 0", fontWeight: 700 }}>{inc.worker}</td>
                                  <td style={{ padding: "10px 0", color: "var(--muted2)" }}>{inc.description}</td>
                                  <td style={{ padding: "10px 0" }}>
                                    <span style={{
                                      fontSize: "9px",
                                      fontWeight: 700,
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                      background: inc.severity === "HIGH" ? "rgba(249, 115, 22, 0.1)" : "rgba(245, 158, 11, 0.05)",
                                      color: inc.severity === "HIGH" ? "#f97316" : "#b45309"
                                    }}>
                                      {inc.severity}
                                    </span>
                                  </td>
                                  <td style={{ padding: "10px 0", textAlign: "right" }}>
                                    {inc.status === "Resolved" ? (
                                      <span style={{ color: "#06b6d4", fontSize: "11px", fontWeight: 600 }}>Resolved</span>
                                    ) : (
                                      <button
                                        onClick={() => handleResolveIncident(inc.id)}
                                        style={{ fontSize: "10px", padding: "4px 8px", borderRadius: "4px", background: "transparent", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text)" }}
                                      >
                                        Resolve
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Factory Floor Zones Monitor */}
                    <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 style={{ fontSize: "12px", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Factory Floor Grid Monitor
                        </h4>
                        <span style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "var(--muted2)" }}>
                          MAP REF: FL-02
                        </span>
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        {/* Zone A */}
                        <div style={{ border: "1px solid var(--border)", borderRadius: "6px", padding: "12px", background: "rgba(6, 182, 212, 0.02)", display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 700, fontSize: "11px" }}>Zone A (Spinning)</span>
                            <span style={{ color: "#06b6d4", fontSize: "10px", fontWeight: 700 }}>● SAFE</span>
                          </div>
                          <span style={{ fontSize: "10.5px", color: "var(--muted2)" }}>12 Monitored Workers</span>
                          <span style={{ fontSize: "10.5px", color: "var(--muted)" }}>PPE Index: 100%</span>
                        </div>

                        {/* Zone B */}
                        <div style={{ border: "1px solid var(--border)", borderRadius: "6px", padding: "12px", background: "rgba(249, 115, 22, 0.02)", display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 700, fontSize: "11px" }}>Zone B (Breaker 2)</span>
                            <span style={{ color: "var(--orange)", fontSize: "10px", fontWeight: 700, animation: "blinkDot 1.5s infinite" }}>▲ ALERT</span>
                          </div>
                          <span style={{ fontSize: "10.5px", color: "var(--muted2)" }}>1 Boots Incident Logged</span>
                          <span style={{ fontSize: "10.5px", color: "var(--muted)" }}>PPE Index: 84%</span>
                        </div>

                        {/* Zone C */}
                        <div style={{ border: "1px solid var(--border)", borderRadius: "6px", padding: "12px", background: "rgba(6, 182, 212, 0.02)", display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 700, fontSize: "11px" }}>Zone C (Weaving)</span>
                            <span style={{ color: "#06b6d4", fontSize: "10px", fontWeight: 700 }}>● SAFE</span>
                          </div>
                          <span style={{ fontSize: "10.5px", color: "var(--muted2)" }}>8 Monitored Workers</span>
                          <span style={{ fontSize: "10.5px", color: "var(--muted)" }}>PPE Index: 100%</span>
                        </div>

                        {/* Zone D */}
                        <div style={{ border: "1px solid var(--border)", borderRadius: "6px", padding: "12px", background: "rgba(6, 182, 212, 0.02)", display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 700, fontSize: "11px" }}>Zone D (Warehouse Corridor)</span>
                            <span style={{ color: "#06b6d4", fontSize: "10px", fontWeight: 700 }}>● SAFE</span>
                          </div>
                          <span style={{ fontSize: "10.5px", color: "var(--muted2)" }}>4 Monitored Workers</span>
                          <span style={{ fontSize: "10.5px", color: "var(--muted)" }}>PPE Index: 100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 3: Live Telemetry Terminal & Charts (Side-by-Side) */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
                  
                  {/* Left Bottom: Live Telemetry Event Logs */}
                  <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", fontFamily: "var(--font-mono)", fontSize: "11px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>LIVE OPERATIONS ACTIVITY LOG</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className="chat-pulse-ring" style={{ width: "6px", height: "6px", background: "#06b6d4", borderRadius: "50%", display: "inline-block" }}></span>
                        <span style={{ fontSize: "9px", color: "var(--muted)", fontWeight: 600 }}>STREAMING LIVE</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", minHeight: "110px", color: "var(--muted2)" }}>
                      {telemetryLogs.map((log, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", animation: "joinFadeIn 0.2s ease" }}>
                          <span style={{ color: "var(--orange)" }}>&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Bottom: SVG Chart Panel */}
                  <div className="metric-card" style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h4 style={{ fontSize: "12px", fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Safety Assistance Growth</h4>
                      <p style={{ fontSize: "11px", color: "var(--muted2)", margin: 0 }}>Shift safety questions auto-answered by SOP grounding</p>
                    </div>
                    
                    <div style={{ height: "80px", marginTop: "12px" }}>
                      <svg viewBox="0 0 800 200" width="100%" height="100%" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.15"></stop>
                            <stop offset="100%" stopColor="var(--orange)" stopOpacity="0.00"></stop>
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="160" x2="800" y2="160" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4" />
                        <line x1="0" y1="100" x2="800" y2="100" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4" />
                        <line x1="0" y1="40" x2="800" y2="40" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4" />
                        
                        <path d="M 0 180 Q 150 160 300 130 T 450 120 T 600 70 T 800 30 L 800 200 L 0 200 Z" fill="url(#chart-grad)" />
                        <path className="chart-line" d="M 0 180 Q 150 160 300 130 T 450 120 T 600 70 T 800 30" fill="none" stroke="var(--orange)" strokeWidth="2.5" />
                        
                        <text x="5" y="152" fontSize="9" fill="var(--muted2)" fontFamily="var(--font-mono)">300</text>
                        <text x="5" y="92" fontSize="9" fill="var(--muted2)" fontFamily="var(--font-mono)">600</text>
                        <text x="5" y="32" fontSize="9" fill="var(--muted2)" fontFamily="var(--font-mono)">1,200</text>
                      </svg>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--muted)", fontWeight: 600, fontFamily: "var(--font-sans)", marginTop: "8px" }}>
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 2. UNIFIED LIVE INBOX */}
            {activeTab === "inbox" && (
              <div className="inbox-grid">
                
                {/* Pane 1: Conversations list */}
                <div className="inbox-threads-list">
                  {conversations.length === 0 ? (
                    <div style={{ padding: "32px", textAlign: "center", color: "var(--muted2)", fontSize: "12.5px" }}>
                      No active conversations.
                    </div>
                  ) : (
                    conversations.map(c => {
                      const isUnanswered = unanswered.some(u => c.messages.some(msg => msg.sender === "Worker" && msg.text.toLowerCase().includes(u.question.toLowerCase())));
                      const hasIncidents = incidents.some(i => i.status !== "Resolved" && (c.snippet.includes(i.description.substring(0, 15)) || i.worker.includes("Ramesh")));
                      
                      return (
                        <div
                          key={c.id}
                          className={`inbox-thread-item ${c.id === selectedConvId ? "active" : ""}`}
                          onClick={() => setSelectedConvId(c.id)}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                            <span style={{ fontWeight: 700, fontSize: "13px" }}>{c.phone}</span>
                            <span style={{ fontSize: "10px", color: "var(--muted)" }}>{c.messages[c.messages.length - 1]?.time || "now"}</span>
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--muted2)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {c.snippet}
                          </div>
                          
                          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                            {isUnanswered ? (
                              <span style={{ background: "rgba(255, 87, 34, 0.1)", color: "var(--orange)", fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" }}>Need SOP</span>
                            ) : hasIncidents ? (
                              <span style={{ background: "rgba(249, 115, 22, 0.1)", color: "var(--orange)", fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" }}>Incident</span>
                            ) : (
                              <span style={{ background: "rgba(6, 182, 212, 0.1)", color: "#06b6d4", fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" }}>RAG Auto</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Pane 2: Message feed area */}
                <div className="inbox-messages-pane">
                  {selectedConv ? (
                    <>
                      <div className="inbox-messages-header">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>{selectedConv.phone}</h4>
                            <span style={{ fontSize: "11px", color: "var(--muted)" }}>Interactive WhatsApp Logs</span>
                          </div>
                          
                          {incidents.some(i => i.status !== "Resolved" && (selectedConv.snippet.includes(i.description.substring(0, 15)) || i.worker.includes("Ramesh"))) && (
                            <button
                              className="btn-p"
                              style={{ background: "#ef4444", fontSize: "11px", padding: "6px 12px" }}
                              onClick={() => {
                                const matched = incidents.find(i => i.status !== "Resolved");
                                if (matched) handleResolveIncident(matched.id);
                              }}
                            >
                              Resolve Event
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="inbox-messages-body">
                        {selectedConv.messages.map((m, idx) => (
                          <div
                            key={idx}
                            style={{
                              maxWidth: "75%",
                              padding: "10px 14px",
                              borderRadius: "8px",
                              fontSize: "13.5px",
                              lineHeight: "1.5",
                              alignSelf: m.sender === "Worker" ? "flex-start" : "flex-end",
                              background: m.sender === "Worker" ? "var(--white)" : "var(--orange)",
                              color: m.sender === "Worker" ? "var(--text)" : "#fff",
                              border: m.sender === "Worker" ? "1px solid var(--border)" : "none"
                            }}
                          >
                            <div>{m.text}</div>
                            <div style={{ fontSize: "9px", textAlign: "right", marginTop: "4px", opacity: 0.7 }}>
                              {m.time}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Manual Override Text Input */}
                      <div style={{ padding: "16px 24px", background: "var(--white)", borderTop: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            type="text"
                            value={inboxReplyText}
                            onChange={(e) => setInboxReplyText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSendInboxReply(selectedConv.phone); }}
                            placeholder="Type manual safety override message to worker..."
                            style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "var(--text)", outline: "none" }}
                          />
                          <button
                            className="btn-p"
                            onClick={() => handleSendInboxReply(selectedConv.phone)}
                            style={{ padding: "10px 16px" }}
                          >
                            Override
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted2)" }}>
                      Select a conversation thread to override or trace.
                    </div>
                  )}
                </div>

                {/* Pane 3: Trace Debugger + Claude SOP drafting */}
                <div className="inbox-trace-pane">
                  {selectedConv ? (
                    <>
                      <div>
                        <div className="trace-section-title">Observe Intelligence</div>
                        <div className="trace-row">
                          <b>Observe:</b> <span style={{ color: "var(--muted2)" }}>{selectedConv.trace?.Observe}</span>
                        </div>
                        <div className="trace-row">
                          <b>Confidence Match:</b> <span style={{ fontWeight: 700 }}>{selectedConv.trace?.Confidence}</span>
                        </div>
                        <div className="trace-row">
                          <b>DatabaseSync Log:</b> <span style={{ color: "var(--muted2)", fontFamily: "var(--font-mono)", fontSize: "11px" }}>{selectedConv.trace?.DatabaseSync}</span>
                        </div>
                      </div>

                      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                        <div className="trace-section-title">Tools Execution</div>
                        <div className="trace-code-block">{selectedConv.trace?.ToolsCalled}</div>
                      </div>

                      {/* Claude AI SOP Section generator */}
                      {selectedConv.trace?.Confidence < confidenceThreshold && (
                        <div style={{ background: "rgba(255, 87, 34, 0.04)", border: "1px solid rgba(255, 87, 34, 0.15)", borderRadius: "8px", padding: "16px", marginTop: "12px" }}>
                          <h5 style={{ margin: "0 0 6px", fontWeight: 700, color: "var(--orange)", fontSize: "12px" }}>Claude SOP Gap Filler</h5>
                          <p style={{ fontSize: "11.5px", color: "var(--muted)", margin: "0 0 12px" }}>
                            The safety agent bypassed this query due to low similarity match. Click below to auto-index overrides.
                          </p>
                          
                          <button
                            className="btn-p"
                            style={{ width: "100%", padding: "8px", fontSize: "11px" }}
                            onClick={() => {
                              const unansweredMatch = unanswered.find(u => selectedConv.snippet.toLowerCase().includes(u.question.toLowerCase().substring(0, 15)));
                              if (unansweredMatch) {
                                handleConfirmSop(unansweredMatch.id, unansweredMatch.cluster_topic);
                              } else {
                                handleConfirmSop(`un-${Date.now()}`, "Store Rooms");
                              }
                            }}
                          >
                            Index Overriding SOP
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ color: "var(--muted2)", fontSize: "12px", textAlign: "center", paddingTop: "40px" }}>
                      No debug traces loaded.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 3. SOP VAULT */}
            {activeTab === "documents" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                <div className="upload-dropzone" onClick={triggerFileInput} style={{ cursor: "pointer", border: "1px dashed var(--border)", background: "var(--white)", borderRadius: "8px", padding: "32px", textAlign: "center" }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".txt,.md"
                    style={{ display: "none" }}
                  />
                  <svg className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: "32px", height: "32px", margin: "0 auto 12px", color: "var(--muted)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>
                    Drag and drop SOP manuals (.TXT, .MD) here, or <b style={{ color: "var(--orange)" }}>browse local storage</b>
                  </p>
                </div>

                {isUploading && (
                  <div className="upload-progress-container" style={{ display: "block", background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 500 }}>
                      <span>{uploadFilename}</span>
                      <span>{uploadPercent}%</span>
                    </div>
                    <div className="progress-bar-bg" style={{ background: "var(--border)", height: "4px", borderRadius: "2px", overflow: "hidden", margin: "8px 0" }}>
                      <div className="progress-bar-fg" style={{ width: `${uploadPercent}%`, background: "var(--orange)", height: "100%" }}></div>
                    </div>
                    <div className="progress-status-text" style={{ fontSize: "11px", color: "var(--muted2)" }}>{uploadStatus}</div>
                  </div>
                )}

                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 12px" }}>Active Grounded Materials</h4>
                  <div className="tbl-wrap" style={{ border: "1px solid var(--border)", borderRadius: "8px", background: "var(--white)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                          <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Filename</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Status</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Chunks</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Upload Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((doc, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid var(--border)" }}>
                            <td style={{ padding: "12px 16px", fontSize: "13px" }}>{doc.name}</td>
                            <td style={{ padding: "12px 16px" }}><span className="tag tag-v1" style={{ fontSize: "10.5px" }}>{doc.status}</span></td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--muted2)" }}>{doc.chunks} chunks</td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--muted2)" }}>{doc.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 4. ROSTER */}
            {activeTab === "workers" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                    Linked active WhatsApp worker profiles registered inside current database roster.
                  </p>
                  <button className="btn-p" style={{ padding: "8px 16px", fontSize: "12px" }} onClick={handleAddWorker}>
                    + Add Worker
                  </button>
                </div>

                <div className="tbl-wrap" style={{ border: "1px solid var(--border)", borderRadius: "8px", background: "var(--white)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>ID</th>
                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Name</th>
                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Phone</th>
                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Language</th>
                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Department</th>
                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workers.map(w => (
                        <tr key={w.id} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "12px 16px", fontSize: "13px", fontFamily: "var(--font-mono)" }}>{w.id}</td>
                          <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700 }}>{w.name}</td>
                          <td style={{ padding: "12px 16px", fontSize: "13px" }}>{w.phone}</td>
                          <td style={{ padding: "12px 16px", fontSize: "12px" }}><code className="route-code">{w.language}</code></td>
                          <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--muted)" }}>{w.department}</td>
                          <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--muted2)" }}>{w.active}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. BRIEFINGS */}
            {activeTab === "briefings" && (
              <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>Draft Announcement Broadcast (Morning Handover)</h4>
                <p style={{ fontSize: "12.5px", color: "var(--muted)", margin: 0 }}>
                  Auto-compile Shift Safety briefings to broadcast directly to active workers&apos; WhatsApp screens.
                </p>
                
                <textarea
                  value={briefingText}
                  onChange={(e) => setBriefingText(e.target.value)}
                  style={{ width: "100%", height: "160px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "14px", fontFamily: "inherit", fontSize: "13.5px", color: "var(--text)", outline: "none" }}
                  placeholder="Type briefing message..."
                />
                
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn-g" onClick={handleGenerateBriefing} style={{ border: "1px solid var(--border)", borderRadius: "6px" }}>
                    Compile Floor Reminders
                  </button>
                  <button className="btn-p" onClick={handleBroadcastBriefing}>
                    Approve & Broadcast
                  </button>
                </div>
              </div>
            )}

            {/* 6. PLAYGROUND & SETTINGS */}
            {activeTab === "settings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                
                {/* Confidence threshold & configs */}
                <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px" }}>Confidence Scoring Limit</h4>
                    <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0 0 16px" }}>
                      Threshold score for automatic RAG replies (low scores are routed to unanswered pool).
                    </p>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <input
                        type="range"
                        min="0.5"
                        max="0.95"
                        step="0.05"
                        value={confidenceThreshold}
                        onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                        style={{ flex: 1, accentColor: "var(--orange)" }}
                      />
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--orange)" }}>{confidenceThreshold}</span>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                    <h5 className="trace-section-title">Meta Whatsapp Webhook Config</h5>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "8px" }}>
                      <div>
                        <label style={{ fontSize: "11px", color: "var(--muted)" }}>Phone Number ID</label>
                        <input type="text" value="109284204918204" disabled style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 12px", fontSize: "13px", marginTop: "4px" }} />
                      </div>
                      
                      <div>
                        <label style={{ fontSize: "11px", color: "var(--muted)" }}>System Token Auth</label>
                        <input type="password" value="mock_meta_whatsapp_temporary_token" disabled style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 12px", fontSize: "13px", marginTop: "4px" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vector Search Playground */}
                <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px" }}>Vector Search Playground</h4>
                  <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0 0 16px" }}>
                    Test vector similarity matching and agentic Observe/Reason pipelines.
                  </p>
                  
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                    <input
                      type="text"
                      value={playgroundQuery}
                      onChange={(e) => setPlaygroundQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handlePlaygroundSubmit(); }}
                      placeholder="Input test query (e.g. Helmet kahan milega?)..."
                      style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "var(--text)", outline: "none" }}
                    />
                    <button className="btn-p" onClick={() => handlePlaygroundSubmit()} disabled={playgroundLoading}>
                      {playgroundLoading ? "Running..." : "Test RAG"}
                    </button>
                  </div>

                  {/* Presets */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center", marginBottom: "20px" }}>
                    <span style={{ fontSize: "11px", color: "var(--muted)", marginRight: "6px" }}>Presets:</span>
                    <button className="btn-g" style={{ padding: "4px 8px", fontSize: "11px", border: "1px solid var(--border)" }} onClick={() => { setPlaygroundQuery("Safety helmet kahan milega?"); handlePlaygroundSubmit("Safety helmet kahan milega?"); }}>"Safety helmet"</button>
                    <button className="btn-g" style={{ padding: "4px 8px", fontSize: "11px", border: "1px solid var(--border)" }} onClick={() => { setPlaygroundQuery("Machine 4 error E-02 reset कैसे करें?"); handlePlaygroundSubmit("Machine 4 error E-02 reset कैसे करें?"); }}>"Machine 4 reset"</button>
                    <button className="btn-g" style={{ padding: "4px 8px", fontSize: "11px", border: "1px solid var(--border)" }} onClick={() => { setPlaygroundQuery("Chemical spill in aisle 4!"); handlePlaygroundSubmit("Chemical spill in aisle 4!"); }}>"Chemical spill"</button>
                  </div>

                  {playgroundLoading && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
                      <div className="boot-loader" style={{ width: "24px", height: "24px" }} />
                    </div>
                  )}

                  {playgroundResponse && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "12px", fontSize: "12.5px" }}>
                        <b>Grounded Output:</b>
                        <p style={{ margin: "6px 0 0", lineHeight: "1.5" }} dangerouslySetInnerHTML={{ __html: playgroundResponse.text.replace(/\n/g, "<br>") }} />
                      </div>
                      
                      <div className="trace-code-block" style={{ fontSize: "11px" }}>
                        Observe Trace: {playgroundResponse.trace.Observe}
                        {"\n"}Tools Called: {playgroundResponse.trace.ToolsCalled}
                        {"\n"}Best Score Match: {playgroundResponse.confidence}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
