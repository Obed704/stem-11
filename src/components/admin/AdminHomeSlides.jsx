import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import NavigationButtons from "./Button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api/slides`;

export default function SlidesAdmin() {
  const [slides, setSlides] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const token = localStorage.getItem("token");

  const axiosAuth = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchSlides = async () => {
    try {
      const res = await axios.get(API);
      setSlides(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  /* Handle file select */
  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  /* Submit (add / update) */
  const submit = async () => {
    if (!file) {
        alert("Please select an image first.");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);

    try {
      if (editId) {
        await axiosAuth.put(`${API}/${editId}`, formData);
      } else {
        await axiosAuth.post(API, formData);
      }

      resetForm();
      fetchSlides();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save slide.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setEditId(null);
  };

  const editSlide = (slide) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditId(slide._id);
    setPreview(slide.bg.startsWith('http') ? slide.bg : `${BACKEND_URL}${slide.bg}`);
  };

  const deleteSlide = async (id) => {
    if (!confirm("Delete this slide permanently?")) return;
    try {
      await axiosAuth.delete(`${API}/${id}`);
      fetchSlides();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium tracking-widest text-xs uppercase">Loading Assets</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans pb-20">
      <NavigationButtons />

      <div className="max-w-6xl mx-auto px-6 pt-24">
        {/* Header */}
        <header className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black text-white tracking-tight"
          >
            HERO <span className="text-indigo-500">CAROUSEL</span>
          </motion.h1>
          <p className="text-slate-500 mt-2 font-medium">Curate the visual first impression of your platform.</p>
        </header>

        {/* Upload Form */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111113] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl mb-20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            {editId ? "Update Asset" : "New Slide Registration"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* File Input Zone */}
            <label className="relative group cursor-pointer aspect-video bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500">
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Slide preview"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                   <svg className="w-12 h-12 mb-4 text-slate-700 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5" /></svg>
                  <p className="text-slate-400 font-bold tracking-tight">DROP NEW ASSET</p>
                  <p className="text-[10px] text-slate-600 uppercase mt-2 font-black tracking-widest leading-relaxed">Cloudinary CDN Optimized<br/>High Resolution Recommended</p>
                </div>
              )}
              {preview && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-black text-[10px] font-black px-6 py-2 rounded-full">CHANGE IMAGE</span>
                </div>
              )}
            </label>

            {/* Form Content / Actions */}
            <div className="space-y-6">
              <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5">
                <h3 className="text-white font-bold mb-2">Technical Specifications</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Images will be automatically processed for global delivery. We recommend a 16:9 aspect ratio and files under 5MB for best performance.</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={submit}
                  disabled={loading || !file}
                  className="flex-1 h-16 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-white/5 active:scale-95 transition-all disabled:bg-slate-800 disabled:text-slate-600"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : editId ? "PUBLISH CHANGES" : "DEPLOY TO PRODUCTION"}
                </button>

                {editId && (
                  <button
                    onClick={resetForm}
                    className="h-16 px-6 bg-slate-900 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:text-white transition-colors"
                  >
                    CANCEL
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Slides Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Live Production Stack</h2>
            <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-slate-400">{slides.length} ACTIVE ASSETS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {slides.map((slide, index) => (
                <motion.div
                  key={slide._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-[#111113] border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all duration-500"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={slide.bg.startsWith('http') ? slide.bg : `${BACKEND_URL}${slide.bg}`}
                      alt="slide"
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                    
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={() => editSlide(slide)}
                        className="p-3 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black rounded-xl transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button
                        onClick={() => deleteSlide(slide._id)}
                        className="p-3 bg-rose-500/20 backdrop-blur-md text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ASSET ID</p>
                      <p className="text-[10px] font-mono text-slate-400">#{slide._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                       <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">ACTIVE</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {slides.length === 0 && (
            <div className="text-center py-40 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800/50">
              <p className="text-slate-600 font-black tracking-widest text-xs uppercase">No Visual Assets Found In Production</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
