"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "es", name: "Spanish" },
  { code: "vi", name: "Vietnamese" },
  { code: "en", name: "English" }
];

const DEPARTMENTS = ["Production", "Spinning Floor", "Weaving", "Warehouse A", "Maintenance"];

export default function WorkerJoinPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedLang, setSelectedLang] = useState("hi");
  const [department, setDepartment] = useState("Production");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if worker is already onboarded
  React.useEffect(() => {
    const sessionStr = localStorage.getItem("harness_worker_session");
    if (sessionStr) {
      router.push("/chat");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg("");

    const newWorker = {
      id: `w-0${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      phone: phone.trim(),
      language: selectedLang,
      department,
      active: "Just joined"
    };

    try {
      // POST to our roster API
      const res = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorker)
      });

      if (res.ok) {
        // Save session in localStorage
        localStorage.setItem("harness_worker_session", JSON.stringify(newWorker));
        // Redirect to /chat
        router.push("/chat");
      } else {
        throw new Error("Failed to register worker profile.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Connection error. Profile saved locally.");
      localStorage.setItem("harness_worker_session", JSON.stringify(newWorker));
      setTimeout(() => router.push("/chat"), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="worker-portal-bg">
      <div className="glass-card">
        
        {/* Sleek Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" style={{ color: "var(--orange)" }}>
              <path d="M5 4v16M19 4v16M5 12h14" />
              <circle cx="12" cy="12" r="3.5" fill="#121210" stroke="var(--orange)" strokeWidth="3" />
            </svg>
            <span style={{ fontWeight: 900, fontSize: "22px", color: "#fff", letterSpacing: "-0.03em" }}>
              Harness<span style={{ color: "var(--orange)", fontWeight: 500 }}>.ai</span>
            </span>
          </div>
          <h3 style={{ fontSize: "16px", color: "#fff", fontWeight: 600, marginTop: "8px" }}>Worker Onboarding Portal</h3>
          <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "4px" }}>Register your mobile profile to start chatting with the AI helper.</p>
        </div>

        {errorMsg && (
          <div className="tag tag-v4" style={{ width: "100%", textAlign: "center", padding: "10px", borderRadius: "6px", marginBottom: "20px", fontSize: "13px" }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          
          {/* Name Field */}
          <div className="form-group">
            <label className="form-label">Full Name / आपका नाम</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="form-input"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label className="form-label">Phone Number / मोबाइल नंबर</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +919876543210"
              className="form-input"
              required
            />
          </div>

          {/* Department Selector */}
          <div className="form-group">
            <label className="form-label">Floor Department / विभाग</label>
            <div className="dept-pills">
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setDepartment(dept)}
                  className={`dept-pill ${department === dept ? "active" : ""}`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection Grid */}
          <div className="form-group" style={{ marginBottom: "28px" }}>
            <label className="form-label">Preferred Language / भाषा चुनें</label>
            <div className="lang-grid-onboard">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLang(lang.code)}
                  className={`lang-onboard-btn ${selectedLang === lang.code ? "active" : ""}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-p"
            style={{ width: "100%", padding: "14px", justifyContent: "center", fontSize: "14px", fontWeight: 700 }}
          >
            {isLoading ? "Signing up..." : "Onboard Me / प्रवेश करें"}
          </button>
        </form>

      </div>
    </div>
  );
}
