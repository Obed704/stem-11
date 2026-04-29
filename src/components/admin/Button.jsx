import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FloatingNavigationButtons = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, x: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { staggerChildren: 0.1 }
    },
    exit: { opacity: 0, x: 10, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    // Fixed Right Center
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[10000] flex flex-row-reverse items-center gap-6">

      {/* Primary Control Bar */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        className="relative w-14 h-64 rounded-xl bg-white border-2 border-[#050505] flex flex-col items-center justify-between py-10 shadow-[8px_8px_0px_#050505] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 group"
      >
        {/* Label */}
        <span className="text-[#050505] text-[10px] font-black tracking-[0.5em] uppercase [writing-mode:vertical-lr] rotate-180">
          {isOpen ? "CLOSE" : "ACTIONS"}
        </span>

        {/* Navigation Icon */}
        <div className="flex flex-col gap-1 items-center">
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            className="text-[#050505] group-hover:text-cyan-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </motion.div>
        </div>
      </motion.button>

      {/* Expanded Actions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col gap-4"
          >
            {/* Home Link */}
            <motion.button
              variants={itemVariants}
              whileHover={{ x: -5 }}
              onClick={() => { navigate("/"); setIsOpen(false); }}
              className="group flex items-center gap-4 px-6 py-4 rounded-lg bg-white border-2 border-[#050505] text-[#050505] shadow-[4px_4px_0px_#050505] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-cyan-500 transition-all"
            >
              <div className="flex flex-col items-end">
                <span className="text-[12px] font-black uppercase tracking-widest">Home</span>
                <span className="text-[8px] opacity-50 font-bold uppercase tracking-tighter">Return to Main</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:text-cyan-500 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </motion.button>

            {/* Dashboard Link */}
            <motion.button
              variants={itemVariants}
              whileHover={{ x: -5 }}
              onClick={() => { navigate("/admin-dashboard"); setIsOpen(false); }}
              className="group flex items-center gap-4 px-6 py-4 rounded-lg bg-white border-2 border-[#050505] text-[#050505] shadow-[4px_4px_0px_#050505] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-cyan-500 transition-all"
            >
              <div className="flex flex-col items-end">
                <span className="text-[12px] font-black uppercase tracking-widest">Dashboard</span>
                <span className="text-[8px] opacity-50 font-bold uppercase tracking-tighter">Admin Console</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:text-cyan-500 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingNavigationButtons;