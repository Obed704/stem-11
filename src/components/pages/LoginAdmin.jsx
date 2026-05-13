import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const C = {
  cyan: "#17CFDC",
  pink: "#F21EA7",
  yellow: "#F7F42E",
  slate: "#0f172a",
};

// ─────────────────────────────────────────────────────────────
// ENHANCED PARTICLE CONSTELLATION BACKGROUND - MANY STARS & VISIBLE LINES
// ─────────────────────────────────────────────────────────────
function ParticleBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    // --- MANY STARS (increased particle count for rich constellation) ---
    const PARTICLE_COUNT = 220;        // Many stars
    const CONNECTION_DISTANCE = 210;   // Longer connections for dense web
    const MAX_SPEED = 0.55;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      // Slight color variety: mostly cyan/pink, some yellow
      let color;
      const rand = Math.random();
      if (rand < 0.6) color = C.cyan;
      else if (rand < 0.85) color = C.pink;
      else color = C.yellow;

      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * MAX_SPEED,
        vy: (Math.random() - 0.5) * MAX_SPEED,
        radius: Math.random() * 2.4 + 0.8,    // Slightly larger stars
        color: color,
        glowSize: Math.random() * 8 + 6,
        twinkle: Math.random() * Math.PI * 2,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Update particles with mouse repulsion
      particles.forEach((p) => {
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0) {
          const force = 0.028;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.987;
        p.vy *= 0.987;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Tiny twinkle phase update
        p.twinkle += 0.02;
      });

      // 2. DRAW CONNECTING LINES (enhanced visibility)
      ctx.lineWidth = 1.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            // More visible opacity: base 0.38, fading with distance, with slight color variation
            let opacity = 0.38 * (1 - dist / CONNECTION_DISTANCE);
            // Make lines between same color stars slightly brighter
            if (a.color === b.color) opacity += 0.08;
            opacity = Math.min(opacity, 0.65);

            // Use cyan as default line color, but mix pink for variation
            const lineColor = (a.color === C.pink || b.color === C.pink)
              ? `rgba(242, 30, 167, ${opacity * 0.9})`
              : `rgba(23, 207, 220, ${opacity})`;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = lineColor;
            ctx.stroke();
          }
        }
      }

      // 3. DRAW STARS with strong glow & twinkle effect
      particles.forEach((p) => {
        const twinkleFactor = 0.7 + Math.sin(p.twinkle) * 0.3;
        const radius = p.radius;
        const glowR = p.glowSize * twinkleFactor;

        // Outer glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        gradient.addColorStop(0, p.color + "CC");
        gradient.addColorStop(0.5, p.color + "55");
        gradient.addColorStop(1, p.color + "00");
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core star
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Tiny specular highlight for some stars
        if (radius > 1.6) {
          ctx.beginPath();
          ctx.arc(p.x - 1, p.y - 1, radius * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.fill();
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        display: "block",
      }}
    />
  );
}

// Loading screen component (unchanged but polished)
function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: `3px solid rgba(23,207,220,0.2)`,
            borderTop: `3px solid ${C.cyan}`,
            margin: "0 auto",
          }}
        />
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          style={{
            marginTop: 18,
            color: "rgba(255,255,255,0.7)",
            fontSize: 13,
            letterSpacing: "0.08em",
          }}
        >
          Loading Dashboard...
        </motion.p>
      </div>
    </motion.div>
  );
}

// Custom input with glow effect
function Input({ label, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          border: `1px solid ${focused ? "rgba(23,207,220,0.85)" : "rgba(255,255,255,0.1)"}`,
          boxShadow: focused ? `0 0 18px rgba(23,207,220,0.35)` : "none",
          transition: "0.25s",
          pointerEvents: "none",
        }}
      />
      <input
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          height: 54,
          borderRadius: 999,
          border: "none",
          outline: "none",
          background: "rgba(255,255,255,0.04)",
          padding: "0 22px",
          color: "#fff",
          fontSize: 14,
          backdropFilter: "blur(8px)",
          boxSizing: "border-box",
          fontFamily: "'Inter', sans-serif",
        }}
      />
    </div>
  );
}

// Spinner component for loading state on buttons
function ButtonSpinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        animation: "spin 0.7s linear infinite",
        marginRight: 8,
        verticalAlign: "middle",
      }}
    />
  );
}

// Inject keyframes for spinner
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

// ─────────────────────────────────────────────────────────────
// MAIN ADMIN LOGIN - WITH VISIBLE LOADING STATES
// ─────────────────────────────────────────────────────────────
export default function AdminLogin() {
  const { login, verifyCode, resendCode, loading, emailSent, adminEmail } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loadingDash, setLoadingDash] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  useEffect(() => {
    setError("");
    setSuccess("");
    setCode("");
  }, [emailSent]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email, password);
    if (!res.success) return setError(res.message);
    if (res.requiresTwoFactor) {
      setSuccess("Verification code sent to your email");
    } else {
      triggerDashboard();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return setError("Please enter a valid 6-digit code");
    const res = await verifyCode(code);
    if (!res.success) return setError(res.message);
    triggerDashboard();
  };

  const triggerDashboard = () => {
    setLoadingDash(true);
    setTimeout(() => navigate("/admin-dashboard"), 1800);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    const res = await resendCode();
    if (res.success) {
      setSuccess("New verification code sent");
      setCountdown(60);
    } else setError(res.message);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <ParticleBackground />

      {/* Ambient Glows */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.cyan}18 0%, transparent 70%)`,
          top: -200,
          left: -200,
          filter: "blur(40px)",
          zIndex: 1,
        }}
      />
      <motion.div
        animate={{ x: [0, -70, 0], y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.pink}18 0%, transparent 70%)`,
          bottom: -200,
          right: -200,
          filter: "blur(40px)",
          zIndex: 1,
        }}
      />

      <AnimatePresence>{loadingDash && <LoadingScreen />}</AnimatePresence>

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "90%",
          maxWidth: 980,
          minHeight: 560,
          position: "relative",
          zIndex: 10,
          display: "flex",
          clipPath: "polygon(4% 0%, 100% 0%, 96% 100%, 0% 100%)",
          border: `1px solid ${C.cyan}`,
          background: "rgba(2,6,23,0.85)",
          backdropFilter: "blur(16px)",
          boxShadow: `0 0 40px rgba(23,207,220,0.3), inset 0 0 30px rgba(23,207,220,0.05)`,
          overflow: "hidden",
        }}
      >
        {/* Glowing Border overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: `1px solid ${C.cyan}70`,
            pointerEvents: "none",
            boxShadow: `0 0 28px ${C.cyan}60`,
          }}
        />

        {/* LEFT SIDE - Branding (unchanged) */}
        <div
          style={{
            width: "52%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: `linear-gradient(135deg, rgba(23,207,220,0.35), rgba(23,207,220,0.05))`,
            clipPath: "polygon(0 0, 78% 0, 58% 100%, 0% 100%)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.05), transparent 60%)" }} />
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ position: "relative", zIndex: 2, paddingLeft: 60, paddingRight: 120 }}
          >
            <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, color: "#ffffff", letterSpacing: "-0.04em" }}>
              WELCOME
            </div>
            <div style={{ marginTop: 20, width: 80, height: 4, borderRadius: 999, background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})` }} />
            <p style={{ marginTop: 26, color: "rgba(255,255,255,0.78)", fontSize: 15, lineHeight: 1.7, maxWidth: 320 }}>
              Secure STEM administrative access portal with futuristic authentication architecture.
            </p>
            <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 12 }}>
              {["Constellation Security", "2FA Authentication", "AI Protected Access"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 14px ${C.cyan}` }} />
                  <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, letterSpacing: "0.04em" }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE - Login / 2FA Forms with loading indicator on buttons */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "60px 50px" }}>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} style={{ width: "100%", maxWidth: 360 }}>
            <AnimatePresence mode="wait">
              {!emailSent ? (
                <motion.div key="login">
                  <div style={{ color: "#fff", fontSize: 34, fontWeight: 700, marginBottom: 8 }}>Login</div>
                  <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 34 }}>
                    Enter your credentials to continue
                  </div>
                  <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.7)", marginBottom: 10, fontSize: 13 }}>Email</div>
                      <Input type="email" placeholder="admin@stem.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.7)", marginBottom: 10, fontSize: 13 }}>Password</div>
                      <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    {/* LOGIN BUTTON with enhanced loading state */}
                    <motion.button
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      disabled={loading}
                      type="submit"
                      style={{
                        marginTop: 10,
                        height: 54,
                        borderRadius: 999,
                        border: "none",
                        cursor: loading ? "default" : "pointer",
                        background: loading
                          ? "rgba(23,207,220,0.25)"
                          : `linear-gradient(135deg, ${C.cyan}, ${C.pink})`,
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        boxShadow: loading
                          ? "none"
                          : `0 0 28px rgba(23,207,220,0.5)`,
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {loading ? (
                        <>
                          <ButtonSpinner />
                          <span>AUTHENTICATING...</span>
                        </>
                      ) : (
                        "LOGIN"
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="verify">
                  <div style={{ color: "#fff", fontSize: 34, fontWeight: 700, marginBottom: 8 }}>Verify Email</div>
                  <p style={{ color: "#aaa", marginBottom: 24 }}>
                    Enter the 6-digit code sent to <strong style={{ color: C.cyan }}>{adminEmail}</strong>
                  </p>
                  <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                    <Input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      style={{ textAlign: "center", letterSpacing: "0.5em", fontSize: 18 }}
                    />

                    {/* VERIFY BUTTON with loading state */}
                    <motion.button
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      disabled={loading}
                      type="submit"
                      style={{
                        marginTop: 10,
                        height: 54,
                        borderRadius: 999,
                        border: "none",
                        cursor: loading ? "default" : "pointer",
                        background: loading
                          ? "rgba(23,207,220,0.25)"
                          : `linear-gradient(135deg, ${C.cyan}, ${C.pink})`,
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        boxShadow: loading
                          ? "none"
                          : `0 0 28px rgba(23,207,220,0.5)`,
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {loading ? (
                        <>
                          <ButtonSpinner />
                          <span>VERIFYING...</span>
                        </>
                      ) : (
                        "VERIFY CODE"
                      )}
                    </motion.button>
                  </form>
                  <p onClick={handleResend} style={{ color: countdown > 0 ? "#555" : C.cyan, cursor: countdown > 0 ? "not-allowed" : "pointer", textAlign: "center", marginTop: 20, fontSize: 13 }}>
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12, background: "rgba(242,30,167,0.1)", border: "1px solid rgba(242,30,167,0.3)", color: "#f9a8d4", fontSize: 13 }}>
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12, background: "rgba(23,207,220,0.1)", border: `1px solid ${C.cyan}50`, color: C.cyan, fontSize: 13 }}>
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ marginTop: 24, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
              STEM INSPIRE ADMIN PORTAL
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}