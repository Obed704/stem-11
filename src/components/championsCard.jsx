import React from "react";
import { motion } from "framer-motion";

const ChampionCard = ({ champion, reverse }) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 md:gap-20`}
    >
      {/* IMAGE CONTAINER with WIPE EFFECT */}
      <div className="w-full md:w-[45%] relative">
        <div className="relative overflow-hidden rounded-sm shadow-2xl h-[350px] md:h-[450px]">
          {" "}
          {/* Reduced height */}
          {/* The Image */}
          <motion.img
            variants={{
              hidden: { scale: 1.2, opacity: 0 },
              visible: {
                scale: 1,
                opacity: 1,
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            src={champion.image}
            alt={champion.title}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          {/* COLOR WIPE OVERLAY */}
          <motion.div
            variants={{
              hidden: { x: "-100%" },
              visible: {
                x: "100%",
                transition: { duration: 0.8, ease: "easeInOut" },
              },
            }}
            className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-[#17cfdc]/80 to-transparent pointer-events-none"
            style={{ width: "200%" }}
          />
          {/* SECONDARY WIPER (Accent Color) */}
          <motion.div
            variants={{
              hidden: { y: "100%" },
              visible: {
                y: "-100%",
                transition: { duration: 1, delay: 0.2, ease: "easeInOut" },
              },
            }}
            className="absolute inset-0 z-10 bg-[#f21ea7]/10 pointer-events-none"
          />
        </div>

        {/* Floating Tag */}
        <div
          className={`absolute -bottom-4 ${reverse ? "-left-4" : "-right-4"} bg-black text-white px-6 py-3 font-mono text-[9px] tracking-[0.3em] uppercase z-20`}
        >
          Class: {champion.season || "S_01"}
        </div>
      </div>

      {/* CONTENT BLOCK */}
      <div className="w-full md:w-[55%] space-y-8">
        <div className="space-y-4">
          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.4 } },
            }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-slate-900"
          >
            {champion.title}
          </motion.h3>
          <div className="h-[1px] w-24 bg-[#17cfdc]" />
        </div>

        <motion.p
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 0.6 } },
          }}
          className="text-slate-500 text-lg leading-relaxed font-light max-w-xl"
        >
          {champion.description}
        </motion.p>

        {champion.roadToVictory && (
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0, transition: { delay: 0.8 } },
            }}
            className="border-l-2 border-slate-200 pl-6 py-2"
          >
            <p className="text-xs font-mono uppercase text-slate-400 tracking-widest mb-2">
              Core_Insight:
            </p>
            <p className="italic text-slate-600 font-medium leading-relaxed">
              "{champion.roadToVictory}"
            </p>
          </motion.div>
        )}

        {champion.cta && (
          <motion.a
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { delay: 1 } },
            }}
            href={champion.cta.link}
            className="inline-block group"
          >
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-black group-hover:text-[#f21ea7] transition-colors">
              <span>Initialize_Profile_Link</span>
              <div className="w-8 h-[1px] bg-black group-hover:bg-[#f21ea7] group-hover:w-16 transition-all duration-500" />
            </div>
          </motion.a>
        )}
      </div>
    </motion.section>
  );
};

export default ChampionCard;
