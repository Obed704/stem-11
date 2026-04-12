import Navbar from "../Header";
import Footer from "../Footer";
import FTCLanding from "../ftc-welcome";
import ChatBolt from "../ChatBolt";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function FtcPage() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [navbar, setNavbar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchNavbar = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/navbar`);
        if (!res.ok) throw new Error("Failed to fetch navbar");

        const data = await res.json();

        if (!mounted) return;

        setNavbar(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError("Unable to load navbar");
          setLoading(false);
        }
      }
    };

    fetchNavbar();

    return () => {
      mounted = false;
    };
  }, [BACKEND_URL]);

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

  return (
    <div className="bg-white selection:bg-[#17cfdc] selection:text-white">
      {/* Set Navbar to black background as per your request */}
      <Navbar bg="bg-black" settings={navbar} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <FTCLanding />
      </motion.div>

      <ChatBolt />
      <Footer />
    </div>
  );
}

export default FtcPage;
