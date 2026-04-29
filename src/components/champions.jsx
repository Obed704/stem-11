import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ChampionsSection = ({ championsFromParent = [] }) => {
  const [mobileLimit, setMobileLimit] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const orgColors = {
    pink: "rgb(242, 30, 167)",
    blue: "rgb(23, 207, 220)",
    yellow: "rgb(247, 244, 46)",
    slate: "#1e293b",
    border: "#f1f5f9",
  };

  const actualChampions = Array.isArray(championsFromParent)
    ? championsFromParent
    : championsFromParent?.champions || [];

  const sortedChampions = [...actualChampions].sort(
    (a, b) => (b.year || 0) - (a.year || 0),
  );

  const formattedChampions = sortedChampions.map((c) => ({
    id: c._id || c.id,
    name: c.title || c.name || "Unnamed",
    description: c.description || "",
    image: c.image || "",
    year: c.year || "N/A",
    to: "/champions",
  }));

  const desktopChampions = formattedChampions.slice(0, 3);
  const mobileChampions = formattedChampions.slice(0, mobileLimit);

  return (
    <section
      id="champions"
      className="pt-24 pb-0 bg-white relative overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: orgColors.pink }}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                Hall of Fame
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              RECENT{" "}
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: `1px ${orgColors.slate}` }}
              >
                CHAMPIONS
              </span>
            </h2>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-[9px] font-mono uppercase text-slate-300">
              Archive_Status: Synchronized
            </p>
            <p className="text-[9px] font-mono uppercase text-slate-300">
              Lat: -1.9441 | Long: 30.0619
            </p>
          </div>
        </div>

        {formattedChampions.length === 0 ? (
          <div className="py-20 text-center font-mono text-[10px] tracking-widest text-slate-300 uppercase border border-dashed border-slate-200">
            [ ! ] NO_DATA_STREAM_FOUND
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-3 border border-slate-100 divide-x divide-slate-100">
              {desktopChampions.map((c, i) => (
                <div
                  key={c.id}
                  className="p-10 hover:bg-slate-50/50 transition-all group relative"
                >
                  <div className="aspect-square bg-slate-100 mb-8 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img
                      src={c.image?.startsWith("http") ? c.image : `${BACKEND_URL}${c.image}`}
                      alt={c.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4 border-y border-slate-100 py-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Entry_0{i + 1}
                    </span>
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5"
                      style={{ backgroundColor: orgColors.yellow }}
                    >
                      {c.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-black uppercase mb-3 text-slate-800 tracking-tight group-hover:text-pink-600 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed mb-8 line-clamp-2 uppercase tracking-wide">
                    {c.description}
                  </p>
                  <Link
                    to={c.to}
                    className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] pt-4 border-t border-slate-100"
                    style={{ color: orgColors.blue }}
                  >
                    View Full Dossier{" "}
                    <span className="group-hover:translate-x-2 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="md:hidden space-y-6">
              {mobileChampions.map((c) => (
                <motion.div
                  key={c.id}
                  className="border border-slate-100 p-6 rounded-none"
                >
                  <img
                    src={c.image?.startsWith("http") ? c.image : `${BACKEND_URL}${c.image}`}
                    className="w-full h-64 object-cover mb-6 grayscale"
                  />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-2 py-1 text-[8px] font-black bg-slate-900 text-white uppercase">
                      {c.year}
                    </div>
                    <div className="h-[1px] flex-1 bg-slate-100" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
                    {c.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-6 uppercase leading-relaxed tracking-wider line-clamp-2 italic">
                    {c.description}
                  </p>
                  <Link
                    to={c.to}
                    className="text-[10px] font-black uppercase tracking-widest"
                    style={{ color: orgColors.pink }}
                  >
                    Analyze Journey →
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* BOTTOM ACTION - Tightened spacing */}
        <div className="mt-8 md:mt-12 flex flex-col items-center gap-6">
          <div className="w-full h-[1px] bg-slate-100" />
          <button
            onClick={() => setShowModal(true)}
            className="group relative px-12 py-5 overflow-hidden transition-all active:scale-95"
          >
            <div
              className="absolute inset-0 w-full h-full transition-all"
              style={{ backgroundColor: orgColors.pink }}
            />
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em] text-white">
              Open_Directory_Index
            </span>
          </button>
        </div>

        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-slate-900/98 backdrop-blur-2xl z-[200] flex flex-col items-center justify-center p-6 md:p-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-10 right-10 text-white text-[10px] font-black uppercase tracking-[0.5em] border border-white/20 px-6 py-2"
              >
                Close [ESC]
              </button>
              <div className="w-full max-w-4xl space-y-2">
                {formattedChampions.map((c, i) => (
                  <Link
                    key={c.id}
                    to={c.to}
                    className="flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:border-pink-500 transition-all group"
                  >
                    <div className="flex items-center gap-8">
                      <span className="text-xs font-mono text-slate-500">
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <h4 className="text-white font-black text-sm uppercase tracking-widest">
                        {c.name}
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">
                      {c.year}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ChampionsSection;
