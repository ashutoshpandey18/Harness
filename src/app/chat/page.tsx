"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Message {
  sender: "Worker" | "Agent";
  text: string;
  time: string;
  type?: "text" | "voice" | "photo";
}

export default function WorkerChatPage() {
  const router = useRouter();
  
  const [worker, setWorker] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Media Mock UI overlays
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const voiceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load worker session
  useEffect(() => {
    const sessionStr = localStorage.getItem("harness_worker_session");
    if (!sessionStr) {
      router.push("/join");
      return;
    }
    const parsed = JSON.parse(sessionStr);
    setWorker(parsed);

    // Seed welcoming introduction message
    setMessages([
      {
        sender: "Agent",
        text: `Namaste **${parsed.name}**! MAGS.ai safety engine mein aapka swagat hai. Aap mujhse koi bhi safety ya operational manual sawal pooch sakte hain. (Language: ${parsed.language.toUpperCase()})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [router]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const timestamp = getTimestamp();
    const userMsg: Message = { sender: "Worker", text: textToSend, time: timestamp };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSend,
          phone: worker?.phone || "+919876543210",
          confidenceThreshold: 0.75
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, {
          sender: "Agent",
          text: data.text,
          time: getTimestamp()
        }]);
      } else {
        throw new Error("Failed to call chat api");
      }
    } catch (err) {
      console.error(err);
      // Offline fallback
      setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: "Agent",
          text: `[Offline Local Fallback]: I received "${textToSend}". Database connection is saved locally.`,
          time: getTimestamp()
        }]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const startVoiceRecording = () => {
    setShowVoiceRecorder(true);
    setVoiceSeconds(0);
    voiceIntervalRef.current = setInterval(() => {
      setVoiceSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopAndSendVoice = () => {
    if (voiceIntervalRef.current) {
      clearInterval(voiceIntervalRef.current);
    }
    setShowVoiceRecorder(false);

    // Simulate sending translated voice query based on worker language
    let query = "Safety helmet kahan milega?";
    if (worker?.language === "en") query = "Where is my safety helmet?";
    if (worker?.language === "es") query = "¿Dónde puedo encontrar el casco?";
    if (worker?.language === "vi") query = "Kính bảo hộ lao động ở đâu?";

    handleSendMessage(query);
  };

  const triggerPhotoUpload = () => {
    const query = "Machine 4 band ho gayi, error lights flashing. How to reset?";
    handleSendMessage(query);
  };

  // Check and format RAG SOP References dynamically in message bubbles
  const renderMessageText = (m: Message) => {
    const text = m.text;
    const match = text.match(/(SOP Section \d+\.\d+)/i);
    const reference = match ? match[0] : null;

    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }} />
        {reference && m.sender === "Agent" && (
          <div className="rag-reference-text">
            source: {reference.toLowerCase()}
          </div>
        )}
      </div>
    );
  };

  if (!worker) {
    return (
      <div className="worker-portal-bg">
        <div className="boot-loader" style={{ width: "40px", height: "40px" }} />
      </div>
    );
  }

  return (
    <div className="chat-client-wrapper">
      
      {/* 1. Glass Header */}
      <header className="chat-client-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="chat-client-avatar">
            {worker.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>{worker.name}</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--muted2)", marginTop: "2px" }}>
              <span className="chat-pulse-ring" />
              <span>{worker.department} · {worker.phone}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-g" style={{ padding: "6px 12px", fontSize: "11px" }} onClick={() => {
            localStorage.removeItem("harness_worker_session");
            router.push("/join");
          }}>
            Logout
          </button>
        </div>
      </header>

      {/* 2. Messages Feed */}
      <div className="chat-client-body" ref={chatBodyRef}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`chat-msg-bubble ${m.sender === "Worker" ? "chat-msg-out" : "chat-msg-in"}`}
          >
            {renderMessageText(m)}
            <div style={{ fontSize: "9.5px", opacity: 0.6, textAlign: "right", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
              {m.time}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-msg-bubble chat-msg-in typing-indicator-bubble">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}
      </div>

      {/* 3. Audio Recorder Overlay */}
      {showVoiceRecorder && (
        <div className="voice-recording-flat" style={{ margin: "0 20px 10px" }}>
          <div className="recording-dot-flat" />
          <span style={{ fontSize: "12.5px", fontWeight: 500, color: "#E3E1DC", flex: 1 }}>
            Recording audio note... 0:0{voiceSeconds}s
          </span>
          <button className="btn-p" style={{ background: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "11px" }} onClick={stopAndSendVoice}>
            Stop & Send
          </button>
        </div>
      )}

      {/* 4. Chat Input footer */}
      <footer className="chat-client-footer">
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          
          {/* Camera photo upload trigger */}
          <button className="sim-btn-extra" title="Mock gauge/OCR photo scan" onClick={triggerPhotoUpload}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Voice recorder trigger */}
          <button className="sim-btn-extra" title="Record Voice Query" onClick={startVoiceRecording} disabled={showVoiceRecorder}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v5a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Text entry field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage(inputValue);
                setInputValue("");
              }
            }}
            placeholder="Type query in your dialect / संदेश लिखें..."
            style={{ flex: 1, background: "#1F1E1B", border: "1px solid #2E2C28", borderRadius: "100px", padding: "10px 18px", color: "#fff", fontSize: "13.5px", outline: "none" }}
          />

          {/* Send */}
          <button
            className="btn-p"
            onClick={() => {
              handleSendMessage(inputValue);
              setInputValue("");
            }}
            style={{ padding: "10px 16px", borderRadius: "50%" }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </button>
        </div>
      </footer>

    </div>
  );
}
