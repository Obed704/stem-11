import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const pages = [
    { name: "Champions", path: "/admin-champions", icon: "🏆", desc: "Manage Hall of Fame and recent winners" },
    { name: "Mission & Vision", path: "/admin-vision-mission", icon: "🎯", desc: "Configure core organization values" },
    { name: "Sponsors", path: "/admin-sponsors", icon: "🏢", desc: "Manage corporate and local partners" },
    { name: "Team", path: "/admin-team", icon: "👥", desc: "Update organization members and roles" },
    { name: "Resources", path: "/admin-resources", icon: "📁", desc: "Manage downloadable files and videos" },
    { name: "Education", path: "/admin-education", icon: "🎓", desc: "Update STEM modules and learning materials" },
    { name: "Recruiting", path: "/admin-recruiting-process", icon: "🤝", desc: "Manage school onboarding steps" },
    { name: "Champions Gallery", path: "/admin-gallery", icon: "🖼️", desc: "Curate visual database images" },
    { name: "Testimonials", path: "/admin-testimonials", icon: "💬", desc: "Manage community feedback and comments" },
    { name: "Get Involved", path: "/admin-getInvolved", icon: "✨", desc: "Manage involvement opportunity cards" },
    { name: "Support Components", path: "/admin-support", icon: "❤️", desc: "Configure donation and support blocks" },
    { name: "Navbar Settings", path: "/header-settings", icon: "⚙️", desc: "Configure header navigation and colors" },
    { name: "Home Settings", path: "/welcome-settings", icon: "🏠", desc: "Update home page text and slides" },
    { name: "Emails", path: "/admin-emails", icon: "📧", desc: "Manage contact form submissions" },
  ];

  return (
    <AdminLayout title="System Overview" subtitle="Management_View">
      {/* ── DESKTOP GRID (shown inside the sidebar layout) ── */}
      <div className="hidden md:block">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <NavLink
              key={page.path}
              to={page.path}
              className="group relative overflow-hidden bg-slate-900 border border-white/5 rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/5"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-500">
                  {page.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {page.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {page.desc}
                </p>
              </div>

              {/* Hover Indicator */}
              <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-cyan-400 font-mono text-xs uppercase tracking-widest">
                Manage_Now →
              </div>
            </NavLink>
          ))}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              ✓
            </div>
            <div>
              <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Database_Status</p>
              <p className="text-white font-bold text-lg mt-0.5">Sync Successful</p>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              📊
            </div>
            <div>
              <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Available_Nodes</p>
              <p className="text-white font-bold text-lg mt-0.5">{pages.length} Active Modules</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE CONTENT (shown inside the mobile layout) ── */}
      <div className="md:hidden space-y-3">
        {/* Quick Stats */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
          <div className="min-w-[140px] bg-slate-900 p-4 rounded-2xl border border-white/5">
            <p className="text-slate-500 text-xs uppercase font-bold">Status</p>
            <p className="text-green-400 font-bold">● Online</p>
          </div>
          <div className="min-w-[140px] bg-slate-900 p-4 rounded-2xl border border-white/5">
            <p className="text-slate-500 text-xs uppercase font-bold">Nodes</p>
            <p className="text-white font-bold">{pages.length} Active</p>
          </div>
        </div>

        {/* Module List */}
        <h2 className="text-sm font-mono text-slate-500 uppercase pt-2">Management_Modules</h2>
        {pages.map((page) => (
          <motion.div
            key={page.path}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(page.path)}
            className="flex items-center gap-4 bg-slate-900 border border-white/5 p-4 rounded-2xl active:border-cyan-500/50 cursor-pointer"
          >
            <div className="text-2xl w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
              {page.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base">{page.name}</h3>
              <p className="text-xs text-slate-500 truncate">{page.desc}</p>
            </div>
            <div className="text-slate-600 shrink-0">❯</div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;