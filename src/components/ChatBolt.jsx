// AdvancedChatBolt.jsx
// UI redesign: sleek dark glass panel — professional, brand-accented
// All logic (voice, TTS, API, localStorage, suggestions) preserved exactly

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getResponse } from "../utils/intents.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  yellow: "rgb(247,244,46)",
  cyan: "rgb(23,207,220)",
  pink: "rgb(242,30,167)",
  bg: "#0f0f0f",
  surface: "#1a1a1a",
  surface2: "#222222",
  border: "rgba(255,255,255,0.07)",
  border2: "rgba(255,255,255,0.12)",
  muted: "rgba(255,255,255,0.35)",
  body: "rgba(255,255,255,0.75)",
  white: "#ffffff",
};

// ─── Micro icons (SVG, no emoji) ──────────────────────────────────────────────
const IconChat = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconClose = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconSend = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
  </svg>
);
const IconMic = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
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
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 9-6 6M15 9l6 6M9 15l6-6M3 3l18 18" />
  </svg>
);
const IconTrash = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// ─── Typing indicator ─────────────────────────────────────────────────────────
const TypingDots = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "10px 14px",
    }}
  >
    {[C.yellow, C.cyan, C.pink].map((c, i) => (
      <motion.div
        key={i}
        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1, delay: i * 0.18 }}
        style={{ width: 7, height: 7, borderRadius: "50%", background: c }}
      />
    ))}
  </div>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ isBot }) => (
  <div
    style={{
      width: 30,
      height: 30,
      borderRadius: "50%",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: isBot
        ? `linear-gradient(135deg, ${C.cyan}, rgba(23,207,220,0.3))`
        : `linear-gradient(135deg, #333, #555)`,
      border: `1px solid ${isBot ? "rgba(23,207,220,0.3)" : C.border2}`,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.68rem",
      fontWeight: 700,
      color: C.white,
      letterSpacing: "0.02em",
    }}
  >
    {isBot ? "S" : "U"}
  </div>
);

// ─── Message bubble ───────────────────────────────────────────────────────────
const Bubble = ({ msg }) => {
  const isBot = msg.from === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      style={{
        display: "flex",
        flexDirection: isBot ? "row" : "row-reverse",
        alignItems: "flex-end",
        gap: 8,
      }}
    >
      <Avatar isBot={isBot} />
      <div
        style={{
          maxWidth: "72%",
          padding: "10px 14px",
          borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
          background: isBot
            ? C.surface2
            : `linear-gradient(135deg, ${C.cyan}, rgba(23,207,220,0.7))`,
          border: isBot ? `1px solid ${C.border}` : "none",
          boxShadow: isBot ? "none" : "0 2px 12px rgba(23,207,220,0.25)",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.83rem",
            lineHeight: 1.65,
            color: isBot ? C.body : C.bg,
            margin: 0,
          }}
        >
          {msg.text}
        </p>
        <span
          style={{
            display: "block",
            fontSize: "0.6rem",
            color: isBot ? C.muted : "rgba(0,0,0,0.35)",
            marginTop: 4,
            textAlign: "right",
          }}
        >
          {msg.time}
        </span>
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdvancedChatBolt() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("stemChatHistory");
    return saved
      ? JSON.parse(saved)
      : [
          {
            from: "bot",
            text: "Hi! I'm your STEM Inspires assistant. Choose a question below or ask me about robotics, donations, or our programs!",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  const quickQuestions = [
    "What is STEM Inspires?",
    "How can I donate?",
    "What is FIRST LEGO League?",
    "How do I start a team?",
    "Who are the founders?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem("stemChatHistory", JSON.stringify(messages));
  }, [messages]);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support speech recognition.");
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.start();
    setListening(true);
    new Audio("/start-beep.mp3").play().catch(() => {});
    recognition.onresult = (e) => {
      handleSend(e.results[0][0].transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => {
      setListening(false);
      new Audio("/end-beep.mp3").play().catch(() => {});
    };
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    setShowSuggestions(false);
    const userMsg = {
      from: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    let botReply;
    try {
      if (!navigator.onLine) throw new Error("Offline mode");
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      botReply = data.reply || getResponse(text);
    } catch {
      botReply = getResponse(text);
    }

    const delay = Math.min(1800, 400 + botReply.length * 25);
    setTimeout(() => {
      setIsTyping(false);
      const botMsg = {
        from: "bot",
        text: botReply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setShowSuggestions(true);
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(botReply);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    }, delay);
  };

  const resetChat = () => {
    localStorage.removeItem("stemChatHistory");
    setMessages([
      {
        from: "bot",
        text: "Chat cleared. I'm ready to help again!",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .cb-fab {
          position: fixed; bottom: 24px; right: 24px; z-index: 50;
          width: 52px; height: 52px; border-radius: 50%;
          border: 1px solid rgba(23,207,220,0.3);
          background: #0f0f0f;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgb(23,207,220);
          box-shadow: 0 0 0 0 rgba(23,207,220,0.4);
          animation: cb-pulse 2.5s infinite;
          transition: background 0.2s, border-color 0.2s;
        }
        .cb-fab:hover { background: #1a1a1a; border-color: rgba(23,207,220,0.6); }
        @keyframes cb-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(23,207,220,0.25); }
          50%       { box-shadow: 0 0 0 10px rgba(23,207,220,0); }
        }

        .cb-window {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 50;
          display: flex; flex-direction: column;
          background: #0f0f0f;
          height: 100dvh;
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .cb-window {
            bottom: 88px; right: 24px; left: auto;
            width: 380px; height: 560px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.09);
            box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(23,207,220,0.08);
          }
        }

        .cb-messages {
          flex: 1; overflow-y: auto;
          padding: 20px 16px;
          display: flex; flex-direction: column; gap: 14px;
          scroll-behavior: smooth;
        }
        .cb-messages::-webkit-scrollbar { width: 3px; }
        .cb-messages::-webkit-scrollbar-track { background: transparent; }
        .cb-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

        .cb-chip {
          padding: 6px 13px;
          border-radius: 100px;
          border: 1px solid rgba(23,207,220,0.25);
          background: rgba(23,207,220,0.06);
          color: rgb(23,207,220);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem; font-weight: 500;
          cursor: pointer; white-space: nowrap;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .cb-chip:hover {
          background: rgba(23,207,220,0.14);
          border-color: rgba(23,207,220,0.5);
          color: #fff;
        }

        .cb-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.83rem;
          color: #fff;
          outline: none;
          transition: border-color 0.2s;
        }
        .cb-input::placeholder { color: rgba(255,255,255,0.3); }
        .cb-input:focus { border-color: rgba(23,207,220,0.4); }

        .cb-send {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgb(23,207,220); color: #0f0f0f;
          border: none; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .cb-send:hover { background: #fff; transform: scale(1.05); }

        .cb-voice-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 100px;
          font-family: 'DM Sans', sans-serif; font-size: 0.73rem; font-weight: 500;
          cursor: pointer; transition: all 0.2s; border: none;
        }
        .cb-voice-btn.idle {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
        }
        .cb-voice-btn.idle:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .cb-voice-btn.active {
          background: rgba(242,30,167,0.15);
          border: 1px solid rgba(242,30,167,0.35);
          color: rgb(242,30,167);
          animation: cb-mic-pulse 1.2s infinite;
        }
        @keyframes cb-mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(242,30,167,0.3); }
          50%       { box-shadow: 0 0 0 6px rgba(242,30,167,0); }
        }
        .cb-mute-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 100px;
          font-family: 'DM Sans', sans-serif; font-size: 0.73rem; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          background: rgba(242,30,167,0.12);
          border: 1px solid rgba(242,30,167,0.3);
          color: rgb(242,30,167);
        }
        .cb-mute-btn:hover { background: rgba(242,30,167,0.2); }
      `}</style>

      {/* ── Floating button ── */}
      <motion.button
        className="cb-fab"
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.92 }}
        aria-label="Open chat"
      >
        <IconChat />
      </motion.button>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="cb-window"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ── Header ── */}
            <div
              style={{
                padding: "0 16px",
                height: 60,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `1px solid ${C.border}`,
                background: C.surface,
              }}
            >
              {/* Brand strip */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, ${C.cyan}, ${C.pink}, ${C.yellow})`,
                }}
              />

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Bot avatar */}
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.cyan}, rgba(23,207,220,0.25))`,
                    border: `1px solid rgba(23,207,220,0.3)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: C.white,
                  }}
                >
                  S
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      color: C.white,
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    STEM Inspires Bot
                  </p>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.cyan,
                        boxShadow: `0 0 6px ${C.cyan}`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.65rem",
                        color: C.muted,
                      }}
                    >
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: `1px solid ${C.border2}`,
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.muted,
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = C.white;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = C.muted;
                }}
              >
                <IconClose />
              </button>
            </div>

            {/* ── Messages ── */}
            <div className="cb-messages">
              {messages.map((msg, i) => (
                <Bubble key={i} msg={msg} />
              ))}

              {isTyping && (
                <div
                  style={{ display: "flex", alignItems: "flex-end", gap: 8 }}
                >
                  <Avatar isBot />
                  <div
                    style={{
                      background: C.surface2,
                      border: `1px solid ${C.border}`,
                      borderRadius: "4px 16px 16px 16px",
                    }}
                  >
                    <TypingDots />
                  </div>
                </div>
              )}

              {/* Quick suggestions */}
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{ marginTop: 4 }}
                >
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.65rem",
                      color: C.muted,
                      textAlign: "center",
                      marginBottom: 10,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Suggested questions
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 7,
                      justifyContent: "center",
                    }}
                  >
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        className="cb-chip"
                        onClick={() => handleSend(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Voice controls */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      marginTop: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    {!listening ? (
                      <button
                        className="cb-voice-btn idle"
                        onClick={startListening}
                      >
                        <IconMic /> Speak
                      </button>
                    ) : (
                      <button
                        className="cb-voice-btn active"
                        onClick={stopListening}
                      >
                        <IconStop /> Listening…
                      </button>
                    )}
                    {isSpeaking && (
                      <button className="cb-mute-btn" onClick={stopSpeaking}>
                        <IconVolumeMute /> Mute
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input bar ── */}
            <div
              style={{
                padding: "12px 14px",
                borderTop: `1px solid ${C.border}`,
                background: C.surface,
                flexShrink: 0,
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                <input
                  ref={inputRef}
                  className="cb-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about FLL, donations, or programs…"
                />
                <button type="submit" className="cb-send" aria-label="Send">
                  <IconSend />
                </button>
              </form>

              <button
                onClick={resetChat}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  margin: "10px auto 0",
                  background: "none",
                  border: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.68rem",
                  color: C.muted,
                  cursor: "pointer",
                  transition: "color 0.2s",
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
