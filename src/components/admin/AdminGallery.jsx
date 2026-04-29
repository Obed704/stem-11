import React, { useEffect, useState } from "react";
import NavigationButtons from "./Button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const GalleryAdmin = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form States
  const [newAlt, setNewAlt] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);

  // Edit States
  const [editingId, setEditingId] = useState(null);
  const [editAlt, setEditAlt] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editFile, setEditFile] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/gallery`);
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleNewFileChange = (file) => {
    setNewFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewSrc(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newFile) return alert("Please select an image first.");

    setIsProcessing(true);
    const fd = new FormData();
    fd.append("image", newFile);
    fd.append("alt", newAlt);
    fd.append("title", newTitle);

    try {
      const res = await fetch(`${BACKEND_URL}/api/gallery`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");

      setNewAlt(""); setNewTitle(""); setNewFile(null); setPreviewSrc(null);
      await fetchImages();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEdit = async (id) => {
    setIsProcessing(true);
    const fd = new FormData();
    fd.append("alt", editAlt);
    fd.append("title", editTitle);
    if (editFile) fd.append("image", editFile);

    try {
      const res = await fetch(`${BACKEND_URL}/api/gallery/${id}`, { method: "PUT", body: fd });
      if (!res.ok) throw new Error("Update failed");
      setEditingId(null);
      await fetchImages();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent delete? This cannot be undone.")) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchImages();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium tracking-widest text-xs uppercase">Initializing System</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-10 font-sans">
      <NavigationButtons />

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">CHAMPIONS <span className="text-indigo-500">GALLERY</span></h1>
            <p className="text-slate-500 mt-1 font-medium">Cloudinary-powered asset management system.</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{images.length} Active Assets</span>
          </div>
        </header>

        {/* --- ADD NEW IMAGE FORM --- */}
        <section className="mb-16">
          <form onSubmit={handleUpload} className="bg-[#111113] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
              {/* File Input Wrapper */}
              <div className="lg:col-span-1">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3 block ml-1">Select Asset</label>
                <label className="flex items-center justify-center w-full h-14 bg-slate-900 border border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-all group active:scale-95">
                  <span className="text-sm text-slate-400 truncate px-4">
                    {newFile ? newFile.name : "Choose Image"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleNewFileChange(e.target.files[0])} />
                </label>
              </div>

              {/* Text Inputs */}
              <div className="lg:col-span-1">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3 block ml-1">Alt Tag</label>
                <input
                  value={newAlt}
                  onChange={(e) => setNewAlt(e.target.value)}
                  className="w-full h-14 bg-slate-900 border border-slate-800 rounded-2xl px-4 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
                  placeholder="SEO Alt text..."
                />
              </div>

              <div className="lg:col-span-1">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3 block ml-1">Title</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-14 bg-slate-900 border border-slate-800 rounded-2xl px-4 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
                  placeholder="Display title..."
                />
              </div>

              {/* Upload Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : "UPLOAD ASSET"}
              </button>
            </div>

            {previewSrc && (
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                <img src={previewSrc} className="w-24 h-24 object-cover rounded-2xl border border-white/10" alt="Preview" />
                <div>
                  <p className="text-white font-bold text-sm">Previewing Upload</p>
                  <button onClick={() => setPreviewSrc(null)} className="text-xs text-rose-500 font-bold mt-1 hover:underline">Remove file</button>
                </div>
              </div>
            )}
          </form>
        </section>

        {/* --- GRID LISTING --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {images.map((it) => (
            <div key={it._id} className="bg-[#111113] group border border-white/5 rounded-[2rem] overflow-hidden flex flex-col hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1">
              {/* Image Area */}
              <div className="relative h-60 overflow-hidden">
                <img src={it.image} alt={it.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-60"></div>

                {/* Floating ID Tag */}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span className="text-[9px] font-mono text-slate-400">UID: {it._id.slice(-6)}</span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex-1 flex flex-col">
                {editingId === it._id ? (
                  <div className="space-y-3 animate-in zoom-in-95 duration-200">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="Title"
                    />
                    <input
                      value={editAlt}
                      onChange={(e) => setEditAlt(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="Alt"
                    />
                    <label className="block cursor-pointer bg-slate-800 text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition active:scale-95">
                      {editFile ? "READY" : "SWAP IMAGE"}
                      <input type="file" className="hidden" onChange={(e) => setEditFile(e.target.files[0])} />
                    </label>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleSaveEdit(it._id)}
                        className="flex-1 bg-indigo-600 text-white text-[10px] font-black py-3 rounded-xl hover:bg-indigo-500 transition active:scale-95"
                      >
                        SAVE
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-4 bg-slate-700 text-white text-[10px] font-black py-3 rounded-xl hover:bg-slate-600 transition">×</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-white font-bold text-lg truncate leading-none mb-2">{it.title || "Untitled Asset"}</h3>
                    <p className="text-slate-500 text-xs truncate font-medium mb-6">{it.alt || "No alternative text description provided."}</p>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => {
                          setEditingId(it._id);
                          setEditAlt(it.alt);
                          setEditTitle(it.title);
                          setEditFile(null);
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black tracking-widest py-3 rounded-xl border border-white/5 transition active:scale-95 uppercase"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(it._id)}
                        className="bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white text-[10px] font-black tracking-widest px-4 py-3 rounded-xl border border-rose-500/10 transition active:scale-95 uppercase"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Process Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-white font-black tracking-[0.3em] text-sm animate-pulse">COMMUNICATING WITH CLOUDINARY</h2>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;