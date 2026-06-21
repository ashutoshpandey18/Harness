"use client";

import React, { useState } from "react";
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

const studies = [
  {
    id: "velvet-garments",
    company: "Velvet Garments",
    location: "Surat, Gujarat",
    industry: "Apparel Manufacturing",
    workers: 240,
    logo: "VG",
    logoColor: "#FF5722",
    headline: "240 workers. 89% fewer supervisor interruptions. First month.",
    challenge: "Supervisors at Velvet Garments were fielding 60–80 WhatsApp messages per shift from workers asking about loom settings, thread tension specifications, and safety PPE protocols. Supervisors spent 2–3 hours daily on repeat queries instead of on the floor.",
    solution: "Loaded 14 SOPs and machine operation manuals into Harness.ai. Workers saved the company WhatsApp number. Questions that previously required supervisor attention now get answered in Hindi in under 4 seconds.",
    metrics: [
      { num: "89%", label: "Fewer supervisor interruptions" },
      { num: "4.2s", label: "Avg agent response time" },
      { num: "240", label: "Workers onboarded (zero training)" },
      { num: "14", label: "SOPs indexed and searchable" },
    ],
    quote: "\"Previously, I used to get 70 messages a day from workers. Now I get 8. And those 8 are genuinely complex issues that need me.\"",
    quotePerson: "Ramesh Patel, Floor Supervisor",
    tag: "Apparel",
    impact: "Time saved per supervisor per shift: 2.4 hours",
    color: "#FF5722",
  },
  {
    id: "autoparts-hub",
    company: "AutoParts Hub",
    location: "Pune, Maharashtra",
    industry: "Auto Ancillary",
    workers: 180,
    logo: "AP",
    logoColor: "#1D4ED8",
    headline: "Zero machine-error downtime incidents. 3 months running.",
    challenge: "Line workers on the CNC and lathe floors at AutoParts Hub were losing 30–45 minutes per machine error waiting for supervisors to provide reset procedures. The factory's SOP binder was 84 pages — workers never read it.",
    solution: "Digitized the entire maintenance manual into Harness.ai. Workers now photo-message machine error codes and receive step-by-step Hindi reset instructions with safety prerequisites checked automatically.",
    metrics: [
      { num: "0", label: "Machine downtime incidents (3 mo.)" },
      { num: "38 min", label: "Avg wait time reduced to 4 sec" },
      { num: "180", label: "Workers on WhatsApp + Voice" },
      { num: "₹4.2L", label: "Estimated downtime cost saved" },
    ],
    quote: "\"Workers were scared to reset machines alone. Now they follow the SOP step by step because Harness.ai talks to them in their language.\"",
    quotePerson: "Anjali Desai, Plant Manager",
    tag: "Auto Ancillary",
    impact: "Downtime cost reduced by an estimated ₹4.2 lakh/month",
    color: "#1D4ED8",
  },
  {
    id: "buildright-infra",
    company: "BuildRight Infra",
    location: "Chennai, Tamil Nadu",
    industry: "Construction",
    workers: 420,
    logo: "BR",
    logoColor: "#15803D",
    headline: "3 languages. 420 workers. One number.",
    challenge: "BuildRight's workforce spans Tamil, Telugu, and Hindi speakers across 6 construction sites. Safety compliance was near-impossible to enforce — different supervisors, different language barriers, no consistent SOP delivery.",
    solution: "Harness.ai handles automatic language detection and responds in the worker's own language. Voice notes in Tamil are transcribed and responded to in Tamil. Safety violations are flagged and incident logs auto-generated.",
    metrics: [
      { num: "3", label: "Languages handled (Tamil, Telugu, Hindi)" },
      { num: "100%", label: "Safety query response coverage" },
      { num: "420", label: "Workers across 6 sites" },
      { num: "47", label: "Safety incidents auto-logged" },
    ],
    quote: "\"We have supervisors on only 3 of the 6 sites. Harness.ai is effectively the supervisor on the other 3. It works in Tamil, which is everything for us.\"",
    quotePerson: "Senthil Kumar, HSE Manager",
    tag: "Construction",
    impact: "Safety protocol compliance up from 61% to 94%",
    color: "#15803D",
  },
];

const globalMetrics = [
  { num: "840+", label: "Workers actively using Harness.ai" },
  { num: "12,400+", label: "Queries handled per month" },
  { num: "4.1s", label: "Average response latency" },
  { num: "94%", label: "First-response resolution rate" },
];

export default function CaseStudiesPage() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  React.useEffect(() => {
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

  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const activeStudy = studies.find((s) => s.id === active);

  return (
    <>
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
            <li><Link href="/case-studies" style={{ color: "var(--orange)", fontWeight: 600 }}>Case Studies</Link></li>
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
        <section className="cs-hero">
          <div className="w">
            <div className="cs-hero-eyebrow">
              <span className="pulse-dot" />
              Results from the Factory Floor
            </div>
            <h1 className="cs-hero-h1">
              Real factories.<br /><em>Real numbers.</em>
            </h1>
            <p className="cs-hero-sub">
              These aren't projections. Harness.ai is running live in Indian manufacturing plants. Here's what happened in the first 90 days.
            </p>
          </div>
        </section>

        {/* GLOBAL METRICS STRIP */}
        <section className="cs-metrics-strip">
          <div className="w cs-metrics-grid">
            {globalMetrics.map((m) => (
              <div key={m.label} className="cs-global-metric">
                <div className="cs-global-num">{m.num}</div>
                <div className="cs-global-label">{m.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CASE STUDY CARDS */}
        <section className="cs-cards-section">
          <div className="w">
            {studies.map((s, i) => (
              <div
                key={s.id}
                className={`cs-card ${active === s.id ? "cs-card-open" : ""}`}
                style={{ "--cs-color": s.color } as React.CSSProperties}
              >
                {/* Card Header (always visible) */}
                <div className="cs-card-header" onClick={() => setActive(active === s.id ? null : s.id)}>
                  <div className="cs-card-left">
                    <div className="cs-logo" style={{ background: s.logoColor }}>{s.logo}</div>
                    <div>
                      <div className="cs-company">{s.company}</div>
                      <div className="cs-location">{s.location} · {s.industry} · {s.workers} workers</div>
                    </div>
                  </div>
                  <div className="cs-card-mid">
                    <p className="cs-headline">{s.headline}</p>
                  </div>
                  <div className="cs-card-right">
                    <span className="cs-tag">{s.tag}</span>
                    <button className={`cs-expand-btn ${active === s.id ? "open" : ""}`}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded Detail */}
                {active === s.id && (
                  <div className="cs-card-body">
                    <div className="cs-card-body-grid">
                      {/* Story */}
                      <div className="cs-story">
                        <div className="cs-story-block">
                          <div className="cs-story-label">The Challenge</div>
                          <p className="cs-story-text">{s.challenge}</p>
                        </div>
                        <div className="cs-story-block">
                          <div className="cs-story-label">The Solution</div>
                          <p className="cs-story-text">{s.solution}</p>
                        </div>
                        <div className="cs-quote-block" style={{ borderLeftColor: s.color }}>
                          <p className="cs-quote-text">{s.quote}</p>
                          <p className="cs-quote-person">— {s.quotePerson}</p>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="cs-metrics-panel">
                        <div className="cs-metrics-title">Impact Metrics</div>
                        <div className="cs-metrics-list">
                          {s.metrics.map((m) => (
                            <div key={m.label} className="cs-metric-item">
                              <div className="cs-metric-num" style={{ color: s.color }}>{m.num}</div>
                              <div className="cs-metric-label">{m.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className="cs-impact-bar" style={{ background: `${s.color}18`, borderColor: `${s.color}40`, color: s.color }}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          {s.impact}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* QUOTE FEATURE */}
        <section className="cs-feature-section">
          <div className="w cs-feature-inner">
            <div className="cs-feature-quote">
              <div className="cs-fq-mark">"</div>
              <p className="cs-fq-text">
                Harness.ai is the only B2B SaaS I've seen that actually gets used by the people who need it most — workers on the floor, not managers in offices.
              </p>
              <div className="cs-fq-person">
                <div className="cs-fq-avatar">YC</div>
                <div>
                  <div className="cs-fq-name">YC Batch Advisor</div>
                  <div className="cs-fq-role">Pilot feedback, June 2026</div>
                </div>
              </div>
            </div>
            <div className="cs-feature-right">
              <div className="cs-feature-stat">
                <div className="cs-feature-num">94%</div>
                <div className="cs-feature-label">First-response resolution rate across all pilots</div>
              </div>
              <div className="cs-feature-stat">
                <div className="cs-feature-num">₹0</div>
                <div className="cs-feature-label">Cost per message for workers — it runs on WhatsApp they already use</div>
              </div>
              <div className="cs-feature-stat">
                <div className="cs-feature-num">5 min</div>
                <div className="cs-feature-label">Average time to go live from SOP upload to first response</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cs-cta-section">
          <div className="w cs-cta-inner">
            <h2 className="cs-cta-h2">Your factory could be next.</h2>
            <p className="cs-cta-sub">
              Start a pilot in a single production line. No IT integration needed. Setup in under a day.
            </p>
            <div className="cs-cta-actions">
              <Link href="/pricing" className="btn-p" style={{ fontSize: "16px", padding: "14px 32px" }}>
                View Pricing
              </Link>
              <Link href="/how-it-works" className="btn-g">
                How It Works →
              </Link>
            </div>
          </div>
        </section>

        <footer>
          <div className="w footer-container">
            <div className="f-logo"><Logo /></div>
            <div className="f-copy">© 2026 Harness.ai. All rights reserved. Confidential.</div>
          </div>
        </footer>
      </main>

      <style>{`
        /* HERO */
        .cs-hero {
          padding: 90px 0 72px;
          border-bottom: 0.5px solid var(--border);
        }
        .cs-hero-eyebrow {
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
        .cs-hero-h1 {
          font-size: clamp(44px, 7vw, 80px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }
        .cs-hero-h1 em { font-style: italic; color: var(--orange); }
        .cs-hero-sub {
          font-size: 18px;
          color: var(--muted);
          max-width: 540px;
          line-height: 1.65;
        }

        /* METRICS STRIP */
        .cs-metrics-strip {
          background: #2D2A26;
          padding: 40px 0;
        }
        .dark-theme .cs-metrics-strip {
          background: #121110;
        }
        .cs-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .cs-global-metric {
          padding: 0 24px;
          border-right: 0.5px solid rgba(255,255,255,0.1);
          text-align: center;
        }
        .cs-global-metric:last-child { border-right: none; }
        .cs-global-num {
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
        }
        .cs-global-label {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          margin-top: 4px;
        }

        /* CARDS */
        .cs-cards-section {
          padding: 72px 0 80px;
          background: var(--bg);
        }
        .cs-card {
          background: var(--white);
          border: 0.5px solid var(--border);
          border-radius: 16px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .cs-card:hover { box-shadow: 0 12px 40px var(--shadow-heavy); }
        .cs-card-open {
          border-color: var(--cs-color, var(--orange));
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }
        .cs-card-header {
          display: grid;
          grid-template-columns: 260px 1fr auto;
          gap: 24px;
          align-items: center;
          padding: 28px 32px;
          cursor: pointer;
        }
        .cs-card-left { display: flex; align-items: center; gap: 16px; }
        .cs-logo {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          color: #fff;
          flex-shrink: 0;
        }
        .cs-company { font-size: 15px; font-weight: 700; color: var(--text); }
        .cs-location { font-size: 12px; color: var(--muted); margin-top: 2px; }
        .cs-headline { font-size: 15px; font-weight: 600; color: var(--text); line-height: 1.45; }
        .cs-card-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .cs-tag {
          font-size: 11px;
          font-weight: 600;
          background: var(--bg);
          border: 0.5px solid var(--border2);
          border-radius: 100px;
          padding: 4px 10px;
          color: var(--muted);
          white-space: nowrap;
        }
        .cs-expand-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 0.5px solid var(--border2);
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--muted);
          transition: all 0.2s;
        }
        .cs-expand-btn.open {
          transform: rotate(180deg);
          background: var(--orange);
          color: #fff;
          border-color: var(--orange);
        }

        /* EXPANDED BODY */
        .cs-card-body {
          padding: 0 32px 32px;
          animation: expandIn 0.25s ease-out;
        }
        .cs-card-body-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 40px;
          padding-top: 24px;
          border-top: 0.5px solid var(--border);
        }
        .cs-story { display: flex; flex-direction: column; gap: 20px; }
        .cs-story-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted2);
          margin-bottom: 6px;
        }
        .cs-story-text { font-size: 14px; color: var(--muted); line-height: 1.7; }
        .cs-quote-block {
          border-left: 3px solid;
          padding-left: 20px;
          margin-top: 4px;
        }
        .cs-quote-text {
          font-size: 15px;
          font-style: italic;
          color: var(--text);
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .cs-quote-person { font-size: 12px; color: var(--muted); font-weight: 600; }

        /* METRICS PANEL */
        .cs-metrics-panel {
          background: var(--bg);
          border-radius: 12px;
          padding: 24px;
          border: 0.5px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-self: start;
        }
        .cs-metrics-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted2);
        }
        .cs-metrics-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .cs-metric-num { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
        .cs-metric-label { font-size: 12px; color: var(--muted); margin-top: 2px; line-height: 1.4; }
        .cs-impact-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 8px;
          border: 0.5px solid;
          font-size: 12px;
          font-weight: 600;
        }

        /* FEATURE SECTION */
        .cs-feature-section {
          background: var(--white);
          border-top: 0.5px solid var(--border);
          border-bottom: 0.5px solid var(--border);
          padding: 80px 0;
        }
        .cs-feature-inner {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 64px;
          align-items: center;
        }
        .cs-fq-mark { font-size: 80px; font-weight: 900; color: var(--border2); line-height: 0.8; margin-bottom: 16px; }
        .cs-fq-text {
          font-size: 20px;
          font-weight: 500;
          line-height: 1.55;
          color: var(--text);
          margin-bottom: 24px;
        }
        .cs-fq-person { display: flex; align-items: center; gap: 12px; }
        .cs-fq-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--orange);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cs-fq-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .cs-fq-role { font-size: 12px; color: var(--muted); }
        .cs-feature-right { display: flex; flex-direction: column; gap: 28px; }
        .cs-feature-stat { padding: 20px; background: var(--bg); border: 0.5px solid var(--border); border-radius: 12px; }
        .cs-feature-num { font-size: 32px; font-weight: 800; color: var(--orange); letter-spacing: -0.02em; margin-bottom: 6px; }
        .cs-feature-label { font-size: 13px; color: var(--muted); line-height: 1.5; }

        /* CTA */
        .cs-cta-section { padding: 80px 0; background: var(--bg); text-align: center; }
        .cs-cta-inner { max-width: 560px; margin: 0 auto; }
        .cs-cta-h2 { font-size: 36px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 14px; }
        .cs-cta-sub { font-size: 16px; color: var(--muted); margin-bottom: 36px; line-height: 1.6; }
        .cs-cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        @keyframes expandIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 960px) {
          .cs-card-header { grid-template-columns: 1fr auto; }
          .cs-card-mid { grid-column: 1; }
          .cs-metrics-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .cs-card-body-grid { grid-template-columns: 1fr; }
          .cs-feature-inner { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .cs-card-header { grid-template-columns: 1fr; gap: 16px; }
          .cs-metrics-grid { grid-template-columns: 1fr 1fr; }
          .cs-hero-h1 { font-size: 40px; }
        }
      `}</style>
    </>
  );
}
