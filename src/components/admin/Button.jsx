import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FloatingNavigationButtons = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const menuVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { staggerChildren: 0.08 },
    },
    exit: { opacity: 0, y: 10, scale: 0.95 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0 },
  };

  const NavButton = ({ label, sub, icon, onClick }) => (
    <motion.button
      variants={itemVariants}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-slate-900 text-white border border-white/10 shadow-lg hover:border-cyan-400 hover:shadow-cyan-500/20 transition w-full"
    >
      <div className="text-left">
        <div className="text-sm font-bold">{label}</div>
        <div className="text-xs text-slate-400">{sub}</div>
      </div>
      <div className="text-lg">{icon}</div>
    </motion.button>
  );

  const go = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* BACKDROP */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />
        )}
      </AnimatePresence>

      {/* ── DESKTOP: right-side vertical toggle ── */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-[9999] flex-row-reverse items-center gap-4">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          className="w-14 h-56 bg-slate-900 text-white border border-white/10 rounded-xl shadow-xl flex flex-col items-center justify-between py-8"
        >
          <span className="text-[10px] font-bold [writing-mode:vertical-rl] rotate-180">
            {isOpen ? "CLOSE" : "MENU"}
          </span>
          <motion.div animate={{ rotate: isOpen ? 90 : 0 }} className="text-xl">
            ☰
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-3 w-64"
            >
              <NavButton label="Home" sub="Main page" icon="🏠" onClick={() => go("/")} />
              <NavButton label="Dashboard" sub="Admin panel" icon="📊" onClick={() => go("/admin-dashboard")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MOBILE: bottom-center pill ── */}
      <div className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999]">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 w-72 space-y-3"
            >
              <NavButton label="Home" sub="Main page" icon="🏠" onClick={() => go("/")} />
              <NavButton label="Dashboard" sub="Admin panel" icon="📊" onClick={() => go("/admin-dashboard")} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-slate-900 text-white border border-white/10 rounded-full shadow-lg font-bold"
        >
          {isOpen ? "Close Menu" : "Quick Nav"}
        </motion.button>
      </div>
    </>
  );
};

export default FloatingNavigationButtons;