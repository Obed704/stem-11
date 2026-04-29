import React from "react";
import { motion } from "framer-motion";

const Banner = ({ bannerData }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  if (!bannerData) return null;

  const imageUrl = bannerData.image?.startsWith("http")
    ? bannerData.image
    : `${BACKEND_URL}${bannerData.image?.startsWith("/") ? "" : "/"}${bannerData.image}`;
  const accentColor = bannerData.primaryColor || "#f21ea7";

  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-black"
      id="home"
    >
      {/* 1. Background Image with Zoom Effect */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src={imageUrl}
          alt="Women in STEM"
          className="w-full h-full object-cover object-center brightness-[0.6]"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </motion.div>

      {/* 2. Tech Decors (Corner Brackets) */}
      <div className="absolute inset-10 pointer-events-none border-l border-t border-white/10 w-20 h-20" />
      <div className="absolute bottom-10 right-10 pointer-events-none border-r border-b border-white/10 w-20 h-20" />

      {/* 3. Main Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end md:justify-center px-[5%] pb-20 md:pb-0">
        <div className="max-w-5xl">
          {/* Subtitle / Tag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <span
              className="h-[2px] w-12"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-white text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase opacity-80">
              Champions_
            </span>
          </motion.div>

          {/* Title with Split Color logic */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-8"
          >
            {bannerData.title.split(" ").map((word, i) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <span style={{ color: accentColor }}>{word}</span>
                ) : (
                  word
                )}
              </span>
            ))}
          </motion.h1>

          {/* Description with Glassmorphism Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="relative group max-w-2xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-transparent blur-sm" />
            <div
              className="relative bg-black/40 backdrop-blur-md border-l-2 p-6 md:p-8"
              style={{ borderColor: accentColor }}
            >
              <p className="text-slate-200 text-sm md:text-lg leading-relaxed font-light">
                {bannerData.description}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. Side Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute right-10 bottom-10 hidden lg:flex flex-col items-center gap-4"
      >
        <span className="[writing-mode:vertical-lr] text-white/30 text-[10px] uppercase tracking-[0.3em] font-mono">
          Scroll_To_Explore
        </span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Banner;
