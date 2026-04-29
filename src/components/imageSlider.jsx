import React, { useState, useRef, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// ─── Resolve URL ───────────────────────────────────────────────────────────────
const resolve = (src) =>
  src?.startsWith("http") ? src : `${BACKEND_URL}${src}`;

// ─── Shimmer ──────────────────────────────────────────────────────────────────
const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
    <div
      style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg,#0f172a 25%,#1e293b 50%,#0f172a 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite",
      }}
    />
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

// ─── BlurBackdropImage ────────────────────────────────────────────────────────
// The core creative solution:
//   Layer 1 — same image, object-cover, blurred + darkened → fills ALL dead space
//   Layer 2 — radial vignette for depth
//   Layer 3 — actual image, object-CONTAIN → 100% visible, zero cropping ever
// Works perfectly for portrait, landscape, square, panoramic, anything.
const BlurBackdropImage = React.memo(({ src, alt, priority = false }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Blurred fill backdrop */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: "cover",
          filter: "blur(32px) brightness(0.3) saturate(1.6)",
          transform: "scale(1.15)",   // hides blur edge bleed
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s",
        }}
        onLoad={() => setLoaded(true)}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Shimmer while loading */}
      {!loaded && <Shimmer className="absolute inset-0 z-[2]" />}

      {/* Real image — fully visible, NEVER cropped */}
      <img
        src={src}
        alt={alt || ""}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 w-full h-full z-[2]"
        style={{
          objectFit: "contain",
          objectPosition: "center",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  );
});

// ─── ThumbImage — same blur-backed contain strategy ──────────────────────────
const ThumbImage = React.memo(({ src, alt, isActive }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "1/1" }}>
      {/* Blurred fill */}
      <img
        src={src} alt="" aria-hidden loading="lazy" decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "blur(12px) brightness(0.35)",
          transform: "scale(1.1)",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s",
        }}
        onLoad={() => setLoaded(true)}
      />
      {/* Full image, contained */}
      <img
        src={src} alt={alt || ""} loading="lazy" decoding="async"
        className="absolute inset-0 w-full h-full object-contain z-10"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s" }}
      />
      {/* Active ring */}
      {isActive && (
        <motion.div
          layoutId="activeThumb"
          className="absolute inset-0 z-20 rounded-lg"
          style={{
            boxShadow: "inset 0 0 0 2px rgb(23,207,220)",
            background: "rgba(23,207,220,0.12)",
          }}
        />
      )}
    </div>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────
const ThumbnailCarouselFullScreen = ({ initialSlides = [] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const formattedSlides = useMemo(
    () => initialSlides.map((img) => ({ ...img, src: resolve(img.src) })),
    [initialSlides],
  );

  // Preload neighbours on index change
  useEffect(() => {
    if (!formattedSlides.length) return;
    const n = formattedSlides.length;
    [activeIndex, (activeIndex + 1) % n, (activeIndex - 1 + n) % n].forEach((i) => {
      const src = formattedSlides[i]?.src;
      if (src) { const img = new window.Image(); img.src = src; }
    });
  }, [activeIndex, formattedSlides]);

  if (!formattedSlides.length) {
    return (
      <div className="w-full h-[40vh] flex items-center justify-center bg-slate-900 rounded-2xl border border-white/5">
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest animate-pulse">
          Awaiting Media Assets...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">

      {/* ══ MAIN VIEWER ════════════════════════════════════════════════════════ */}
      <div
        className="relative rounded-2xl overflow-hidden bg-slate-950 shadow-2xl"
        style={{ height: "clamp(380px, 64vh, 820px)" }}
      >
        <Swiper
          effect="fade"
          spaceBetween={0}
          navigation={{ nextEl: ".nav-next", prevEl: ".nav-prev" }}
          autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[Navigation, Thumbs, Autoplay, EffectFade]}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActiveIndex(s.realIndex)}
          className="h-full w-full"
        >
          {formattedSlides.map((img, idx) => (
            <SwiperSlide key={img._id || idx}>
              <div className="relative w-full h-full">

                {/* ── Full image, blur-backed, zero cropping ── */}
                <BlurBackdropImage
                  src={img.src}
                  alt={img.alt}
                  priority={idx === 0 || idx === activeIndex}
                />

                {/* ── Caption gradient ── */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 z-10 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)" }}
                />

                {/* ── Caption ── */}
                <AnimatePresence mode="wait">
                  {idx === activeIndex && img.caption && (
                    <motion.div
                      key={`cap-${idx}`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-x-0 bottom-0 z-20 px-6 pb-6 md:px-10 md:pb-8"
                    >
                      <span className="inline-block px-3 py-1 mb-2 text-[9px] font-black tracking-[0.3em] uppercase bg-[rgb(23,207,220)] text-slate-900 rounded-full">
                        Project Detail
                      </span>
                      <p className="text-base md:text-xl font-semibold text-white leading-snug tracking-tight max-w-xl drop-shadow-lg">
                        {img.caption}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Counter ── */}
                <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                  <span className="text-[10px] font-mono text-white/60 tracking-widest">
                    {String(idx + 1).padStart(2, "0")} / {String(formattedSlides.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── Nav arrows ── */}
        {["prev", "next"].map((dir) => (
          <button
            key={dir}
            className={`nav-${dir} absolute ${dir === "prev" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-white hidden md:flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300`}
            aria-label={dir === "prev" ? "Previous" : "Next"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                d={dir === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
        ))}

        {/* ── Mobile swipe hint ── */}
        <motion.div
          className="absolute bottom-14 inset-x-0 flex justify-center z-20 md:hidden pointer-events-none"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2.5, duration: 1.2 }}
        >
          <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/50 text-[9px] tracking-widest font-mono uppercase">
            Swipe to browse
          </span>
        </motion.div>
      </div>

      {/* ══ THUMBNAIL STRIP ════════════════════════════════════════════════════ */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={8}
        slidesPerView={4}
        watchSlidesProgress
        modules={[Navigation, Thumbs]}
        breakpoints={{
          480: { slidesPerView: 5 },
          768: { slidesPerView: 6, spaceBetween: 10 },
          1024: { slidesPerView: 8, spaceBetween: 12 },
        }}
      >
        {formattedSlides.map((img, idx) => (
          <SwiperSlide
            key={img._id || idx}
            className="cursor-pointer"
            style={{
              opacity: activeIndex === idx ? 1 : 0.45,
              transform: activeIndex === idx ? "scale(1.06)" : "scale(1)",
              transition: "opacity 0.3s, transform 0.3s",
            }}
          >
            {({ isActive }) => (
              <ThumbImage src={img.src} alt={img.alt} isActive={isActive} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ══ DOT STRIP — mobile ═════════════════════════════════════════════════ */}
      <div className="flex justify-center gap-1.5 pt-1 md:hidden">
        {formattedSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => swiperRef.current?.slideTo(idx)}
            aria-label={`Slide ${idx + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: activeIndex === idx ? 20 : 6,
              height: 6,
              backgroundColor:
                activeIndex === idx ? "rgb(23,207,220)" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ThumbnailCarouselFullScreen;