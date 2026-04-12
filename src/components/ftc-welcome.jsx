import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ================= ANIMATIONS =================
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function FTCLanding() {
  const [schools, setSchools] = useState([]);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    Promise.all([
      axios.get(`${BACKEND_URL}/api/ftc-landing`),
      axios.get(`${BACKEND_URL}/api/schools`),
    ])
      .then(([contentRes, schoolsRes]) => {
        setContent(contentRes.data);
        setSchools(schoolsRes.data);
      })
      .catch((err) => console.error("FTC load error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !content) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <img
            src={`./welcomeSlide/Logo.png`}
            alt="STEM Inspires"
            className="w-32 mx-auto mb-6 animate-pulse"
          />
          <div className="text-white text-xl">Loading STEM Inspires…</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ================= HERO (UPDATED UI & COLORED BG) ================= */}
      <motion.section
        className="relative min-h-[80vh] flex items-center justify-center text-white overflow-hidden bg-cyan-600"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Subtle pattern overlay for the colored background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <motion.div
          className="relative z-10 max-w-4xl px-6 text-center"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
            custom={0}
            variants={fadeUp}
          >
            {content.hero.titlePrefix}{" "}
            <span className="text-yellow-300">
              {content.hero.titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl mb-10 text-cyan-50 font-medium max-w-2xl mx-auto"
            custom={1}
            variants={fadeUp}
          >
            {content.hero.subtitle}
          </motion.p>

          <motion.button
            custom={2}
            variants={fadeUp}
            onClick={() => (window.location.href = content.hero.ctaLink)}
            className="bg-white text-cyan-600 hover:bg-yellow-300 hover:text-cyan-900 font-bold px-10 py-4 text-lg rounded-full shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {content.hero.ctaText}
          </motion.button>
        </motion.div>
      </motion.section>

      {/* ================= ABOUT (LEFT AS IS) ================= */}
      <motion.section
        className="py-16 sm:py-20 bg-gradient-to-b from-gray-100 to-gray-200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6">
          <motion.div variants={staggerContainer}>
            <motion.h2
              className="text-3xl sm:text-4xl font-bold mb-5 text-gray-900"
              custom={0}
              variants={fadeUp}
            >
              {content.about.title}
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6"
              custom={1}
              variants={fadeUp}
            >
              {content.about.description}
            </motion.p>

            <motion.a
              href={content.about.linkUrl}
              custom={2}
              variants={fadeUp}
              className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition-colors"
              whileHover={{ x: 5 }}
            >
              {content.about.linkText}
            </motion.a>
          </motion.div>

          <motion.div custom={3} variants={fadeUp}>
            <img
              src={`${BACKEND_URL}${content.about.image}`}
              alt="FTC Competition"
              className="rounded-2xl shadow-xl w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* ================= TEAMS/SCHOOLS (CHANGED UI) ================= */}
      <motion.section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <motion.div className="text-left" variants={fadeUp}>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
                {content.schoolsSection.title}
              </h2>
              <div className="h-2 w-24 bg-cyan-500 mt-2 rounded-full"></div>
            </motion.div>

            <motion.button
              onClick={() =>
                (window.location.href = content.schoolsSection.ctaLink)
              }
              className="bg-gray-900 hover:bg-cyan-600 text-white font-bold px-8 py-3 rounded-lg transition-all"
              variants={fadeUp}
              whileHover={{ y: -2 }}
            >
              {content.schoolsSection.ctaText}
            </motion.button>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {schools.map((school, index) => (
              <motion.a
                key={school._id}
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white border border-gray-200 rounded-3xl p-4 transition-all hover:border-cyan-400 hover:shadow-2xl"
                custom={index}
                variants={fadeUp}
              >
                <div className="relative h-64 w-full mb-6 overflow-hidden rounded-2xl">
                  <img
                    src={`${BACKEND_URL}${school.img}`}
                    alt={school.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                    {school.location}
                  </div>
                </div>

                <div className="px-2 pb-2">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
                    {school.name}
                  </h3>
                  <p className="text-gray-500 mt-1">Partner School</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
