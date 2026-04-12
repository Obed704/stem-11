import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Ensure framer-motion is installed
import Navbar from "../Header";
import Banner from "../bannerChampion";
import ChampionsSection from "../championsSection";
import Gallery from "../gallery";
import Footer from "../Footer";
import ChatBolt from "../ChatBolt";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WomenInStem = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [navbar, setNavbar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [navbarRes, bannerRes, galleryRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/navbar`),
          fetch(`${BACKEND_URL}/api/banner`),
          fetch(`${BACKEND_URL}/api/gallery`),
        ]);

        if (!navbarRes.ok || !bannerRes.ok || !galleryRes.ok) {
          throw new Error(
            "One or more requests failed to connect to the server.",
          );
        }

        const navbarData = await navbarRes.json();
        const bannerData = await bannerRes.json();
        const galleryData = await galleryRes.json();

        if (!mounted) return;

        setNavbar(navbarData);
        setBanner(bannerData);
        setGallery(Array.isArray(galleryData) ? galleryData : []);

        // Small delay to let animations breathe
        setTimeout(() => {
          if (mounted) setLoading(false);
        }, 800);
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError(err.message || "Failed to load Women in STEM page");
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => (mounted = false);
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
            src="/logo.png" // Ensure this matches your logo path
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

  // 3. MAIN CONTENT
  return (
    <>
      <Navbar bg="bg-black" settings={navbar} />
      <Banner bannerData={banner} />
      <ChatBolt />
      <ChampionsSection />
      <Gallery galleryImages={gallery} />
      <Footer />
    </>
  );
};

export default WomenInStem;
