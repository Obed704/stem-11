import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../Header.jsx";
import HeroSection from "../welcome.jsx";
import MissionVision from "../visionMission.jsx";
import ChampionsSection from "../champions.jsx";
import StatsSection from "../counter.jsx";
import TestimonialsSlider from "../comments.jsx";
import GetInvolved from "../getInvolved.jsx";
import SupportComponent from "../pages/supportComponent.jsx";
import SponsorsSection from "../sponsorSection.jsx";
import Footer from "../Footer.jsx";
import ChatBolt from "../ChatBolt.jsx";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data, setData] = useState({
    navbar: null,
    hero: null,
    slides: [],
    missionVision: [],
    champions: [],
    stats: null,
    testimonials: [],
    getInvolved: [],
    support: [],
    sponsors: [],
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      console.log("System: Initializing Data Fetch...");
      try {
        const endpoints = [
          "/api/navbar",
          "/api/hero",
          "/api/slides",
          "/api/mission-vision",
          "/api/champions",
          "/api/stats",
          "/api/testimonials",
          "/api/getinvolved",
          "/api/support",
          "/api/sponsors",
        ];

        const responses = await Promise.all(
          endpoints.map((ep) =>
            fetch(`${BACKEND_URL}${ep}`).then((res) => {
              if (!res.ok) throw new Error(`Failed: ${ep}`);
              return res.json();
            }),
          ),
        );

        if (!isMounted) return;

        // Destructure carefully
        const [
          navbar,
          hero,
          slides,
          missionVision,
          championsRaw,
          stats,
          testimonials,
          getInvolved,
          support,
          sponsors,
        ] = responses;

        // Safeguard the sort: Ensure championsRaw is an array
        const sortedChampions = Array.isArray(championsRaw)
          ? [...championsRaw].sort((a, b) => (b.year || 0) - (a.year || 0))
          : [];

        setData({
          navbar,
          hero,
          slides: slides || [],
          missionVision: missionVision || [],
          champions: sortedChampions,
          stats,
          testimonials: testimonials || [],
          getInvolved: getInvolved || [],
          support: support || [],
          sponsors: sponsors || [],
        });

        console.log("System: Data Sync Complete.");
        setLoading(false); // FORCED EXIT
      } catch (err) {
        console.error("System Error:", err);
        if (isMounted) {
          setError(err.message);
          setLoading(false); // EXIT EVEN ON ERROR
        }
      }
    };

    fetchAll();
    return () => {
      isMounted = false;
    };
  }, []);

  // LOADING VIEW
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.img
            src="/logo.png"
            alt="STEM Inspires"
            className="w-28 md:w-36 mx-auto mb-10"
            onError={(e) => console.log("Current path failed:", e.target.src)}
          />
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-400">
              Loading .....
            </div>
            <div className="w-48 h-[1px] bg-slate-100 mx-auto overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-300"
                animate={{ x: [-200, 200] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // MAIN RENDER
  return (
    <div className="bg-white min-h-screen">
      <Header fixed={true} settings={data.navbar} />
      <main>
        <HeroSection hero={data.hero} slides={data.slides} />
        <MissionVision cards={data.missionVision} />
        <ChatBolt />
        <ChampionsSection championsFromParent={data.champions} />
        <StatsSection statsSettings={data.stats} />
        <TestimonialsSlider testimonials={data.testimonials} />
        <GetInvolved involvementData={data.getInvolved} />
        <SupportComponent supportCards={data.support} />
        <SponsorsSection sponsors={data.sponsors} />
      </main>
      <Footer />
    </div>
  );
}
