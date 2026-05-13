import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavigationButtons from "./Button";
import { authApi, removeToken, removeAdmin } from "../../api.js";

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
    { name: "Settings", path: "/header-settings", icon: "⚙️" },
  ];

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error(err);
    }
    removeToken();
    removeAdmin();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* ── DESKTOP LAYOUT (md+) ── */}
      <div className="hidden md:flex min-h-screen bg-slate-950 text-slate-100">
        <NavigationButtons />

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: isSidebarOpen ? 280 : 80 }}
          className="bg-slate-900 border-r border-white/5 flex flex-col z-40 sticky top-0 h-screen"
        >
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

          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
            {pages.map((page) => (
              <NavLink
                key={page.path}
                to={page.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <span className="text-xl">{page.icon}</span>
                {isSidebarOpen && (
                  <span className="text-sm font-medium">{page.name}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400"
            >
              <span className="text-xl">🚪</span>
              {isSidebarOpen && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8">
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </header>
          <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
      </div>

      {/* ── MOBILE LAYOUT (< md) ── */}
      <MobileAdminLayout
        title={title}
        subtitle={subtitle}
        pages={pages}
        onLogout={handleLogout}
      >
        {children}
      </MobileAdminLayout>
    </>
  );
};

/* ─────────────────────────────────────────────
   Mobile shell (visible only on small screens)
───────────────────────────────────────────── */
const MobileAdminLayout = ({ children, title, subtitle, pages, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const bottomNav = [
    { icon: "📊", label: "Dash", tab: "dashboard", path: "/admin-dashboard" },
    { icon: "📧", label: "Inbox", tab: "inbox", path: "/admin-emails" },
    { icon: "👥", label: "Team", tab: "team", path: "/admin-team" },
    { icon: "⚙️", label: "Config", tab: "settings", path: "/header-settings" },
  ];

  return (
    <div className="md:hidden min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
            {subtitle || "System_V2"}
          </p>
          <h1 className="text-lg font-bold">{title || "Admin Panel"}</h1>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center"
        >
          ☰
        </button>
      </header>

      {/* Page content */}
      <main className="px-4 pt-4">{children}</main>

      {/* Full-screen Drawer (all nav links) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-slate-900 border-l border-white/5 z-[9999] flex flex-col"
            >
              <div className="p-5 border-b border-white/5 flex justify-between items-center">
                <span className="font-black text-lg italic uppercase">
                  STEM<span className="text-cyan-400">ADMIN</span>
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {pages.map((page) => (
                  <NavLink
                    key={page.path}
                    to={page.path}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <span className="text-xl">{page.icon}</span>
                    <span className="text-sm font-medium">{page.name}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t border-white/5">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                >
                  <span className="text-xl">🚪</span>
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex justify-between items-center">
        {bottomNav.slice(0, 2).map((item) => (
          <NavIcon
            key={item.tab}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.tab}
            onClick={() => {
              setActiveTab(item.tab);
              navigate(item.path);
            }}
          />
        ))}

        {/* FAB */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-14 h-14 bg-cyan-500 -mt-10 rounded-full shadow-lg shadow-cyan-500/30 flex items-center justify-center text-2xl border-4 border-slate-950"
        >
          ☰
        </button>

        {bottomNav.slice(2).map((item) => (
          <NavIcon
            key={item.tab}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.tab}
            onClick={() => {
              setActiveTab(item.tab);
              navigate(item.path);
            }}
          />
        ))}
      </nav>
    </div>
  );
};

const NavIcon = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1">
    <span className={`text-xl transition-colors ${active ? "text-cyan-400" : "text-slate-500"}`}>
      {icon}
    </span>
    <span
      className={`text-[10px] font-bold tracking-tighter uppercase ${active ? "text-cyan-400" : "text-slate-500"
        }`}
    >
      {label}
    </span>
  </button>
);

export default AdminLayout;