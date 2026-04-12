import React from "react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Gallery = ({ galleryImages = [] }) => {
  if (galleryImages.length === 0) return null;

  return (
    <section id="gallery" className="py-24 bg-white w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#17cfdc]" />
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-slate-400">
                Visual_Database
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              The <span className="text-[#f21ea7]">Gallery</span>
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Total_Entries: {galleryImages.length.toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Masonry-inspired Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryImages.map((item, index) => (
            <motion.div
              key={item._id || index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: index * 0.1 },
                },
              }}
              className="relative group cursor-none overflow-hidden rounded-sm bg-slate-100"
            >
              {/* Image with zoom effect */}
              <motion.img
                src={`${BACKEND_URL}${item.image}`}
                alt={item.alt || "STEM Gallery"}
                className="w-full h-auto object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                loading="lazy"
              />

              {/* Scanning Wipe Effect (Entrance Only) */}
              <motion.div
                variants={{
                  hidden: { x: "-100%" },
                  visible: {
                    x: "100%",
                    transition: {
                      duration: 0.8,
                      ease: "easeInOut",
                      delay: index * 0.1,
                    },
                  },
                }}
                className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-[#17cfdc]/40 to-transparent pointer-events-none"
              />

              {/* System Overlay on Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <div className="w-4 h-4 border-t border-l border-white/40" />
                  <span className="text-[8px] font-mono text-white/60 tracking-widest">
                    IMG_ENTRY_{index + 1}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-white font-bold uppercase tracking-tight text-sm">
                    {item.title || "STEM_RECORD"}
                  </p>
                  <div className="h-[1px] w-0 group-hover:w-full bg-[#17cfdc] transition-all duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
