// TestimonialsCards.jsx
// Redesigned: Editorial / Magazine aesthetic — mobile-first
// Palette: Ivory bg, Forest Green anchor, Gold accent

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Design tokens ──────────────────────────────────────────────────────────
const tokens = {
  bg: "#F9F7F4",
  bgCard: "#FFFFFF",
  green: "#1A3A2F",
  greenLight: "#2D5C47",
  gold: "#C9A84C",
  goldLight: "#E8C97A",
  textPrimary: "#1A1A1A",
  textSecondary: "#5A5A5A",
  border: "#E8E3DC",
  shadow: "0 2px 24px rgba(26,58,47,0.08), 0 1px 4px rgba(26,58,47,0.04)",
  shadowHover: "0 12px 40px rgba(26,58,47,0.14), 0 2px 8px rgba(26,58,47,0.08)",
};

// ─── Big decorative quote mark ───────────────────────────────────────────────
const QuoteMark = () => (
  <svg
    aria-hidden="true"
    width="64"
    height="48"
    viewBox="0 0 64 48"
    fill="none"
    style={{ position: "absolute", top: 20, left: 20, opacity: 0.07 }}
  >
    <path
      d="M0 48V28.8C0 12.96 9.6 3.84 28.8 0L32 6.4C22.08 8.32 16.32 13.44 14.4 21.6H24V48H0ZM40 48V28.8C40 12.96 49.6 3.84 68.8 0L72 6.4C62.08 8.32 56.32 13.44 54.4 21.6H64V48H40Z"
      fill={tokens.green}
    />
  </svg>
);

// ─── Star rating ─────────────────────────────────────────────────────────────
const Stars = ({ count = 5 }) => (
  <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill={i < count ? tokens.gold : tokens.border}
      >
        <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.635l3.455-.505L7 1z" />
      </svg>
    ))}
  </div>
);

// ─── Avatar initials ─────────────────────────────────────────────────────────
const Avatar = ({ name, borderColor }) => {
  const initials = (name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${tokens.green}, ${tokens.greenLight})`,
        border: `2px solid ${borderColor || tokens.gold}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 15,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        letterSpacing: "0.04em",
      }}
    >
      {initials}
    </div>
  );
};

// ─── Single testimonial card ─────────────────────────────────────────────────
const TestimonialCard = ({ t, index }) => {
  const accentColor = t.borderColor || tokens.gold;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
        boxShadow: tokens.shadowHover,
        transition: { duration: 0.25 },
      }}
      style={{
        position: "relative",
        background: tokens.bgCard,
        borderRadius: 20,
        padding: "32px 28px 28px",
        boxShadow: tokens.shadow,
        borderTop: `3px solid ${accentColor}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <QuoteMark />

      <Stars count={t.stars ?? 5} />

      <p
        style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: "1rem",
          lineHeight: 1.75,
          color: tokens.textPrimary,
          margin: "0 0 24px",
          flexGrow: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        {t.text || "No testimonial text provided."}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingTop: 20,
          borderTop: `1px solid ${tokens.border}`,
        }}
      >
        <Avatar name={t.name} borderColor={accentColor} />
        <div>
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: tokens.green,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {t.name || "Anonymous"}
          </p>
          {t.role && (
            <p
              style={{
                fontSize: "0.78rem",
                color: tokens.textSecondary,
                margin: "3px 0 0",
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {t.role}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
};

// ─── Mobile dot carousel ──────────────────────────────────────────────────────
const MobileCarousel = ({ testimonials }) => {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);

  const prev = () =>
    setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div
      style={{ width: "100%", overflow: "hidden", paddingBottom: 8 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div style={{ position: "relative", minHeight: 320 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ padding: "0 4px" }}
          >
            <TestimonialCard t={testimonials[active]} index={0} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots + arrows */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          marginTop: 20,
        }}
      >
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `1.5px solid ${tokens.green}`,
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: tokens.green,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = tokens.green + "15")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L5 7l4 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div style={{ display: "flex", gap: 6 }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{
                width: i === active ? 20 : 8,
                height: 8,
                borderRadius: 4,
                background: i === active ? tokens.green : tokens.border,
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next testimonial"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `1.5px solid ${tokens.green}`,
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: tokens.green,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = tokens.green + "15")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M5 2l4 5-4 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    style={{ textAlign: "center", marginBottom: 56 }}
  >
    <span
      style={{
        display: "inline-block",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: tokens.gold,
        background: tokens.green + "0D",
        border: `1px solid ${tokens.gold}40`,
        borderRadius: 100,
        padding: "5px 14px",
        marginBottom: 20,
      }}
    >
      Testimonials
    </span>
    <h2
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(2rem, 5vw, 3.25rem)",
        fontWeight: 800,
        color: tokens.green,
        margin: 0,
        lineHeight: 1.15,
        letterSpacing: "-0.02em",
      }}
    >
      What People Say
      <br />
      <span
        style={{
          fontStyle: "italic",
          fontWeight: 400,
          color: tokens.textSecondary,
          fontSize: "0.85em",
        }}
      >
        about STEM Inspires
      </span>
    </h2>
    <div
      style={{
        width: 48,
        height: 3,
        background: `linear-gradient(90deg, ${tokens.gold}, ${tokens.goldLight})`,
        borderRadius: 2,
        margin: "20px auto 0",
      }}
    />
  </motion.div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <section
    style={{
      background: tokens.bg,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 280,
      padding: "64px 24px",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        style={{ margin: "0 auto 16px" }}
      >
        <circle
          cx="20"
          cy="20"
          r="19"
          stroke={tokens.border}
          strokeWidth="1.5"
        />
        <path
          d="M13 20h14M20 13v14"
          stroke={tokens.border}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <p
        style={{
          fontFamily: "'Lora', Georgia, serif",
          color: tokens.textSecondary,
          fontSize: "1rem",
          margin: 0,
        }}
      >
        No testimonials available yet.
      </p>
    </div>
  </section>
);

// ─── Main component ───────────────────────────────────────────────────────────
const TestimonialsCards = ({ testimonials = [] }) => {
  if (testimonials.length === 0) return <EmptyState />;

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400&family=Lora:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');

        .testimonials-grid {
          display: none;
        }

        @media (min-width: 768px) {
          .testimonials-mobile { display: none !important; }
          .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        @media (min-width: 1100px) {
          .testimonials-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      <section
        style={{
          background: tokens.bg,
          backgroundImage: `
            radial-gradient(circle at 20% 10%, ${tokens.green}06 0%, transparent 50%),
            radial-gradient(circle at 80% 90%, ${tokens.gold}08 0%, transparent 50%)
          `,
          padding: "80px 0 96px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grain overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "0 20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <SectionHeader />

          {/* Mobile */}
          <div className="testimonials-mobile">
            <MobileCarousel testimonials={testimonials} />
          </div>

          {/* Tablet + Desktop grid */}
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={t._id || `${t.name}-${i}`}
                t={t}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsCards;
