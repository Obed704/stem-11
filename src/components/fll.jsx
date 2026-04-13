import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import axios from "axios";
import robotImg from "../assets/robot.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/* ─── Fade Animation Component ──────────────────────────────── */
const Fade = ({ children, delay = 0, y = 15 }) => {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setOn(true);
      },
      { threshold: 0.12 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-[750ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "translateY(0)" : `translateY(${y}px)`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const MainContent = () => {
  const [fllData, setFllData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

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
          {/* Added mt-12 for mobile margin-top spacing */}
          <section className="relative min-h-[92vh] flex flex-col justify-center px-6 py-12 mt-12 md:mt-0 md:px-20 lg:px-24">
            {/* Watermark */}
            <motion.div
              style={{ y: titleY }}
              className="absolute top-[12%] left-0 text-[18vw] font-black opacity-[0.04] pointer-events-none tracking-tighter leading-none"
            >
              FLL_2026
            </motion.div>

            {/* Intro Tag */}
            <Fade>
              <div className="flex items-center gap-[10px] mb-3">
                <span className="w-7 h-[2px] bg-[#f21ea7]" />
                <span className="text-[10px] tracking-[0.2em] font-bold text-[#f21ea7] uppercase">
                  Featured Program
                </span>
              </div>
            </Fade>

            {/* Title */}
            <Fade delay={0.05}>
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-black leading-[0.9] uppercase mb-6">
                {fll.title.split(" ").map((w, i) => (
                  <span
                    key={i}
                    className={`block ${i === 1 ? "text-[#f21ea7]" : "text-[#050505]"}`}
                  >
                    {w}
                  </span>
                ))}
              </h1>
            </Fade>

            {/* Hero Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Text */}
              <Fade delay={0.1}>
                <div>
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
                </div>
              </Fade>

              {/* Right Image */}
              <Fade delay={0.15}>
                <div className="flex justify-center items-center">
                  <img
                    src="/robot.png"
                    alt="robot"
                    className="w-full max-w-[320px] md:max-w-[420px] object-contain"
                  />
                </div>
              </Fade>
            </div>
          </section>

          {/* ───────── MAP SECTION ───────── */}
          {fll.mapUrl && (
            <section className="px-4 py-8 md:px-20 md:pb-20">
              <Fade>
                <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-xl shadow-black/5">
                  {/* Map Header */}
                  <div className="px-3.5 py-2.5 flex justify-between items-center border-b border-black/5">
                    <span className="text-[10px] font-bold tracking-widest text-gray-500">
                      NETWORK_MAP
                    </span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>

                  {/* Iframe */}
                  <iframe
                    src={fll.mapUrl}
                    title="map"
                    className="w-full h-[260px] md:h-[420px] border-none"
                  />
                </div>
              </Fade>
            </section>
          )}
        </div>
      ))}
    </main>
  );
};

export default MainContent;
