// StatsSection.jsx
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

// Data for stats
const statsData = [
  { id: 1, label: "Teams Started", target: 125, color: "text-red-600" },
  { id: 2, label: "Students Learning", target: 2500, color: "text-green-700", plus: true },
  { id: 3, label: "Competitions", target: 13, color: "text-blue-700" },
];

const StatsSection = () => {
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;

    statsData.forEach((stat, idx) => {
      const duration = 1500; // milliseconds
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * stat.target);

        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[idx] = value;
          return newCounts;
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    });
  }, [inView]);

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="py-16 bg-yellow-300 text-black font-sans"
    >
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 text-center gap-10">
        {statsData.map((stat, idx) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: idx * 0.2 }}
            className="stat-item"
          >
            <h3 className={`text-5xl font-extrabold ${stat.color}`}>
              {counts[idx]}{stat.plus && counts[idx] === stat.target ? "+" : stat.plus ? "+" : ""}
            </h3>
            <p className="mt-2 text-lg font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
