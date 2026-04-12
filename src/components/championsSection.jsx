import React, { useState, useEffect } from "react";
import ChampionCard from "./championsCard.jsx";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ITEMS_PER_PAGE = 4;

const ChampionsSection = () => {
  const [champions, setChampions] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/champions`)
      .then((res) => res.json())
      .then((data) => {
        setChampions(
          data.map((c) => ({
            ...c,
            image: `${BACKEND_URL}${c.image?.startsWith("/") ? "" : "/"}${c.image}`,
          })),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="py-20 text-center font-mono text-[10px] tracking-[0.5em] opacity-50">
        INITIALIZING_ARCHIVE...
      </div>
    );

  return (
    <section className="bg-[#fcfcfc] py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Minimalist Header */}
        <div className="mb-24 border-l-2 border-black pl-8">
          <p className="text-[#f21ea7] font-mono text-[10px] tracking-[0.4em] uppercase mb-2">
            Database_Access_Granted
          </p>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-slate-900">
            The{" "}
            <span className="text-slate-400 italic font-light">Champions</span>
          </h2>
        </div>

        <div className="space-y-32 md:space-y-48">
          {champions.slice(0, visibleCount).map((champion, index) => (
            <ChampionCard
              key={champion._id || index}
              champion={champion}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>

        {visibleCount < champions.length && (
          <div className="mt-32 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              className="px-12 py-4 border border-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-black hover:text-white transition-all duration-500"
            >
              Expand_Directory [+]
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChampionsSection;
