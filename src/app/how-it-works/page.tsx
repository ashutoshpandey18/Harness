"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Custom Designed Logo Component ─── */
const Logo = () => (
  <span className="logo-brand" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", gap: "6px", verticalAlign: "middle" }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" style={{ color: "var(--text)" }}>
      <path d="M5 4v16M19 4v16M5 12h14" />
      <circle cx="12" cy="12" r="3.5" fill="var(--bg)" stroke="var(--orange)" strokeWidth="3" />
    </svg>
    <span style={{ fontWeight: 900, fontSize: "20px", color: "var(--text)", letterSpacing: "-0.03em" }}>
      Harness<span style={{ color: "var(--orange)", fontWeight: 500 }}>.ai</span>
    </span>
  </span>
);

const steps = [
  {
    num: "01",
    label: "Upload Your Knowledge",
    heading: "Every SOP, manual, and safety binder — digitized in minutes.",
    body: "Drop PDFs, Word docs, or paste share drive links. Harness.ai's document pipeline parses, chunks, and embeds every page into a searchable vector database. Your 40-page safety binder becomes a sub-second query.",
    chips: ["PDF / Word / Drive", "Automatic chunking", "pgvector embedding", "Instant indexing"],
    visual: "upload",
  },
  {
    num: "02",
    label: "Workers Just Text",
    heading: "No app download. No login. Just WhatsApp.",
    body: "Workers save one number. They text in Hindi, Tamil, or Telugu — even send voice notes from the shop floor. Harness.ai handles multilingual input, transcribes voice via Whisper, and matches the query to your knowledge base.",
    chips: ["WhatsApp / SMS / Line", "Hindi, Tamil, Telugu, English", "Voice → Text via Whisper", "Zero training needed"],
    visual: "text",
  },
  {
    num: "03",
    label: "Agent Thinks, Acts, Responds",
    heading: "4-second response. Supervisor notified. Incident logged.",
    body: "The agentic core runs a reasoning loop: search → confidence check → respond or escalate. High-confidence answers go directly to the worker. Low-confidence or safety-critical events trigger supervisor alerts and incident logs — automatically.",
    chips: ["RAG search + confidence scoring", "Supervisor escalation", "Auto incident logging", "Response in < 4 seconds"],
    visual: "agent",
  },
];

const techStack = [
  { name: "Meta WhatsApp Cloud API", role: "Messaging layer", color: "#25D366" },
  { name: "Twilio SMS Gateway", role: "US / Global SMS", color: "#F22F46" },
  { name: "OpenAI Whisper", role: "Voice transcription", color: "#10A37F" },
  { name: "Sarvam AI", role: "Hindi / regional NLP", color: "#FF5722" },
  { name: "pgvector + Supabase", role: "Vector knowledge store", color: "#3ECF8E" },
  { name: "Redis", role: "Conversation memory", color: "#DC382D" },
  { name: "DeepL API", role: "Multilingual translation", role2: "", color: "#003FFF" },
  { name: "Claude Vision", role: "Photo understanding", color: "#CC9B7A" },
];

const reasoningTrace = [
  { time: "0ms", step: "Observe", text: "WhatsApp webhook received from +91-98765-43210" },
  { time: "120ms", step: "Memory", text: "Redis cache: Worker profile loaded — Amit Kumar, Line 4" },
  { time: "340ms", step: "Search", text: "pgvector cosine search: 'Loom 4 E-04 reset' → 3 chunks, top score 0.94" },
  { time: "510ms", step: "Reason", text: "Confidence 0.94 > threshold 0.75 — no escalation needed" },
  { time: "820ms", step: "Respond", text: "Sarvam AI: Translated SOP procedure to Hindi" },
  { time: "1,090ms", step: "Dispatch", text: "Meta Cloud API: Message dispatched ✓" },
];

function UploadVisual() {
  const [active, setActive] = useState(0);
  const docs = ["Safety_Manual_v4.pdf", "Machine_SOP_Line4.docx", "Emergency_Protocols.pdf", "Onboarding_Guide.pdf"];

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % docs.length), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hiw-visual-box">
      <div className="hiw-upload-drop">
        <div className="hiw-drop-icon">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <p className="hiw-drop-label">Drop your documents here</p>
        <p className="hiw-drop-sub">PDF · Word · Google Drive · Notion</p>
      </div>
      <div className="hiw-file-list">
        {docs.map((d, i) => (
          <div key={d} className={`hiw-file-row ${i === active ? "hiw-file-active" : ""}`}>
            <span className="hiw-file-icon" style={{ display: "flex", alignItems: "center" }}>
              {d.endsWith(".pdf") ? (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              )}
            </span>
            <span className="hiw-file-name" style={{ marginLeft: "6px" }}>{d}</span>
            {i < active ? (
              <span className="hiw-file-check">✓ Indexed</span>
            ) : i === active ? (
              <span className="hiw-file-processing">Processing…</span>
            ) : (
              <span className="hiw-file-queued">Queued</span>
            )}
          </div>
        ))}
      </div>
      <div className="hiw-vec-bar">
        <span className="hiw-vec-label">Vector chunks embedded</span>
        <div className="hiw-vec-track">
          <div className="hiw-vec-fill" style={{ width: `${((active + 1) / docs.length) * 100}%` }} />
        </div>
        <span className="hiw-vec-count">{(active + 1) * 847} / {docs.length * 847}</span>
      </div>
    </div>
  );
}

function TextVisual() {
  const messages = [
    { from: "worker", text: "Helmet kahan milega?", lang: "Hindi" },
    { from: "agent", text: "Store Room B mein — Gate 2 ke paas. (SOP Sec 2.1) ✓✓", lang: "" },
    { from: "worker", text: "Voice note (0:03)", lang: "Voice" },
    { from: "agent", text: "Boiler 2: Aux valve B band karein, pressure gauge check karein. (SOP 5.4)", lang: "" },
  ];
  const [shown, setShown] = useState(1);

  useEffect(() => {
    const t = setInterval(() => setShown(p => Math.min(p + 1, messages.length)), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hiw-visual-box">
      <div className="hiw-chat-header">
        <div className="hiw-chat-dot hiw-dot-green" />
        <span>Harness.ai · WhatsApp</span>
        <span className="hiw-chat-badge">Hindi</span>
      </div>
      <div className="hiw-chat-feed">
        {messages.slice(0, shown).map((m, i) => (
          <div key={i} className={`hiw-chat-msg ${m.from === "agent" ? "hiw-msg-out" : "hiw-msg-in"}`}>
            {m.lang && <span className="hiw-msg-lang">{m.lang}</span>}
            {m.lang === "Voice" && (
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            )}
            <span style={{ verticalAlign: "middle" }}>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="hiw-channel-row">
        <div className="hiw-ch-pill hiw-ch-wa">WhatsApp</div>
        <div className="hiw-ch-pill hiw-ch-sms">Twilio SMS</div>
        <div className="hiw-ch-pill hiw-ch-line">Line App</div>
      </div>
    </div>
  );
}

function AgentVisual() {
  const [activeTrace, setActiveTrace] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTrace(p => (p + 1) % reasoningTrace.length), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hiw-visual-box">
      <div className="hiw-trace-header">
        <div className="hiw-trace-dot" />
        <span>Agent Reasoning Trace</span>
        <span className="hiw-trace-live">LIVE</span>
      </div>
      <div className="hiw-trace-feed">
        {reasoningTrace.map((r, i) => (
          <div key={i} className={`hiw-trace-row ${i === activeTrace ? "hiw-trace-active" : i < activeTrace ? "hiw-trace-done" : "hiw-trace-pending"}`}>
            <span className="hiw-trace-time">{r.time}</span>
            <span className={`hiw-trace-step hiw-step-${r.step.toLowerCase()}`}>{r.step}</span>
            <span className="hiw-trace-text">{r.text}</span>
          </div>
        ))}
      </div>
      <div className="hiw-result-row">
        <div className="hiw-result-num">1,090ms</div>
        <div className="hiw-result-label">Average end-to-end response</div>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = stepRefs.current.indexOf(e.target as HTMLDivElement);
            if (idx !== -1) setActiveStep(idx);
          }
        });
      },
      { threshold: 0.4 }
    );
    stepRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* NAV */}
      <nav id="main-nav" className={scrolled ? "scrolled" : ""}>
        <div className="w nav-container">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Logo />
          </Link>
          <input type="checkbox" id="nav-toggle" className="nav-toggle-checkbox" style={{ display: 'none' }} />
          <label htmlFor="nav-toggle" className="mobile-menu-btn" aria-label="Toggle navigation menu">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul className="nav-links">
            <li><Link href="/how-it-works" style={{ color: "var(--orange)", fontWeight: 600 }}>How It Works</Link></li>
            <li><Link href="/case-studies">Case Studies</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/#product">Product</Link></li>
          </ul>
          <div className="nav-actions">
            <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle theme" style={{ padding: "8px", display: "flex", alignItems: "center" }}>
              {theme === "light"
                ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
                : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              }
            </button>
            <Link href="/dashboard" className="btn-p">Admin Dashboard</Link>
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: "80px" }}>

        {/* HERO */}
        <section className="hiw-hero">
          <div className="w">
            <div className="hiw-hero-eyebrow">
              <span className="pulse-dot" />
              How Harness.ai Works
            </div>
            <h1 className="hiw-hero-h1">
              Three steps.<br />
              <em>Zero friction.</em><br />
              Factory-ready in minutes.
            </h1>
            <p className="hiw-hero-sub">
              From a dusty SOP binder to a real-time AI assistant on every worker's phone — here's exactly how it works, technically and operationally.
            </p>
            <div className="hiw-hero-stats">
              <div className="hiw-stat">
                <div className="hiw-stat-num">4 sec</div>
                <div className="hiw-stat-label">Avg response time</div>
              </div>
              <div className="hiw-stat-div" />
              <div className="hiw-stat">
                <div className="hiw-stat-num">500M+</div>
                <div className="hiw-stat-label">Frontline workers in India</div>
              </div>
              <div className="hiw-stat-div" />
              <div className="hiw-stat">
                <div className="hiw-stat-num">0</div>
                <div className="hiw-stat-label">Apps to download</div>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY STEP PROGRESS */}
        <div className="hiw-step-progress">
          {steps.map((s, i) => (
            <button
              key={i}
              className={`hiw-progress-btn ${activeStep === i ? "active" : ""}`}
              onClick={() => stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}
            >
              <span className="hiw-progress-num">{s.num}</span>
              <span className="hiw-progress-label">{s.label}</span>
            </button>
          ))}
        </div>

        {/* STEPS */}
        <div className="hiw-steps-container">
          {steps.map((s, i) => (
            <section
              key={i}
              className="hiw-step-section"
              ref={(el) => { stepRefs.current[i] = el as HTMLDivElement; }}
            >
              <div className="w hiw-step-grid">
                {/* Left: Content */}
                <div className="hiw-step-content">
                  <div className="hiw-step-tag">{s.label}</div>
                  <div className="hiw-step-bignum">{s.num}</div>
                  <h2 className="hiw-step-h2">{s.heading}</h2>
                  <p className="hiw-step-body">{s.body}</p>
                  <div className="hiw-chips">
                    {s.chips.map((c) => (
                      <span key={c} className="hiw-chip">{c}</span>
                    ))}
                  </div>
                </div>

                {/* Right: Visual */}
                <div className="hiw-step-visual">
                  {s.visual === "upload" && <UploadVisual />}
                  {s.visual === "text" && <TextVisual />}
                  {s.visual === "agent" && <AgentVisual />}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* ARCHITECTURE SECTION */}
        <section className="hiw-arch-section">
          <div className="w">
            <div className="sec-label">Under the Hood</div>
            <h2 className="sec-h2" style={{ maxWidth: "600px" }}>
              Enterprise-grade infrastructure. Factory-simple interface.
            </h2>
            <p className="sec-sub">
              Every component in the stack is selected for reliability at scale, cost efficiency, and India-specific language support.
            </p>
            <div className="hiw-tech-grid">
              {techStack.map((t) => (
                <div key={t.name} className="hiw-tech-card">
                  <div className="hiw-tech-dot" style={{ background: t.color }} />
                  <div>
                    <div className="hiw-tech-name">{t.name}</div>
                    <div className="hiw-tech-role">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FULL LOOP DIAGRAM */}
        <section className="hiw-loop-section">
          <div className="w">
            <div className="sec-label">The Full Loop</div>
            <h2 className="sec-h2">Signal to response. Every time.</h2>
            <div className="hiw-loop-diagram">
              {["Worker texts", "Webhook fires", "Agent reasons", "Knowledge searched", "Response drafted", "Message dispatched", "Worker reads"].map((node, i, arr) => (
                <React.Fragment key={node}>
                  <div className={`hiw-loop-node ${i === 0 || i === arr.length - 1 ? "hiw-node-accent" : ""}`}>
                    {node}
                  </div>
                  {i < arr.length - 1 && <div className="hiw-loop-arrow">→</div>}
                </React.Fragment>
              ))}
            </div>
            <p className="hiw-loop-caption">Average end-to-end latency: <strong>under 4 seconds</strong> for 94% of queries</p>
          </div>
        </section>

        {/* CTA */}
        <section className="hiw-cta-section">
          <div className="w hiw-cta-inner">
            <div className="hiw-cta-content">
              <h2 className="hiw-cta-h2">Ready to see it on your factory floor?</h2>
              <p className="hiw-cta-sub">Get a personalized demo with your actual SOPs loaded in. Takes 15 minutes.</p>
            </div>
            <div className="hiw-cta-actions">
              <Link href="/pricing" className="btn-p">View Pricing</Link>
              <Link href="/case-studies" className="btn-g">See Case Studies</Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="w footer-container">
            <div className="f-logo"><Logo /></div>
            <div className="f-copy">© 2026 Harness.ai. All rights reserved. Confidential.</div>
          </div>
        </footer>
      </main>

      <style>{`
        /* HIW HERO */
        .hiw-hero {
          padding: 80px 0 60px;
          border-bottom: 0.5px solid var(--border);
        }
        .hiw-hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--orange);
          margin-bottom: 24px;
        }
        .hiw-hero-h1 {
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 24px;
        }
        .hiw-hero-h1 em {
          font-style: italic;
          color: var(--orange);
        }
        .hiw-hero-sub {
          font-size: 18px;
          color: var(--muted);
          max-width: 560px;
          line-height: 1.65;
          margin-bottom: 48px;
        }
        .hiw-hero-stats {
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .hiw-stat-num {
          font-size: 28px;
          font-weight: 800;
          color: var(--text);
        }
        .hiw-stat-label {
          font-size: 12px;
          color: var(--muted);
          margin-top: 2px;
        }
        .hiw-stat-div {
          width: 1px;
          height: 32px;
          background: var(--border2);
        }

        /* STEP PROGRESS */
        .hiw-step-progress {
          position: sticky;
          top: 72px;
          z-index: 90;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border-bottom: 0.5px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 0;
          overflow-x: auto;
        }
        .hiw-progress-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 28px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-family: inherit;
          color: var(--muted);
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .hiw-progress-btn.active {
          color: var(--orange);
          border-bottom-color: var(--orange);
        }
        .hiw-progress-num {
          font-size: 11px;
          font-weight: 700;
          opacity: 0.5;
        }
        .hiw-progress-btn.active .hiw-progress-num {
          opacity: 1;
        }

        /* STEP SECTIONS */
        .hiw-steps-container { background: var(--bg); }
        .hiw-step-section {
          padding: 100px 0;
          border-bottom: 0.5px solid var(--border);
        }
        .hiw-step-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .hiw-step-tag {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--orange);
          margin-bottom: 12px;
        }
        .hiw-step-bignum {
          font-size: 120px;
          font-weight: 900;
          line-height: 1;
          color: var(--border2);
          letter-spacing: -0.05em;
          margin-bottom: -16px;
          font-feature-settings: 'tnum';
        }
        .hiw-step-h2 {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          color: var(--text);
        }
        .hiw-step-body {
          font-size: 16px;
          color: var(--muted);
          line-height: 1.7;
          margin-bottom: 28px;
        }
        .hiw-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hiw-chip {
          background: var(--white);
          border: 0.5px solid var(--border2);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text);
        }

        /* VISUAL BOX */
        .hiw-visual-box {
          background: var(--white);
          border: 0.5px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 60px var(--shadow-heavy);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* UPLOAD VISUAL */
        .hiw-upload-drop {
          border: 1.5px dashed var(--border2);
          border-radius: 12px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }
        .hiw-drop-icon { color: var(--orange); }
        .hiw-drop-label { font-size: 14px; font-weight: 600; color: var(--text); }
        .hiw-drop-sub { font-size: 12px; color: var(--muted2); }
        .hiw-file-list { display: flex; flex-direction: column; gap: 8px; }
        .hiw-file-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          background: var(--bg);
          border: 0.5px solid var(--border);
          transition: all 0.3s;
          font-size: 13px;
        }
        .hiw-file-row.hiw-file-active {
          border-color: var(--orange);
          background: var(--orange-m);
        }
        .hiw-file-name { flex: 1; font-weight: 500; color: var(--text); }
        .hiw-file-check { font-size: 11px; color: var(--green); font-weight: 600; }
        .hiw-file-processing { font-size: 11px; color: var(--orange); font-weight: 600; }
        .hiw-file-queued { font-size: 11px; color: var(--muted2); }
        .hiw-vec-bar { display: flex; align-items: center; gap: 10px; }
        .hiw-vec-label { font-size: 11px; color: var(--muted); white-space: nowrap; }
        .hiw-vec-track { flex: 1; height: 4px; background: var(--border); border-radius: 4px; overflow: hidden; }
        .hiw-vec-fill { height: 100%; background: var(--orange); border-radius: 4px; transition: width 0.6s ease; }
        .hiw-vec-count { font-size: 11px; color: var(--muted); white-space: nowrap; font-variant-numeric: tabular-nums; }

        /* CHAT VISUAL */
        .hiw-chat-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 12px;
          border-bottom: 0.5px solid var(--border);
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }
        .hiw-chat-dot { width: 8px; height: 8px; border-radius: 50%; }
        .hiw-dot-green { background: #25D366; }
        .hiw-chat-badge {
          margin-left: auto;
          font-size: 10px;
          background: var(--orange-m);
          color: var(--orange);
          border: 0.5px solid var(--orange);
          border-radius: 100px;
          padding: 2px 8px;
          font-weight: 600;
        }
        .hiw-chat-feed { display: flex; flex-direction: column; gap: 10px; min-height: 120px; }
        .hiw-chat-msg {
          max-width: 80%;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.5;
          animation: fadeSlideIn 0.3s ease-out;
        }
        .hiw-msg-in { background: var(--bg); border: 0.5px solid var(--border); align-self: flex-start; color: var(--text); }
        .hiw-msg-out { background: #25D366; color: #fff; align-self: flex-end; }
        .hiw-msg-lang {
          display: block;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          opacity: 0.6;
          margin-bottom: 2px;
        }
        .hiw-channel-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .hiw-ch-pill {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 100px;
          border: 0.5px solid;
        }
        .hiw-ch-wa { background: rgba(37,211,102,0.1); color: #25D366; border-color: #25D366; }
        .hiw-ch-sms { background: rgba(242,47,70,0.08); color: #F22F46; border-color: #F22F46; }
        .hiw-ch-line { background: rgba(6,199,85,0.08); color: #06C755; border-color: #06C755; }

        /* AGENT TRACE VISUAL */
        .hiw-trace-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          padding-bottom: 12px;
          border-bottom: 0.5px solid var(--border);
          color: var(--text);
        }
        .hiw-trace-dot {
          width: 8px;
          height: 8px;
          background: var(--orange);
          border-radius: 50%;
          animation: pulse-anim 1.4s infinite;
        }
        .hiw-trace-live {
          margin-left: auto;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          background: #FEE2E2;
          color: var(--red);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .hiw-trace-feed { display: flex; flex-direction: column; gap: 6px; font-family: var(--font-mono); }
        .hiw-trace-row {
          display: grid;
          grid-template-columns: 54px 64px 1fr;
          gap: 8px;
          align-items: start;
          padding: 7px 10px;
          border-radius: 6px;
          font-size: 11px;
          transition: all 0.2s;
        }
        .hiw-trace-pending { opacity: 0.25; }
        .hiw-trace-done { opacity: 0.55; }
        .hiw-trace-active { background: var(--orange-m); border: 0.5px solid var(--orange); opacity: 1; }
        .hiw-trace-time { color: var(--muted); font-weight: 600; }
        .hiw-trace-step {
          font-weight: 700;
          text-transform: uppercase;
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 3px;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          height: fit-content;
        }
        .hiw-step-observe { background: #DBEAFE; color: #1D4ED8; }
        .hiw-step-memory { background: #F3E8FF; color: #7C3AED; }
        .hiw-step-search { background: #FEF3C7; color: #B45309; }
        .hiw-step-reason { background: #D1FAE5; color: #065F46; }
        .hiw-step-respond { background: #FFE4E6; color: #BE123C; }
        .hiw-step-dispatch { background: var(--orange-m); color: var(--orange); }

        .dark-theme .hiw-step-observe { background: #1a2a3a; color: #60a5fa; }
        .dark-theme .hiw-step-memory { background: #2a1a3a; color: #c084fc; }
        .dark-theme .hiw-step-search { background: #352c0f; color: #facc15; }
        .dark-theme .hiw-step-reason { background: #14321a; color: #4ade80; }
        .dark-theme .hiw-step-respond { background: #3d1c1c; color: #f87171; }
        .hiw-trace-text { color: var(--text); line-height: 1.4; }
        .hiw-result-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 12px;
          border-top: 0.5px solid var(--border);
        }
        .hiw-result-num { font-size: 22px; font-weight: 800; color: var(--orange); }
        .hiw-result-label { font-size: 12px; color: var(--muted); }

        /* ARCHITECTURE */
        .hiw-arch-section {
          padding: 100px 0;
          background: var(--white);
          border-top: 0.5px solid var(--border);
          border-bottom: 0.5px solid var(--border);
        }
        .hiw-tech-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 48px;
        }
        .hiw-tech-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 18px;
          background: var(--bg);
          border: 0.5px solid var(--border);
          border-radius: 12px;
          transition: all 0.2s;
        }
        .hiw-tech-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 8px 20px var(--shadow-heavy); }
        .hiw-tech-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
        }
        .hiw-tech-name { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
        .hiw-tech-role { font-size: 11px; color: var(--muted); }

        /* LOOP DIAGRAM */
        .hiw-loop-section {
          padding: 100px 0;
          background: var(--bg);
        }
        .hiw-loop-diagram {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 48px;
          margin-bottom: 24px;
        }
        .hiw-loop-node {
          padding: 10px 18px;
          background: var(--white);
          border: 0.5px solid var(--border2);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }
        .hiw-node-accent {
          background: var(--orange);
          color: #fff;
          border-color: var(--orange);
        }
        .hiw-loop-arrow { font-size: 18px; color: var(--muted2); }
        .hiw-loop-caption { font-size: 14px; color: var(--muted); }

        /* CTA */
        .hiw-cta-section {
          padding: 80px 0;
          background: #2D2A26;
        }
        .dark-theme .hiw-cta-section {
          background: #121110;
        }
        .hiw-cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }
        .hiw-cta-h2 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .hiw-cta-sub { font-size: 15px; color: rgba(255,255,255,0.6); }
        .hiw-cta-actions { display: flex; gap: 12px; flex-wrap: wrap; }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-anim {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        @media (max-width: 900px) {
          .hiw-step-grid { grid-template-columns: 1fr; gap: 40px; }
          .hiw-tech-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .hiw-tech-grid { grid-template-columns: 1fr; }
          .hiw-loop-diagram { flex-direction: column; align-items: stretch; }
          .hiw-loop-arrow { text-align: center; transform: rotate(90deg); margin: 4px 0; }
        }
      `}</style>
    </>
  );
}
