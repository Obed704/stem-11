import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import FloatingNavigationButtons from "./admin/Button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminSistersCard = () => {
  const [title, setTitle] = useState("");
  const [paragraphs, setParagraphs] = useState([{ text: "", highlight: false }]);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/sections/sisters_card?_=${Date.now()}`);
      setTitle(res.data.title || "");
      setParagraphs(res.data.description || [{ text: "", highlight: false }]);
      setImage1(res.data.image1 || "");
      setImage2(res.data.image2 || "");
    } catch (err) {
      console.error("Failed to fetch sisters card:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= HANDLERS =================
  const handleParagraphChange = (index, key, value) => {
    const updated = [...paragraphs];
    updated[index][key] = value;
    setParagraphs(updated);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, { text: "", highlight: false }]);
  };

  const removeParagraph = (index) => {
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (index === 1) {
        setImageFile1(file);
        setPreview1(URL.createObjectURL(file));
      } else {
        setImageFile2(file);
        setPreview2(URL.createObjectURL(file));
      }
    }
  };

  const saveChanges = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", JSON.stringify(paragraphs));
    if (imageFile1) formData.append("image1", imageFile1);
    if (imageFile2) formData.append("image2", imageFile2);

    try {
      await axios.put(`${BACKEND_URL}/api/sections/sisters_card`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Sisters card updated successfully!");
      setImageFile1(null);
      setImageFile2(null);
      setPreview1(null);
      setPreview2(null);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-medium tracking-widest text-xs uppercase">Loading CMS Content</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans pb-20">
      <FloatingNavigationButtons />
      
      <div className="max-w-4xl mx-auto px-6 pt-24">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-white tracking-tight"
          >
            SISTERS <span className="text-cyan-500 italic">CARD</span>
          </motion.h1>
          <p className="text-slate-500 mt-2 font-medium">Refine the editorial content and visual branding of the sisters feature.</p>
        </header>

        <div className="space-y-10">
          {/* Main Content Section */}
          <section className="bg-[#111113] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 to-pink-500" />
            
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400 mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
              Editorial Content
            </h2>

            {/* Title Input */}
            <div className="mb-10">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3 block ml-1">Main Heading</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-16 bg-slate-900 border border-slate-800 rounded-2xl px-6 text-xl font-bold text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                placeholder="Enter title..."
              />
            </div>

            {/* Paragraphs List */}
            <div className="space-y-6">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1 block ml-1">Dynamic Description Paragraphs</label>
              <AnimatePresence>
                {paragraphs.map((p, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative transition-all hover:border-slate-700"
                  >
                    <textarea
                      value={p.text}
                      onChange={(e) => handleParagraphChange(index, "text", e.target.value)}
                      placeholder="Add insight text here..."
                      className="w-full bg-transparent text-gray-300 leading-relaxed resize-none focus:outline-none min-h-[100px]"
                    />
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
                      <label className="flex items-center gap-3 cursor-pointer group/label">
                        <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${p.highlight ? 'bg-cyan-500 border-cyan-500' : 'border-slate-700'}`}>
                          {p.highlight && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input
                          type="checkbox"
                          checked={p.highlight}
                          onChange={(e) => handleParagraphChange(index, "highlight", e.target.checked)}
                          className="hidden"
                        />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${p.highlight ? 'text-cyan-400' : 'text-slate-500'}`}>Highlight Text</span>
                      </label>
                      <button
                        onClick={() => removeParagraph(index)}
                        className="text-[10px] font-black text-rose-500/50 hover:text-rose-500 uppercase tracking-widest transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <button
                onClick={addParagraph}
                className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all"
              >
                + Append Paragraph
              </button>
            </div>
          </section>

          {/* Image Upload Section */}
          <section className="bg-[#111113] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400 mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
              Visual Identity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Image 1 */}
              <div className="space-y-4 text-center">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Sister Image 1</label>
                <div className="relative group rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[4/5] flex items-center justify-center">
                  {preview1 || image1 ? (
                    <img 
                      src={preview1 || (image1?.startsWith('http') ? image1 : `${BACKEND_URL}${image1}`)} 
                      alt="Sister 1" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="text-center p-6 text-slate-600">
                      <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5" /></svg>
                      <p className="text-[10px] font-black uppercase tracking-widest">No Visual Asset</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <label htmlFor="image-upload-1" className="bg-white text-black text-[10px] font-black px-6 py-2 rounded-full cursor-pointer hover:bg-cyan-400 transition-colors">REPLACE IMAGE</label>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 1)} className="hidden" id="image-upload-1" />
                </div>
              </div>

              {/* Image 2 */}
              <div className="space-y-4 text-center">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Sister Image 2</label>
                <div className="relative group rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[4/5] flex items-center justify-center">
                  {preview2 || image2 ? (
                    <img 
                      src={preview2 || (image2?.startsWith('http') ? image2 : `${BACKEND_URL}${image2}`)} 
                      alt="Sister 2" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="text-center p-6 text-slate-600">
                      <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5" /></svg>
                      <p className="text-[10px] font-black uppercase tracking-widest">No Visual Asset</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <label htmlFor="image-upload-2" className="bg-white text-black text-[10px] font-black px-6 py-2 rounded-full cursor-pointer hover:bg-cyan-400 transition-colors">REPLACE IMAGE</label>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 2)} className="hidden" id="image-upload-2" />
                </div>
              </div>
            </div>
          </section>

          {/* Global Save Button */}
          <div className="flex justify-center pt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveChanges}
              disabled={saving}
              className="bg-white text-black font-black px-20 py-6 rounded-full text-lg tracking-tight shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:bg-cyan-400 transition-all flex items-center gap-4"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : "PUBLISH UPDATES"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSistersCard;
