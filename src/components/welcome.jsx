import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ─── Helper: resolve full image URL ───────────────────────────────────────────
const resolveUrl = (src) =>
  src?.startsWith("http") ? src : `${BACKEND_URL}${src}`;

// ─── Shimmer placeholder shown while images are loading ───────────────────────
const ShimmerPlaceholder = () => (
  <div className="absolute inset-0 bg-slate-100 overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite",
      }}
    />
    <style>{`
      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

const HeroSection = ({ hero, slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Track which slide images have fully loaded
  const [loadedSlides, setLoadedSlides] = useState({});
  const slideIntervalRef = useRef(null);
  const preloadedRef = useRef({}); // cache Image objects so GC doesn't drop them

  // BRAND COLORS
  const orgColors = {
    pink: "rgb(242, 30, 167)",
    blue: "rgb(23, 207, 220)",
    yellow: "rgb(247, 244, 46)",
    white: "rgb(255, 255, 255)",
    dark: "#0f172a",
  };

  // ── Preload all slide images immediately on mount ──────────────────────────
  useEffect(() => {
    if (!slides?.length) return;

    slides.forEach((slide, index) => {
      const url = resolveUrl(slide.bg);
      if (!url || preloadedRef.current[index]) return;

      const img = new Image();
      img.fetchPriority = index === 0 ? "high" : "low";
      img.onload = () =>
        setLoadedSlides((prev) => ({ ...prev, [index]: true }));
      img.onerror = () =>
        // Mark as "loaded" anyway so the slide still advances
        setLoadedSlides((prev) => ({ ...prev, [index]: true }));
      img.src = url;
      preloadedRef.current[index] = img; // prevent GC
    });
  }, [slides]);

  // ── Auto-advance only after the NEXT slide's image is ready ───────────────
  const advanceSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % (slides?.length || 1);
      // If next image isn't loaded yet, skip silently and try again next tick
      if (!loadedSlides[next]) return prev;
      return next;
    });
  }, [slides, loadedSlides]);

  useEffect(() => {
    if (!slides?.length || !hero) return;
    slideIntervalRef.current = setInterval(
      advanceSlide,
      hero.slideInterval || 7000,
    );
    return () => clearInterval(slideIntervalRef.current);
  }, [slides, hero, advanceSlide]);

  const goToSlide = (idx) => {
    if (!loadedSlides[idx]) return; // don't jump to unloaded slide
    setCurrentSlide(idx);
    clearInterval(slideIntervalRef.current);
    slideIntervalRef.current = setInterval(
      advanceSlide,
      hero.slideInterval || 7000,
    );
  };

  if (!hero) return null;

  const firstSlideReady = loadedSlides[0];

  return (
    <section className="relative h-screen bg-white overflow-hidden">

      {/* ── HIDDEN PRELOAD LAYER (all slides, display:none) ──────────────────
          Tells the browser to fetch these as high-priority resources.      */}
      <div aria-hidden="true" style={{ display: "none" }}>
        {slides?.map((slide, i) => (
          <img
            key={i}
            src={resolveUrl(slide.bg)}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
          />
        ))}
      </div>

      {/* 1. ENGINEERING GRID OVERLAY */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* 2. BACKGROUND IMAGE SLIDER */}
      <div className="absolute inset-0 z-0">

        {/* Shimmer shown until first image is ready */}
        <AnimatePresence>
          {!firstSlideReady && (
            <motion.div
              key="shimmer"
              className="absolute inset-0 z-10"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ShimmerPlaceholder />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slide images — rendered as soon as their image is loaded */}
        <AnimatePresence mode="wait">
          {slides?.map(
            (slide, index) =>
              index === currentSlide &&
              loadedSlides[index] && (
                <motion.div
                  key={slide._id || index}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  // Faster reveal on first slide; cinematic on subsequent
                  transition={{ duration: index === 0 ? 0.6 : 1.2 }}
                  className="absolute inset-0"
                  style={{
                    willChange: "opacity, transform",
                    backgroundImage: `url(${resolveUrl(slide.bg)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    // Use already-cached browser image — no network hit
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>

      {/* 3. CONTENT LAYER */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <div className="max-w-2xl space-y-8">
          {/* MAIN HEADING */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-slate-900">
              <span style={{ color: orgColors.pink }}>
                {hero.title?.word1 || "STEM"}
              </span>
              <br />
              <span className="italic font-light" style={{ color: orgColors.blue }}>
                {hero.title?.word2 || "Inspires"}
              </span>
            </h1>
          </motion.div>

          {/* SUBTITLE */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-slate-600 font-medium leading-relaxed max-w-md border-l-2 pl-4"
            style={{ borderLeftColor: orgColors.yellow }}
          >
            {hero.subtitle ||
              "Building the next generation of African innovators through robotics and engineering."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {hero.buttons?.map((btn, i) => (
              <a
                key={i}
                href={btn.link}
                className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105"
                style={{
                  backgroundColor:
                    btn.type === "primary" ? orgColors.pink : "transparent",
                  color:
                    btn.type === "primary" ? orgColors.white : orgColors.dark,
                  border:
                    btn.type === "primary"
                      ? "none"
                      : `2px solid ${orgColors.blue}`,
                }}
              >
                {btn.label}
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 4. SLIDE INDICATORS */}
      <div className="absolute bottom-12 right-12 flex flex-col gap-4 z-30">
        {slides?.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className="group flex items-center gap-4 text-right"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span
              className={`text-[10px] font-mono font-bold transition-opacity ${currentSlide === idx ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                }`}
              style={{ color: orgColors.blue }}
            >
              {/* Show a tiny spinner while the slide image is still loading */}
              {!loadedSlides[idx] ? "…" : `SLIDE ${idx + 1}`}
            </span>
            <div
              className={`h-[2px] transition-all duration-500 ${currentSlide === idx ? "w-20" : "w-8 opacity-30"
                }`}
              style={{
                backgroundColor:
                  currentSlide === idx ? orgColors.pink : orgColors.dark,
              }}
            />
          </button>
        ))}
      </div>

      {/* FOOTER BAR ACCENT */}
      <div className="absolute bottom-0 left-0 w-full h-1 flex">
        <div className="flex-1" style={{ backgroundColor: orgColors.pink }} />
        <div className="flex-1" style={{ backgroundColor: orgColors.blue }} />
        <div className="flex-1" style={{ backgroundColor: orgColors.yellow }} />
      </div>
    </section>
  );
};

export default HeroSection;