// SupportCards.jsx  (was GetInvolved)
// Redesigned: white-native, mobile-first, brand palette applied precisely
// Pink = primary action | Cyan = highlight/data | Yellow = warm accent

import React from "react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  pink: "#f21ea7",
  pinkSoft: "#fde8f6",
  pinkBorder: "rgba(242,30,167,0.2)",
  cyan: "rgb(23,207,220)",
  cyanSoft: "rgba(23,207,220,0.08)",
  cyanBorder: "rgba(23,207,220,0.35)",
  yellow: "rgb(247,244,46)",
  yellowSoft: "rgba(247,244,46,0.15)",
  ink: "#0f0f0f",
  muted: "#6b7280",
  border: "#efefef",
  white: "#ffffff",
};

// ─── Eyebrow pill ─────────────────────────────────────────────────────────────
const Pill = ({ children, color = C.pink, bg = C.pinkSoft }) => (
  <span
    style={{
      display: "inline-block",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.62rem",
      fontWeight: 600,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color,
      background: bg,
      border: `1px solid ${color}30`,
      borderRadius: 100,
      padding: "4px 12px",
    }}
  >
    {children}
  </span>
);

// ─── Support card ─────────────────────────────────────────────────────────────
const SupportCard = ({ card, idx }) => {
  const imgSrc = card.image?.startsWith("http")
    ? card.image
    : `${BACKEND_URL}${card.image?.startsWith("/") ? "" : "/"}${
        card.image || "images/placeholder-support.jpg"
      }`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: idx * 0.09,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover="hovered"
      style={{
        background: C.white,
        borderRadius: 20,
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.04)",
        padding: "36px 28px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Cyan top accent bar — animates in on hover */}
      <motion.div
        variants={{
          hovered: { scaleX: 1 },
          initial: { scaleX: 0 },
        }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`,
          transformOrigin: "left",
          borderRadius: "20px 20px 0 0",
        }}
      />

      {/* Yellow dot — decorative top-right */}
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: C.yellow,
        }}
      />

      {/* Avatar image */}
      <motion.div
        variants={{
          hovered: { boxShadow: `0 0 0 4px ${C.cyan}` },
        }}
        transition={{ duration: 0.25 }}
        style={{
          width: 88,
          height: 88,
          borderRadius: "50%",
          overflow: "hidden",
          border: `3px solid ${C.border}`,
          marginBottom: 20,
          flexShrink: 0,
          transition: "box-shadow 0.25s ease",
        }}
      >
        <img
          src={imgSrc}
          alt={card.alt || card.title || "Support option"}
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder-support.jpg";
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </motion.div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "1.15rem",
          fontWeight: 800,
          color: C.ink,
          margin: "0 0 10px",
          lineHeight: 1.25,
          letterSpacing: "-0.01em",
        }}
      >
        {card.title || "Support Opportunity"}
      </h3>

      {/* Cyan divider */}
      <div
        style={{
          width: 28,
          height: 2,
          background: C.cyan,
          borderRadius: 2,
          margin: "0 auto 14px",
          opacity: 0.7,
        }}
      />

      {/* Description */}
      <p
        style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: "0.87rem",
          lineHeight: 1.75,
          color: C.muted,
          margin: "0 0 22px",
          flexGrow: 1,
        }}
      >
        {card.description || "No description provided."}{" "}
        {card.linkText && (
          <a
            href={`/contact?subject=${encodeURIComponent(card.title || "Support Inquiry")}`}
            style={{
              color: C.pink,
              fontWeight: 600,
              textDecoration: "none",
              borderBottom: `1px solid ${C.pinkBorder}`,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.cyan)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.pink)}
          >
            {card.linkText}
          </a>
        )}
      </p>

      {/* Subtle pill tag */}
      <Pill color={C.cyan} bg={C.cyanSoft}>
        Collaborate
      </Pill>
    </motion.article>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div
    style={{
      gridColumn: "1 / -1",
      textAlign: "center",
      padding: "64px 24px",
      color: C.muted,
      fontFamily: "'Lora', Georgia, serif",
      fontSize: "0.95rem",
    }}
  >
    No support options available at the moment.
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const GetInvolved = ({ supportCards = [] }) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,800;1,700&family=Lora:wght@400&family=DM+Sans:wght@500;600&display=swap');

      .support-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
      }
      @media (min-width: 600px) {
        .support-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (min-width: 960px) {
        .support-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      }
    `}</style>

    <section
      id="involved"
      style={{
        background: C.white,
        padding: "88px 20px 100px",
        position: "relative",
      }}
    >
      {/* Hairline top rule */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "8%",
          right: "8%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.border} 25%, ${C.border} 75%, transparent)`,
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          marginBottom: 60,
          maxWidth: 620,
          margin: "0 auto 60px",
        }}
      >
        <Pill>How to contribute</Pill>

        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: C.ink,
            margin: "16px 0 0",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
          }}
        >
          <span style={{ color: C.pink }}>Support</span>{" "}
          <span
            style={{
              fontStyle: "italic",
              fontWeight: 700,
              color: C.ink,
              WebkitTextStroke: `1.5px ${C.cyan}`,
            }}
          >
            STEM Inspires
          </span>
        </h1>

        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.97rem",
            lineHeight: 1.72,
            color: C.muted,
            margin: "20px auto 0",
            maxWidth: 480,
          }}
        >
          Collaboration is at the heart of STEM Inspires. Here's how you can
          contribute:
        </p>

        {/* Cyan/pink gradient rule */}
        <div
          style={{
            width: 44,
            height: 3,
            background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`,
            borderRadius: 2,
            margin: "24px auto 0",
          }}
        />
      </motion.div>

      {/* Cards grid */}
      <div
        className="support-grid"
        style={{ maxWidth: 1080, margin: "0 auto" }}
      >
        {supportCards.length === 0 ? (
          <EmptyState />
        ) : (
          supportCards.map((card, idx) => (
            <SupportCard key={card._id || idx} card={card} idx={idx} />
          ))
        )}
      </div>
    </section>
  </>
);

export default GetInvolved;
