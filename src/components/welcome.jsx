import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const HeroSection = ({ hero, slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef(null);

  // BRAND COLORS
  const orgColors = {
    pink: "rgb(242, 30, 167)",
    blue: "rgb(23, 207, 220)",
    yellow: "rgb(247, 244, 46)",
    white: "rgb(255, 255, 255)",
    dark: "#0f172a",
  };

  useEffect(() => {
    if (!slides?.length || !hero) return;
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, hero.slideInterval || 7000);
    return () => clearInterval(slideIntervalRef.current);
  }, [slides, hero]);

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
    clearInterval(slideIntervalRef.current);
  };

  if (!hero) return null;

  return (
    <section className="relative h-screen bg-white overflow-hidden">
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
        <AnimatePresence mode="wait">
          {slides?.map(
            (slide, index) =>
              index === currentSlide && (
                <motion.div
                  key={slide._id || index}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${BACKEND_URL}${slide.bg})` }}
                >
                  {/* Organizational Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>

      {/* 3. CONTENT LAYER */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <div className="max-w-2xl space-y-8">
          {/* LOGO AREA */}
          {/* <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src={`${BACKEND_URL}/logo/${hero.logoImage}`}
              alt="STEM Inspires"
              className="h-16 w-auto object-contain"
            />
          </motion.div> */}

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

      {/* 4. TECHNICAL INDICATORS (Dots) */}
      <div className="absolute bottom-12 right-12 flex flex-col gap-4 z-30">
        {slides?.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className="group flex items-center gap-4 text-right"
          >
            <span
              className={`text-[10px] font-mono font-bold transition-opacity ${currentSlide === idx ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}
              style={{ color: orgColors.blue }}
            >
              SLIDE {idx + 1}
            </span>
            <div
              className={`w-12 h-[2px] transition-all duration-500 ${currentSlide === idx ? "w-20" : "w-8 opacity-30"}`}
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
