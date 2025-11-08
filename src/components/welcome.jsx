import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const HeroSection = () => {
  const [slidesData, setSlidesData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);

  // Fetch slides from backend
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

  // Auto-slide interval
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

  const renderColoredTitle = (text) => {
    const colors = ["rgb(247, 244, 46)", "rgb(23, 207, 220)", "rgb(242, 30, 167)"];
    return text.split("").map((char, i) => (
      <motion.span
        key={i}
        style={{ color: colors[i % colors.length] }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
      >
        {char}
      </motion.span>
    ));
  };

  if (slidesData.length === 0) {
    return (
      <section className="hero relative h-screen flex items-center justify-center bg-black text-white">
        <p>Loading slides...</p>
      </section>
    );
  }

  return (
    <section className="hero relative h-screen overflow-hidden">
      {/* Background Slides with Smooth Fade */}
      <AnimatePresence>
        {slidesData.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide._id || index}
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${BACKEND_URL}${slide.bg})` }}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            )
        )}
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10"></div>

      {/* Hero content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-start px-8 max-w-5xl text-white space-y-6 md:ml-4">
        {/* Logo */}
        <motion.img
          src={`${BACKEND_URL}/welcomeSlide/logo.avif`}
          alt="STEM Inspires Logo"
          className="w-32 mb-4 rounded-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* Title */}
        <motion.h1
          className="text-5xl font-bold text-blue-500"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {renderColoredTitle("STEM Inspires")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Inspiring the Next Generation of Innovators Through Inclusive, Exciting,
          and Hands-On Robotics Curriculums
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex gap-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <a
            href="/about"
            className="bg-purple-700 text-white px-6 py-3 rounded-full hover:bg-purple-800 transition-colors duration-300"
          >
            Learn About STEM Inspires
          </a>
          <a
            href="/ourProjects"
            className="border-white text-white border px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors duration-300"
          >
            See Events
          </a>
        </motion.div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {slidesData.map((_, index) => (
          <motion.div
            key={index}
            className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
              index === currentSlide
                ? "bg-red-500 scale-125"
                : "bg-white opacity-50"
            }`}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.4 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;