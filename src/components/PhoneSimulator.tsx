"use client";

import React, { useState, useEffect, useRef } from "react";

// Scenario and preset data definitions
export interface TraceStep {
  text: string;
  delay: number;
}

export interface Scenario {
  input: string;
  reply: string;
  reasoning: TraceStep[];
}

export const chatScenarios: Record<string, Scenario> = {
  safety_helmet: {
    input: "Safety helmet kahan milega?",
    reply: "Store Room B mein — Gate 2 ke paas. Supervisor Ramesh ji ke paas extra hain. (SOP Sec 2.1)",
    reasoning: [
      { text: "Observe: WhatsApp message received: 'Safety helmet kahan milega?' from +919876543210", delay: 300 },
      { text: "Redis Cache: Loaded last 10 messages. Memory: None (New Thread)", delay: 600 },
      { text: "Agent Plan: Execute semantic search to find matching safety equipment protocols", delay: 900 },
      { text: "pgvector Search: search_knowledge_base('safety helmet location', company_id='velvet_garments') → 1 result found. Content: 'Safety helmets are stored in Store Room B next to Gate 2. Supervisor Ramesh holds the keys.' Confidence: 0.96", delay: 1200 },
      { text: "Agent Logic: Confidence threshold 0.75 satisfied. Response generated from verified database records.", delay: 1500 },
      { text: "Sarvam AI API: Translated grounded output to Hindi.", delay: 1800 },
      { text: "Meta Cloud API: Dispatched WhatsApp message response in 2.1 seconds.", delay: 2100 }
    ]
  },
  machine_error: {
    input: "Machine 4 band ho gayi, reset kaise karein?",
    reply: "Kaunsa error show ho raha hai, Amit ji? (E-01, E-02 ya E-04?)",
    reasoning: [
      { text: "Observe: WhatsApp message received: 'Machine 4 band ho gayi, reset kaise karein?'", delay: 300 },
      { text: "Redis Cache: Loaded last messages. Worker name: Amit (Onboarding complete)", delay: 600 },
      { text: "Agent Plan: Run pgvector search on machine 4 troubleshooting steps", delay: 900 },
      { text: "pgvector Search: search_knowledge_base('machine 4 reset shutdown') → Multiple records found (E-01, E-02, E-04 errors have different reset procedures). Combined Confidence: 0.52 (Low)", delay: 1200 },
      { text: "Agent Logic: Confidence (0.52) below threshold (0.75). Initiating clarification request.", delay: 1500 },
      { text: "Tool Executed: ask_clarification(options=['E-01', 'E-02', 'E-04'])", delay: 1800 },
      { text: "Meta Cloud API: Dispatched response asking for details.", delay: 2100 }
    ]
  },
  smoke_incident: {
    input: "yahan pe line 2 mein smoke aa raha hai jaldi aao",
    reply: "[EMERGENCY ALERT] Line 2 mein aag/smoke detect kiya gaya hai. Main gas valve band karein. Supervisor Ramesh ji ko notify kar diya gaya hai.",
    reasoning: [
      { text: "Observe: WhatsApp message received: 'yahan pe line 2 mein smoke aa raha hai jaldi aao'", delay: 300 },
      { text: "Regex Interceptor: Smoke/Aag/Injury keywords intercepted. Threat Level: High.", delay: 600 },
      { text: "Tool Executed: log_incident(worker_id='amit_01', description='smoke on line 2', severity='HIGH')", delay: 900 },
      { text: "Database: Supabase Incident log generated. Incident ID: inc_9422", delay: 1200 },
      { text: "Tool Executed: route_to_supervisor(department='Production', text='Emergency: Amit reported smoke on Line 2!')", delay: 1500 },
      { text: "Meta Cloud API: Dispatched WhatsApp notification alert to Supervisor Ramesh (+919811122233)", delay: 1800 },
      { text: "Agent Plan: Fetch emergency SOP steps for smoke evacuations", delay: 2100 },
      { text: "pgvector Search: search_knowledge_base('smoke fire emergency SOP') → Confidence: 0.98", delay: 2400 },
      { text: "Meta Cloud API: Sent emergency instructions to Amit in 2.8 seconds.", delay: 2700 }
    ]
  },
  new_worker: {
    input: "Hi",
    reply: "Namaste! MAGS.ai mein aapka swagat hai. Aapka naam kya hai?",
    reasoning: [
      { text: "Observe: WhatsApp message received: 'Hi' from +919999888777", delay: 300 },
      { text: "Database Query: Fetching profile details... Result: No worker record found for this number.", delay: 600 },
      { text: "Agent Plan: Start worker onboarding workflow.", delay: 900 },
      { text: "Tool Executed: get_worker_history() → None", delay: 1200 },
      { text: "Agent Logic: Send welcome message & request name.", delay: 1500 },
      { text: "Meta Cloud API: Dispatched welcome prompt.", delay: 1800 }
    ]
  },
  chemical_us: {
    input: "There is a chemical leak in aisle 4, what do I do?",
    reply: "[HAZARD ESCALATION] Chemical spill detected in Aisle 4. Evacuate aisle immediately. Supervisor John alerted. Refer to SOP Section 7.1.",
    reasoning: [
      { text: "Observe: Twilio SMS received: 'There is a chemical leak in aisle 4...' from +12025550143", delay: 300 },
      { text: "Agent Action: Intercepted keyword 'chemical leak'. Escalating threat status.", delay: 600 },
      { text: "Tool Executed: log_incident(worker_id='us_worker_09', description='chemical leak in aisle 4', severity='HIGH')", delay: 900 },
      { text: "Tool Executed: route_to_supervisor(department='Safety Coordinator', text='Alert: Chemical leak reported in Aisle 4!')", delay: 1200 },
      { text: "pgvector Search: search_knowledge_base('chemical leak protocol Aisle 4') → Confidence: 0.94", delay: 1500 },
      { text: "Twilio SMS Gateway: Dispatched SMS alert & evacuation guide in 1.8 seconds.", delay: 1800 }
    ]
  },
  gafas_sp: {
    input: "¿Dónde puedo conseguir gafas de seguridad?",
    reply: "Las gafas de seguridad están en el Gabinete de Seguridad A, al lado de la entrada principal. (SOP Sec 3.4)",
    reasoning: [
      { text: "Observe: Twilio SMS received: '¿Dónde puedo conseguir gafas de seguridad?'", delay: 300 },
      { text: "DeepL Translation API: Translated Spanish to English: 'Where can I get safety glasses?'", delay: 600 },
      { text: "pgvector Search: search_knowledge_base('safety glasses storage location') → Result found: 'Safety glasses are kept in Safety Cabinet A next to the main entrance.' Confidence: 0.91", delay: 900 },
      { text: "DeepL Translation API: Translated English reply to Spanish.", delay: 1200 },
      { text: "Twilio SMS Gateway: Dispatched Spanish reply bubble.", delay: 1500 }
    ]
  },
  kinh_vi: {
    input: "Kính bảo hộ lao động để ở đâu?",
    reply: "Kính bảo hộ được cất ở Tủ An toàn A, cạnh lối ra vào chính. (SOP Sec 3.4)",
    reasoning: [
      { text: "Observe: Line App message received: 'Kính bảo hộ lao động để ở đâu?' from LineUser_094", delay: 300 },
      { text: "OpenAI translation layer: Translated Vietnamese to English: 'Where are safety glasses kept?'", delay: 600 },
      { text: "pgvector Search: search_knowledge_base('safety glasses location') → Result: 'Safety glasses are in Safety Cabinet A.' Confidence: 0.94", delay: 900 },
      { text: "OpenAI translation layer: Translated English response back to Vietnamese.", delay: 1200 },
      { text: "Line Messaging API: Dispatched response in 1.4 seconds.", delay: 1500 }
    ]
  }
};

export const presetScenarios: Record<string, Record<string, { id: string; label: string }[]>> = {
  whatsapp: {
    hi: [
      { id: "safety_helmet", label: "helmet query" },
      { id: "machine_error", label: "machine error" },
      { id: "smoke_incident", label: "incident alert" },
      { id: "new_worker", label: "onboarding" }
    ],
    en: [
      { id: "safety_helmet", label: "helmet location" }
    ]
  },
  sms: {
    en: [
      { id: "chemical_us", label: "chemical leak" }
    ],
    es: [
      { id: "gafas_sp", label: "gafas seguridad" }
    ]
  },
  line: {
    vi: [
      { id: "kinh_vi", label: "kính bảo hộ" }
    ]
  }
};

export interface Message {
  type: "in" | "out" | "voice" | "photo";
  text?: string;
  time: string;
}

interface PhoneSimulatorProps {
  onShowSpeechBubbles?: () => void;
  onTraceUpdate?: (steps: string[]) => void;
  isDashboardDocked?: boolean;
  confidenceThreshold?: number;
}

export default function PhoneSimulator({
  onShowSpeechBubbles,
  onTraceUpdate,
  isDashboardDocked = false,
  confidenceThreshold = 0.75
}: PhoneSimulatorProps) {
  // Simulator State variables
  const [isPowered, setIsPowered] = useState<"off" | "booting" | "on">("off");
  const [channel, setChannel] = useState<"whatsapp" | "sms" | "line">("whatsapp");
  const [lang, setLang] = useState<"hi" | "en" | "es" | "vi">("hi");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isTypingIndicator, setIsTypingIndicator] = useState(false);
  const [powerClicked, setPowerClicked] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const traceStepsRef = useRef<string[]>([]);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to call live RAG backend endpoint
  const fetchChat = async (text: string) => {
    try {
      let phoneNum = "+919876543210";
      if (channel === "sms") phoneNum = "+15550199";
      if (channel === "line") phoneNum = "+84901234567";

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          phone: phoneNum,
          confidenceThreshold
        })
      });
      if (!res.ok) throw new Error("API failed");
      return await res.json();
    } catch (e) {
      console.warn("Offline fallback in simulator:", e);
      return null;
    }
  };

  // Fetch active thread history from database
  const loadActiveThread = async (ch: "whatsapp" | "sms" | "line") => {
    try {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("API failed");
      const list = await res.json();
      let phoneNum = "+919876543210";
      if (ch === "sms") phoneNum = "+15550199";
      if (ch === "line") phoneNum = "+84901234567";

      const activeConv = list.find((c: any) => c.phone === phoneNum && c.channel === ch);
      if (activeConv && activeConv.messages && activeConv.messages.length > 0) {
        const mapped = activeConv.messages.map((m: any) => ({
          type: m.sender === "Worker" ? "in" : "out",
          text: m.text,
          time: m.time
        }));
        setMessages(mapped);

        if (onTraceUpdate && activeConv.trace) {
          const t = activeConv.trace;
          traceStepsRef.current = [
            t.Observe,
            `Tools Called: ${t.ToolsCalled}`,
            `DB Sync: ${t.DatabaseSync}`,
            `Confidence Level: ${t.Confidence}`
          ];
          onTraceUpdate([...traceStepsRef.current]);
        }
        return true;
      }
    } catch (e) {
      console.warn("Failed to load active thread:", e);
    }
    return false;
  };

  // Auto-scroll messages
  useEffect(() => {
    const scrollChat = () => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTo({
          top: chatBodyRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    };

    scrollChat();
    const t1 = setTimeout(scrollChat, 100);
    const t2 = setTimeout(scrollChat, 300);
    const t3 = setTimeout(scrollChat, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [messages, isTypingIndicator, isKeyboardVisible]);

  const handleKeyMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleKeyClick = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (key !== "backspace" && key !== "return" && key !== " ") {
      setActiveKey(key.toLowerCase());
      addTimeout(() => setActiveKey(null), 80);
    }

    if (key === "backspace") {
      setInputValue(prev => prev.slice(0, -1));
    } else if (key === "return") {
      handleCustomSubmit();
    } else {
      setInputValue(prev => prev + key);
    }
  };

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const addTimeout = (fn: () => void, delay: number) => {
    const timer = setTimeout(fn, delay);
    timeoutsRef.current.push(timer);
    return timer;
  };

  const clearAllTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  // Run the default introduction animation on initial mount
  useEffect(() => {
    if (isDashboardDocked) {
      setIsPowered("on");
      loadActiveThread("whatsapp").then(loaded => {
        if (!loaded) {
          setMessages([
            { type: "in", text: "Machine 4 band ho gayi, kya karein?", time: "09:01" },
            {
              type: "out",
              text: "Machine 4 ke liye:<br>1. Main switch off karein<br>2. 30 sec wait karein<br>3. Reset button dabayein<br><br>SOP Section 4.2 se. Agar phir bhi na chale — supervisor ko bulayein.",
              time: "09:01"
            }
          ]);
        }
      });
      return;
    }

    setIsPowered("off");
    setMessages([]);
    setInputValue("");
    setIsKeyboardVisible(false);
    setIsTypingIndicator(false);
    setPowerClicked(false);
    clearAllTimers();

    addTimeout(() => {
      setPowerClicked(true);
      addTimeout(() => setPowerClicked(false), 350);
    }, 500);

    addTimeout(() => {
      setIsPowered("booting");
    }, 850);

    addTimeout(() => {
      setIsPowered("on");
    }, 2850);

    addTimeout(() => {
      setIsKeyboardVisible(true);
    }, 3400);

    addTimeout(() => {
      const messageText = "Machine 4 band ho gayi, kya karein?";
      let index = 0;
      let currentVal = "";

      typingIntervalRef.current = setInterval(() => {
        if (index < messageText.length) {
          const char = messageText[index];
          currentVal += char;
          setInputValue(currentVal);
          triggerKeyPressAnimation(char);
          index++;
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          addTimeout(() => {
            sendSequence(messageText);
          }, 400);
        }
      }, 70);
    }, 4000);

    return () => {
      clearAllTimers();
    };
  }, [isDashboardDocked]);

  const triggerKeyPressAnimation = (char: string) => {
    setActiveKey(char.toLowerCase());
    addTimeout(() => setActiveKey(null), 80);
  };

  const getTimestamp = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const sendSequence = async (text: string) => {
    setInputValue("");
    setIsKeyboardVisible(false);
    
    const timestamp = getTimestamp();
    setMessages(prev => [...prev, { type: "in", text, time: timestamp }]);
    setIsTypingIndicator(true);

    traceStepsRef.current = [];
    if (onTraceUpdate) onTraceUpdate([]);

    // 1. Try calling the live backend first
    const liveData = await fetchChat(text);
    if (liveData) {
      const trace = liveData.trace;
      const steps = [
        trace.Observe,
        `Tools Called: ${trace.ToolsCalled}`,
        `DB Sync: ${trace.DatabaseSync}`,
        `Confidence Level: ${trace.Confidence}`
      ];

      steps.forEach((stepText, idx) => {
        addTimeout(() => {
          traceStepsRef.current.push(stepText);
          if (onTraceUpdate) onTraceUpdate([...traceStepsRef.current]);
        }, (idx + 1) * 350);
      });

      addTimeout(() => {
        setIsTypingIndicator(false);
        setMessages(prev => [...prev, { type: "out", text: liveData.text, time: timestamp }]);
        if (onShowSpeechBubbles) onShowSpeechBubbles();
      }, (steps.length + 1) * 350);
      return;
    }

    // 2. Offline Fallback
    addTimeout(() => {
      traceStepsRef.current = [];
      const addTraceLine = (stepText: string) => {
        traceStepsRef.current.push(stepText);
        if (onTraceUpdate) {
          onTraceUpdate([...traceStepsRef.current]);
        }
      };

      addTimeout(() => addTraceLine("Incoming WhatsApp query from Rajesh Kumar (Loom 4 auto-stop)"), 100);
      addTimeout(() => addTraceLine("Analyzing problem description: 'Machine 4 band ho gayi...'"), 600);
      addTimeout(() => addTraceLine("Matching Loom 4 metadata with factory layout database..."), 1100);
      addTimeout(() => addTraceLine("Retrieving SOP Section 4.2 (Loom Auto-Stop Troubleshooting)..."), 1600);
      addTimeout(() => addTraceLine("Generating response instructions in Hindi (Indian Factory dialect)"), 2100);
    }, 300);

    addTimeout(() => {
      setIsTypingIndicator(false);
      setMessages(prev => [
        ...prev,
        {
          type: "out",
          text: "Machine 4 ke liye:<br>1. Main switch off karein<br>2. 30 sec wait karein<br>3. Reset button dabayein<br><br>SOP Section 4.2 se. Agar phir bhi na chale — supervisor ko bulayein.",
          time: timestamp
        }
      ]);

      if (onShowSpeechBubbles) {
        onShowSpeechBubbles();
      }
    }, 3300);
  };

  const handleChannelSwitch = async (ch: "whatsapp" | "sms" | "line") => {
    clearAllTimers();
    setChannel(ch);
    let defaultLang: "hi" | "en" | "es" | "vi" = "hi";
    if (ch === "sms") defaultLang = "en";
    if (ch === "line") defaultLang = "vi";
    setLang(defaultLang);
    setMessages([]);
    setIsTypingIndicator(false);
    
    traceStepsRef.current = [];
    if (onTraceUpdate) onTraceUpdate([]);

    // Try loading actual conversation thread from DB first
    const loaded = await loadActiveThread(ch);
    if (loaded) return;

    if (ch === "sms") {
      setMessages([
        { type: "in", text: "There is a chemical leak in aisle 4, what do I do?", time: getTimestamp() },
        {
          type: "out",
          text: "[HAZARD ESCALATION] Chemical spill detected in Aisle 4. Evacuate aisle immediately. Supervisor John alerted. Refer to SOP Section 7.1.",
          time: getTimestamp()
        }
      ]);
    } else if (ch === "line") {
      setMessages([
        { type: "in", text: "Kính bảo hộ lao động để ở đâu?", time: getTimestamp() },
        {
          type: "out",
          text: "Kính bảo hộ được cất ở Tủ An toàn A, cạnh lối ra vào chính. (SOP Sec 3.4)",
          time: getTimestamp()
        }
      ]);
    } else {
      setMessages([
        { type: "in", text: "Machine 4 band ho gayi, kya karein?", time: getTimestamp() },
        {
          type: "out",
          text: "Machine 4 ke liye:<br>1. Main switch off karein<br>2. 30 sec wait karein<br>3. Reset button dabayein<br><br>SOP Section 4.2 se. Agar phir bhi na chale — supervisor ko bulayein.",
          time: getTimestamp()
        }
      ]);
    }
  };

  const handleRunScenario = (id: string) => {
    clearAllTimers();
    const scenario = chatScenarios[id];
    if (!scenario) return;

    setInputValue("");
    setMessages(prev => [...prev, { type: "in", text: scenario.input, time: getTimestamp() }]);
    setIsTypingIndicator(true);

    traceStepsRef.current = [];
    if (onTraceUpdate) onTraceUpdate([]);

    scenario.reasoning.forEach(step => {
      addTimeout(() => {
        traceStepsRef.current.push(step.text);
        if (onTraceUpdate) onTraceUpdate([...traceStepsRef.current]);
      }, step.delay);
    });

    const finalDelay = scenario.reasoning[scenario.reasoning.length - 1].delay + 400;
    addTimeout(() => {
      setIsTypingIndicator(false);
      setMessages(prev => [...prev, { type: "out", text: scenario.reply, time: getTimestamp() }]);
    }, finalDelay);
  };

  const handleCustomSubmit = async () => {
    const text = inputValue.trim();
    if (!text) return;

    clearAllTimers();
    setInputValue("");
    const timestamp = getTimestamp();
    setMessages(prev => [...prev, { type: "in", text, time: timestamp }]);
    setIsTypingIndicator(true);

    traceStepsRef.current = [];
    if (onTraceUpdate) onTraceUpdate([]);

    // 1. Try calling the live backend first
    const liveData = await fetchChat(text);
    if (liveData) {
      const trace = liveData.trace;
      const steps = [
        trace.Observe,
        `Tools Called: ${trace.ToolsCalled}`,
        `DB Sync: ${trace.DatabaseSync}`,
        `Confidence Level: ${trace.Confidence}`
      ];

      steps.forEach((stepText, idx) => {
        addTimeout(() => {
          traceStepsRef.current.push(stepText);
          if (onTraceUpdate) onTraceUpdate([...traceStepsRef.current]);
        }, (idx + 1) * 350);
      });

      addTimeout(() => {
        setIsTypingIndicator(false);
        setMessages(prev => [...prev, { type: "out", text: liveData.text, time: timestamp }]);
      }, (steps.length + 1) * 350);
      return;
    }

    // 2. Offline Fallback for matched scenarios
    const cleanText = text.toLowerCase();
    let matchedScenario: string | null = null;
    if (cleanText.includes("helmet") || cleanText.includes("safety") || cleanText.includes("sir")) {
      matchedScenario = "safety_helmet";
    } else if (cleanText.includes("incident") || cleanText.includes("smoke") || cleanText.includes("aag")) {
      matchedScenario = "smoke_incident";
    } else if (cleanText.includes("machine") || cleanText.includes("error") || cleanText.includes("reset") || cleanText.includes("boiler")) {
      matchedScenario = "machine_error";
    } else if (cleanText.includes("onboard") || cleanText.includes("welcome") || cleanText.includes("hi") || cleanText.includes("hello")) {
      matchedScenario = "new_worker";
    }

    if (matchedScenario) {
      const scenario = chatScenarios[matchedScenario];
      if (scenario) {
        scenario.reasoning.forEach(step => {
          addTimeout(() => {
            traceStepsRef.current.push(step.text);
            if (onTraceUpdate) onTraceUpdate([...traceStepsRef.current]);
          }, step.delay);
        });

        const finalDelay = scenario.reasoning[scenario.reasoning.length - 1].delay + 400;
        addTimeout(() => {
          setIsTypingIndicator(false);
          setMessages(prev => [...prev, { type: "out", text: scenario.reply, time: timestamp }]);
        }, finalDelay);
        return;
      }
    }

    // 3. Fallback for completely random queries (offline mock)
    const customSteps = [
      `Observe: Received text: '${text}' on channel: ${channel}`,
      "Redis Cache: Checked last message context...",
      `Agent Plan: Translate and call search_knowledge_base('${text}')`,
      "pgvector Search: Cosine similarities calculated... Best fit: 0.43 (Low)",
      "Agent Plan: Confidence low. Flagging query and routing to supervisor.",
      "Tool Executed: flag_unanswered()",
      "Tool Executed: route_to_supervisor(department='General')"
    ];

    customSteps.forEach((stepText, idx) => {
      addTimeout(() => {
        traceStepsRef.current.push(stepText);
        if (onTraceUpdate) onTraceUpdate([...traceStepsRef.current]);
      }, (idx + 1) * 350);
    });

    addTimeout(() => {
      setIsTypingIndicator(false);
      let replyStr = "Main iski jankari nahi dhoondh paya. Sawaal supervisor ko bhej diya gaya hai.";
      if (lang === "en") replyStr = "I couldn't find matches for this. I have routed your query to the duty supervisor.";
      if (lang === "es") replyStr = "No pude encontrar coincidencias. He transferido su consulta al supervisor.";
      if (lang === "vi") replyStr = "Tôi không tìm thấy thông tin này. Đã chuyển tiếp câu hỏi tới giám sát viên.";
      setMessages(prev => [...prev, { type: "out", text: replyStr, time: timestamp }]);
    }, 2800);
  };

  const handleVoiceTrigger = () => {
    clearAllTimers();
    setInputValue("");
    setMessages(prev => [...prev, { type: "voice", time: getTimestamp() }]);
    setIsTypingIndicator(true);

    traceStepsRef.current = [];
    if (onTraceUpdate) onTraceUpdate([]);

    const voiceSteps = [
      "Observe: WhatsApp voice message received (.ogg format)",
      "FFmpeg Pipeline: Executing high-pass machinery noise isolation filter...",
      "Whisper API: Sending filtered audio payload for transcription...",
      "Whisper Response: 'Boiler 2 warning indicator light red, check reset step'",
      "pgvector Search: search_knowledge_base('Boiler 2 indicator light red reset') → Confidence: 0.94",
      "Agent Plan: Output Boiler 2 SOP section details in worker language"
    ];

    voiceSteps.forEach((stepText, idx) => {
      addTimeout(() => {
        traceStepsRef.current.push(stepText);
        if (onTraceUpdate) onTraceUpdate([...traceStepsRef.current]);
      }, (idx + 1) * 350);
    });

    addTimeout(() => {
      setIsTypingIndicator(false);
      let reply = "Boiler 2 indicator red warning ke liye: \n1. Aux valve B band karein.\n2. Pressure gauges inspect karein.\n3. Reset trigger 2 dabayein.\n(SOP Sec 5.4)";
      if (lang === "en") reply = "For Boiler 2 indicator red warning:\n1. Close auxiliary valve B.\n2. Inspect pressure gauges.\n3. Press reset trigger 2.\n(SOP Sec 5.4)";
      setMessages(prev => [...prev, { type: "out", text: reply, time: getTimestamp() }]);
    }, 2700);
  };

  const handlePhotoTrigger = () => {
    clearAllTimers();
    setInputValue("");
    setMessages(prev => [...prev, { type: "photo", time: getTimestamp() }]);
    setIsTypingIndicator(true);

    traceStepsRef.current = [];
    if (onTraceUpdate) onTraceUpdate([]);

    const photoSteps = [
      "Observe: Outbound photo payload received",
      "Claude Vision API: Processing image features and text tags...",
      "Claude Vision Description: 'A close-up photo of an active warning panel with indicator status light active'",
      "pgvector Search: search_knowledge_base('active warning panel indicator light') → Confidence: 0.89",
      "Agent Plan: Dispatch safety verification and route warning instructions"
    ];

    photoSteps.forEach((stepText, idx) => {
      addTimeout(() => {
        traceStepsRef.current.push(stepText);
        if (onTraceUpdate) onTraceUpdate([...traceStepsRef.current]);
      }, (idx + 1) * 350);
    });

    addTimeout(() => {
      setIsTypingIndicator(false);
      let reply = "Yeh active safety warning alarm indicator light hai. SOP Section 6.2 ke anusaar, immediately main power control shut off karein aur supervisor notify karein.";
      if (lang === "en") reply = "This is the active safety warning indicator light. According to SOP Section 6.2, shut off the main power control immediately and notify your supervisor.";
      setMessages(prev => [...prev, { type: "out", text: reply, time: getTimestamp() }]);
    }, 2600);
  };

  const getHeaderInfo = () => {
    if (channel === "sms") {
      return {
        name: "Twilio SMS Gateway",
        status: "Active (+1-202-555-0143)",
        avatar: "TS"
      };
    } else if (channel === "line") {
      return {
        name: "Line Business Account",
        status: "Line Bot Active",
        avatar: "LN"
      };
    } else {
      return {
        name: "MAGS.ai Agent",
        status: "online",
        avatar: "HR"
      };
    }
  };

  const headerInfo = getHeaderInfo();
  const activePresets = presetScenarios[channel]?.[lang] || [];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {!isDashboardDocked && (
        <div className="channel-selector-row" style={{ marginBottom: "24px" }}>
          <button
            className={`channel-tab-btn ${channel === "whatsapp" ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleChannelSwitch("whatsapp")}
          >
            WhatsApp (India)
          </button>
          <button
            className={`channel-tab-btn ${channel === "sms" ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleChannelSwitch("sms")}
          >
            Twilio SMS (USA)
          </button>
          <button
            className={`channel-tab-btn ${channel === "line" ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleChannelSwitch("line")}
          >
            Line App (Japan)
          </button>
        </div>
      )}

      <div className={`phone-mockup ${channel === "sms" ? "sms-mode" : channel === "line" ? "line-mode" : ""}`} id="phone-simulator">
        
        <div
          className={`phone-btn phone-btn-power ${powerClicked ? "clicked" : ""}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (isPowered === "on") setIsPowered("off");
            else if (isPowered === "off") {
              setIsPowered("booting");
              setTimeout(() => setIsPowered("on"), 2000);
            }
          }}
        />
        <div className="phone-btn phone-btn-vol-up" />
        <div className="phone-btn phone-btn-vol-down" />

        <div className="phone-screen">
          
          <div className={`phone-boot-overlay ${isPowered === "off" ? "off" : isPowered === "booting" ? "booting" : ""}`}>
            <div className="boot-logo" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" style={{ marginRight: "6px" }}>
                <path d="M5 4v16M19 4v16M5 12h14" />
                <circle cx="12" cy="12" r="3.5" fill="#000" stroke="var(--orange)" strokeWidth="3" />
              </svg>
              <span>MAGS<b>.ai</b></span>
            </div>
            <div className="boot-loader"></div>
          </div>

          <div className="dynamic-island">
            <div className="camera-lens"></div>
          </div>
          
          <div className="home-indicator"></div>

          <div className="phone-status-bar" id="phone-status-bar">
            <span>09:01 AM</span>
            <div className="status-bar-icons" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: "700" }}>5G</span>
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ display: "inline-block" }}>
                <path d="M2 17h3v4H2v-4zm5-4h3v8H7v-8zm5-4h3v12h-3V9zm5-4h3v16h-3V5zm5-4h3v20h-3V1z" />
              </svg>
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" style={{ display: "inline-block" }}>
                <path d="M17 5H3a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2zm-1 11H4V8h12v8zm5-7v6h1V9h-1z" />
              </svg>
              <span style={{ fontSize: "10px", fontWeight: "600" }}>92%</span>
            </div>
          </div>

          <div className="whatsapp-header" id="phone-header">
            <div className="whatsapp-avatar" id="phone-avatar">{headerInfo.avatar}</div>
            <div className="whatsapp-header-info">
              <span className="whatsapp-name" id="phone-name">{headerInfo.name}</span>
              <span className="whatsapp-status" id="phone-status">{headerInfo.status}</span>
            </div>
          </div>

          <div className="whatsapp-chat-body" id="whatsapp-chat" ref={chatBodyRef}>
            {messages.map((msg, idx) => {
              if (msg.type === "voice") {
                return (
                  <div key={idx} className="msg msg-voice">
                    <svg style={{ width: "16px", height: "16px", color: "var(--orange)", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v5a3 3 0 01-3 3z" />
                    </svg>
                    <div className="voice-wave">
                      <span className="recording"></span>
                      <span className="recording"></span>
                      <span className="recording"></span>
                      <span className="recording"></span>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--muted)", marginLeft: "4px" }}>0:04</span>
                  </div>
                );
              }
              if (msg.type === "photo") {
                return (
                  <div key={idx} className="msg msg-photo">
                    <img src="/assets/hand-right.png" alt="Uploaded Panel Status" />
                    <div className="msg-photo-desc">Warning indicator light.jpg</div>
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className={`msg ${msg.type === "in" ? "msg-in" : "msg-out"}`}
                  dangerouslySetInnerHTML={{ __html: `${msg.text} <span class="msg-time">${msg.time}${msg.type === "out" ? " ✓✓" : ""}</span>` }}
                />
              );
            })}

            {isTypingIndicator && (
              <div className="msg msg-out typing-indicator-bubble" id="whatsapp-typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="whatsapp-input-row">
            <div className="lang-selector-row">
              <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase" }}>Language:</span>
              <button className={`lang-pill-btn ${lang === "hi" ? "active" : ""}`} onMouseDown={(e) => e.preventDefault()} onClick={() => setLang("hi")}>Hindi</button>
              <button className={`lang-pill-btn ${lang === "en" ? "active" : ""}`} onMouseDown={(e) => e.preventDefault()} onClick={() => setLang("en")}>English</button>
              <button className={`lang-pill-btn ${lang === "es" ? "active" : ""}`} onMouseDown={(e) => e.preventDefault()} onClick={() => setLang("es")}>Spanish</button>
              <button className={`lang-pill-btn ${lang === "vi" ? "active" : ""}`} onMouseDown={(e) => e.preventDefault()} onClick={() => setLang("vi")}>Vietnamese</button>
            </div>

            <div className="whatsapp-presets">
              {activePresets.length === 0 ? (
                <span style={{ fontSize: "10px", color: "var(--muted2)", padding: "4px" }}>
                  No presets for this selection. Try typing.
                </span>
              ) : (
                activePresets.map((preset, pIdx) => (
                  <button key={pIdx} className="preset-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => handleRunScenario(preset.id)}>
                    {preset.label}
                  </button>
                ))
              )}
            </div>

            <div className="whatsapp-input-container">
              <div className="sim-controls">
                <button className="sim-btn-extra" onMouseDown={(e) => e.preventDefault()} onClick={handleVoiceTrigger} title="Record Voice">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <button className="sim-btn-extra" onMouseDown={(e) => e.preventDefault()} onClick={handlePhotoTrigger} title="Upload Photo">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={e => e.key === "Enter" && handleCustomSubmit()}
                placeholder="Type a message..."
              />
              
              <button onMouseDown={(e) => e.preventDefault()} onClick={handleCustomSubmit}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>

          <div className={`mock-keyboard ${isKeyboardVisible ? "show-keyboard" : ""}`}>
            <div className="keyboard-row">
              {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map(k => (
                <span key={k} data-key={k} className={activeKey === k ? "active" : ""} onMouseDown={handleKeyMouseDown} onClick={(e) => handleKeyClick(e, k)}>{k}</span>
              ))}
            </div>
            <div className="keyboard-row">
              {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map(k => (
                <span key={k} data-key={k} className={activeKey === k ? "active" : ""} onMouseDown={handleKeyMouseDown} onClick={(e) => handleKeyClick(e, k)}>{k}</span>
              ))}
            </div>
            <div className="keyboard-row">
              <span className="key-shift" onMouseDown={handleKeyMouseDown} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>⇧</span>
              {["z", "x", "c", "v", "b", "n", "m"].map(k => (
                <span key={k} data-key={k} className={activeKey === k ? "active" : ""} onMouseDown={handleKeyMouseDown} onClick={(e) => handleKeyClick(e, k)}>{k}</span>
              ))}
              <span className="key-back" onMouseDown={handleKeyMouseDown} onClick={(e) => handleKeyClick(e, "backspace")}>⌫</span>
            </div>
            <div className="keyboard-row">
              <span className="key-123" onMouseDown={handleKeyMouseDown} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>123</span>
              <span className="key-space" data-key=" " onMouseDown={handleKeyMouseDown} onClick={(e) => handleKeyClick(e, " ")}>space</span>
              <span className="key-return" onMouseDown={handleKeyMouseDown} onClick={(e) => handleKeyClick(e, "return")}>return</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
