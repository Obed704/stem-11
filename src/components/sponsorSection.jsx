// SponsorsSection.jsx
// Redesigned: white-native, brand palette, mobile-first
// Pink = primary | Cyan = highlight | Yellow = accent | White = base

import React from "react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  pink: "#f21ea7",
  pinkSoft: "rgba(242,30,167,0.08)",
  cyan: "rgb(23,207,220)",
  cyanSoft: "rgba(23,207,220,0.08)",
  yellow: "rgb(247,244,46)",
  white: "#ffffff",
  ink: "#0f0f0f",
  muted: "#6b7280",
  border: "#efefef",
};

// Each sponsor card gets one of these overlay accents on hover
const OVERLAYS = [
  { from: C.pink, to: "#c01280" },
  { from: C.cyan, to: "#0fa8b8" },
  { from: "#f21ea7", to: "rgb(23,207,220)" }, // pink→cyan diagonal
  { from: C.cyan, to: C.pink },
  { from: "#9b19f5", to: C.pink },
];

const SponsorCard = ({ sponsor, idx }) => {
  const overlay = OVERLAYS[idx % OVERLAYS.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.5,
        delay: idx * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover="hovered"
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        background: C.white,
        aspectRatio: "1 / 1",
        cursor: "pointer",
      }}
    >
      {/* Logo image */}
      <img
        src={sponsor.img}
        alt={sponsor.name || "Sponsor"}
        onError={(e) => {
          e.currentTarget.src = "/images/placeholder-sponsor.png";
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          padding: 16,
          display: "block",
          transition: "opacity 0.3s",
        }}
      />

      {/* Hover overlay */}
      <motion.div
        variants={{
          hovered: { opacity: 1 },
          initial: { opacity: 0 },
        }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${overlay.from}, ${overlay.to})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 10px",
          textAlign: "center",
          gap: 6,
        }}
      >
        {/* Yellow dot accent */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: C.yellow,
            marginBottom: 2,
          }}
        />

        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize: "clamp(0.7rem, 1.8vw, 0.95rem)",
            color: "#fff",
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            wordBreak: "break-word",
          }}
        >
          {sponsor.name || "Sponsor"}
        </p>

        {sponsor.description && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(0.6rem, 1.2vw, 0.72rem)",
              color: "rgba(255,255,255,0.88)",
              margin: 0,
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
          >
            {sponsor.description}
          </p>
        )}
      </motion.div>
    </motion.article>
  );
};

const SponsorsSection = ({ sponsors: rawSponsors = [] }) => {
  const formattedSponsors = rawSponsors.map((sponsor) => ({
    ...sponsor,
    img: `${BACKEND_URL}${sponsor.img?.startsWith("/") ? "" : "/"}${sponsor.img}`,
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@800&family=DM+Sans:wght@400;500;600&display=swap');

        .sp-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        @media (min-width: 500px) {
          .sp-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
        }
        @media (min-width: 768px) {
          .sp-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 16px; }
        }
        @media (min-width: 1024px) {
          .sp-grid { grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 16px; }
        }
      `}</style>

      <section
        style={{
          background: C.white,
          padding: "80px 20px 96px",
          position: "relative",
        }}
      >
        {/* Top hairline */}
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
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          {/* Eyebrow pill */}
          <span
            style={{
              display: "inline-block",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.pink,
              background: C.pinkSoft,
              border: `1px solid ${C.pink}28`,
              borderRadius: 100,
              padding: "4px 13px",
              marginBottom: 14,
            }}
          >
            Partners &amp; Sponsors
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.9rem, 4.5vw, 2.9rem)",
              fontWeight: 800,
              color: C.ink,
              margin: "0 0 14px",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            Our <span style={{ color: C.pink }}>Sponsors</span>
          </h2>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.93rem",
              lineHeight: 1.7,
              color: C.muted,
              margin: "0 auto",
              maxWidth: 440,
            }}
          >
            These organisations make STEM Inspires possible. Hover to learn
            more.
          </p>

          {/* Gradient rule */}
          <div
            style={{
              width: 44,
              height: 3,
              background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`,
              borderRadius: 2,
              margin: "22px auto 0",
            }}
          />
        </motion.div>

        {/* Grid */}
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          {formattedSponsors.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                padding: "48px 0",
                fontFamily: "'DM Sans', sans-serif",
                color: C.muted,
                fontSize: "0.95rem",
              }}
            >
              No sponsors available at the moment.
            </p>
          ) : (
            <div className="sp-grid">
              {formattedSponsors.map((sponsor, idx) => (
                <SponsorCard
                  key={sponsor._id || idx}
                  sponsor={sponsor}
                  idx={idx}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom cyan accent line */}
        <div
          aria-hidden
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            marginTop: 52,
          }}
        >
          {[C.cyan, C.pink, C.yellow].map((c, i) => (
            <div
              key={i}
              style={{
                width: i === 1 ? 28 : 8,
                height: 3,
                background: c,
                borderRadius: 2,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default SponsorsSection;
