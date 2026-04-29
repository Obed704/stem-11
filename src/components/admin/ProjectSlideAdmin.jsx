import React, { useEffect, useState } from "react";
import NavigationButtons from "./Button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProjectSlidesAdmin = () => {
  const [slides, setSlides] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Global processing state

  const [formData, setFormData] = useState({ alt: "", caption: "", src: null });
  const [newSlideData, setNewSlideData] = useState({ alt: "", caption: "", src: null });

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/project-slides`)
      .then((res) => res.json())
      .then((data) => {
        setSlides(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleEdit = (slide) => {
    setEditing(slide._id);
    setFormData({ alt: slide.alt, caption: slide.caption, src: null });
  };

  const handleUpdate = async (id) => {
    setIsProcessing(true);
    const form = new FormData();
    form.append("alt", formData.alt);
    form.append("caption", formData.caption);
    if (formData.src) form.append("src", formData.src);

    try {
      const res = await fetch(`${BACKEND_URL}/api/project-slides/${id}`, {
        method: "PUT",
        body: form,
      });
      if (!res.ok) throw new Error("Failed to update");
      const updatedSlide = await res.json();
      setSlides((prev) => prev.map((s) => (s._id === id ? updatedSlide : s)));
      setEditing(null);
    } catch (err) {
      alert("❌ Update failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddNewSlide = async () => {
    if (!newSlideData.src) return alert("Please select an image");
    setIsProcessing(true);
    const form = new FormData();
    form.append("alt", newSlideData.alt);
    form.append("caption", newSlideData.caption);
    form.append("src", newSlideData.src);

    try {
      const res = await fetch(`${BACKEND_URL}/api/project-slides`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Failed to add slide");
      const addedSlide = await res.json();
      setSlides((prev) => [...prev, addedSlide]);
      setNewSlideData({ alt: "", caption: "", src: null });
      alert("✅ Slide added!");
    } catch (err) {
      alert("❌ Failed to add slide");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    setIsProcessing(true);
    try {
      await fetch(`${BACKEND_URL}/api/project-slides/${id}`, { method: "DELETE" });
      setSlides((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("❌ Delete failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-6 md:p-12 relative">
      <NavigationButtons />

      {/* Global Overlay Spinner for Processing */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#111113] p-8 rounded-2xl border border-white/10 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-bold animate-pulse">Updating Cloudinary...</p>
          </div>
        </div>
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-white">
        Project Slides <span className="text-indigo-500">Admin</span>
      </h1>

      {/* Add New Slide */}
      <div className="max-w-4xl mx-auto mb-12 bg-[#111113] border border-white/5 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span> Add New Slide
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="file"
            onChange={(e) => setNewSlideData({ ...newSlideData, src: e.target.files[0] })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm"
          />
          <input
            type="text"
            value={newSlideData.alt}
            onChange={(e) => setNewSlideData({ ...newSlideData, alt: e.target.value })}
            placeholder="Alt text"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <input
          type="text"
          value={newSlideData.caption}
          onChange={(e) => setNewSlideData({ ...newSlideData, caption: e.target.value })}
          placeholder="Slide Caption"
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 mt-4 outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddNewSlide}
          className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
        >
          Add Slide to Cloudinary
        </button>
      </div>

      {/* Existing Slides */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {slides.map((slide) => (
          <div key={slide._id} className={`bg-[#111113] border ${editing === slide._id ? 'border-indigo-500' : 'border-white/5'} rounded-3xl overflow-hidden transition-all shadow-xl`}>
            <div className="relative h-48 group">
              <img
                src={slide.src} // Cloudinary provides the full URL now
                alt={slide.alt}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>

            <div className="p-6">
              {editing === slide._id ? (
                <div className="space-y-3">
                  <input
                    value={formData.alt}
                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm"
                    placeholder="Alt text"
                  />
                  <input
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm"
                    placeholder="Caption"
                  />
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, src: e.target.files[0] })}
                    className="w-full text-[10px]"
                  />
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => handleUpdate(slide._id)} className="bg-indigo-600 px-4 py-2 rounded-lg text-xs font-bold flex-1">Save</button>
                    <button onClick={() => setEditing(null)} className="bg-slate-800 px-4 py-2 rounded-lg text-xs font-bold">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-white font-bold mb-4">{slide.caption || "No Caption"}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(slide)} className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs flex-1 transition">Edit</button>
                    <button onClick={() => handleDelete(slide._id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-xs transition">Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSlidesAdmin;