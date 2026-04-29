import React from "react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const EducationElements = ({ elements = [] }) => {
  const scrollVariant = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  if (!elements || elements.length === 0) {
    return (
      <section className="bg-white py-16 px-4 text-center">
        <div className="max-w-md mx-auto border border-dashed border-slate-200 rounded-3xl py-12">
          <p className="text-slate-400 text-xs uppercase tracking-[0.3em] font-mono">
            Syncing Modules...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 md:py-28 px-4 sm:px-6 lg:px-16 relative overflow-hidden">
      {/* background glow */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[rgb(23,207,220)]/5 blur-3xl rounded-full pointer-events-none" />

      {/* HEADER */}
      <motion.div
        className="max-w-6xl mx-auto text-center mb-10 md:mb-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={scrollVariant}
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-[rgb(242,30,167)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[rgb(242,30,167)]">
            Core Curriculum
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 uppercase leading-tight">
          Elements of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(23,207,220)] to-slate-400">
            Education
          </span>
        </h2>

        <p className="mt-3 text-sm md:text-base text-slate-500 max-w-xl mx-auto">
          Structured learning modules designed for innovation, robotics, and
          STEM excellence.
        </p>
      </motion.div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
        {elements.map(({ _id, title, description, img, alt }, index) => (
          <motion.div
            key={_id || index}
            variants={scrollVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="group relative bg-white border border-slate-100 rounded-2xl md:rounded-[2rem] p-5 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* number */}
            <div className="absolute top-4 right-4 text-4xl md:text-5xl font-black text-slate-100">
              0{index + 1}
            </div>

            {/* image */}
            <div className="flex justify-center mb-5 md:mb-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full border border-dashed border-slate-200 group-hover:border-[rgb(242,30,167)]/40 transition" />

                <img
                  src={img?.startsWith("http") ? img : `${BACKEND_URL}${img}`}
                  alt={alt || title}
                  onError={(e) => (e.target.src = "/placeholder-education.jpg")}
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-full relative z-10 shadow-md group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* title */}
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 uppercase text-center group-hover:text-[rgb(23,207,220)] transition-colors">
              {title}
            </h3>

            {/* description */}
            <p className="mt-2 md:mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed text-center">
              {description}
            </p>

            {/* underline */}
            <div className="mt-6 h-[2px] w-10 mx-auto bg-slate-100 group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-[rgb(23,207,220)] group-hover:to-[rgb(242,30,167)] transition-all duration-500" />
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        className="mt-12 md:mt-20 text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={scrollVariant}
      >
        <motion.a
          href="/contact?subject=Take fll to my school"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          className="inline-flex items-center gap-3 px-6 py-3 md:px-10 md:py-5 bg-slate-900 text-white text-xs md:text-sm font-bold uppercase tracking-widest rounded-full shadow-lg relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          Take It to Your School
        </motion.a>
      </motion.div>
    </section>
  );
};

export default EducationElements;
