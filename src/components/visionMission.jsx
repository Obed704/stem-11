import React from "react";
import { motion } from "framer-motion";

const STEM_COLORS = {
  yellow: "rgb(247, 244, 46)",
  blue: "rgb(23, 207, 220)",
  pink: "rgb(242, 30, 167)",
  slate: "#64748b", // A soft gray for secondary text
  navy: "#0f172a", // A very dark blue (almost black, but cleaner) for primary headers
};

const MissionVision = ({ cards = [] }) => {
  if (!cards?.length) return null;

  return (
    <section className="bg-white py-24 px-6 md:px-12 relative overflow-hidden">
      {/* 1. BACKGROUND GRID (The Blueprint Foundation) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${STEM_COLORS.blue} 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* MOBILE-FIRST HEADER */}

        {/* THE CARDS: Mobile-First Stacking */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 items-stretch">
          {cards.map((card, index) => {
            const isMission = card.title?.toLowerCase().includes("mission");
            const accentColor = isMission
              ? STEM_COLORS.blue
              : STEM_COLORS.yellow;

            return (
              <motion.div
                key={card._id || index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative flex-1 p-8 md:p-16 border-gray-100 transition-all duration-700
                  ${index === 0 ? "lg:border-r" : ""}
                `}
              >
                {/* GIANT HOLLOW BACKGROUND TEXT */}
                <div
                  className="absolute top-10 left-10 text-8xl md:text-[12rem] font-black opacity-[0.03] pointer-events-none select-none italic"
                  style={{
                    WebkitTextStroke: `2px ${accentColor}`,
                    color: "transparent",
                  }}
                >
                  {isMission ? "01" : "02"}
                </div>

                <div className="relative z-10 space-y-10">
                  {/* ACCENT BOX */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full"
                        style={{ backgroundColor: accentColor }}
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {isMission ? "Strategic" : "Visionary"}
                    </span>
                  </div>

                  {/* MAIN CONTENT */}
                  <div className="space-y-6">
                    <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                      {card.title}
                      {isMission && (
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: STEM_COLORS.pink }}
                        />
                      )}
                    </h3>

                    <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-lg">
                      {card.description}
                    </p>
                  </div>

                  {/* BOTTOM DECOR: Technical Coordinates */}
                </div>

                {/* Subtle hover effect: A colored corner that appears */}
                <div
                  className="absolute bottom-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at bottom right, ${accentColor}, transparent)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
