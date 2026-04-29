import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const gradientOptions = [
  { id: 1, value: "from-yellow-400 to-pink-500", colors: ["#F7F42E", "#F21EA7"] },
  { id: 2, value: "from-cyan-400 to-blue-600", colors: ["#17CFDC", "#3B82F6"] },
  { id: 3, value: "from-pink-500 to-purple-600", colors: ["#F21EA7", "#8B5CF6"] },
];

const SponsorDashboard = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", gradient: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/sponsors`);
      setSponsors(res.data);
    } catch (err) {
      console.error("Load failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (file) data.append("img", file);

    try {
      if (editingId) {
        await axios.put(`${BACKEND_URL}/api/sponsors/${editingId}`, data);
      } else {
        await axios.post(`${BACKEND_URL}/api/sponsors`, data);
      }
      resetForm();
      fetchSponsors();
      alert("Sync successful");
    } catch (err) {
      alert("Sync failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (s) => {
    setFormData({ name: s.name, description: s.description, gradient: s.gradient });
    setEditingId(s._id);
    setPreview(s.img);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Destroy record?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/sponsors/${id}`);
      fetchSponsors();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", gradient: "" });
    setFile(null);
    setPreview(null);
    setEditingId(null);
  };

  if (loading && sponsors.length === 0) return (
    <AdminLayout title="Sponsor Hub" subtitle="Retrieving_Partner_Nodes...">
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-slate-900 rounded-[2.5rem] border border-white/5" />)}
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Sponsor Hub" subtitle={`${sponsors.length}_Corporate_Nodes_Linked`}>
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <section className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl sticky top-28">
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-10 border-b border-white/5 pb-6">
              {editingId ? "Update_Sponsor" : "Register_Partner"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">Brand_Identity</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">Partner_Context</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">Visual_Theme</label>
                <div className="flex gap-4">
                  {gradientOptions.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, gradient: g.value })}
                      className={`w-12 h-12 rounded-2xl transition-all duration-300 ${formData.gradient === g.value ? "scale-110 ring-2 ring-white ring-offset-4 ring-offset-slate-900 shadow-2xl shadow-cyan-500/20" : "opacity-40 hover:opacity-100"}`}
                      style={{ background: `linear-gradient(45deg, ${g.colors[0]}, ${g.colors[1]})` }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative group border-2 border-dashed border-white/10 rounded-3xl p-8 text-center hover:border-cyan-500/50 transition-all overflow-hidden">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                {preview ? (
                  <img src={preview} alt="Preview" className="h-24 mx-auto rounded-xl object-cover" />
                ) : (
                  <div className="space-y-2">
                    <p className="text-white font-black text-xs uppercase tracking-widest">Select_Logo</p>
                    <p className="text-[9px] font-mono text-slate-500 uppercase">Vector / SVG / PNG</p>
                  </div>
                )}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-5 bg-white text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-cyan-400 transition-all shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : editingId ? "Commit_Update" : "Initialize_Sponsor"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full py-4 border border-white/5 text-slate-500 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/5 transition-all"
                >
                  Abort
                </button>
              )}
            </form>
          </section>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.4em] mb-4 ml-4">Network_Nodes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {sponsors.map((s) => (
              <div
                key={s._id}
                className="group relative bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] hover:border-white/10 transition-all duration-500 shadow-xl overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <img src={s.img} alt={s.name} className="w-16 h-16 rounded-2xl object-cover border border-white/5 group-hover:scale-110 transition-transform duration-700" />
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(s)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">✎</button>
                      <button onClick={() => handleDelete(s._id)} className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">✕</button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{s.name}</h4>
                    <p className="text-xs text-slate-500 font-medium line-clamp-3 leading-relaxed mt-2">{s.description}</p>
                  </div>

                  <div className={`h-1 w-24 bg-gradient-to-r ${s.gradient} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SponsorDashboard;