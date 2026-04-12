import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Header";
import Fll from "../fll";
import RecruitingProcess from "../recruiting";
import Footer from "../Footer";
import EducationElements from "../educationElements";
import ThumbnailCarouselFullScreen from "../imageSlider";
import ChatBolt from "../ChatBolt";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pageData, setPageData] = useState({
    navbar: null,
    fll: [],
    process: [],
    education: [],
    slides: [],
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        const endpoints = [
          "/api/navbar",
          "/api/fll",
          "/api/process",
          "/api/education",
          "/api/project-slides",
        ];

        const promises = endpoints.map((endpoint) =>
          fetch(`${BACKEND_URL}${endpoint}`).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch ${endpoint} – ${res.status}`);
            }
            return res.json();
          }),
        );

        const [navbar, fllData, processData, educationData, slidesData] =
          await Promise.all(promises);

        if (!isMounted) return;

        setPageData({
          navbar,
          fll: fllData || [],
          process: processData || [],
          education: educationData || [],
          slides: slidesData || [],
        });

        // Small delay to let animations breathe
        setTimeout(() => {
          if (isMounted) setLoading(false);
        }, 800);
      } catch (err) {
        console.error("Failed to load page data:", err);
        if (isMounted) {
          setError(err.message || "Could not load the content.");
          setLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 1. PROFESSIONAL LOADING VIEW
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
            animate={{ scale: [0.95, 1, 0.95] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-400">
              Initializing_System
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

  // 2. ERROR VIEW
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-lg border border-white/10 p-12 bg-white/5 backdrop-blur-xl">
          <h2 className="text-white text-3xl font-black uppercase tracking-tighter mb-4">
            Connection_Reset
          </h2>
          <p className="text-slate-400 font-mono text-xs uppercase tracking-widest mb-8">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-pink-600 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-pink-700 transition-colors"
          >
            Retry_System_Check
          </button>
        </div>
      </div>
    );
  }

  // 3. MAIN APP RENDER
  return (
    <div className="bg-white min-h-screen">
      <Navbar settings={pageData.navbar} />

      <main>
        <Fll data={pageData.fll} />
        <RecruitingProcess steps={pageData.process} />
        <EducationElements elements={pageData.education} />
        <ThumbnailCarouselFullScreen initialSlides={pageData.slides} />
      </main>

      <ChatBolt />
      <Footer />
    </div>
  );
}

export default App;
