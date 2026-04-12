import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Header = ({ settings }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // 1. SCROLL LOCK & SCROLL EFFECT
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  if (!settings) return null;

  const logoSrc = `${BACKEND_URL}/logo/${settings.logoImage || "default-logo.png"}`;

  const colors = {
    pink: "rgb(242, 30, 167)",
    blue: "rgb(23, 207, 220)",
    yellow: "rgb(247, 244, 46)",
    text: "#0f172a",
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 
        ${
          scrolled || menuOpen
            ? "py-3 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
            : "py-6 bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* LOGO */}
          <Link
            to="/"
            className="relative z-[110] flex items-center gap-2 group shrink-0"
          >
            <img
              src={logoSrc}
              alt="STEM Inspires"
              className={`transition-all duration-300 object-contain ${scrolled ? "h-8" : "h-10"}`}
            />
            {settings.logoMode === "logo-with-text" && (
              <div className="flex flex-col leading-none">
                <span
                  className="font-black text-xl italic tracking-tighter"
                  style={{ color: colors.text }}
                >
                  STEM<span style={{ color: colors.pink }}>.</span>
                </span>
                <span
                  className="font-bold text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: colors.blue }}
                >
                  Inspires
                </span>
              </div>
            )}
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center bg-gray-50 p-1 rounded-full border border-gray-100">
            {settings.links?.map(({ name, link }) => (
              <Link
                key={name}
                to={link}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300
                ${location.pathname === link ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-black"}`}
              >
                {name}
              </Link>
            ))}
          </div>

          {/* ACTION BUTTON & HAMBURGER */}
          <div className="flex items-center gap-4">
            {/* <Link
              to="/donate"
              className="hidden md:block px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 text-white"
              style={{ backgroundColor: colors.pink }}
            >
              Donate
            </Link> */}

            {/* ANIMATED HAMBURGER */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative z-[110] w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
            >
              <span
                className={`w-6 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`w-6 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
                style={{ backgroundColor: colors.pink }}
              />
              <span
                className={`w-6 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE FULL-SCREEN MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="fixed inset-0 bg-white z-[90] lg:hidden flex flex-col pt-24"
          >
            {/* 1. ARCHITECTURAL GRID BACKGROUND */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />

            <div className="flex-1 px-8 overflow-y-auto relative z-10 flex flex-col">
              {/* 2. THE LINKS - Transparent, Bordered Bottom Only */}
              <div className="flex flex-col">
                {settings.links?.map(({ name, link }, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={link}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center justify-between py-5 border-b border-gray-50 active:opacity-60 transition-all"
                    >
                      <div className="flex items-center gap-6">
                        {/* Subtle Index */}
                        <span className="text-[8px] font-medium text-gray-300 font-mono tracking-widest">
                          [{String(i + 1).padStart(2, "0")}]
                        </span>

                        {/* Extra Small Link Text */}
                        <span
                          className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors
                    ${location.pathname === link ? "text-slate-900" : "text-gray-400 group-hover:text-slate-900"}`}
                        >
                          {name}
                        </span>
                      </div>

                      {/* Status Indicator */}
                      {location.pathname === link ? (
                        <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest">
                          Active
                        </span>
                      ) : (
                        <svg
                          className="w-3 h-3 text-gray-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 3. ORGANIZATIONAL FOOTER - Clean & Compact */}
            <div className="p-8 space-y-8 bg-white/50 backdrop-blur-sm relative z-10">
              {/* Professional Minimal Button */}
              <Link
                to="/donate"
                onClick={() => setMenuOpen(false)}
                className="relative group overflow-hidden flex items-center justify-center w-full py-4 rounded-full bg-slate-900 text-white transition-all duration-300 active:scale-[0.95] hover:shadow-[0_0_20px_rgba(242,30,167,0.4)]"
              >
                {/* Subtle Background Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <span className="relative z-10 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                  Donate
                  <svg
                    className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
