import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// 🎨 Brand Color Palette
const STEM_COLORS = [
  "rgb(247, 244, 46)", // Yellow
  "rgb(23, 207, 220)", // Cyan
  "rgb(242, 30, 167)", // Pink
];

const HeroSection = () => {
  const [slidesData, setSlidesData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);

  // 🎲 Random but unique colors (once per load)
  const getRandomWordColors = () => {
    const shuffled = [...STEM_COLORS].sort(() => 0.5 - Math.random());
    return {
      stem: shuffled[0],
      inspires: shuffled[1],
    };
  };

  const wordColors = useRef(getRandomWordColors());

  // Fetch slides
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/slides`);
        const data = await res.json();
        setSlidesData(data);
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };
    fetchSlides();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (slidesData.length > 0) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slidesData.length);
      }, 7000);
    }
    return () => clearInterval(slideInterval.current);
  }, [slidesData]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 7000);
  };

  if (slidesData.length === 0) {
    return (
      <section className="h-screen flex items-center justify-center bg-black text-white">
        <p>Loading slides...</p>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence>
        {slidesData.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide._id || index}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${BACKEND_URL}${slide.bg})` }}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
              />
            )
        )}
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-12 max-w-5xl text-white">
        <div className="space-y-7">
          {/* Logo */}
          <motion.img
            src={`${BACKEND_URL}/welcomeSlide/logo.png`}
            alt="STEM Inspires Logo"
            className="w-28 md:w-32 rounded-md"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
          >
            <span style={{ color: wordColors.current.stem }}>STEM</span>{" "}
            <span style={{ color: wordColors.current.inspires }}>
              Inspires
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-lg max-w-2xl text-white/90 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Inspiring the next generation of innovators through inclusive,
            exciting, and hands-on robotics curriculums that empower
            creativity and real-world problem solving.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {/* Primary */}
            <a
              href="/about"
              style={{ backgroundColor: wordColors.current.stem }}
              className="px-7 py-3 rounded-full font-semibold text-black tracking-wide transition-all hover:scale-105 hover:brightness-90"
            >
              Learn About STEM Inspires
            </a>

            {/* Secondary */}
            <a
              href="/ourProjects"
              style={{
                borderColor: wordColors.current.inspires,
                color: wordColors.current.inspires,
              }}
              className="border-2 px-7 py-3 rounded-full font-semibold tracking-wide transition-all hover:scale-105 hover:brightness-110"
            >
              See Events
            </a>
          </motion.div>
        </div>
      </div>

      {/* Slide Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slidesData.map((_, index) => (
          <motion.div
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3.5 h-3.5 rounded-full cursor-pointer ${
              index === currentSlide ? "scale-125" : "opacity-50"
            }`}
            style={{
              backgroundColor:
                index === currentSlide
                  ? wordColors.current.stem
                  : "rgba(255,255,255,0.35)",
            }}
            whileHover={{ scale: 1.4 }}
            transition={{ type: "spring", stiffness: 260 }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
