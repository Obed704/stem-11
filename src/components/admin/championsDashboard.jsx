import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";


const API = (() => {
  const backend = import.meta.env.VITE_BACKEND_URL;
  if (backend) return `${backend.replace(/\/$/, '')}/api/champions`;
  // Fallback to same origin when env var not set (Vercel deployment)
  if (typeof window !== "undefined") return `${window.location.origin}/api/champions`;
  // Default placeholder for server-side rendering environments
  return "/api/champions";
})();

// ─── Champion Form Component ──────────────────────────────────────────────────
function ChampionForm({ initial, onSubmit, submitting, error, onCancel }) {
  const empty = { title: "", season: "", year: "", description: "", roadToVictory: "", alt: "", showHeader: true, rank: 0 };
  const [form, setForm] = useState(initial ? { ...empty, ...initial } : empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (f) => {
    if (f.size > 10 * 1024 * 1024) { alert("File too large (max 10 MB)"); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("image", file);
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs">
          {error.error || "Sync Error"}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">Champion_Title</label>
          <input
            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
            placeholder="e.g. FTC World Champions"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">Season_Label</label>
          <input
            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
            placeholder="e.g. FTC 2024-2025"
            value={form.season}
            onChange={(e) => setForm({ ...form, season: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">Achievement_Bio</label>
        <textarea
          className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all resize-none"
          rows={3}
          placeholder="Describe the milestone..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">Image_Context (Alt)</label>
          <input
            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
            value={form.alt}
            onChange={(e) => setForm({ ...form, alt: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">Rank_Order</label>
          <input
            type="number"
            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
            value={form.rank}
            onChange={(e) => setForm({ ...form, rank: e.target.value })}
          />
        </div>
      </div>

      <div className="border-2 border-dashed border-white/10 rounded-3xl p-8 text-center hover:border-cyan-500/50 transition-all relative">
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
        {preview || initial?.image ? (
          <img src={preview || initial?.image} className="h-32 mx-auto rounded-xl object-cover" alt="Preview" />
        ) : (
          <div className="text-slate-500 uppercase font-mono text-[10px] tracking-widest">Select_Visual_Asset</div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 border border-white/10 rounded-2xl text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-[2] py-4 bg-cyan-500 text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-cyan-400 transition-all disabled:opacity-50"
        >
          {submitting ? "Processing..." : initial ? "Update_Record" : "Create_Entry"}
        </button>
      </div>
    </form>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function ChampionDashboard() {
  const [data, setData] = useState({ champions: [], total: 0 });
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [champRes, yearsRes] = await Promise.all([
        axios.get(API),
        axios.get(`${API}/years`),
      ]);
      setData(champRes.data);
      setYears(yearsRes.data);
    } catch (err) {
      console.error("Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCreate = async (fd) => {
    setSubmitting(true);
    try {
      await axios.post(API, fd);
      fetchAll();
      setShowForm(false);
    } catch (err) {
      alert("Creation sync failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (fd) => {
    setSubmitting(true);
    try {
      await axios.put(`${API}/${editing._id}`, fd);
      fetchAll();
      setEditing(null);
    } catch (err) {
      alert("Update sync failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Destroy record?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchAll();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  if (loading) return (
    <AdminLayout title="Champions" subtitle="Syncing_Hall_Of_Fame...">
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-slate-900 rounded-[2.5rem]" />
        <div className="h-64 bg-slate-900 rounded-[2.5rem]" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Hall of Fame" subtitle={`${data.total}_Verified_Champions`}>
      <div className="space-y-12">
        {/* Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Database_View</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-3 bg-white text-slate-950 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl"
          >
            {showForm ? "Cancel" : "Add_Champion"}
          </button>
        </div>

        {/* Modal-like Form for Create/Edit */}
        {(showForm || editing) && (
          <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-10 border-b border-white/5 pb-6">
              {editing ? "Update_Record" : "Create_New_Node"}
            </h3>
            <ChampionForm
              initial={editing}
              onSubmit={editing ? handleUpdate : handleCreate}
              submitting={submitting}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </div>
        )}

        {/* List View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.champions.map((c) => (
            <div key={c._id} className="group bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-cyan-500/30 transition-all duration-500 shadow-xl">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-mono text-cyan-400 border border-cyan-500/20">
                  {c.year}
                </div>
              </div>

              <div className="p-8 space-y-4">
                <h4 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{c.title}</h4>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{c.description}</p>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEditing(c)}
                    className="flex-1 py-2 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
