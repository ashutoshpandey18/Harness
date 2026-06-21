"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PhoneSimulator from "@/components/PhoneSimulator";

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

/* ─── Inline SVG Icon Helpers ─── */
const SvgLightning = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const SvgBrain = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
    <line x1="7.41" y1="7.41" x2="10.59" y2="10.59" strokeWidth="1.5" />
    <line x1="16.59" y1="7.41" x2="13.41" y2="10.59" strokeWidth="1.5" />
    <line x1="7.41" y1="16.59" x2="10.59" y2="13.41" strokeWidth="1.5" />
    <line x1="16.59" y1="16.59" x2="13.41" y2="13.41" strokeWidth="1.5" />
  </svg>
);

const SvgGlobe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10zM2 12h20" />
  </svg>
);

const SvgMic = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v5a3 3 0 01-3 3z" />
  </svg>
);

const SvgCamera = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 018.686 5h6.628c.78 0 1.498.396 1.859 1.175l1.05 2.274a.462.462 0 00.418.262.462.462 0 01.462.462v9.377a1.5 1.5 0 01-1.5 1.5H5.456a1.5 1.5 0 01-1.5-1.5V9.173a.462.462 0 01.462-.462.462.462 0 00.418-.262l1.05-2.274ZM12 16.5a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5Z" />
  </svg>
);

const SvgAlert = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const SvgShield = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12Z" />
  </svg>
);

const SvgCog = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SvgUserPlus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zM4 19.235A8.91 8.91 0 0 1 9 18a8.91 8.91 0 0 1 5 1.235c.19.115.3.322.3.546v.719a.75.75 0 0 1-.75.75H4.75a.75.75 0 0 1-.75-.75V19.78c0-.224.11-.43.3-.546z" />
  </svg>
);

const SvgLock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const SvgChart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 18.375v-5.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125v-9.75zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z" />
  </svg>
);

/* ─── Count-up hook ─── */
function useCountUp(target: number, duration: number, trigger: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start: number | null = null;
    const raf = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [trigger, target, duration]);
  return val;
}

/* ─── Ticker data ─── */
const TICKER = [
  { flag: "IN", q: "Helmet kahan milega?",         r: "Store Room B — Gate 2 (SOP 2.1)", t: "0.8s" },
  { flag: "IN", q: "Machine 4 reset kaise karein?", r: "Error E-02: Switch off → 30s → Reset", t: "1.2s" },
  { flag: "US", q: "Chemical spill in aisle 4",     r: "Supervisor alerted. Evacuate now.", t: "0.6s" },
  { flag: "MX", q: "¿Dónde están las gafas?",       r: "Gabinete A, junto a la entrada", t: "1.1s" },
  { flag: "VN", q: "Kính bảo hộ để ở đâu?",        r: "Tủ An toàn A, cạnh lối vào chính", t: "1.4s" },
  { flag: "IN", q: "Boiler 2 warning light red",    r: "Close aux valve B, check pressure", t: "0.9s" },
];

/* ─── Features ─── */
const FEATURES = [
  { 
    icon: <SvgLightning style={{ color: "#FF5722" }} />, 
    title: "4-Second Response", 
    desc: "Sub-4s end-to-end from WhatsApp to verified SOP answer. Not a chatbot latency — an agent latency.", 
    color: "#FF5722",
    details: "Pipeline breakdown: 0.2s audio buffer transcription -> 1.1s Supabase pgvector RAG fetch -> 1.8s regional language synthesis -> 0.4s network dispatch."
  },
  { 
    icon: <SvgBrain style={{ color: "#7C3AED" }} />, 
    title: "Agentic Reasoning", 
    desc: "Search → confidence check → respond or escalate. Autonomously. Every query. Every time.", 
    color: "#7C3AED",
    details: "The agent reviews retrieved text. If RAG match confidence is < 75%, it asks the worker clarification questions instead of returning inaccurate information."
  },
  { 
    icon: <SvgGlobe style={{ color: "#1D4ED8" }} />, 
    title: "8 Languages", 
    desc: "Hindi, Tamil, Telugu, Marathi, Bengali, English, Spanish, Vietnamese. Auto-detected. Auto-translated.", 
    color: "#1D4ED8",
    details: "Supports regional slang. Standard phrases are mapped through deep semantic embeddings, supporting diverse local factory terminology natively."
  },
  { 
    icon: <SvgMic style={{ color: "#059669" }} />, 
    title: "Voice Notes", 
    desc: "Workers record on a loud factory floor. Whisper + FFmpeg transcribes it. Agent responds in text.", 
    color: "#059669",
    details: "Utilizes an FFmpeg voice gating algorithm that strips out low-frequency heavy machinery hums before dispatching files to the Whisper transcription node."
  },
  { 
    icon: <SvgCamera style={{ color: "#B45309" }} />, 
    title: "Photo Understanding", 
    desc: "Snap the error screen. Claude Vision reads it. Agent returns the SOP section. No manual lookup.", 
    color: "#B45309",
    details: "Accepts snapshots of gauges, error display terminals, and safety equipment. The model performs OCR and identifies warning states in under 3 seconds."
  },
  { 
    icon: <SvgAlert style={{ color: "#DC2626" }} />, 
    title: "Auto-Escalation", 
    desc: "Safety keywords trigger immediate supervisor alerts, logged incidents, and override flags. Zero delay.", 
    color: "#DC2626",
    details: "Matches high-severity words (fire, leak, smoke, shock). Triggers immediate webhook notifications to active supervisors and logs entries in the Postgres DB."
  },
];

/* ─── Metrics ─── */
const METRICS = [
  { target: 500, suffix: "M+", label: "Frontline workers in India",   sub: "Total addressable market" },
  { target: 94,  suffix: "%",  label: "First-response resolution",    sub: "Without supervisor escalation" },
  { target: 4,   suffix: "s",  label: "Average response time",        sub: "Across all query types" },
  { target: 89,  suffix: "%",  label: "Fewer supervisor interruptions", sub: "From our 90-day pilot data" },
];

/* ─── Chaos messages ─── */
const CHAOS = [
  "Machine 3 ka error code kya hai?",
  "Safety harness kahan milega?",
  "Loom 4 thread tension reset?",
  "Chemical cabinet ki key?",
  "Break ka time change hua kya?",
  "Emergency exit ka code?",
  "Quality check form kahan hai?",
  "Shift change procedure?",
];

/* ─── Use-case interactive tab data ─── */
const USE_CASES = [
  { 
    id: "safety",
    tag: "Safety",     
    icon: <SvgShield width="18" height="18" />, 
    q: "Helmet kahan milega?",            
    a: "Store Room B — Gate 2 ke paas. (SOP 2.1)",
    log: "Found SOP 2.1 (confidence 96%). Mapped location: Store Room B.",
    bg: "#FFF7ED", 
    border: "#FDBA74" 
  },
  { 
    id: "emergency",
    tag: "Emergency",  
    icon: <SvgAlert width="18" height="18" />, 
    q: "Line 2 mein smoke aa raha hai!",   
    a: "[EMERGENCY ALERT] Main gas valve band karein. Supervisor Ramesh ji ko notify kar diya gaya hai. Evacuate immediately.",
    log: "Severity: HIGH. Supervisor Ramesh notified. Incident auto-logged (ID: 9422).",
    bg: "#FEF2F2", 
    border: "#FCA5A5" 
  },
  { 
    id: "machine",
    tag: "Machine",    
    icon: <SvgCog width="18" height="18" />, 
    q: "Machine 4 band ho gayi, reset?",   
    a: "Error E-02: Main switch off -> 30s wait -> Reset. (SOP 4.2)",
    log: "Found machine reset code E-02 match (confidence 91%).",
    bg: "#F0FDF4", 
    border: "#86EFAC" 
  },
  { 
    id: "onboarding",
    tag: "Onboarding", 
    icon: <SvgUserPlus width="18" height="18" />, 
    q: "Hi",                               
    a: "Namaste! Harness.ai mein aapka swagat hai. Aapka naam kya hai?",
    log: "New worker greeting registered. Triggering onboarding sequence.",
    bg: "#EFF6FF", 
    border: "#93C5FD" 
  },
];

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [heroIn, setHeroIn] = useState(false);
  const [metricsOn, setMetricsOn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("product");
  const metricsRef = useRef<HTMLDivElement>(null);

  /* UX States */
  const [activeTab, setActiveTab] = useState(0);
  const [typedQ, setTypedQ] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [typingState, setTypingState] = useState<"idle" | "typing" | "thinking" | "replying">("idle");
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  /* Email Capture States */
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

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

  /* Scroll handler for progress, nav toggle, and active section */
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 24);

      // Scroll Progress Bar calculation
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Check active section
      const sections = ["product", "knowledge-layer", "how-it-works", "features", "metrics", "use-cases", "pricing"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Hero reveal */
  useEffect(() => { const t = setTimeout(() => setHeroIn(true), 80); return () => clearTimeout(t); }, []);

  /* Metrics observer */
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setMetricsOn(true); }, { threshold: 0.25 });
    if (metricsRef.current) obs.observe(metricsRef.current);
    return () => obs.disconnect();
  }, []);

  /* Scroll Reveal animation trigger */
  useEffect(() => {
    const els = document.querySelectorAll(".sr");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("sr-in"); }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Interactive Use Case Tab typing workflow loop */
  useEffect(() => {
    setTypedQ("");
    setShowReply(false);
    setTypingState("typing");

    const fullQ = USE_CASES[activeTab].q;
    let curr = "";
    let i = 0;
    let timer: NodeJS.Timeout;

    const type = () => {
      if (i < fullQ.length) {
        curr += fullQ[i];
        setTypedQ(curr);
        i++;
        timer = setTimeout(type, 50);
      } else {
        setTypingState("thinking");
        timer = setTimeout(() => {
          setTypingState("replying");
          setShowReply(true);
        }, 1200);
      }
    };

    timer = setTimeout(type, 200);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setEmailStatus("error");
      return;
    }
    setEmailStatus("submitting");
    setTimeout(() => {
      setEmailStatus("success");
      setEmail("");
    }, 1500);
  };

  const m0 = useCountUp(METRICS[0].target, 1800, metricsOn);
  const m1 = useCountUp(METRICS[1].target, 1400, metricsOn);
  const m2 = useCountUp(METRICS[2].target,  800, metricsOn);
  const m3 = useCountUp(METRICS[3].target, 1600, metricsOn);
  const MV  = [m0, m1, m2, m3];

  return (
    <>
      {/* ────── SCROLL PROGRESS BAR ────── */}
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* ────── FLOATING DOT NAVIGATION ────── */}
      <div className="dot-nav" role="navigation" aria-label="Quick jump dot navigation">
        {[
          { id: "product", label: "Product" },
          { id: "knowledge-layer", label: "The Problem" },
          { id: "how-it-works", label: "Architecture" },
          { id: "features", label: "Features" },
          { id: "metrics", label: "Metrics" },
          { id: "use-cases", label: "Interactive Demo" },
          { id: "pricing", label: "Pricing" }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth" })}
            className={`dot-nav-item ${activeSection === sec.id ? "active" : ""}`}
            aria-label={`Jump to ${sec.label}`}
          >
            <span className="dot-nav-tooltip">{sec.label}</span>
          </button>
        ))}
      </div>

      {/* ────── NAV ────── */}
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
            <li><Link href="/how-it-works">How It Works</Link></li>
            <li><Link href="/case-studies">Case Studies</Link></li>
            <li><a href="#product" onClick={() => {
              const el = document.getElementById("nav-toggle") as HTMLInputElement;
              if (el) el.checked = false;
            }}>Product</a></li>
            <li><Link href="/pricing">Pricing</Link></li>
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

      {/* ────── LIVE TICKER ────── */}
      <div className="ticker-bar" role="marquee" aria-label="Live factory queries">
        <span className="ticker-live-tag">LIVE</span>
        <div className="ticker-track">
          <div className="ticker-items">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="ticker-item">
                <span className="ti-flag-badge">{t.flag}</span>
                <span className="ti-q">"{t.q}"</span>
                <span className="ti-arr">→</span>
                <span className="ti-r">{t.r}</span>
                <span className="ti-t">{t.t}</span>
                <span className="ti-sep">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <main>

        {/* ══════════════════════════════════════════
            HERO — THE PRODUCT IS THE HERO
        ══════════════════════════════════════════ */}
        <section className="lp-hero" id="product">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="orb orb-c" />

          <div className="w hero-grid">
            <div className={`hero-copy ${heroIn ? "hero-copy-in" : ""}`}>
              <div className="eyebrow">
                <span className="pulse-dot" />
                Factory AI — Product Console — 2026
              </div>

              <h1 className="lp-h1" id="lp-hero-headline">
                <span className="h1-muted">Every worker's</span>
                <span className="h1-bold">WhatsApp.</span>
                <span className="h1-accent">Your entire <em>SOP.</em></span>
              </h1>

              <p className="lp-hero-sub">
                Harness.ai is an agentic AI assistant for India's factory workers.
                Ask in Hindi via WhatsApp. Get a verified SOP answer in under 4 seconds.
                No app. No login. No training.
              </p>

              <div className="hero-ctas">
                <Link href="/how-it-works" className="hero-btn-primary">
                  See How It Works
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                </Link>
                <Link href="/case-studies" className="hero-btn-ghost">
                  View Case Studies
                </Link>
              </div>

              <div className="hero-pills">
                {["WhatsApp-native", "Hindi-first", "Zero app install", "< 4s response", "Agentic (not chatbot)"].map(p => (
                  <span key={p} className="hero-pill">{p}</span>
                ))}
              </div>

              <div className="hero-stats-row">
                {[
                  { n: "500M+", l: "frontline workers in India" },
                  { n: "INR 0",  l: "per message for workers" },
                  { n: "8",    l: "languages" },
                ].map((s, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div className="hs-div" />}
                    <div className="hs-item">
                      <span className="hs-n">{s.n}</span>
                      <span className="hs-l">{s.l}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className={`hero-visual ${heroIn ? "hero-visual-in" : ""}`}>
              <div className="radar">
                <div className="radar-ring rr-1" />
                <div className="radar-ring rr-2" />
                <div className="radar-ring rr-3" />
              </div>

              <div className="float-tag ft-tl float-anim-1">
                <span className="ft-dot green-dot" />
                <span>Surat · Velvet Garments</span>
              </div>
              <div className="float-tag ft-tr float-anim-2">
                <span className="ft-dot orange-dot" />
                <span>240 workers onboarded</span>
              </div>
              <div className="float-tag ft-bl float-anim-3">
                <span className="ft-dot blue-dot" />
                <span>Response in 1.1s</span>
              </div>
              <div className="float-tag ft-br float-anim-2" style={{ animationDelay: "1.5s" }}>
                <SvgLock width="12" height="12" style={{ display: "inline-block", verticalAlign: "middle" }} />
                <span style={{ marginLeft: "4px" }}>Safety alert auto-escalated</span>
              </div>

              <div className="hero-phone-wrap" id="hero-phone-dock">
                <PhoneSimulator
                  onShowSpeechBubbles={() => {}}
                  isDashboardDocked={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            INDUSTRY RIBBON
        ══════════════════════════════════════════ */}
        <section className="lp-ribbon">
          <div className="ribbon-label">Built for India's manufacturing floor —</div>
          <div className="ribbon-track">
            <div className="ribbon-items">
              {["Garments & Apparel", "Auto Ancillary", "Pharmaceuticals", "Construction", "FMCG", "Chemicals & Petrochem", "Electronics Assembly", "Warehousing & Logistics", "Garments & Apparel", "Auto Ancillary", "Pharmaceuticals", "Construction", "FMCG", "Chemicals & Petrochem", "Electronics Assembly", "Warehousing & Logistics"].map((item, i) => (
                <span key={i} className="ribbon-item">
                  {item}
                  <span className="ribbon-sep">·</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            THE PROBLEM — DARK SECTION
        ══════════════════════════════════════════ */}
        <section className="lp-problem sr" id="knowledge-layer">
          <div className="prob-noise-grid" />
          <div className="w prob-grid">
            <div className="prob-copy">
              <div className="sec-label" style={{ color: "rgba(255,255,255,0.35)" }}>The Problem</div>
              <h2 className="prob-h2">
                One supervisor.<br />200 workers.<br />
                <span style={{ color: "var(--orange)" }}>Impossible math.</span>
              </h2>
              <p className="prob-sub">
                Factory knowledge is locked inside supervisors' heads. When they're overwhelmed, the floor stalls. When they're away, production stops.
              </p>

              <div className="prob-stats">
                {[
                  { n: "80+", l: "Daily repeat queries to one supervisor" },
                  { n: "2.4h", l: "Hours lost per supervisor per shift" },
                  { n: "38 min", l: "Average machine error response time" },
                  { n: "61%", l: "SOP compliance without digital enforcement" },
                ].map((s) => (
                  <div key={s.l} className="prob-stat">
                    <div className="prob-stat-n">{s.n}</div>
                    <div className="prob-stat-l">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="prob-visual">
              <div className="chaos-phone">
                <div className="chaos-topbar">
                  <div className="chaos-av">RM</div>
                  <div>
                    <div className="chaos-name">Ramesh Sir</div>
                    <div className="chaos-sub">Supervisor · Velvet Garments</div>
                  </div>
                  <div className="chaos-unread">83</div>
                </div>
                <div className="chaos-feed">
                  {CHAOS.map((m, i) => (
                    <div key={i} className="chaos-msg" style={{ animationDelay: `${i * 0.15}s` }}>
                      {m}
                    </div>
                  ))}
                </div>
                <div className="chaos-footer">
                  <SvgAlert width="12" height="12" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                  <span>3 hours of repeat questions every single shift</span>
                </div>
              </div>

              <div className="prob-arrow-down">
                <div className="pad-line" />
                <div className="pad-label">Harness.ai absorbs all of this →</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CONNECTION — HOW THE SYSTEM CONNECTS
        ══════════════════════════════════════════ */}
        <section className="lp-conn sr" id="how-it-works">
          <div className="w">
            <div className="conn-header">
              <div className="sec-label">The Architecture</div>
              <h2 className="sec-h2">
                One AI node. Every worker. Every question.
              </h2>
              <p className="sec-sub" style={{ maxWidth: "520px" }}>
                Harness.ai sits between your knowledge base and your workforce — handling everything autonomously, in real-time.
              </p>
            </div>

            <div className="conn-diagram">
              <div className="conn-col">
                <div className="conn-col-title">Workers</div>
                {[
                  { ch: "WhatsApp Cloud API", dot: "#25D366" },
                  { ch: "Twilio SMS Gateway", dot: "#F22F46" },
                  { ch: "Line App (Southeast Asia)", dot: "#06C755" },
                ].map((c, i) => (
                  <div key={i} className="conn-node cn-left" style={{ animationDelay: `${i * 0.15}s` }}>
                    <div className="cn-dot" style={{ background: c.dot }} />
                    {c.ch}
                  </div>
                ))}
              </div>

              <svg className="conn-svg" viewBox="0 0 120 220" fill="none" preserveAspectRatio="xMidYMid meet">
                <path d="M10 35 C 60 35, 60 110, 110 110" stroke="var(--border2)" strokeWidth="1.2" className="cp"/>
                <path d="M10 110 L 110 110" stroke="var(--border2)" strokeWidth="1.2" className="cp"/>
                <path d="M10 185 C 60 185, 60 110, 110 110" stroke="var(--border2)" strokeWidth="1.2" className="cp"/>
                <circle r="3" fill="var(--orange)" opacity="0.8">
                  <animateMotion dur="2s" repeatCount="indefinite" begin="0s">
                    <mpath href="#p1"/>
                  </animateMotion>
                </circle>
                <circle r="3" fill="var(--orange)" opacity="0.8">
                  <animateMotion dur="2s" repeatCount="indefinite" begin="0.7s">
                    <mpath href="#p2"/>
                  </animateMotion>
                </circle>
                <circle r="3" fill="var(--orange)" opacity="0.8">
                  <animateMotion dur="2s" repeatCount="indefinite" begin="1.4s">
                    <mpath href="#p3"/>
                  </animateMotion>
                </circle>
                <defs>
                  <path id="p1" d="M10 35 C 60 35, 60 110, 110 110"/>
                  <path id="p2" d="M10 110 L 110 110"/>
                  <path id="p3" d="M10 185 C 60 185, 60 110, 110 110"/>
                </defs>
              </svg>

              <div className="conn-brain">
                <div className="brain-ring br-1" />
                <div className="brain-ring br-2" />
                <div className="brain-core">
                  <SvgBrain style={{ color: "#fff" }} />
                  <div className="bc-name">Harness.ai</div>
                  <div className="bc-sub">RAG · Agent · Multi-lingual</div>
                </div>
              </div>

              <svg className="conn-svg" viewBox="0 0 120 220" fill="none" preserveAspectRatio="xMidYMid meet">
                <path d="M10 110 C 60 110, 60 35, 110 35" stroke="var(--border2)" strokeWidth="1.2" className="cp"/>
                <path d="M10 110 L 110 110" stroke="var(--border2)" strokeWidth="1.2" className="cp"/>
                <path d="M10 110 C 60 110, 60 185, 110 185" stroke="var(--border2)" strokeWidth="1.2" className="cp"/>
                <circle r="3" fill="#25D366" opacity="0.8">
                  <animateMotion dur="2s" repeatCount="indefinite" begin="0.3s">
                    <mpath href="#q1"/>
                  </animateMotion>
                </circle>
                <circle r="3" fill="#DC2626" opacity="0.8">
                  <animateMotion dur="2s" repeatCount="indefinite" begin="1s">
                    <mpath href="#q2"/>
                  </animateMotion>
                </circle>
                <circle r="3" fill="#B45309" opacity="0.8">
                  <animateMotion dur="2s" repeatCount="indefinite" begin="1.7s">
                    <mpath href="#q3"/>
                  </animateMotion>
                </circle>
                <defs>
                  <path id="q1" d="M10 110 C 60 110, 60 35, 110 35"/>
                  <path id="q2" d="M10 110 L 110 110"/>
                  <path id="q3" d="M10 110 C 60 110, 60 185, 110 185"/>
                </defs>
              </svg>

              <div className="conn-col">
                <div className="conn-col-title">Outputs</div>
                {[
                  { label: "SOP Answer → Worker",    dot: "#FF5722" },
                  { label: "Supervisor Alert",        dot: "#DC2626" },
                  { label: "Incident Auto-Log",       dot: "#B45309" },
                ].map((o, i) => (
                  <div key={i} className="conn-node cn-right" style={{ animationDelay: `${i * 0.15}s` }}>
                    <div className="cn-dot" style={{ background: o.dot }} />
                    {o.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FEATURES — INTERACTIVE DRAWER CARDS
        ══════════════════════════════════════════ */}
        <section className="lp-features sr" id="features">
          <div className="feat-bg-grid" />
          <div className="w">
            <div className="sec-label" style={{ color: "rgba(255,255,255,0.35)" }}>Features</div>
            <h2 className="feat-h2">
              Everything a factory needs.<br />Nothing it doesn't.
            </h2>
            <div className="feat-grid">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  onClick={() => setExpandedFeature(expandedFeature === i ? null : i)}
                  className={`feat-card ${expandedFeature === i ? "feat-card-expanded" : ""}`}
                  style={{ "--fc": f.color, animationDelay: `${i * 0.07}s` } as React.CSSProperties}
                >
                  <div className="fc-top">
                    <span className="fc-icon-wrap">{f.icon}</span>
                    <div className="fc-bar" style={{ background: f.color }} />
                  </div>
                  <h4 className="fc-title">{f.title}</h4>
                  <p className="fc-desc">{f.desc}</p>
                  
                  <span className="fc-learn-more">
                    {expandedFeature === i ? "Click to collapse" : "Click to view technical flow →"}
                  </span>

                  {expandedFeature === i && (
                    <div className="fc-expanded-detail">
                      <div className="fed-line" style={{ background: f.color }} />
                      <p className="fed-text">{f.details}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            METRICS — COUNT-UP
        ══════════════════════════════════════════ */}
        <section className="lp-metrics sr" ref={metricsRef} id="metrics">
          <div className="met-gradient" />
          <div className="w">
            <div className="met-header">
              <div className="sec-label">By The Numbers</div>
              <h2 className="sec-h2">Numbers that matter on the factory floor.</h2>
            </div>
            <div className="met-grid">
              {METRICS.map((m, i) => (
                <div key={i} className="met-block">
                  <div className="met-big">
                    {MV[i]}<span className="met-sfx">{m.suffix}</span>
                  </div>
                  <div className="met-lbl">{m.label}</div>
                  <div className="met-sub">{m.sub}</div>
                </div>
              ))}
            </div>
            <div className="met-quote">
              <div className="mq-rule" />
              <p className="mq-text">"Most software is designed for people with laptops. Harness.ai was designed for people with hard hats."</p>
              <div className="mq-rule" />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOW IT WORKS — 3 STEP TIMELINE
        ══════════════════════════════════════════ */}
        <section className="lp-hiw sr" id="how-it-works-steps">
          <div className="w">
            <div className="sec-label">How It Works</div>
            <h2 className="sec-h2">Set up in 5 minutes. An expert in every pocket.</h2>
            <div className="hiw-row">
              {[
                { n: "01", title: "Upload Your SOPs", body: "Drop PDFs, Word docs, or paste Drive links. Auto-chunked, embedded, and indexed in minutes. 40-page binder -> sub-second search.", tech: "pgvector · Supabase · Auto-chunking" },
                { n: "02", title: "Workers Save One Number", body: "Share your WhatsApp number with the floor team. Zero app download. Zero IT ticket. Zero training required.", tech: "Meta Cloud API · Twilio · Line" },
                { n: "03", title: "Agent Handles Everything", body: "Workers text in Hindi. Agent answers, escalates safety events, and logs incidents — autonomously, in under 4 seconds.", tech: "RAG · Sarvam AI · Whisper · Claude Vision" },
              ].map((s, i, arr) => (
                <React.Fragment key={i}>
                  <div className="hiw-card sr">
                    <div className="hiw-n">{s.n}</div>
                    <h4 className="hiw-title">{s.title}</h4>
                    <p className="hiw-body">{s.body}</p>
                    <div className="hiw-tech">{s.tech}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="hiw-connector">
                      <div className="hc-line" />
                      <div className="hc-dot" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="hiw-cta">
              <Link href="/how-it-works" className="btn-g">Full Technical Walkthrough →</Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            USE CASES — TABBED INTERACTIVE SIMULATION
        ══════════════════════════════════════════ */}
        <section className="lp-usecases sr" id="use-cases">
          <div className="w">
            <div className="sec-label">Interactive Demo</div>
            <h2 className="sec-h2">Experience typical worker workflows.</h2>
            
            <div className="usecase-tab-layout">
              <div className="uc-tabs">
                {USE_CASES.map((uc, i) => (
                  <button
                    key={uc.id}
                    className={`uc-tab-item ${activeTab === i ? "active" : ""}`}
                    onClick={() => setActiveTab(i)}
                  >
                    <span className="uc-tab-icon">{uc.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <span className="uc-tab-tag">{uc.tag}</span>
                      <span className="uc-tab-query">"{uc.q}"</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="uc-chat-viewer" style={{ "--uc-border": USE_CASES[activeTab].border } as React.CSSProperties}>
                <div className="uc-chat-header">
                  <div className="uc-ch-status" />
                  <span>WhatsApp · Harness.ai Agent</span>
                </div>

                <div className="uc-chat-messages">
                  {typedQ && (
                    <div className="uc-msg uc-msg-worker">
                      <div className="uc-msg-label">Worker</div>
                      <div className="uc-msg-text">{typedQ}</div>
                    </div>
                  )}

                  {typingState === "thinking" && (
                    <div className="uc-thinking-box">
                      <span className="uc-pulse-dot" />
                      <span>Agent reasoning in progress...</span>
                    </div>
                  )}

                  {showReply && (
                    <div className="uc-msg uc-msg-agent">
                      <div className="uc-msg-label">Agent (sub-2s)</div>
                      <div className="uc-msg-text">{USE_CASES[activeTab].a}</div>
                    </div>
                  )}
                </div>

                <div className="uc-log-pane">
                  <div className="uc-log-title">RAG Trace Logs</div>
                  <div className="uc-log-body">
                    {typingState === "typing" && <code>[Status] Typing query...</code>}
                    {typingState === "thinking" && (
                      <>
                        <code>[Obs] WhatsApp incoming from Line 3</code><br/>
                        <code>[Search] Querying pgvector index...</code><br/>
                        <code>[RAG] Found matching SOP context</code>
                      </>
                    )}
                    {typingState === "replying" && (
                      <>
                        <code>{`[Info] ${USE_CASES[activeTab].log}`}</code><br/>
                        <code>[Dispatch] Response sent via Meta API. Status: Delivered.</code>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            PRICING TEASER
        ══════════════════════════════════════════ */}
        <section className="lp-pricing sr" id="pricing">
          <div className="w">
            <div className="sec-label">Pricing</div>
            <h2 className="sec-h2">One price per factory. Every worker included.</h2>
            <p className="sec-sub">No per-seat fees. No per-message charges. Just one flat rate.</p>
            <div className="pt-grid">
              {[
                { name: "Starter",    price: "₹4,999",  period: "/mo", desc: "Up to 100 workers · 1 site",            pop: false },
                { name: "Growth",     price: "₹9,999",  period: "/mo", desc: "Unlimited workers · Full features",      pop: true  },
                { name: "Enterprise", price: "Custom",   period: "",    desc: "Multi-factory · SLA · REST API",         pop: false },
              ].map((p, i) => (
                <div key={i} className={`pt-card ${p.pop ? "pt-pop" : ""}`}>
                  {p.pop && <div className="pt-badge">Most Popular</div>}
                  <div className="pt-name">{p.name}</div>
                  <div className="pt-price">{p.price}<span className="pt-per">{p.period}</span></div>
                  <div className="pt-desc">{p.desc}</div>
                  <Link href="/pricing" className={p.pop ? "btn-p" : "btn-g"} style={{ display: "block", textAlign: "center", marginTop: "12px" }}>
                    {p.pop ? "Get Started" : "Learn More"}
                  </Link>
                </div>
              ))}
            </div>
            <div className="pt-link-row">
              <Link href="/pricing" className="pt-compare-link">See full feature comparison →</Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FINAL CTA — INTERACTIVE EMAIL CAPTURE
        ══════════════════════════════════════════ */}
        <section className="lp-final-cta">
          <div className="fcta-orb" />
          <div className="fcta-orb fcta-orb-2" />
          <div className="w fcta-inner">
            <div className="fcta-eyebrow">Ready when you are.</div>
            <h2 className="fcta-h2">
              Your workers are already<br />on WhatsApp.<br />
              Your SOPs are already written.<br />
              <em>Put them together.</em>
            </h2>

            <div className="fcta-form-container" style={{ margin: "0 auto 36px", maxWidth: "460px" }}>
              {emailStatus === "success" ? (
                <div className="fcta-success-block">
                  <div className="fsb-icon-wrap">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 style={{ margin: "12px 0 6px", fontSize: "16px", fontWeight: "700" }}>Pilot Request Received</h4>
                  <p style={{ fontSize: "13px", opacity: 0.7, margin: 0 }}>Our team will contact you in under 4 hours to index your SOP.</p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="fcta-form">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailStatus === "error") setEmailStatus("idle");
                    }}
                    placeholder="Enter factory email address..."
                    className={`fcta-input ${emailStatus === "error" ? "fcta-input-error" : ""}`}
                    disabled={emailStatus === "submitting"}
                  />
                  <button type="submit" className="fcta-submit-btn" disabled={emailStatus === "submitting"}>
                    {emailStatus === "submitting" ? "Requesting..." : "Apply for Pilot"}
                  </button>
                </form>
              )}
              {emailStatus === "error" && (
                <div style={{ color: "#f87171", fontSize: "12px", marginTop: "8px", fontWeight: "600" }}>
                  Please enter a valid factory email address.
                </div>
              )}
            </div>

            <div className="fcta-actions" style={{ justifyContent: "center" }}>
              <Link href="/how-it-works" className="fcta-ghost">
                See How It Works
              </Link>
            </div>
            <div className="fcta-note" style={{ marginTop: "24px" }}>
              14-day pilot · No credit card · Setup in under a day
            </div>
            
            <div className="fcta-trust">
              <span>
                <SvgLock width="14" height="14" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                AES-256 encrypted
              </span>
              <span>
                <SvgGlobe width="14" height="14" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                India-hosted on AWS Mumbai
              </span>
              <span>
                <SvgChart width="14" height="14" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                Never trains on your data
              </span>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="w footer-container">
            <div className="f-logo">
              <Logo />
            </div>
            <div className="f-nav-links">
              <Link href="/how-it-works">How It Works</Link>
              <Link href="/case-studies">Case Studies</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
            <div className="f-copy">© 2026 Harness.ai. Confidential.</div>
          </div>
        </footer>
      </main>

      {/* ═══════════════════ PAGE STYLES ═══════════════════ */}
      <style>{`
        .scroll-progress-bar {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          background: var(--orange);
          z-index: 9999;
          transition: width 0.1s ease-out;
        }

        .dot-nav {
          position: fixed;
          right: 24px; top: 50%;
          transform: translateY(-50%);
          z-index: 999;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .dot-nav-item {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: var(--border2);
          border: 2px solid transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.25s ease;
          padding: 0;
        }
        .dot-nav-item:hover, .dot-nav-item.active {
          background: var(--orange);
          transform: scale(1.3);
        }
        .dot-nav-tooltip {
          position: absolute;
          right: 20px; top: 50%;
          transform: translateY(-50%) translateX(10px);
          opacity: 0; pointer-events: none;
          background: var(--text);
          color: var(--bg);
          font-size: 11px; font-weight: 600;
          padding: 4px 8px; border-radius: 4px;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .dot-nav-item:hover .dot-nav-tooltip {
          opacity: 1; transform: translateY(-50%) translateX(0);
        }

        .ticker-bar {
          position: fixed;
          top: 72px; left: 0; right: 0;
          z-index: 89;
          background: #2D2A26;
          height: 34px;
          display: flex;
          align-items: center;
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
        }
        .dark-theme .ticker-bar {
          background: #121110;
        }
        .ticker-live-tag {
          background: var(--orange);
          color: #fff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
          padding: 3px 10px;
          margin: 0 12px;
          border-radius: 3px;
          flex-shrink: 0;
        }
        .ticker-track { flex: 1; overflow: hidden; }
        .ticker-items {
          display: flex; align-items: center;
          white-space: nowrap;
          width: max-content;
          animation: tickScroll 44s linear infinite;
        }
        .ticker-items:hover { animation-play-state: paused; }
        .ticker-item { display: inline-flex; align-items: center; gap: 8px; padding: 0 20px; font-size: 12px; }
        .ti-flag-badge {
          font-size: 9px;
          font-weight: 800;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.12);
          border: 0.5px solid rgba(255,255,255,0.25);
          padding: 1px 6px;
          border-radius: 4px;
        }
        .ti-q { color: rgba(255,255,255,0.45); }
        .ti-arr { color: var(--orange); }
        .ti-r { color: rgba(255,255,255,0.8); font-weight: 500; }
        .ti-t { background: rgba(255,255,255,0.08); color: #4ade80; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px; }
        .ti-sep { color: rgba(255,255,255,0.15); }
        @keyframes tickScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        main { padding-top: 106px; }

        .lp-hero {
          min-height: calc(100vh - 106px);
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 60px 0;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          animation: orbDrift 9s ease-in-out infinite;
        }
        .orb-a { width: 560px; height: 560px; background: rgba(255,87,34,0.07); right: -80px; bottom: -120px; animation-delay: 0s; }
        .orb-b { width: 320px; height: 320px; background: rgba(255,160,0,0.05); right: 180px; top: 60px; animation-delay: 3.5s; }
        .orb-c { width: 200px; height: 200px; background: rgba(255,87,34,0.04); left: 40px; top: 160px; animation-delay: 6s; }
        @keyframes orbDrift {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-28px) scale(1.08); }
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 48px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .hero-copy {
          opacity: 0; transform: translateY(36px);
          transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1);
        }
        .hero-copy.hero-copy-in { opacity: 1; transform: translateY(0); }

        .lp-h1 {
          display: flex; flex-direction: column; gap: 2px;
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.0;
          margin: 14px 0 22px;
        }
        .h1-muted { font-size: clamp(18px, 2.5vw, 28px); color: var(--muted2); font-weight: 600; }
        .h1-bold  { font-size: clamp(52px, 7vw, 88px);  color: var(--text); }
        .h1-accent { font-size: clamp(30px, 4.5vw, 56px); color: var(--text); }
        .lp-h1 em { color: var(--orange); font-style: italic; }

        .lp-hero-sub {
          font-size: 17px; color: var(--muted); line-height: 1.7;
          max-width: 460px; margin-bottom: 28px;
        }

        .hero-ctas { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--text); color: var(--bg);
          padding: 13px 26px; border-radius: 8px;
          font-size: 14px; font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
          border: 1.5px solid var(--text);
        }
        .hero-btn-primary:hover { background: var(--orange); border-color: var(--orange); color: #fff; }
        .hero-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 22px; border-radius: 8px;
          font-size: 14px; font-weight: 600;
          text-decoration: none; color: var(--muted);
          border: 1.5px solid var(--border2);
          transition: all 0.2s;
        }
        .hero-btn-ghost:hover { border-color: var(--text); color: var(--text); }

        .hero-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 32px; }
        .hero-pill {
          font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 100px;
          background: var(--white); border: 0.5px solid var(--border2);
          color: var(--muted);
        }

        .hero-stats-row {
          display: flex; align-items: center; gap: 16px;
          padding-top: 20px; border-top: 0.5px solid var(--border);
        }
        .hs-n { display: block; font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
        .hs-l { font-size: 11px; color: var(--muted); }
        .hs-div { width: 1px; height: 24px; background: var(--border2); }

        .hero-visual {
          position: relative;
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.95s cubic-bezier(0.16,1,0.3,1) 0.18s, transform 0.95s cubic-bezier(0.16,1,0.3,1) 0.18s;
          display: flex; justify-content: center; align-items: center;
        }
        .hero-visual.hero-visual-in { opacity: 1; transform: translateY(0); }

        .radar {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          pointer-events: none; z-index: 0;
        }
        .radar-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid var(--orange);
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          animation: radarPulse 3.6s ease-out infinite;
        }
        .rr-1 { width: 200px; height: 200px; animation-delay: 0s; }
        .rr-2 { width: 360px; height: 360px; animation-delay: 1.2s; }
        .rr-3 { width: 520px; height: 520px; animation-delay: 2.4s; }
        @keyframes radarPulse {
          0%   { opacity: 0.3;  transform: translate(-50%,-50%) scale(0.92); }
          60%  { opacity: 0.07; }
          100% { opacity: 0;    transform: translate(-50%,-50%) scale(1.08); }
        }

        .float-tag {
          position: absolute;
          background: var(--white);
          border: 0.5px solid var(--border2);
          border-radius: 100px;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text);
          display: flex; align-items: center; gap: 6px;
          box-shadow: 0 4px 16px var(--shadow-heavy);
          white-space: nowrap;
          z-index: 10;
        }
        .ft-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .green-dot  { background: #25D366; }
        .orange-dot { background: var(--orange); }
        .blue-dot   { background: #1D4ED8; }
        .ft-tl { top: 12%; left: -8%; }
        .ft-tr { top: 22%; right: -5%; }
        .ft-bl { bottom: 22%; left: -10%; }
        .ft-br { bottom: 12%; right: -4%; }

        @keyframes floatA { 0%,100%{transform:translateY(0);}   50%{transform:translateY(-10px);} }
        @keyframes floatB { 0%,100%{transform:translateY(0);}   50%{transform:translateY(-14px);} }
        @keyframes floatC { 0%,100%{transform:translateY(-6px);}50%{transform:translateY(6px);}  }
        .float-anim-1 { animation: floatA 4.2s ease-in-out infinite; }
        .float-anim-2 { animation: floatB 5s   ease-in-out infinite; }
        .float-anim-3 { animation: floatC 3.8s ease-in-out infinite; }

        .hero-phone-wrap { position: relative; z-index: 5; width: 100%; }

        .lp-ribbon {
          display: flex; align-items: center;
          background: var(--white);
          border-top: 0.5px solid var(--border);
          border-bottom: 0.5px solid var(--border);
          height: 44px; overflow: hidden; gap: 0;
        }
        .ribbon-label {
          font-size: 11px; font-weight: 600; color: var(--muted2);
          padding: 0 20px; white-space: nowrap; flex-shrink: 0;
          border-right: 0.5px solid var(--border2);
        }
        .ribbon-track { flex: 1; overflow: hidden; }
        .ribbon-items {
          display: flex; align-items: center;
          white-space: nowrap; width: max-content;
          animation: ribbonScroll 28s linear infinite;
        }
        .ribbon-item { font-size: 12px; font-weight: 600; color: var(--muted); padding: 0 16px; }
        .ribbon-sep { margin-left: 16px; color: var(--border2); }
        @keyframes ribbonScroll { from{transform:translateX(0);}to{transform:translateX(-50%);} }

        .lp-problem {
          background: #2D2A26; padding: 100px 0;
          position: relative; overflow: hidden;
        }
        .dark-theme .lp-problem {
          background: #121110;
        }
        .prob-noise-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,0.025)1px,transparent 1px),
                            linear-gradient(90deg,rgba(255,255,255,0.025)1px,transparent 1px);
          background-size: 48px 48px;
        }
        .prob-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 72px; align-items: center; position: relative; z-index: 1;
        }
        .prob-h2 { font-size: clamp(32px,4vw,48px); font-weight: 800; color: #fff; line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 20px; }
        .prob-sub { font-size: 16px; color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 36px; }
        .prob-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .prob-stat { background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; }
        .prob-stat-n { font-size: 28px; font-weight: 800; color: var(--orange); letter-spacing: -0.02em; }
        .prob-stat-l { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 4px; line-height: 1.4; }

        .chaos-phone { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.5); max-width: 300px; margin: 0 auto; }
        .chaos-topbar { background: #075E54; padding: 14px 16px; display: flex; align-items: center; gap: 10px; }
        .chaos-av { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.2); color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .chaos-name { color: #fff; font-size: 14px; font-weight: 600; }
        .chaos-sub { color: rgba(255,255,255,0.6); font-size: 11px; }
        .chaos-unread { margin-left: auto; background: #25D366; color: #fff; min-width: 22px; height: 22px; border-radius: 11px; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
        .chaos-feed { padding: 10px; background: #ECE5DD; display: flex; flex-direction: column; gap: 5px; }
        .chaos-msg { background: #fff; padding: 7px 10px; border-radius: 6px; font-size: 11.5px; color: #2D2A26; animation: msgIn 0.35s ease-out both; max-width: 88%; }
        @keyframes msgIn { from{opacity:0;transform:translateX(-10px);}to{opacity:1;transform:translateX(0);} }
        .chaos-footer { background: #FFF3CD; padding: 10px 14px; font-size: 11px; font-weight: 600; color: #856404; text-align: center; border-top: 1px solid #FFE69C; }
        .prob-arrow-down { margin-top: 24px; display: flex; align-items: center; gap: 12px; max-width: 300px; margin-left: auto; margin-right: auto; }
        .pad-line { flex: 1; height: 1px; background: rgba(255,255,255,0.15); }
        .pad-label { font-size: 11px; color: rgba(255,255,255,0.35); white-space: nowrap; }

        .lp-conn { padding: 100px 0; background: var(--bg); }
        .conn-header { max-width: 600px; margin-bottom: 64px; }
        .conn-diagram {
          display: grid;
          grid-template-columns: 1fr 100px 160px 100px 1fr;
          align-items: center; gap: 0;
        }
        .conn-col { display: flex; flex-direction: column; gap: 14px; }
        .conn-col-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted2); margin-bottom: 6px; }
        .conn-node {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px;
          background: var(--white); border: 0.5px solid var(--border); border-radius: 10px;
          font-size: 12px; font-weight: 500; color: var(--text);
          animation: nodeSlideL 0.4s ease-out both;
        }
        .cn-right { animation-name: nodeSlideR; }
        .cn-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .conn-svg { width: 100%; height: 200px; }
        .cp { stroke-dasharray: 200; stroke-dashoffset: 200; animation: drawLine 1.2s ease-out 0.6s forwards; }
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
        @keyframes nodeSlideL { from{opacity:0;transform:translateX(-14px);}to{opacity:1;transform:translateX(0);} }
        @keyframes nodeSlideR { from{opacity:0;transform:translateX(14px);}to{opacity:1;transform:translateX(0);} }

        .conn-brain { display: flex; align-items: center; justify-content: center; position: relative; }
        .brain-ring { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,87,34,0.2); animation: brainPulse 2.4s ease-in-out infinite; }
        .br-1 { width: 180px; height: 180px; animation-delay: 0s; }
        .br-2 { width: 240px; height: 240px; animation-delay: 1.2s; opacity: 0.5; }
        @keyframes brainPulse { 0%,100%{transform:scale(1);opacity:0.4;}50%{transform:scale(1.06);opacity:0.1;} }
        .brain-core { width: 120px; height: 120px; border-radius: 50%; background: #2D2A26; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 0 40px rgba(255,87,34,0.15); z-index: 1; }
        .dark-theme .brain-core { background: #121110; }
        .bc-name { font-size: 11px; font-weight: 700; color: #fff; }
        .bc-sub { font-size: 8px; color: rgba(255,255,255,0.4); text-align: center; line-height: 1.4; padding: 0 8px; }

        .lp-features { background: #2D2A26; padding: 100px 0; position: relative; overflow: hidden; }
        .dark-theme .lp-features { background: #121110; }
        .feat-bg-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,0.02)1px,transparent 1px),
                            linear-gradient(90deg,rgba(255,255,255,0.02)1px,transparent 1px);
          background-size: 40px 40px;
        }
        .feat-h2 { font-size: clamp(28px,3.5vw,42px); font-weight: 700; color: #fff; letter-spacing: -0.02em; line-height: 1.2; margin: 12px 0 48px; position: relative; z-index: 1; }
        .feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; position: relative; z-index: 1; }
        
        .feat-card {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 28px;
          position: relative; overflow: hidden;
          transition: all 0.25s; cursor: pointer;
        }
        .feat-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--fc, var(--orange));
          opacity: 0; transition: opacity 0.2s;
        }
        .feat-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-3px); border-color: rgba(255,255,255,0.14); }
        .feat-card:hover::after { opacity: 1; }
        .feat-card-expanded {
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .fc-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
        .fc-icon-wrap { display: flex; align-items: center; justify-content: center; }
        .fc-bar { width: 32px; height: 3px; border-radius: 100px; opacity: 0.7; }
        .fc-title { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 10px; }
        .fc-desc { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.65; }
        .fc-learn-more {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--orange);
          margin-top: 14px;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .fc-card:hover .fc-learn-more { opacity: 1; }
        .fc-expanded-detail {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.08);
          position: relative;
          animation: slideDown 0.25s ease-out;
        }
        .fed-line {
          position: absolute; left: 0; top: 14px; bottom: 0; width: 2px;
        }
        .fed-text {
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
          margin: 0;
          padding-left: 10px;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .lp-metrics { background: var(--bg); padding: 100px 0; position: relative; overflow: hidden; border-top: 0.5px solid var(--border); }
        .met-gradient {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 50% at 10% 90%, rgba(255,87,34,0.05) 0%, transparent 60%),
                      radial-gradient(ellipse 40% 40% at 90% 10%, rgba(255,140,0,0.04) 0%, transparent 50%);
        }
        .met-header { margin-bottom: 56px; }
        .met-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; position: relative; z-index: 1; }
        .met-block { padding: 0 32px; border-right: 0.5px solid var(--border2); }
        .met-block:first-child { padding-left: 0; }
        .met-block:last-child { border-right: none; }
        .met-big { font-size: clamp(48px,6vw,72px); font-weight: 900; color: var(--text); letter-spacing: -0.05em; line-height: 1; margin-bottom: 10px; font-variant-numeric: tabular-nums; }
        .met-sfx { font-size: 0.5em; color: var(--orange); }
        .met-lbl { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
        .met-sub { font-size: 12px; color: var(--muted); }
        .met-quote { display: flex; align-items: center; gap: 24px; margin-top: 72px; }
        .mq-rule { flex: 1; height: 0.5px; background: var(--border2); }
        .mq-text { font-size: 14px; font-style: italic; color: var(--muted); text-align: center; max-width: 480px; flex-shrink: 0; line-height: 1.6; }

        .lp-hiw { padding: 100px 0; background: var(--white); border-top: 0.5px solid var(--border); }
        .hiw-row { display: grid; grid-template-columns: 1fr 40px 1fr 40px 1fr; align-items: stretch; gap: 0; margin-top: 48px; }
        .hiw-card {
          background: var(--bg); border: 0.5px solid var(--border); border-radius: 14px;
          padding: 32px; transition: all 0.2s;
        }
        .hiw-card:hover { border-color: var(--border2); box-shadow: 0 8px 24px var(--shadow-heavy); }
        .hiw-n { font-size: 52px; font-weight: 900; color: var(--border2); letter-spacing: -0.04em; line-height: 1; margin-bottom: 14px; }
        .hiw-title { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 12px; }
        .hiw-body { font-size: 13px; color: var(--muted); line-height: 1.65; margin-bottom: 14px; }
        .hiw-tech { font-size: 11px; color: var(--orange); font-weight: 600; font-family: var(--font-mono); }
        .hiw-connector { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
        .hc-line { width: 1px; flex: 1; background: var(--border2); }
        .hc-dot { width: 24px; height: 24px; border-radius: 50%; background: var(--orange); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; }
        .hc-dot::after { content: '→'; }
        .hiw-cta { text-align: center; margin-top: 32px; }

        .lp-usecases { padding: 100px 0; background: var(--bg); }
        .usecase-tab-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 32px;
          margin-top: 40px;
          align-items: stretch;
        }
        .uc-tabs {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .uc-tab-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .uc-tab-item:hover {
          border-color: var(--border2);
          transform: translateX(4px);
        }
        .uc-tab-item.active {
          border-color: var(--orange);
          background: var(--orange-m);
          box-shadow: 0 4px 12px rgba(255,87,34,0.06);
        }
        .uc-tab-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--bg);
          color: var(--text);
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .uc-tab-item.active .uc-tab-icon {
          background: var(--orange);
          color: #fff;
        }
        .uc-tab-tag {
          display: block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
          margin-bottom: 2px;
        }
        .uc-tab-query {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }

        .uc-chat-viewer {
          background: var(--white);
          border: 1.5px solid var(--uc-border, var(--border));
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 16px 40px var(--shadow-heavy);
        }
        .uc-chat-header {
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          padding: 14px 20px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text);
        }
        .uc-ch-status {
          width: 8px; height: 8px;
          background: #25d366;
          border-radius: 50%;
        }
        .uc-chat-messages {
          flex: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 180px;
        }
        .uc-msg {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13.5px;
          line-height: 1.5;
          animation: ucFadeIn 0.3s ease-out forwards;
        }
        .uc-msg-label {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          opacity: 0.6;
          margin-bottom: 3px;
        }
        .uc-msg-worker {
          background: var(--bg);
          border: 0.5px solid var(--border);
          align-self: flex-start;
          color: var(--text);
        }
        .uc-msg-agent {
          background: rgba(37,211,102,0.12);
          border: 0.5px solid rgba(37,211,102,0.25);
          color: #14532D;
          align-self: flex-end;
        }
        .dark-theme .uc-msg-agent {
          color: #4ade80;
        }
        .uc-thinking-box {
          align-self: flex-end;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg);
          border: 0.5px solid var(--border);
          border-radius: 20px;
          font-size: 12px;
          color: var(--muted);
        }
        .uc-pulse-dot {
          width: 6px; height: 6px;
          background: var(--orange);
          border-radius: 50%;
          animation: pulse 1s infinite alternate;
        }
        .uc-log-pane {
          background: #2D2A26;
          border-top: 1px solid var(--border);
          padding: 14px 20px;
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .dark-theme .uc-log-pane {
          background: #121110;
        }
        .uc-log-title {
          color: rgba(255,255,255,0.4);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .uc-log-body code {
          color: #4ade80;
        }
        @keyframes ucFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .lp-pricing { padding: 100px 0; background: var(--white); border-top: 0.5px solid var(--border); }
        .pt-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 48px; }
        .pt-card {
          background: var(--bg); border: 0.5px solid var(--border); border-radius: 16px;
          padding: 28px; display: flex; flex-direction: column; gap: 8px;
          position: relative; transition: all 0.2s;
        }
        .pt-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px var(--shadow-heavy); }
        .pt-pop { border-color: var(--orange); box-shadow: 0 8px 32px rgba(255,87,34,0.1); background: var(--white); }
        .pt-badge { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: var(--orange); color: #fff; font-size: 10px; font-weight: 700; padding: 3px 12px; border-radius: 100px; letter-spacing: 0.05em; text-transform: uppercase; }
        .pt-name { font-size: 15px; font-weight: 700; color: var(--text); }
        .pt-price { font-size: 34px; font-weight: 800; color: var(--text); letter-spacing: -0.03em; }
        .pt-per { font-size: 14px; color: var(--muted); font-weight: 400; }
        .pt-desc { font-size: 13px; color: var(--muted); }
        .pt-link-row { text-align: center; margin-top: 24px; }
        .pt-compare-link { color: var(--orange); font-size: 14px; font-weight: 600; text-decoration: none; }
        .pt-compare-link:hover { text-decoration: underline; }

        .lp-final-cta { background: #2D2A26; padding: 120px 0; text-align: center; position: relative; overflow: hidden; }
        .dark-theme .lp-final-cta { background: #121110; }
        .fcta-orb { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle,rgba(255,87,34,0.14) 0%,transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); animation: orbDrift 7s ease-in-out infinite; pointer-events: none; }
        .fcta-orb-2 { width: 300px; height: 300px; background: radial-gradient(circle,rgba(255,140,0,0.08) 0%,transparent 70%); animation-delay: 3.5s; }
        .fcta-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
        .fcta-eyebrow { font-size: 12px; font-weight: 700; color: var(--orange); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
        .fcta-h2 { font-size: clamp(30px,4.5vw,54px); font-weight: 800; color: #fff; line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 40px; }
        .fcta-h2 em { color: var(--orange); font-style: italic; }
        
        .fcta-form {
          display: flex;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 6px;
          border-radius: 10px;
          gap: 6px;
          transition: border-color 0.2s;
        }
        .fcta-form:focus-within {
          border-color: var(--orange);
        }
        .fcta-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          padding: 10px 14px;
          outline: none;
        }
        .fcta-input::placeholder {
          color: rgba(255,255,255,0.35);
        }
        .fcta-input-error {
          color: #f87171;
        }
        .fcta-submit-btn {
          background: var(--orange);
          color: #fff;
          border: none;
          padding: 0 20px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          transition: background 0.2s;
          font-family: inherit;
        }
        .fcta-submit-btn:hover {
          background: #e64a19;
        }
        .fcta-success-block {
          background: rgba(37,211,102,0.1);
          border: 1px solid rgba(37,211,102,0.25);
          border-radius: 12px;
          padding: 24px;
          color: #fff;
          text-align: center;
          animation: ucFadeIn 0.3s ease-out;
        }
        .fsb-icon-wrap {
          width: 44px; height: 44px;
          background: #25d366;
          color: #fff;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .fcta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }
        .fcta-ghost { color: rgba(255,255,255,0.55); padding: 15px 24px; border-radius: 8px; font-size: 15px; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,0.15); transition: all 0.2s; display: inline-flex; align-items: center; }
        .fcta-ghost:hover { color: #fff; border-color: rgba(255,255,255,0.35); }
        .fcta-note { font-size: 12px; color: rgba(255,255,255,0.25); margin-bottom: 32px; }
        
        .fcta-trust { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
        .fcta-trust span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
        }

        .f-nav-links { display: flex; gap: 20px; }
        .f-nav-links a { font-size: 13px; color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .f-nav-links a:hover { color: var(--text); }

        .sr { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .sr-in { opacity: 1; transform: translateY(0); }

        @media (max-width: 1100px) {
          .met-grid { grid-template-columns: repeat(2,1fr); gap: 32px; }
          .met-block { padding: 0 0 32px; border-right: none; border-bottom: 0.5px solid var(--border2); }
          .met-block:nth-child(odd) { padding-right: 24px; }
          .conn-diagram { grid-template-columns: 1fr 70px 130px 70px 1fr; }
        }
        @media (max-width: 900px) {
          .dot-nav { display: none; }
          .hero-grid { grid-template-columns: 1fr; }
          .hero-visual { order: -1; margin-bottom: 16px; }
          .ft-tl,.ft-tr,.ft-bl,.ft-br { display: none; }
          .prob-grid { grid-template-columns: 1fr; }
          .feat-grid { grid-template-columns: repeat(2,1fr); }
          .hiw-row { grid-template-columns: 1fr; gap: 16px; }
          .hiw-connector { display: none; }
          .pt-grid { grid-template-columns: 1fr; max-width: 400px; margin-left: auto; margin-right: auto; }
          .conn-diagram { display: flex; flex-direction: column; gap: 20px; }
          .conn-svg { display: none; }
          .usecase-tab-layout { grid-template-columns: 1fr; }
          .uc-tabs { flex-direction: row; overflow-x: auto; padding-bottom: 8px; }
          .uc-tab-item { flex-shrink: 0; }
        }
        @media (max-width: 600px) {
          main { padding-top: 80px; }
          .ticker-bar { display: none; }
          .feat-grid { grid-template-columns: 1fr; }
          .prob-stats { grid-template-columns: 1fr 1fr; }
          .met-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
          .met-block { padding: 0; border: none; }
          .fcta-h2 { font-size: 28px; }
          .lp-h1 .h1-bold { font-size: 52px; }
          .hero-stats-row { flex-wrap: wrap; }
          .fcta-trust { flex-direction: column; gap: 8px; }
          .uc-tabs { flex-direction: column; }
        }
      `}</style>
    </>
  );
}
