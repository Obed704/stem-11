import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const StatsSection = ({ statsSettings }) => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-120px" });
  const [counts, setCounts] = useState([]);

  const orgColors = {
    pink: "rgb(242, 30, 167)",
    blue: "rgb(23, 207, 220)",
    yellow: "rgb(247, 244, 46)",
  };

  const stats = statsSettings?.stats || [];

  useEffect(() => {
    if (stats.length) setCounts(stats.map(() => 0));
  }, [stats]);

  useEffect(() => {
    if (!inView || !stats.length) return;

    stats.forEach((stat, idx) => {
      const duration = 2500;
      const start = performance.now();
      const target = stat.target || 0;

      const animate = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const easeOutExpo = 1 - Math.pow(2, -10 * progress);
        const value = Math.floor(easeOutExpo * target);

        setCounts((prev) => {
          const updated = [...prev];
          updated[idx] = value;
          return updated;
        });

        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });
  }, [inView, stats]);

  const formatNumber = (num) => new Intl.NumberFormat().format(num);

  return (
    <section
      ref={sectionRef}
      className="bg-white pt-0 pb-24 relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full opacity-10"
          style={{ background: orgColors.blue }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full opacity-10"
          style={{ background: orgColors.pink }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* FORCED ROW LAYOUT: grid-cols-3 on all screens, reduced padding */}
        <div className="grid grid-cols-3 gap-px bg-slate-100 border border-slate-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
          {stats.length > 0 ? (
            stats.map((stat, idx) => {
              const accentColors = [
                orgColors.blue,
                orgColors.pink,
                orgColors.yellow,
              ];
              const currentAccent = accentColors[idx % 3];

              return (
                <motion.div
                  key={idx}
                  className="group relative p-4 md:p-10 bg-white hover:bg-slate-50 transition-all duration-700 text-center"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: idx * 0.2 }}
                >
                  <div className="flex justify-center items-start mb-4 md:mb-8 mt-8">
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: currentAccent }}
                    />
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-baseline gap-1">
                      {/* SMALLER FONT: text-3xl for mobile, text-5xl for desktop */}
                      <h3
                        className="text-2xl md:text-5xl font-black tracking-tighter tabular-nums leading-none"
                        style={{ color: currentAccent }}
                      >
                        {formatNumber(counts[idx] || 0)}
                      </h3>
                      <span className="text-sm md:text-xl font-black opacity-30 tracking-tighter">
                        {stat.suffix || (stat.plus ? "+" : "")}
                      </span>
                    </div>

                    <div className="mt-2 md:mt-4">
                      {/* SMALLER LABEL: text-[8px] for mobile */}
                      <p className="text-[8px] md:text-xs font-black uppercase tracking-widest text-slate-900 leading-tight">
                        {stat.label || "Stat"}
                      </p>
                    </div>
                  </div>

                  {/* Subtle hover bar */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-500 w-4 group-hover:w-12"
                    style={{ backgroundColor: currentAccent }}
                  />
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-3 p-10 text-center font-mono text-slate-300 text-[10px]">
              NO_STATS_CONNECTED
            </div>
          )}
        </div>

        {/* Technical Footer */}
        <div className="mt-12 pt-6 border-t border-slate-50 flex justify-between items-center">
          <div className="flex gap-4 md:gap-10">
            {Object.values(orgColors).map((color, i) => (
              <div key={i} className="flex items-center">
                <div
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            ))}
          </div>
          <div className="text-[8px] font-mono text-slate-300 uppercase tracking-widest">
            Last_Update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
