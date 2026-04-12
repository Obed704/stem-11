import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";

// CSS Imports
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const ThumbnailCarouselFullScreen = ({
  initialSlides = [],
  mainHeight = "70vh",
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const formattedSlides = initialSlides.map((img) => ({
    ...img,
    src: `${BACKEND_URL}${img.src}`,
  }));

  if (formattedSlides.length === 0) {
    return (
      <div className="w-full h-[40vh] flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest animate-pulse">
          Awaiting Media Assets...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Main Display Container */}
      <div
        className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900 group"
        style={{ height: "clamp(400px, 65vh, 800px)" }}
      >
        <Swiper
          effect={"fade"}
          spaceBetween={0}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[Navigation, Thumbs, Autoplay, EffectFade]}
          className="h-full w-full"
        >
          {formattedSlides.map((img, idx) => (
            <SwiperSlide key={img._id || idx}>
              <div className="relative w-full h-full">
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />

                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 10, ease: "linear" }}
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16">
                  <AnimatePresence mode="wait">
                    {img.caption && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="max-w-2xl"
                      >
                        <span className="inline-block px-3 py-1 mb-4 text-[10px] font-black tracking-[0.3em] uppercase bg-[rgb(23,207,220)] text-slate-900 rounded-full">
                          Project Detail
                        </span>
                        <p className="text-xl md:text-3xl font-medium text-white leading-tight tracking-tight drop-shadow-md">
                          {img.caption}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Professional Navigation Buttons (Desktop only) */}
          <button className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white hidden md:flex items-center justify-center hover:bg-white hover:text-black transition-all">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="swiper-button-next-custom absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white hidden md:flex items-center justify-center hover:bg-white hover:text-black transition-all">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </Swiper>
      </div>

      {/* Modern Thumbnail Bar */}
      <div className="px-2">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView={4}
          watchSlidesProgress
          modules={[Navigation, Thumbs]}
          breakpoints={{
            640: { slidesPerView: 5 },
            1024: { slidesPerView: 8 },
          }}
          className="thumbs-swiper"
        >
          {formattedSlides.map((img, idx) => (
            <SwiperSlide key={img._id || idx} className="cursor-pointer">
              {({ isActive }) => (
                <div
                  className={`relative aspect-video rounded-xl overflow-hidden transition-all duration-500 border-2 ${isActive ? "border-[rgb(23,207,220)] scale-105 shadow-lg" : "border-transparent opacity-50"}`}
                >
                  <img
                    src={img.src}
                    className="w-full h-full object-cover"
                    alt="thumb"
                  />
                  {isActive && (
                    <motion.div
                      layoutId="activeThumb"
                      className="absolute inset-0 bg-[rgb(23,207,220)]/10"
                    />
                  )}
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .thumbs-swiper .swiper-slide-thumb-active {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default ThumbnailCarouselFullScreen;
