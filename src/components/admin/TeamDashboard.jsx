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
  };

  if (loading && members.length === 0) return (
    <AdminLayout title="Team Registry" subtitle="Synchronizing_Member_Database...">
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-900 rounded-3xl border border-white/5" />)}
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Team Registry" subtitle={`${members.length}_Active_Personnel`}>
      <div className="space-y-12">
        {/* Form Section */}
        <section className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
          
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-10 border-b border-white/5 pb-6">
            {editingId ? "Update_Identity" : "Register_Personnel"}
          </h2>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">Legal_Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">Assigned_Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">Comm_Channel (Email)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-400 transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? "Processing..." : editingId ? "Commit_Update" : "Initialize_Member"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-5 border border-white/10 text-slate-400 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/5 transition-all"
                  >
                    Abort
                  </button>
                )}
              </div>
            </div>

            {/* Photo Upload Side */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative group w-48 h-48 mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-full animate-pulse blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-full h-full rounded-full border-2 border-white/10 overflow-hidden bg-slate-950 flex items-center justify-center group-hover:border-cyan-500/50 transition-all">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest text-center px-4">Biometric_Visual_Required</div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      setFile(selectedFile);
                      setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Click_Image_To_Upload</p>
            </div>
          </form>
        </section>

        {/* Database List */}
        <div className="grid gap-4">
          <h3 className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.4em] mb-4 ml-4">Registry_Nodes</h3>
          {members.map((m) => (
            <div
              key={m._id}
              className="group bg-slate-900 border border-white/5 rounded-3xl p-6 flex items-center gap-8 hover:border-cyan-500/20 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/5 group-hover:border-cyan-500/30 transition-all">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-700 font-black text-xl">?</div>
                )}
              </div>

              <div className="flex-1">
                <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">{m.name}</h4>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">{m.role}</span>
                  <span className="text-slate-500 text-[10px] font-mono">{m.email || "NO_COMM_CHANNEL"}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(m)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/5 text-slate-500 hover:bg-white/5 hover:text-white transition-all"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default TeamMemberDashboard;