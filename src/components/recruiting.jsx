import React from "react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/* ─── Design Tokens ─────────────────────────────────────────── */
const ACCENT_CYAN = "rgb(23, 207, 220)";
const ACCENT_PINK = "rgb(242, 30, 167)";

const RecruitingProcess = ({ steps = [] }) => {
  const resolveUrl = (src) =>
    src?.startsWith("http") ? src : `${BACKEND_URL}${src}`;

  if (!steps || steps.length === 0) {
    return (
      <section className="bg-white py-12 text-center border-t border-gray-100">
        <p className="text-gray-400 text-xs font-mono uppercase tracking-[0.3em]">
          No_Active_Nodes
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 px-4 md:px-16 lg:px-24 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Background Watermark */}
        <div className="absolute top-10 left-[-5%] text-[10rem] md:text-[15rem] font-black opacity-[0.02] select-none pointer-events-none uppercase">
          Onboard
        </div>

        {/* --- Section Header --- */}
        <div className="mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-2"
          >
            <span
              className="h-[1px] w-8"
              style={{ background: ACCENT_CYAN }}
            ></span>
            <span
              className="text-[10px] font-black uppercase tracking-[0.4em]"
              style={{ color: ACCENT_CYAN }}
            >
              Onboarding_Phase // 02
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-7xl font-black uppercase leading-[0.8] tracking-tighter text-black"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Recruiting <br />
            <span style={{ color: ACCENT_PINK }}>Schools</span>
          </motion.h2>
        </div>

        {/* --- Steps Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={step._id || index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.8 }}
              className="relative group transition-all duration-500 ease-out"
            >
              {/* Ghost Number - Positioned to the left of the card */}
              <span className="absolute -top-6 -left-2 text-7xl font-black opacity-[0.03] select-none pointer-events-none group-hover:opacity-10 group-hover:text-cyan-500 transition-all duration-500">
                0{index + 1}
              </span>

              {/* --- IMAGE VIEWPORT (Left-to-Right Unmasking) --- */}
              <div className="relative mb-6 w-full aspect-square overflow-hidden border border-gray-100 group-hover:border-cyan-500/30 transition-colors">
                {/* 1. The Grayscale Base (Visible on Desktop) */}
                <img
                  src={resolveUrl(step.img)}
                  alt={step.title}
                  className="w-full h-full object-cover grayscale md:grayscale group-hover:scale-105 transition-transform duration-700"
                />

                {/* 2. The Color Unmask Layer (Sliding in from Left) */}
                <div className="absolute inset-0 z-10 w-full h-full overflow-hidden transition-transform duration-700 ease-in-out transform -translate-x-full group-hover:translate-x-0 hidden md:block">
                  <img
                    src={resolveUrl(step.img)}
                    alt={step.title}
                    className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 transform translate-x-full group-hover:translate-x-0"
                    style={{ maxWidth: "none" }}
                  />
                </div>

                {/* 3. Mobile Color Overlay (Always colored on mobile) */}
                <div className="absolute inset-0 z-0 block md:hidden">
                  <img
                    src={resolveUrl(step.img)}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Corner Accent */}
                <div
                  className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2"
                  style={{ borderColor: ACCENT_CYAN }}
                ></div>
              </div>

              {/* --- TEXT CONTENT --- */}
              <div className="relative z-20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-[2px] w-4 bg-cyan-400 opacity-20 group-hover:opacity-100 group-hover:w-8 transition-all duration-500"></div>
                  <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">
                    STEP_0{index + 1}
                  </span>
                </div>

                {/* Title colors Cyan on hover even with white BG */}
                <h3 className="text-xl font-black uppercase tracking-tight mb-3 text-slate-900 group-hover:text-cyan-500 transition-colors">
                  {step.title}
                </h3>

                {/* Description - Zoomed out text (text-xs) */}
                <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-800 transition-colors">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecruitingProcess;
