import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({ baseURL: `${BACKEND_URL}/api/team` });

const TeamMemberDashboard = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({ name: "", role: "", email: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/");
      setMembers(res.data);
    } catch {
      console.error("Load failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (file) data.append("image", file);

    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/${editingId}`, data);
      } else {
        await api.post("/", data);
      }
      resetForm();
      fetchMembers();
      alert("Sync successful");
    } catch {
      alert("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setFormData({ name: member.name, role: member.role, email: member.email || "" });
    setEditingId(member._id);
    setPreview(member.image || null);
    setFormOpen(true);
    // Scroll to top so the form is visible on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Destroy record?")) return;
    try {
      setLoading(true);
      await api.delete(`/${id}`);
      fetchMembers();
    } catch {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", role: "", email: "" });
    setFile(null);
    setPreview(null);
    setEditingId(null);
    setFormOpen(false);
  };

  if (loading && members.length === 0)
    return (
      <AdminLayout title="Team Registry" subtitle="Synchronizing_Member_Database...">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-900 rounded-3xl border border-white/5" />
          ))}
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout title="Team Registry" subtitle={`${members.length}_members`}>
      <div className="space-y-8">

        {/* ── Mobile: Add button (collapsed by default) ── */}
        <div className="md:hidden">
          {!formOpen ? (
            <button
              onClick={() => setFormOpen(true)}
              className="w-full py-4 bg-white text-slate-950 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-400 transition-all shadow-xl"
            >
              + Register New Member
            </button>
          ) : null}
        </div>

        {/* ── Form Section ── */}
        {/* On desktop: always visible. On mobile: shown when formOpen */}
        <section
          className={`
            bg-slate-900 border border-white/5 rounded-[2rem] md:rounded-[3rem]
            p-6 sm:p-8 md:p-14 shadow-2xl relative overflow-hidden
            transition-all duration-300
            ${!formOpen ? "hidden md:block" : "block"}
          `}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between mb-6 md:mb-10 border-b border-white/5 pb-5 md:pb-6">
            <h2 className="text-base md:text-xl font-black text-white uppercase tracking-widest">
              {editingId ? "Update_Identity" : "Register_New_Member"}
            </h2>
            {/* Mobile close button */}
            <button
              onClick={resetForm}
              className="md:hidden w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-12">
            {/* Fields */}
            <div className="space-y-5 md:space-y-8">
              {/* Name + Role: stacked on mobile, side-by-side on sm+ */}
              <div className="grid sm:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">
                    Full_Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium text-sm md:text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">
                    Assigned_Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium text-sm md:text-base"
                />
              </div>

              {/* Photo upload — inline on mobile (moved above buttons) */}
              <div className="flex md:hidden items-center gap-5">
                <div className="relative w-20 h-20 shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-full blur-lg opacity-20" />
                  <div className="relative w-full h-full rounded-full border-2 border-white/10 overflow-hidden bg-slate-950 flex items-center justify-center">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files[0];
                        setFile(f);
                        setPreview(f ? URL.createObjectURL(f) : null);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Profile Photo</p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
                    Tap to upload
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-1 md:pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-4 md:py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-400 transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? "Processing..." : editingId ? "Update" : "Register"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-4 md:py-5 border border-white/10 text-slate-400 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/5 transition-all"
                  >
                    Abort
                  </button>
                )}
              </div>
            </div>

            {/* Photo Upload — large circle on desktop only */}
            <div className="hidden md:flex flex-col items-center justify-center">
              <div className="relative group w-48 h-48 mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-full animate-pulse blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-full h-full rounded-full border-2 border-white/10 overflow-hidden bg-slate-950 flex items-center justify-center group-hover:border-cyan-500/50 transition-all">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest text-center px-4">
                      select image
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      setFile(f);
                      setPreview(f ? URL.createObjectURL(f) : null);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Click_Image_To_Upload
              </p>
            </div>
          </form>
        </section>

        {/* ── Member List ── */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.4em] mb-4 ml-1">
            Team Members ({members.length})
          </h3>

          {members.map((m) => (
            <div
              key={m._id}
              className="group bg-slate-900 border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 flex items-center gap-4 md:gap-8 hover:border-cyan-500/20 transition-all duration-500"
            >
              {/* Avatar */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden border border-white/5 group-hover:border-cyan-500/30 transition-all shrink-0">
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-700 font-black text-xl">
                    ?
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm md:text-lg font-black text-white uppercase tracking-tight leading-none truncate">
                  {m.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 md:mt-2">
                  <span className="text-cyan-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 px-2 md:px-3 py-1 rounded-full border border-cyan-500/20 whitespace-nowrap">
                    {m.role}
                  </span>
                  <span className="text-slate-500 text-[9px] md:text-[10px] font-mono truncate hidden sm:block">
                    {m.email || "NO_COMM_CHANNEL"}
                  </span>
                </div>
                {/* Email on its own row for xs */}
                {m.email && (
                  <p className="sm:hidden text-slate-500 text-[9px] font-mono mt-1 truncate">
                    {m.email}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 md:gap-3 shrink-0">
                <button
                  onClick={() => handleEdit(m)}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl border border-white/5 text-slate-500 hover:bg-white/5 hover:text-white transition-all text-sm"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {members.length === 0 && (
            <div className="text-center py-16 text-slate-600 font-mono text-xs uppercase tracking-widest">
              No_Members_Found
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default TeamMemberDashboard;