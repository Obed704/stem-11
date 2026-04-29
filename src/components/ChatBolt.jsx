// AdvancedChatBolt.jsx
// Eye-catching FAB + glassmorphic pre-question teaser + full AI chat

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// ─── Session ID ───────────────────────────────────────────────────────────────
const getSessionId = () => {
  let id = sessionStorage.getItem("stemChatSession");
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem("stemChatSession", id);
  }
  return id;
};

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  yellow: "rgb(247,244,46)",
  cyan: "rgb(23,207,220)",
  pink: "rgb(242,30,167)",
  bg: "#0a0a0a",
  surface: "#141414",
  surface2: "#1c1c1c",
  border: "rgba(255,255,255,0.06)",
  border2: "rgba(255,255,255,0.11)",
  muted: "rgba(255,255,255,0.32)",
  body: "rgba(255,255,255,0.78)",
  white: "#ffffff",
};

// ─── Teaser questions shown above the FAB ─────────────────────────────────────
const TEASER_QUESTIONS = [
  "What is STEM Inspires? 🚀",
  "How can I donate? 💛",
  "How do I start a team? 🤖",
];

// ─── Quick chips inside chat ──────────────────────────────────────────────────
const QUICK_QUESTIONS = [
  "What is STEM Inspires?",
  "How can I donate?",
  "What is FIRST LEGO League?",
  "How do I start a team?",
  "Who are the founders?",
  "Tell me about champions",
  "MIT partnership?",
];

const timestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const WELCOME_MSG = {
  from: "bot",
  text: "Hi! I'm the STEM Inspires AI assistant — powered by real intelligence. Ask me anything about our programs, team, donations, or how to get involved!",
  time: timestamp(),
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
  </svg>
);
const IconMic = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
  </svg>
);
const IconStop = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
);
const IconVolumeMute = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 9-6 6M15 9l6 6M9 15l6-6M3 3l18 18" />
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const IconRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

// ─── Typing dots ──────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "10px 14px" }}>
    {[C.cyan, C.pink, C.yellow].map((c, i) => (
      <motion.div
        key={i}
        animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.16 }}
        style={{ width: 6, height: 6, borderRadius: "50%", background: c }}
      />
    ))}
  </div>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ isBot }) => (
  <div style={{
    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: isBot
      ? `linear-gradient(135deg, ${C.cyan}, rgba(23,207,220,0.25))`
      : `linear-gradient(135deg, #2a2a2a, #444)`,
    border: `1px solid ${isBot ? "rgba(23,207,220,0.25)" : C.border2}`,
    fontSize: "0.65rem", fontWeight: 700, color: C.white,
  }}>
    {isBot ? "S" : "U"}
  </div>
);

// ─── Message bubble ───────────────────────────────────────────────────────────
const Bubble = ({ msg }) => {
  const isBot = msg.from === "bot";
  const isError = msg.isError;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: isBot ? "row" : "row-reverse", alignItems: "flex-end", gap: 8 }}
    >
      <Avatar isBot={isBot} />
      <div style={{
        maxWidth: "74%", padding: "10px 13px",
        borderRadius: isBot ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
        background: isError ? "rgba(242,30,167,0.1)" : isBot ? C.surface2 : `linear-gradient(135deg, ${C.cyan}, rgba(23,207,220,0.65))`,
        border: isBot ? `1px solid ${isError ? "rgba(242,30,167,0.2)" : C.border}` : "none",
        boxShadow: !isBot ? "0 2px 14px rgba(23,207,220,0.2)" : "none",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", lineHeight: 1.7,
          color: isBot ? (isError ? "rgb(242,30,167)" : C.body) : C.bg,
          margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word",
        }}>{msg.text}</p>
        <span style={{ display: "block", fontSize: "0.58rem", color: isBot ? C.muted : "rgba(0,0,0,0.3)", marginTop: 5, textAlign: "right" }}>
          {msg.time}
        </span>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdvancedChatBolt() {
  const [open, setOpen] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(
    () => sessionStorage.getItem("stemTeaserDismissed") === "1"
  );
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sessionId] = useState(getSessionId);
  const [fabHovered, setFabHovered] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Auto-show teaser after 2.5s if not dismissed
  const [teaserVisible, setTeaserVisible] = useState(false);
  useEffect(() => {
    if (teaserDismissed || open) return;
    const t = setTimeout(() => setTeaserVisible(true), 2500);
    return () => clearTimeout(t);
  }, [teaserDismissed, open]);

  const dismissTeaser = () => {
    setTeaserVisible(false);
    setTeaserDismissed(true);
    sessionStorage.setItem("stemTeaserDismissed", "1");
  };

  const openChatFromTeaser = (question) => {
    dismissTeaser();
    setOpen(true);
    // Small delay so window animation starts before sending
    setTimeout(() => handleSend(question), 400);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (open) {
      setTeaserVisible(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSend = useCallback(async (text) => {
    const clean = (text ?? input).trim();
    if (!clean || isTyping) return;

    setShowSuggestions(false);
    setInput("");

    const userMsg = { from: "user", text: clean, time: timestamp() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean, sessionId }),
        signal: abortRef.current.signal,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");

      setIsTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: data.reply, time: timestamp() }]);
      setShowSuggestions(true);

      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(data.reply);
        utt.rate = 1; utt.pitch = 1;
        utt.onstart = () => setIsSpeaking(true);
        utt.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utt);
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: err.message || "Something went wrong. Please try again.", time: timestamp(), isError: true }]);
      setShowSuggestions(true);
    }
  }, [input, isTyping, sessionId]);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Speech recognition not supported.");
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = "en-US"; rec.interimResults = false;
    rec.start(); setListening(true);
    new Audio("/start-beep.mp3").play().catch(() => { });
    rec.onresult = (e) => handleSend(e.results[0][0].transcript);
    rec.onerror = () => setListening(false);
    rec.onend = () => { setListening(false); new Audio("/end-beep.mp3").play().catch(() => { }); };
  };
  const stopListening = () => { recognitionRef.current?.stop(); setListening(false); };
  const stopSpeaking = () => { if ("speechSynthesis" in window) { speechSynthesis.cancel(); setIsSpeaking(false); } };

  const resetChat = async () => {
    setMessages([{ ...WELCOME_MSG, time: timestamp() }]);
    setShowSuggestions(true); setIsTyping(false);
    if (abortRef.current) abortRef.current.abort();
    try {
      await fetch(`${BACKEND_URL}/api/chat/session`, {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
    } catch { }
  };

  const retryLast = () => {
    const lastUser = [...messages].reverse().find((m) => m.from === "user");
    if (lastUser) { setMessages((prev) => prev.filter((m) => !m.isError)); handleSend(lastUser.text); }
  };

  const hasError = messages.some((m) => m.isError);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        /* ── FAB ── */
        .cb-fab-wrap {
          position: fixed;
          bottom: 28px;
          right: 24px;
          z-index: 9000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        /* Glassmorphic teaser card */
        .cb-teaser {
          display: flex;
          flex-direction: column;
          gap: 7px;
          padding: 14px 14px 10px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.13);
          background: rgba(15,15,15,0.72);
          backdrop-filter: blur(20px) saturate(1.6);
          -webkit-backdrop-filter: blur(20px) saturate(1.6);
          box-shadow:
            0 8px 32px rgba(0,0,0,0.55),
            0 0 0 1px rgba(23,207,220,0.08),
            inset 0 1px 0 rgba(255,255,255,0.07);
          width: 230px;
          position: relative;
        }

        .cb-teaser-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(23,207,220,0.7);
          margin-bottom: 2px;
        }

        .cb-teaser-q {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, transform 0.15s;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.74rem;
          font-weight: 500;
          color: rgba(255,255,255,0.82);
          text-align: left;
          width: 100%;
        }
        .cb-teaser-q:hover {
          background: rgba(23,207,220,0.1);
          border-color: rgba(23,207,220,0.28);
          color: #fff;
          transform: translateX(-2px);
        }
        .cb-teaser-q-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .cb-teaser-close {
          position: absolute;
          top: 10px; right: 10px;
          width: 22px; height: 22px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
          transition: background 0.18s, color 0.18s;
        }
        .cb-teaser-close:hover {
          background: rgba(242,30,167,0.15);
          color: rgb(242,30,167);
          border-color: rgba(242,30,167,0.25);
        }

        /* Connector line from teaser to FAB */
        .cb-teaser-tail {
          position: absolute;
          bottom: -8px; right: 22px;
          width: 0; height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 8px solid rgba(255,255,255,0.1);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        .cb-teaser-tail::after {
          content: '';
          position: absolute;
          bottom: 2px; left: -6px;
          width: 0; height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid rgba(15,15,15,0.9);
        }

        /* FAB button itself */
        .cb-fab {
          position: relative;
          width: 58px; height: 58px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
          outline: none;

          /* Multi-layer glow background */
          background: linear-gradient(135deg,
            rgb(23,207,220) 0%,
            rgb(18,160,172) 40%,
            rgb(15,100,180) 100%
          );
          box-shadow:
            0 0 0 0 rgba(23,207,220,0),
            0 4px 20px rgba(23,207,220,0.45),
            0 8px 40px rgba(23,207,220,0.2),
            0 2px 8px rgba(0,0,0,0.6);
        }
        .cb-fab:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow:
            0 0 0 8px rgba(23,207,220,0.08),
            0 6px 28px rgba(23,207,220,0.6),
            0 12px 50px rgba(23,207,220,0.25),
            0 2px 8px rgba(0,0,0,0.6);
        }
        .cb-fab:active { transform: scale(0.94); }

        /* Pulsing ring behind FAB */
        .cb-fab-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid rgba(23,207,220,0.35);
          animation: fab-ring 2.4s ease-out infinite;
          pointer-events: none;
        }
        .cb-fab-ring-2 {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid rgba(23,207,220,0.18);
          animation: fab-ring 2.4s ease-out infinite 0.8s;
          pointer-events: none;
        }
        @keyframes fab-ring {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* Robot icon inside FAB */
        .cb-fab-icon {
          font-size: 1.5rem;
          line-height: 1;
          filter: drop-shadow(0 1px 3px rgba(0,0,0,0.4));
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cb-fab:hover .cb-fab-icon { transform: rotate(-8deg) scale(1.15); }

        /* Dot badge */
        .cb-badge {
          position: absolute; top: -3px; right: -3px;
          width: 17px; height: 17px; border-radius: 50%;
          background: rgb(242,30,167);
          border: 2.5px solid #0a0a0a;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.5rem; font-weight: 800; color: #fff;
          animation: badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes badge-pop {
          0%   { transform: scale(0); }
          100% { transform: scale(1); }
        }

        /* ── Chat window ── */
        .cb-window {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 9001;
          display: flex; flex-direction: column;
          background: #0a0a0a; height: 100dvh; overflow: hidden;
        }
        @media (min-width: 640px) {
          .cb-window {
            bottom: 100px; right: 24px; left: auto;
            width: 390px; height: 590px;
            border-radius: 22px;
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(23,207,220,0.07);
          }
        }

        /* Messages */
        .cb-messages {
          flex: 1; overflow-y: auto; padding: 18px 14px;
          display: flex; flex-direction: column; gap: 13px;
          scroll-behavior: smooth;
        }
        .cb-messages::-webkit-scrollbar { width: 3px; }
        .cb-messages::-webkit-scrollbar-track { background: transparent; }
        .cb-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }

        /* Chips */
        .cb-chip {
          padding: 5px 12px; border-radius: 100px;
          border: 1px solid rgba(23,207,220,0.2);
          background: rgba(23,207,220,0.05);
          color: rgba(23,207,220,0.85);
          font-family: 'DM Sans', sans-serif; font-size: 0.7rem; font-weight: 500;
          cursor: pointer; white-space: nowrap;
          transition: background 0.18s, border-color 0.18s, color 0.18s;
        }
        .cb-chip:hover { background: rgba(23,207,220,0.13); border-color: rgba(23,207,220,0.45); color: #fff; }
        .cb-chip:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Input */
        .cb-input {
          flex: 1; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09); border-radius: 10px;
          padding: 10px 13px; font-family: 'DM Sans', sans-serif; font-size: 0.83rem;
          color: #fff; outline: none; transition: border-color 0.2s;
        }
        .cb-input::placeholder { color: rgba(255,255,255,0.28); }
        .cb-input:focus { border-color: rgba(23,207,220,0.38); }

        /* Send */
        .cb-send {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgb(23,207,220); color: #0a0a0a;
          border: none; cursor: pointer; transition: background 0.2s, transform 0.12s;
        }
        .cb-send:hover { background: #fff; transform: scale(1.06); }
        .cb-send:disabled { background: rgba(23,207,220,0.3); cursor: not-allowed; transform: none; }

        /* Voice */
        .cb-voice-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 13px; border-radius: 100px;
          font-family: 'DM Sans', sans-serif; font-size: 0.71rem; font-weight: 500;
          cursor: pointer; transition: all 0.2s; border: none;
        }
        .cb-voice-idle {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.6);
        }
        .cb-voice-idle:hover { background: rgba(255,255,255,0.09); color: #fff; }
        .cb-voice-active {
          background: rgba(242,30,167,0.14);
          border: 1px solid rgba(242,30,167,0.32);
          color: rgb(242,30,167);
          animation: mic-pulse 1.2s infinite;
        }
        .cb-mute-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 13px; border-radius: 100px;
          font-family: 'DM Sans', sans-serif; font-size: 0.71rem; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          background: rgba(242,30,167,0.1);
          border: 1px solid rgba(242,30,167,0.25);
          color: rgb(242,30,167);
        }
        .cb-mute-btn:hover { background: rgba(242,30,167,0.18); }
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(242,30,167,0.28); }
          50%       { box-shadow: 0 0 0 6px rgba(242,30,167,0); }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════════
           FAB WRAPPER — teaser card + button stacked vertically
      ════════════════════════════════════════════════════════════ */}
      <div className="cb-fab-wrap">

        {/* ── Glassmorphic teaser card ────────────────────────────── */}
        <AnimatePresence>
          {teaserVisible && !open && (
            <motion.div
              className="cb-teaser"
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.94 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Close button */}
              <button
                className="cb-teaser-close"
                onClick={dismissTeaser}
                aria-label="Dismiss"
              >
                <IconClose />
              </button>

              <p className="cb-teaser-label">Ask me anything</p>

              {/* Question pills */}
              {TEASER_QUESTIONS.map((q, i) => (
                <motion.button
                  key={i}
                  className="cb-teaser-q"
                  onClick={() => openChatFromTeaser(q.replace(/\s[\u{1F000}-\u{1FFFF}]|[\u{1F000}-\u{1FFFF}]/gu, "").trim())}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <div
                    className="cb-teaser-q-dot"
                    style={{
                      background: [C.cyan, C.pink, C.yellow][i],
                      boxShadow: `0 0 6px ${[C.cyan, C.pink, C.yellow][i]}`,
                    }}
                  />
                  {q}
                </motion.button>
              ))}

              {/* Arrow tail pointing down to FAB */}
              <div className="cb-teaser-tail" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FAB button ────────────────────────────────────────────── */}
        <div style={{ position: "relative" }}>
          {/* Pulsing rings (only when chat is closed) */}
          {!open && (
            <>
              <div className="cb-fab-ring" />
              <div className="cb-fab-ring-2" />
            </>
          )}

          <motion.button
            className="cb-fab"
            onClick={() => { setOpen(!open); setTeaserVisible(false); }}
            onMouseEnter={() => setFabHovered(true)}
            onMouseLeave={() => setFabHovered(false)}
            whileTap={{ scale: 0.9 }}
            aria-label={open ? "Close chat" : "Open STEM Inspires chat"}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="x"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: "#0a0a0a" }}
                >
                  <IconClose />
                </motion.div>
              ) : (
                <motion.div
                  key="bot"
                  initial={{ rotate: 30, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -30, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="cb-fab-icon"
                >
                  🤖
                </motion.div>
              )}
            </AnimatePresence>

            {/* Unread badge */}
            {!open && messages.length > 1 && (
              <div className="cb-badge">!</div>
            )}
          </motion.button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
           CHAT WINDOW
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="cb-window"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div style={{
              position: "relative", padding: "0 16px", height: 60, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderBottom: `1px solid ${C.border}`, background: C.surface,
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.cyan},${C.pink},${C.yellow})` }} />

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.cyan}, rgba(23,207,220,0.2))`,
                  border: `1px solid rgba(23,207,220,0.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem",
                }}>🤖</div>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.86rem", color: C.white, margin: 0, lineHeight: 1.3 }}>
                    STEM Inspires AI
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 6px ${C.cyan}` }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", color: C.muted }}>
                      {isTyping ? "Thinking…" : "Online · Powered by Groq"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  border: `1px solid ${C.border2}`, background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: C.muted, cursor: "pointer", transition: "all 0.18s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = C.white; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; }}
                aria-label="Close"
              >
                <IconClose />
              </button>
            </div>

            {/* Messages */}
            <div className="cb-messages">
              {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}

              {isTyping && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <Avatar isBot />
                  <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: "4px 14px 14px 14px" }}>
                    <TypingDots />
                  </div>
                </div>
              )}

              {hasError && !isTyping && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={retryLast}
                  style={{
                    alignSelf: "center", display: "flex", alignItems: "center", gap: 5,
                    padding: "5px 14px", borderRadius: 100,
                    background: "rgba(242,30,167,0.1)", border: "1px solid rgba(242,30,167,0.22)",
                    color: "rgb(242,30,167)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", cursor: "pointer",
                  }}
                >
                  <IconRefresh /> Retry
                </motion.button>
              )}

              <AnimatePresence>
                {showSuggestions && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }} transition={{ delay: 0.1 }}
                    style={{ marginTop: 2 }}
                  >
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", color: C.muted, textAlign: "center", marginBottom: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Suggested questions
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                      {QUICK_QUESTIONS.map((q, i) => (
                        <button key={i} className="cb-chip" onClick={() => handleSend(q)} disabled={isTyping}>{q}</button>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 7, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
                      {!listening
                        ? <button className="cb-voice-btn cb-voice-idle" onClick={startListening}><IconMic /> Speak</button>
                        : <button className="cb-voice-btn cb-voice-active" onClick={stopListening}><IconStop /> Listening…</button>
                      }
                      {isSpeaking && <button className="cb-mute-btn" onClick={stopSpeaking}><IconVolumeMute /> Mute</button>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div style={{ padding: "11px 13px", borderTop: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  ref={inputRef} className="cb-input" type="text"
                  value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask about FLL, donations, programs…"
                  disabled={isTyping}
                />
                <button className="cb-send" onClick={() => handleSend()} disabled={isTyping || !input.trim()} aria-label="Send">
                  <IconSend />
                </button>
              </div>
              <button
                onClick={resetChat}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  margin: "9px auto 0", background: "none", border: "none",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.66rem",
                  color: C.muted, cursor: "pointer", transition: "color 0.18s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.pink)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                <IconTrash /> Clear chat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}