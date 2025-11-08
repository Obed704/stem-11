// TestimonialsCards.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TestimonialCard = ({ t }) => (
  <motion.div
    whileHover={{ scale: 1.03, boxShadow: `0 8px 20px ${t.borderColor}77` }}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="p-8 rounded-3xl bg-blue-950"
    style={{
      border: `3px solid ${t.borderColor}`,
      boxShadow: `0 4px 12px ${t.borderColor}33`,
    }}
  >
    <p
      style={{
        fontFamily: t.font,
        color: t.textColor,
        fontStyle: "italic",
        lineHeight: 1.6,
        fontSize: "1.1rem",
      }}
      className="mb-6"
    >
      “{t.text}”
    </p>
    <h3
      style={{
        fontFamily: t.font,
        color: t.textColor,
        fontSize: "1.25rem",
        fontWeight: 700,
      }}
    >
      {t.name}
    </h3>
    <p style={{ color: t.textColor, opacity: 0.9 }}>{t.role}</p>
  </motion.div>
);

const TestimonialsCards = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/testimonials`);
        if (!res.ok) throw new Error("Failed to fetch testimonials");

        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-blue-900 flex justify-center">
        <div className="text-white">Loading…</div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-blue-900 flex justify-center">
        <div className="text-white">No testimonials available.</div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-blue-900 flex flex-col items-center">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        What People Say About STEM Inspires
      </motion.h2>

      {/* Desktop grid */}
      <div className="hidden lg:grid grid-cols-3 gap-8 w-full max-w-6xl px-6">
        {testimonials.map((t, idx) => (
          <TestimonialCard key={t._id} t={t} />
        ))}
      </div>

      {/* Swiper on mobile/tablet */}
      <div className="w-full max-w-2xl px-6 lg:hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="pb-12"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t._id}>
              <TestimonialCard t={t} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialsCards;
