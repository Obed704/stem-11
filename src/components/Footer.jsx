// Footer.jsx
// Redesigned: dark editorial — gray-900 base, brand accents applied precisely
// Pink = hover/action | Cyan = structural highlights | Yellow = micro-accent

import React from "react";
import { motion } from "framer-motion";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  pink: "#f21ea7",
  cyan: "rgb(23,207,220)",
  yellow: "rgb(247,244,46)",
  white: "#ffffff",
  bg: "#111111",
  surface: "#1a1a1a",
  border: "rgba(255,255,255,0.07)",
  muted: "rgba(255,255,255,0.45)",
  body: "rgba(255,255,255,0.68)",
};

// ─── Wordmark ─────────────────────────────────────────────────────────────────
const Wordmark = () => (
  <span style={{ display: "inline-flex", gap: 8, alignItems: "baseline" }}>
    <span
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 800,
        fontSize: "1.3rem",
        color: C.yellow,
        letterSpacing: "-0.02em",
      }}
    >
      STEM
    </span>
    <span
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 800,
        fontSize: "1.3rem",
        color: C.cyan,
        letterSpacing: "-0.02em",
      }}
    >
      Inspires
    </span>
  </span>
);

// ─── Animated link ────────────────────────────────────────────────────────────
const FooterLink = ({ href, children, delay = 0 }) => (
  <motion.li
    initial={{ opacity: 0, x: -8 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    style={{ listStyle: "none" }}
  >
    <a
      href={href}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.88rem",
        color: C.body,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "color 0.2s",
        lineHeight: 1.6,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = C.pink;
        e.currentTarget.querySelector(".arrow").style.opacity = "1";
        e.currentTarget.querySelector(".arrow").style.transform =
          "translateX(2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = C.body;
        e.currentTarget.querySelector(".arrow").style.opacity = "0";
        e.currentTarget.querySelector(".arrow").style.transform =
          "translateX(-2px)";
      }}
    >
      {children}
      <span
        className="arrow"
        style={{
          fontSize: 10,
          opacity: 0,
          transform: "translateX(-2px)",
          transition: "opacity 0.2s, transform 0.2s",
          color: C.pink,
        }}
      >
        →
      </span>
    </a>
  </motion.li>
);

// ─── Column heading ───────────────────────────────────────────────────────────
const ColHead = ({ children }) => (
  <div style={{ marginBottom: 18 }}>
    <p
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.62rem",
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: C.cyan,
        margin: "0 0 0",
      }}
    >
      {children}
    </p>
    <div
      style={{
        width: 20,
        height: 2,
        background: C.cyan,
        borderRadius: 2,
        marginTop: 6,
        opacity: 0.5,
      }}
    />
  </div>
);

// ─── Footer data ──────────────────────────────────────────────────────────────
const footerData = {
  description:
    "Inspiring the next generation of innovators through hands-on STEM education.",
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "Our Projects", href: "/ourProjects" },
    { name: "Donate", href: "/donate" },
    { name: "Champions", href: "/champions" },
  ],
  programs: [
    { name: "Resources", href: "/resources" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  contact: [
    { text: "info@steminspires.tech", href: "mailto:info@steminspires.tech" },
  ],
  socials: [
    { label: "Twitter", href: "#", icon: "𝕏" },
    { label: "LinkedIn", href: "#", icon: "in" },
    { label: "Instagram", href: "#", icon: "ig" },
  ],
};

// ─── Main component ───────────────────────────────────────────────────────────
const Footer = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

      .ft-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 40px;
      }
      @media (min-width: 560px) {
        .ft-grid { grid-template-columns: 1fr 1fr; gap: 40px 48px; }
      }
      @media (min-width: 900px) {
        .ft-grid { grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px 56px; }
      }

      .ft-social-btn:hover {
        border-color: rgba(242,30,167,0.5) !important;
        color: #f21ea7 !important;
      }
    `}</style>

    <footer
      style={{
        background: C.bg,
        color: C.white,
        padding: "0 0 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Cyan top border */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg, ${C.cyan}, ${C.pink}, ${C.yellow})`,
        }}
      />

      {/* Subtle background texture dots */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          width: 180,
          height: 180,
          backgroundImage: `radial-gradient(circle, rgba(23,207,220,0.06) 1px, transparent 1px)`,
          backgroundSize: "18px 18px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 24px 0" }}>
        <motion.div
          className="ft-grid"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Brand column ── */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <Wordmark />
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.87rem",
                lineHeight: 1.72,
                color: C.body,
                margin: "0 0 24px",
                maxWidth: 260,
              }}
            >
              {footerData.description}
            </p>

            {/* Social pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {footerData.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="ft-social-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: `1px solid ${C.border}`,
                    color: C.muted,
                    textDecoration: "none",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <ColHead>Quick Links</ColHead>
            <ul
              style={{
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {footerData.quickLinks.map((link, idx) => (
                <FooterLink key={idx} href={link.href} delay={idx * 0.06}>
                  {link.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* ── Programs ── */}
          <div>
            <ColHead>Programs</ColHead>
            <ul
              style={{
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {footerData.programs.map((link, idx) => (
                <FooterLink key={idx} href={link.href} delay={idx * 0.06}>
                  {link.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <ColHead>Contact Us</ColHead>
            <ul
              style={{
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {footerData.contact.map((item, idx) => (
                <FooterLink key={idx} href={item.href} delay={idx * 0.06}>
                  {item.text}
                </FooterLink>
              ))}
            </ul>

            {/* Yellow accent tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 24,
                padding: "5px 12px",
                borderRadius: 100,
                border: `1px solid rgba(247,244,46,0.2)`,
                background: "rgba(247,244,46,0.05)",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.yellow,
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.yellow,
                }}
              >
                Open to partnerships
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            marginTop: 56,
            paddingTop: 20,
            paddingBottom: 28,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              color: C.muted,
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} STEM Inspires. All rights reserved.
          </p>

          {/* Three-dot brand accent */}
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {[C.cyan, C.pink, C.yellow].map((c, i) => (
              <div
                key={i}
                style={{
                  width: i === 1 ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: c,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;
