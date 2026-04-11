// GetInvolved.jsx
// Redesigned: Editorial / refined — white-native, mobile-first
// Accent: brand pink #f21ea7 used as a sharp typographic accent only
// Layout: stacked mobile → alternating magazine spread on desktop

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ─── Design tokens ────────────────────────────────────────────────────────────
const PINK = "#f21ea7";
const PINK_SOFT = "#fde8f6";
const INK = "#111111";
const MUTED = "#6b7280";
const BORDER = "#f0f0f0";

// ─── Pill label ───────────────────────────────────────────────────────────────
const EyebrowPill = ({ children }) => (
  <span
    style={{
      display: "inline-block",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.65rem",
      fontWeight: 600,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: PINK,
      background: PINK_SOFT,
      border: `1px solid ${PINK}30`,
      borderRadius: 100,
      padding: "4px 13px",
      marginBottom: 14,
    }}
  >
    {children}
  </span>
);

// ─── Individual card — alternating magazine layout on desktop ─────────────────
const InvolvementCard = ({ item, idx }) => {
  const isEven = idx % 2 === 0;
  const imgSrc = `${BACKEND_URL}${item.img?.startsWith("/") ? "" : "/"}${item.img}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${BORDER}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
      }}
    >
      {/* ── Mobile: stacked. Desktop: side-by-side (alternating) ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        className="gi-card-inner"
        data-reverse={!isEven}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
          className="gi-image-wrap"
        >
          <motion.img
            src={imgSrc}
            alt={item.title || "Get Involved"}
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder-involvement.jpg";
            }}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Pink accent bar bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${PINK}, #ff79cc)`,
            }}
          />
        </div>

        {/* Text content */}
        <div
          style={{
            padding: "36px 32px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          className="gi-text-wrap"
        >
          <EyebrowPill>Get Involved</EyebrowPill>

          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.4rem, 3vw, 1.85rem)",
              fontWeight: 800,
              color: INK,
              margin: "0 0 14px",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {item.title || "Opportunity"}
          </h3>

          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.93rem",
              lineHeight: 1.78,
              color: MUTED,
              margin: "0 0 28px",
            }}
          >
            {item.description || "No description available."}
          </p>

          {item.buttonLink && item.buttonText && (
            <div>
              <Link
                to={item.buttonLink}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 26px",
                  borderRadius: 100,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  color: "#fff",
                  backgroundColor: item.buttonColor || PINK,
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: `0 4px 14px ${item.buttonColor || PINK}44`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${item.buttonColor || PINK}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = `0 4px 14px ${item.buttonColor || PINK}44`;
                }}
              >
                {item.buttonText}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 7h8M7 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <section
    style={{
      background: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 260,
      padding: "64px 24px",
    }}
  >
    <p
      style={{
        fontFamily: "'Lora', Georgia, serif",
        color: MUTED,
        fontSize: "1rem",
        margin: 0,
        textAlign: "center",
      }}
    >
      No involvement opportunities available at the moment.
    </p>
  </section>
);

// ─── Main component ───────────────────────────────────────────────────────────
const GetInvolved = ({ involvementData = [] }) => {
  if (!involvementData?.length) return <EmptyState />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lora:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');

        /* Mobile: stacked image on top */
        .gi-card-inner {
          flex-direction: column !important;
        }
        .gi-image-wrap {
          width: 100% !important;
          height: 220px !important;
        }

        /* Desktop: side-by-side, alternating */
        @media (min-width: 768px) {
          .gi-card-inner {
            flex-direction: row !important;
          }
          .gi-card-inner[data-reverse="true"] {
            flex-direction: row-reverse !important;
          }
          .gi-image-wrap {
            width: 45% !important;
            height: auto !important;
            min-height: 300px !important;
          }
          .gi-text-wrap {
            width: 55% !important;
          }
        }
      `}</style>

      <section
        style={{
          background: "#fff",
          padding: "88px 20px 100px",
          position: "relative",
        }}
      >
        {/* Very subtle top divider line */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${BORDER} 30%, ${BORDER} 70%, transparent)`,
          }}
        />

        {/* Section header */}
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto 64px",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <EyebrowPill>Join Us</EyebrowPill>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 800,
                color: INK,
                margin: "0 0 16px",
                lineHeight: 1.12,
                letterSpacing: "-0.025em",
              }}
            >
              Get{" "}
              <span
                style={{
                  color: PINK,
                  fontStyle: "italic",
                  fontWeight: 700,
                }}
              >
                Involved
              </span>
            </h2>

            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: "1rem",
                lineHeight: 1.72,
                color: MUTED,
                margin: 0,
              }}
            >
              You can make a difference by taking it further or supporting a
              team.
            </p>

            {/* Rule */}
            <div
              style={{
                width: 40,
                height: 2,
                background: `linear-gradient(90deg, ${PINK}, #ff79cc)`,
                borderRadius: 2,
                margin: "22px auto 0",
              }}
            />
          </motion.div>
        </div>

        {/* Cards */}
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {involvementData.map((item, idx) => (
            <InvolvementCard key={item._id || idx} item={item} idx={idx} />
          ))}
        </div>
      </section>
    </>
  );
};

export default GetInvolved;
