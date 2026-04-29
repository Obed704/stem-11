import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavigationButtons from "./Button";

const AdminLayout = ({ children, title, subtitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const pages = [
    { name: "Dashboard", path: "/admin-dashboard", icon: "📊" },
    { name: "Champions", path: "/admin-champions", icon: "🏆" },
    { name: "Gallery", path: "/admin-gallery", icon: "🖼️" },
    { name: "Mission & Vision", path: "/admin-vision-mission", icon: "🎯" },
    { name: "Team", path: "/admin-team", icon: "👥" },
    { name: "Resources", path: "/admin-resources", icon: "📁" },
    { name: "Education", path: "/admin-education", icon: "🎓" },
    { name: "Recruiting", path: "/admin-recruiting-process", icon: "🤝" },
    { name: "Project Slides", path: "/admin-project-slide", icon: "🎞️" },
    { name: "Home Slides", path: "/admin-welcome-slides", icon: "🏠" },
    { name: "Testimonials", path: "/admin-testimonials", icon: "💬" },
    { name: "Get Involved", path: "/admin-getInvolved", icon: "✨" },
    { name: "Support", path: "/admin-support", icon: "❤️" },
    { name: "Sponsors", path: "/admin-sponsors", icon: "🏢" },
    { name: "Emails", path: "/admin-emails", icon: "📧" },
    { name: "Payments", path: "/admin-payments", icon: "💳" },
    { name: "Settings", path: "/header-settings", icon: "⚙️" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <NavigationButtons />

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-slate-900 border-r border-white/5 flex flex-col z-40 sticky top-0 h-screen"
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/5 h-20">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-black text-xl tracking-tighter uppercase italic"
              >
                STEM<span className="text-cyan-400">ADMIN</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isSidebarOpen ? "❮" : "❯"}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {pages.map((page) => (
            <NavLink
              key={page.path}
              to={page.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`
              }
            >
              <span className="text-xl">{page.icon}</span>
              <AnimatePresence mode="wait">
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium whitespace-nowrap overflow-hidden text-sm"
                  >
                    {page.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 px-4 py-3 w-full rounded-xl transition-all duration-300 group text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent`}
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {title || "Admin Dashboard"}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-white">Administrator</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">System_Online</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 p-[1px]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-black">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
