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
      MAGS<span style={{ color: "var(--orange)", fontWeight: 500 }}>.ai</span>
    </span>
  </span>
);

/* ─── Inline SVG Icons for Trust Strip ─── */
const SvgLock = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: "var(--orange)" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const SvgGlobe = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: "var(--orange)" }}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10zM2 12h20" />
  </svg>
);

const SvgChart = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: "var(--orange)" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 18.375v-5.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125v-9.75zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z" />
  </svg>
);

const SvgLightning = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: "var(--orange)" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const faqs = [
  {
    q: "How long does setup take?",
    a: "Under a day. Upload your SOPs, we process and embed them (usually takes 30–60 minutes depending on volume). Workers save one WhatsApp number — no app download, no IT tickets."
  },
  {
    q: "What if a worker asks something we haven't documented?",
    a: "MAGS.ai's agent detects low-confidence answers and automatically routes the query to your designated supervisor. The query is also flagged in the admin dashboard so you can add it to your knowledge base."
  },
  {
    q: "Is there a limit on the number of SOPs or document pages?",
    a: "Starter handles up to 500 pages. Growth is unlimited. Enterprise includes multi-factory knowledge bases with tenant isolation."
  },
  {
    q: "What languages does MAGS.ai support?",
    a: "Currently: Hindi, English, Tamil, Telugu, Marathi, Bengali, Spanish, and Vietnamese. We're adding Gujarati, Kannada, and Malayalam in Q3 2026."
  },
  {
    q: "Can supervisors see all conversations?",
    a: "Yes. The admin dashboard gives supervisors full conversation history, agent reasoning traces, incident logs, and a 'Broadcast' feature to push announcements to all registered workers."
  },
  {
    q: "Is our SOP data secure?",
    a: "Documents are encrypted at rest (AES-256) and in transit (TLS 1.3). Vector embeddings are stored in an isolated Supabase project per company. We never train models on your data."
  },
  {
    q: "Do you offer a free trial?",
    a: "We offer a 14-day pilot on the Growth plan for qualifying factory operations. Contact us to apply. Most pilots go live within 48 hours."
  },
];

const features = {
  starter: {
    "Workers": "Up to 100",
    "Documents / SOP pages": "Up to 500 pages",
    "WhatsApp channels": "1 dedicated number",
    "Languages": "Hindi + English",
    "Voice notes": "✓",
    "Photo understanding": "—",
    "Admin dashboard": "Basic",
    "Supervisor escalation": "✓",
    "Incident logging": "✓",
    "Reasoning trace log": "—",
    "Broadcast messages": "—",
    "Multi-site support": "—",
    "API access": "—",
    "Dedicated support": "—",
    "SLA": "—",
  },
  growth: {
    "Workers": "Unlimited",
    "Documents / SOP pages": "Unlimited",
    "WhatsApp channels": "2 dedicated numbers",
    "Languages": "All 8 languages",
    "Voice notes": "✓",
    "Photo understanding": "✓ (Claude Vision)",
    "Admin dashboard": "Full analytics",
    "Supervisor escalation": "✓",
    "Incident logging": "✓",
    "Reasoning trace log": "✓",
    "Broadcast messages": "✓",
    "Multi-site support": "Up to 3 sites",
    "API access": "Webhook access",
    "Dedicated support": "Email + Slack",
    "SLA": "99.5% uptime",
  },
  enterprise: {
    "Workers": "Unlimited (multi-tenant)",
    "Documents / SOP pages": "Unlimited + versioning",
    "WhatsApp channels": "Unlimited",
    "Languages": "All + custom fine-tune",
    "Voice notes": "✓",
    "Photo understanding": "✓",
    "Admin dashboard": "Custom analytics",
    "Supervisor escalation": "Multi-tier routing",
    "Incident logging": "ERP/HRMS sync",
    "Reasoning trace log": "✓",
    "Broadcast messages": "✓ + scheduling",
    "Multi-site support": "Unlimited",
    "API access": "Full REST API",
    "Dedicated support": "24/7 dedicated CSM",
    "SLA": "99.9% SLA-backed",
  },
};

const featureKeys = Object.keys(features.starter);

type Billing = "monthly" | "annual";
type Currency = "INR" | "USD";

const prices: Record<Currency, Record<Billing, { starter: string; growth: string; savings?: string }>> = {
  INR: {
    monthly: { starter: "₹4,999", growth: "₹9,999" },
    annual: { starter: "₹3,999", growth: "₹7,999", savings: "Save ₹24,000/yr" },
  },
  USD: {
    monthly: { starter: "$79", growth: "$199" },
    annual: { starter: "$63", growth: "$159", savings: "Save $480/yr" },
  },
};

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [currency, setCurrency] = useState<Currency>("INR");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

  const p = prices[currency][billing];

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
            <li><Link href="/case-studies">Case Studies</Link></li>
            <li><Link href="/pricing" style={{ color: "var(--orange)", fontWeight: 600 }}>Pricing</Link></li>
            <li><Link href="/#product">Product</Link></li>
            <li className="mobile-only" style={{ marginTop: "12px", borderTop: "0.5px solid var(--border)", paddingTop: "16px" }}>
              <Link href="/dashboard" className="btn-p" style={{ width: "100%", justifyContent: "center" }}>
                Admin Dashboard
              </Link>
            </li>
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
        <section className="pr-hero">
          <div className="w">
            <div className="pr-hero-eyebrow">
              <span className="pulse-dot" />
              Simple, Transparent Pricing
            </div>
            <h1 className="pr-hero-h1">
              One price per factory.<br />
              <em>Unlimited workers.</em>
            </h1>
            <p className="pr-hero-sub">
              Most software charges per seat. We charge per plant — because if your factory has 500 workers, all 500 should be able to use it. No hidden fees. No per-message charges.
            </p>

            {/* Toggle Controls */}
            <div className="pr-toggles">
              {/* Billing */}
              <div className="pr-toggle-group">
                <button
                  className={`pr-toggle-btn ${billing === "monthly" ? "active" : ""}`}
                  onClick={() => setBilling("monthly")}
                >Monthly</button>
                <button
                  className={`pr-toggle-btn ${billing === "annual" ? "active" : ""}`}
                  onClick={() => setBilling("annual")}
                >
                  Annual
                  {billing === "annual" && p.savings && (
                    <span className="pr-savings-badge">{p.savings}</span>
                  )}
                </button>
                {billing === "annual" && (
                  <span className="pr-annual-note">Save 20%</span>
                )}
              </div>

              <div className="pr-toggle-sep" />

              {/* Currency */}
              <div className="pr-toggle-group">
                <button
                  className={`pr-toggle-btn ${currency === "INR" ? "active" : ""}`}
                  onClick={() => setCurrency("INR")}
                >₹ INR</button>
                <button
                  className={`pr-toggle-btn ${currency === "USD" ? "active" : ""}`}
                  onClick={() => setCurrency("USD")}
                >$ USD</button>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="pr-cards-section">
          <div className="w pr-cards-grid">

            {/* Starter */}
            <div className="pr-card">
              <div className="pr-card-top">
                <div className="pr-plan-name">Starter</div>
                <div className="pr-plan-desc">For a single production line or pilot phase</div>
                <div className="pr-price">
                  <span className="pr-price-num">{p.starter}</span>
                  <span className="pr-price-period">/month</span>
                </div>
                {billing === "annual" && <div className="pr-billed-note">Billed annually</div>}
              </div>
              <Link href="#" className="pr-cta-btn pr-cta-outline">Start Pilot</Link>
              <ul className="pr-features-list">
                <li>Up to <strong>100 workers</strong></li>
                <li>1 WhatsApp number</li>
                <li>Hindi + English</li>
                <li>Voice note transcription</li>
                <li>Basic admin dashboard</li>
                <li>Supervisor escalation</li>
                <li>Incident auto-logging</li>
              </ul>
            </div>

            {/* Growth */}
            <div className="pr-card pr-card-popular">
              <div className="pr-popular-badge">Most Popular</div>
              <div className="pr-card-top">
                <div className="pr-plan-name">Growth</div>
                <div className="pr-plan-desc">For full-factory deployment across all workers and sites</div>
                <div className="pr-price">
                  <span className="pr-price-num pr-price-accent">{p.growth}</span>
                  <span className="pr-price-period">/month</span>
                </div>
                {billing === "annual" && <div className="pr-billed-note">Billed annually</div>}
              </div>
              <Link href="#" className="pr-cta-btn pr-cta-filled">Get Started</Link>
              <ul className="pr-features-list">
                <li><strong>Unlimited workers</strong></li>
                <li>2 dedicated WhatsApp numbers</li>
                <li>All 8 languages (+ regional)</li>
                <li>Voice + Photo understanding</li>
                <li>Full analytics dashboard</li>
                <li>Agent reasoning traces</li>
                <li>Broadcast to all workers</li>
                <li>Up to 3 factory sites</li>
                <li>Email + Slack support</li>
                <li>99.5% uptime SLA</li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="pr-card">
              <div className="pr-card-top">
                <div className="pr-plan-name">Enterprise</div>
                <div className="pr-plan-desc">For multi-factory operations and large industrial groups</div>
                <div className="pr-price">
                  <span className="pr-price-num">Custom</span>
                </div>
                <div className="pr-billed-note">Contact us for a quote</div>
              </div>
              <Link href="mailto:founders@mags.ai" className="pr-cta-btn pr-cta-outline">Talk to Us</Link>
              <ul className="pr-features-list">
                <li>Multi-factory tenant routing</li>
                <li>Unlimited channels + languages</li>
                <li>Custom fine-tuned models</li>
                <li>ERP / HRMS integration</li>
                <li>On-premise database option</li>
                <li>Full REST API access</li>
                <li>24/7 dedicated CSM</li>
                <li>99.9% SLA-backed uptime</li>
              </ul>
            </div>

          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="pr-table-section">
          <div className="w">
            <div className="pr-table-header">
              <div className="sec-label">Full Comparison</div>
              <h2 className="sec-h2" style={{ maxWidth: "480px" }}>What's included in each plan</h2>
            </div>
            <div className="pr-table-wrap">
              <table className="pr-table">
                <thead>
                  <tr>
                    <th className="pr-th-feature">Feature</th>
                    <th>Starter</th>
                    <th className="pr-th-popular" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <span>Growth</span>
                      <span className="ti-flag-badge" style={{ background: "var(--orange)", color: "#fff", borderColor: "var(--orange)" }}>Best Value</span>
                    </th>
                    <th>Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {featureKeys.map((key) => (
                    <tr key={key}>
                      <td className="pr-td-feature">{key}</td>
                      <td className="pr-td-val">{renderVal(features.starter[key as keyof typeof features.starter])}</td>
                      <td className="pr-td-val pr-td-popular">{renderVal(features.growth[key as keyof typeof features.growth])}</td>
                      <td className="pr-td-val">{renderVal(features.enterprise[key as keyof typeof features.enterprise])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* TRUST STRIP (clean SVGs instead of emojis) */}
        <section className="pr-trust-section">
          <div className="w pr-trust-inner">
            <div className="pr-trust-item">
              <div className="pr-trust-icon" style={{ marginTop: "3px" }}><SvgLock /></div>
              <div>
                <div className="pr-trust-title">AES-256 Encryption</div>
                <div className="pr-trust-sub">All documents encrypted at rest and in transit</div>
              </div>
            </div>
            <div className="pr-trust-item">
              <div className="pr-trust-icon" style={{ marginTop: "3px" }}><SvgGlobe /></div>
              <div>
                <div className="pr-trust-title">India-hosted option</div>
                <div className="pr-trust-sub">AWS Mumbai region by default. On-prem available.</div>
              </div>
            </div>
            <div className="pr-trust-item">
              <div className="pr-trust-icon" style={{ marginTop: "3px" }}><SvgChart /></div>
              <div>
                <div className="pr-trust-title">No model training on your data</div>
                <div className="pr-trust-sub">Your SOPs stay yours. Never used for fine-tuning.</div>
              </div>
            </div>
            <div className="pr-trust-item">
              <div className="pr-trust-icon" style={{ marginTop: "3px" }}><SvgLightning /></div>
              <div>
                <div className="pr-trust-title">14-day pilot available</div>
                <div className="pr-trust-sub">Full Growth plan access. No credit card required.</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pr-faq-section">
          <div className="w pr-faq-inner">
            <div>
              <div className="sec-label">FAQ</div>
              <h2 className="sec-h2">Questions we get a lot</h2>
            </div>
            <div className="pr-faq-list">
              {faqs.map((f, i) => (
                <div key={i} className={`pr-faq-item ${openFaq === i ? "open" : ""}`}>
                  <button
                    className="pr-faq-q"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {f.q}
                    <svg className="pr-faq-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="pr-faq-a">{f.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="pr-final-cta">
          <div className="w pr-final-inner">
            <h2 className="pr-final-h2">
              Most pilots go live in under 24 hours.
            </h2>
            <p className="pr-final-sub">
              Upload your SOP. Share the number. Your workers are already on WhatsApp.
            </p>
            <div className="pr-final-actions">
              <Link href="mailto:founders@mags.ai" className="btn-p" style={{ fontSize: "16px", padding: "16px 40px" }}>
                Apply for a Pilot →
              </Link>
              <Link href="/how-it-works" className="btn-g">
                See How It Works
              </Link>
            </div>
            <div className="pr-final-note">
              No credit card. No IT setup. Works on any Android or iOS.
            </div>
          </div>
        </section>

        <footer>
          <div className="w footer-container">
            <div className="f-logo"><Logo /></div>
            <div className="f-copy">© 2026 MAGS.ai. All rights reserved. Confidential.</div>
          </div>
        </footer>
      </main>

      <style>{`
        /* HERO */
        .pr-hero {
          padding: 90px 0 72px;
          border-bottom: 0.5px solid var(--border);
        }
        .pr-hero-eyebrow {
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
        .pr-hero-h1 {
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }
        .pr-hero-h1 em { font-style: italic; color: var(--orange); }
        .pr-hero-sub {
          font-size: 18px;
          color: var(--muted);
          max-width: 600px;
          line-height: 1.65;
          margin-bottom: 48px;
        }

        /* TOGGLES */
        .pr-toggles {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .pr-toggle-group {
          display: flex;
          background: var(--white);
          border: 0.5px solid var(--border2);
          border-radius: 8px;
          padding: 3px;
          gap: 2px;
        }
        .pr-toggle-btn {
          padding: 8px 18px;
          border: none;
          background: transparent;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          color: var(--muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.18s;
          position: relative;
        }
        .pr-toggle-btn.active {
          background: var(--orange);
          color: #fff;
          font-weight: 600;
        }
        .pr-savings-badge {
          font-size: 10px;
          background: rgba(255,255,255,0.25);
          padding: 1px 6px;
          border-radius: 100px;
          font-weight: 700;
        }
        .pr-toggle-sep { width: 1px; height: 28px; background: var(--border2); }
        .pr-annual-note { font-size: 12px; color: var(--green); font-weight: 600; }

        /* CARDS */
        .pr-cards-section {
          padding: 72px 0 60px;
          background: var(--bg);
        }
        .pr-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr 1fr;
          gap: 20px;
          align-items: start;
        }
        .pr-card {
          background: var(--white);
          border: 0.5px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: relative;
        }
        .pr-card-popular {
          border-color: var(--orange);
          box-shadow: 0 20px 60px rgba(255, 87, 34, 0.12);
          padding-top: 44px;
        }
        .pr-popular-badge {
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--orange);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 5px 14px;
          border-radius: 0 0 10px 10px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .pr-card-top { display: flex; flex-direction: column; gap: 8px; }
        .pr-plan-name { font-size: 18px; font-weight: 700; color: var(--text); }
        .pr-plan-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
        .pr-price { display: flex; align-items: baseline; gap: 4px; margin-top: 8px; }
        .pr-price-num { font-size: 40px; font-weight: 800; color: var(--text); letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
        .pr-price-accent { color: var(--orange); }
        .pr-price-period { font-size: 14px; color: var(--muted); }
        .pr-billed-note { font-size: 12px; color: var(--muted2); }
        .pr-cta-btn {
          display: block;
          text-align: center;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          font-family: inherit;
        }
        .pr-cta-outline {
          border: 1.5px solid var(--border2);
          color: var(--text);
          background: transparent;
        }
        .pr-cta-outline:hover { border-color: var(--text); }
        .pr-cta-filled {
          background: var(--orange);
          color: #fff;
          border: 1.5px solid var(--orange);
        }
        .pr-cta-filled:hover { background: #e64a19; }
        .pr-features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pr-features-list li {
          font-size: 13px;
          color: var(--muted);
          padding-left: 18px;
          position: relative;
          line-height: 1.5;
        }
        .pr-features-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--green);
          font-weight: 700;
          font-size: 12px;
        }

        /* COMPARISON TABLE */
        .pr-table-section {
          padding: 80px 0;
          background: var(--white);
          border-top: 0.5px solid var(--border);
          border-bottom: 0.5px solid var(--border);
        }
        .pr-table-header { margin-bottom: 40px; }
        .pr-table-wrap { overflow-x: auto; }
        .pr-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .pr-table thead tr {
          border-bottom: 1px solid var(--border);
        }
        .pr-table th {
          padding: 14px 20px;
          text-align: center;
          font-weight: 700;
          color: var(--text);
          font-size: 14px;
        }
        .pr-table th.pr-th-feature { text-align: left; color: var(--muted); font-weight: 500; width: 220px; }
        .pr-table th.pr-th-popular { color: var(--orange); background: var(--orange-m); border-radius: 0; }
        .pr-table td { padding: 12px 20px; border-bottom: 0.5px solid var(--border); text-align: center; color: var(--muted); }
        .pr-td-feature { text-align: left; color: var(--text); font-weight: 500; }
        .pr-td-popular { background: rgba(255, 87, 34, 0.04); }
        .pr-table tbody tr:hover { background: var(--bg); }
        .check-icon { color: var(--green); font-weight: 700; }
        .dash-icon { color: var(--border2); }

        .ti-flag-badge {
          font-size: 9px;
          font-weight: 800;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.12);
          border: 0.5px solid rgba(255,255,255,0.25);
          padding: 1px 6px;
          border-radius: 4px;
        }

        /* TRUST STRIP */
        .pr-trust-section {
          padding: 48px 0;
          background: var(--bg);
        }
        .pr-trust-inner {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .pr-trust-item { display: flex; align-items: flex-start; gap: 14px; }
        .pr-trust-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pr-trust-title { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
        .pr-trust-sub { font-size: 12px; color: var(--muted); line-height: 1.5; }

        /* FAQ */
        .pr-faq-section {
          padding: 80px 0;
          background: var(--white);
          border-top: 0.5px solid var(--border);
        }
        .pr-faq-inner {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
        }
        .pr-faq-list { display: flex; flex-direction: column; gap: 0; }
        .pr-faq-item {
          border-bottom: 0.5px solid var(--border);
        }
        .pr-faq-q {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 0;
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          color: var(--text);
          cursor: pointer;
          text-align: left;
        }
        .pr-faq-icon {
          flex-shrink: 0;
          color: var(--muted);
          transition: transform 0.2s;
        }
        .pr-faq-item.open .pr-faq-icon { transform: rotate(180deg); }
        .pr-faq-a {
          padding: 0 0 18px;
          font-size: 14px;
          color: var(--muted);
          line-height: 1.7;
          animation: fadeIn 0.2s ease;
        }

        /* FINAL CTA */
        .pr-final-cta {
          padding: 100px 0;
          background: #2D2A26;
          text-align: center;
        }
        .dark-theme .pr-final-cta {
          background: #121110;
        }
        .pr-final-inner { max-width: 640px; margin: 0 auto; }
        .pr-final-h2 {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        .pr-final-sub { font-size: 17px; color: rgba(255,255,255,0.6); margin-bottom: 36px; }
        .pr-final-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }
        .pr-final-note { font-size: 12px; color: rgba(255,255,255,0.35); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: 960px) {
          .pr-cards-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .pr-trust-inner { grid-template-columns: repeat(2, 1fr); }
          .pr-faq-inner { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 600px) {
          .pr-trust-inner { grid-template-columns: 1fr; }
          .pr-hero-h1 { font-size: 38px; }
          .pr-toggles { flex-direction: column; align-items: flex-start; }
          .pr-final-h2 { font-size: 28px; }
        }
      `}</style>
    </>
  );
}

function renderVal(val: string): React.ReactNode {
  if (val === "✓") return <span className="check-icon">✓</span>;
  if (val === "—") return <span className="dash-icon">—</span>;
  return val;
}
