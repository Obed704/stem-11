import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Optimized Scroll Animation Variant
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: delay,
      ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a "smooth" feel
    },
  }),
};

const MainContent = () => {
  const [fllData, setFllData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/fll`)
      .then((r) => setFllData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-screen bg-[#fcfcfc]" />;

  return (
    <main className="bg-[#fcfcfc] text-[#050505] font-sans overflow-x-hidden">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#f21ea7] origin-left z-[9999]"
        style={{ scaleX }}
      />

      {fllData.map((fll) => (
        <div key={fll._id}>
          {/* ───────── HERO SECTION ───────── */}
          <section className="relative min-h-[92vh] flex flex-col justify-center px-6 py-12 mt-12 md:mt-0 md:px-20 lg:px-24">
            {/* Parallax Watermark */}
            <motion.div
              style={{ y: titleY }}
              className="absolute top-[12%] left-0 text-[18vw] font-black opacity-[0.04] pointer-events-none tracking-tighter leading-none"
            >
              FLL_2026
            </motion.div>

            {/* Intro Tag */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center gap-[10px] mb-3"
            >
              <span className="w-7 h-[2px] bg-[#f21ea7]" />
              <span className="text-[10px] tracking-[0.2em] font-bold text-[#f21ea7] uppercase">
                Featured Program
              </span>
            </motion.div>

            {/* Title with staggered block animation */}
            <motion.h1
              custom={0.1}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-5xl md:text-7xl lg:text-9xl font-black leading-[0.9] uppercase mb-6"
            >
              {fll.title.split(" ").map((w, i) => (
                <span
                  key={i}
                  className={`block ${i === 1 ? "text-[#f21ea7]" : "text-[#050505]"}`}
                >
                  {w}
                </span>
              ))}
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Text */}
              <motion.div
                custom={0.2}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="text-base leading-relaxed text-gray-700 max-w-[520px]">
                  {fll.description}
                </p>

                <div className="border-l-2 border-[#f21ea7] pl-4 mt-[18px]">
                  <p className="font-bold text-lg m-0">
                    We are bringing this to Central Africa!
                  </p>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Check out the schools we are connecting.
                  </p>
                </div>
              </motion.div>

              {/* Right Image - Optimized for LCP */}
              <motion.div
                custom={0.3}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                // Added -mt-12 to pull the image up
                className="flex justify-center items-center -mt-8 md:-mt-16"
              >
                <img
                  src="https://res.cloudinary.com/dashhjuuq/image/upload/q_auto,f_auto/v1776871055/robot_up4uqt.png"
                  alt="robot"
                  loading="eager"
                  fetchpriority="high"
                  className="w-full max-w-[320px] md:max-w-[420px] object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </section>

          {/* ───────── MAP SECTION ───────── */}
          {fll.mapUrl && (
            <section className="px-4 py-8 md:px-20 md:pb-20">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-xl shadow-black/5"
              >
                <div className="px-3.5 py-2.5 flex justify-between items-center border-b border-black/5">
                  <span className="text-[10px] font-bold tracking-widest text-gray-500">
                    NETWORK_MAP
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>

                <iframe
                  src={fll.mapUrl}
                  title="map"
                  className="w-full h-[260px] md:h-[420px] border-none"
                />
              </motion.div>
            </section>
          )}
        </div>
      ))}
    </main>
  );
};

export default MainContent;