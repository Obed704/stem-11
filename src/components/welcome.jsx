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
    <section className="relative h-screen bg-slate-50 overflow-hidden">

      {/* ── HIDDEN PRELOAD LAYER ───────────────────────────────────────────── */}
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

      {/* ENGINEERING GRID */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(#000 1px, transparent 1px),
            linear-gradient(90deg, #000 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0 z-0">

        {/* CINEMATIC WHITE OVERLAY */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(to right, rgba(248,250,252,0.84) 0%, rgba(248,250,252,0.50) 34%, rgba(248,250,252,0.10) 68%, transparent 100%)",
          }}
        />

        {/* LIGHT ATMOSPHERIC DEPTH */}
        <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-[0.5px] z-[1]" />

        {/* SHIMMER */}
        <AnimatePresence>
          {!firstSlideReady && (
            <motion.div
              key="shimmer"
              className="absolute inset-0 z-20"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ShimmerPlaceholder />
            </motion.div>
          )}
        </AnimatePresence>

        {/* SLIDES */}
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
                  transition={{
                    duration: index === 0 ? 0.6 : 1.2,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0"
                  style={{
                    willChange: "opacity, transform",
                    backgroundImage: `url(${resolveUrl(slide.bg)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "saturate(0.96) contrast(0.94) brightness(0.92)",
                  }}
                />
              ),
          )}
        </AnimatePresence>
      </div>

      {/* CONTENT */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <div className="max-w-2xl space-y-8">

          {/* HEADING */}
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

              <span
                className="italic font-light"
                style={{ color: orgColors.blue }}
              >
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

          {/* BUTTONS */}
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
                className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor:
                    btn.type === "primary"
                      ? orgColors.pink
                      : "rgba(255,255,255,0.30)",

                  color:
                    btn.type === "primary"
                      ? orgColors.white
                      : orgColors.dark,

                  border:
                    btn.type === "primary"
                      ? "none"
                      : `1.5px solid ${orgColors.blue}`,

                  backdropFilter: "blur(10px)",
                }}
              >
                {btn.label}
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* SLIDE INDICATORS */}
      <div className="absolute bottom-12 right-12 flex flex-col gap-4 z-30">
        {slides?.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className="group flex items-center gap-4 text-right"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span
              className={`text-[10px] font-mono font-bold transition-opacity ${currentSlide === idx
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-40"
                }`}
              style={{ color: orgColors.blue }}
            >
              {!loadedSlides[idx] ? "…" : `SLIDE ${idx + 1}`}
            </span>

            <div
              className={`h-[2px] transition-all duration-500 ${currentSlide === idx
                  ? "w-20"
                  : "w-8 opacity-30"
                }`}
              style={{
                backgroundColor:
                  currentSlide === idx
                    ? orgColors.pink
                    : orgColors.dark,
              }}
            />
          </button>
        ))}
      </div>

      {/* FOOTER BAR */}
      <div className="absolute bottom-0 left-0 w-full h-1 flex z-40">
        <div
          className="flex-1"
          style={{ backgroundColor: orgColors.pink }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: orgColors.blue }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: orgColors.yellow }}
        />
      </div>
    </section>
  );
};

export default HeroSection;