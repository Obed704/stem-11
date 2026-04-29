import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminGetInvolved = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingIndex, setSavingIndex] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/getinvolved`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setItems(data.map(item => ({ ...item, imgFile: null })));
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleChange = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const handleFileChange = (index, file) => {
    if (!file) return;
    const updated = [...items];
    updated[index].imgFile = file;
    setItems(updated);
  };

  const saveItem = async (item, index) => {
    setSavingIndex(index);
    const formData = new FormData();
    formData.append("title", item.title || "");
    formData.append("description", item.description || "");
    formData.append("buttonText", item.buttonText || "");
    formData.append("buttonLink", item.buttonLink || "#");
    formData.append("buttonColor", item.buttonColor || "#f21ea7");
    if (item.imgFile) formData.append("img", item.imgFile);

    try {
      const res = await fetch(`${BACKEND_URL}/api/getinvolved/${item._id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      const updated = [...items];
      updated[index] = { ...data, imgFile: null };
      setItems(updated);
      alert("Changes persistent.");
    } catch (err) {
      console.error(err);
      alert("Sync failed.");
    } finally {
      setSavingIndex(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Get Involved" subtitle="Connecting_Nodes...">
        <div className="animate-pulse space-y-12">
          {[1, 2].map((i) => (
            <div key={i} className="h-96 bg-slate-900 border border-white/5 rounded-[2.5rem]"></div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Get Involved" subtitle="Card_System_Management">
      <div className="space-y-12">
        {items.map((item, idx) => (
          <section key={item._id} className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-16">
              {/* Form Side */}
              <div className="flex-1 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-black">
                    0{idx + 1}
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Module_Config</h2>
                </div>

                <div className="grid gap-8">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Field_Title</label>
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) => handleChange(idx, "title", e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Field_Description</label>
                    <textarea
                      value={item.description || ""}
                      onChange={(e) => handleChange(idx, "description", e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Action_Label</label>
                      <input
                        type="text"
                        value={item.buttonText || ""}
                        onChange={(e) => handleChange(idx, "buttonText", e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Accent_Hex</label>
                      <div className="flex items-center gap-3 bg-slate-950 border border-white/10 rounded-2xl px-4 py-2">
                        <input
                          type="color"
                          value={item.buttonColor || "#f21ea7"}
                          onChange={(e) => handleChange(idx, "buttonColor", e.target.value)}
                          className="w-10 h-10 bg-transparent border-none cursor-pointer"
                        />
                        <span className="font-mono text-xs text-white flex-1">{item.buttonColor}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Media_Asset</label>
                    <div className="border-2 border-dashed border-white/10 rounded-3xl p-8 text-center hover:border-cyan-500/50 transition-all group/upload relative overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileChange(idx, e.target.files[0])}
                        className="hidden"
                        id={`upload-${idx}`}
                      />
                      <label htmlFor={`upload-${idx}`} className="cursor-pointer block relative z-10">
                        <p className="text-white font-bold uppercase text-xs tracking-widest">Update Visual</p>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => saveItem(item, idx)}
                  disabled={savingIndex === idx}
                  className="w-full py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-400 transition-all shadow-2xl disabled:opacity-50"
                >
                  {savingIndex === idx ? "Processing..." : "Deploy Changes"}
                </button>
              </div>

              {/* Preview Side */}
              <div className="lg:w-96 flex flex-col items-center">
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.4em] mb-10">Live_Node_Preview</p>
                <div className="w-full bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.imgFile ? URL.createObjectURL(item.imgFile) : (item.img?.startsWith("http") ? item.img : `${BACKEND_URL}${item.img}`)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
                  </div>
                  <div className="p-10 text-center space-y-6">
                    <h3 className="text-2xl font-black tracking-tighter" style={{ color: item.buttonColor }}>{item.title}</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.description}</p>
                    <div className="inline-block px-8 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: item.buttonColor }}>
                      {item.buttonText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminGetInvolved;