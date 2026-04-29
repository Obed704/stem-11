import React, { useState, useEffect } from "react";
import axios from "axios";
import NavigationButtons from "./Button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function AdminFtc() {
  const [schools, setSchools] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", website: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Unified Loading States
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/schools`);
      setSchools(res.data);
    } catch (err) {
      console.error("Error fetching schools:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    const data = new FormData();
    data.append("name", form.name);
    data.append("location", form.location);
    data.append("website", form.website);
    // Cloudinary logic: backend should expect 'image' or 'img'
    if (selectedFile) data.append("image", selectedFile);

    try {
      if (editingId) {
        await axios.put(`${BACKEND_URL}/api/schools/${editingId}`, data);
      } else {
        await axios.post(`${BACKEND_URL}/api/schools`, data);
      }
      resetForm();
      await fetchSchools();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to sync with Cloudinary.");
    } finally {
      setIsProcessing(false);
    }
  };

  const startEdit = (school) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(school._id);
    setForm({
      name: school.name,
      location: school.location,
      website: school.website || "",
    });
    setPreview(school.img); // Backend now returns Cloudinary URL
  };

  const deleteSchool = async (id) => {
    if (!window.confirm("Delete this school permanently?")) return;
    setIsProcessing(true);
    try {
      await axios.delete(`${BACKEND_URL}/api/schools/${id}`);
      await fetchSchools();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setEditingId(null);
    setForm({ name: "", location: "", website: "" });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium tracking-widest text-xs uppercase">Loading Schools</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-10 pt-24 font-sans">
      <NavigationButtons />

      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight">FTC <span className="text-indigo-500">SCHOOLS</span></h1>
          <p className="text-slate-500 mt-1 font-medium italic">Manage participant institutions and regional hubs.</p>
        </header>

        {/* --- FORM SECTION --- */}
        <section className="mb-16">
          <form onSubmit={handleSubmit} className="bg-[#111113] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              {editingId ? "Update Institution" : "Register New School"}
            </h2>

            {error && <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-sm font-bold">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3 block ml-1">School Identity</label>
                  <input
                    type="text"
                    placeholder="e.g. Kigali International Community School"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-14 bg-slate-900 border border-slate-800 rounded-2xl px-5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3 block ml-1">Geographic Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Gasabo, Kigali"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full h-14 bg-slate-900 border border-slate-800 rounded-2xl px-5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3 block ml-1">Official Website</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full h-14 bg-slate-900 border border-slate-800 rounded-2xl px-5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              {/* Upload Dropzone Area */}
              <div className="flex flex-col h-full">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3 block ml-1">Institutional Logo / Photo</label>
                <div className="flex-1 min-h-[200px] relative">
                  <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-white/5 rounded-[2rem] cursor-pointer hover:bg-white/5 transition-all group overflow-hidden">
                    {!preview ? (
                      <div className="text-center p-6">
                        <p className="text-indigo-400 font-bold group-hover:scale-110 transition-transform">SELECT ASSET</p>
                        <p className="text-[10px] text-slate-600 uppercase mt-2">Cloudinary Optimization Enabled</p>
                      </div>
                    ) : (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-[2] h-14 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (editingId ? "SYNC CHANGES" : "REGISTER SCHOOL")}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 h-14 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all active:scale-[0.98]"
                >
                  CANCEL
                </button>
              )}
            </div>
          </form>
        </section>

        {/* --- LISTING SECTION --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 mb-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Database Records</h2>
            <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-slate-400">{schools.length} Schools</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {schools.map((s) => (
              <div key={s._id} className="bg-[#111113] border border-white/5 p-4 rounded-3xl flex items-center gap-6 group hover:border-indigo-500/30 transition-all">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0 border border-white/5">
                  {s.img && <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg truncate">{s.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">📍 {s.location}</span>
                    {s.website && <a href={s.website} target="_blank" rel="noreferrer" className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-tighter">View Site</a>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => startEdit(s)} className="p-3 bg-white/5 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all active:scale-90">
                    ✎
                  </button>
                  <button onClick={() => deleteSchool(s._id)} className="p-3 bg-white/5 hover:bg-rose-600 text-slate-400 hover:text-white rounded-xl transition-all active:scale-90">
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Processing Blur */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-white font-black tracking-[0.3em] text-xs">SYNCHRONIZING WITH DATABASE</p>
        </div>
      )}
    </div>
  );
}