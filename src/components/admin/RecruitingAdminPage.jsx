import React, { useEffect, useState } from "react";
import NavigationButtons from "./Button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProcessDashboard = () => {
  const [steps, setSteps] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: "", description: "", alt: "", highlight: "", img: null,
  });

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/process`)
      .then((res) => res.json())
      .then((data) => {
        setSteps(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleEdit = (step) => {
    if (!step._id) return alert("Error: Item has no valid ID");
    setEditing(step._id);
    setFormData({
      title: step.title || "",
      description: step.description || "",
      alt: step.alt || "",
      highlight: step.highlight || "",
      img: null,
    });
  };

  const handleUpdate = async (id) => {
    // 🛡️ Frontend Guard
    if (!id || id === "undefined") {
      alert("Critical Error: Step ID is undefined.");
      return;
    }

    setIsUpdating(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("alt", formData.alt);
    data.append("highlight", formData.highlight);
    if (formData.img) data.append("img", formData.img);

    try {
      const res = await fetch(`${BACKEND_URL}/api/process/${id}`, {
        method: "PUT",
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Update failed");
      }

      const updatedStep = await res.json();
      setSteps(prev => prev.map(s => s._id === id ? updatedStep : s));
      setEditing(null);
      alert("✅ Step updated successfully!");
    } catch (err) {
      console.error(err);
      alert(`❌ Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 p-6 md:p-12">
      <NavigationButtons />

      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-white">Process Management</h1>
          <p className="text-slate-500">Configure your recruitment workflow steps.</p>
        </header>

        <div className="grid gap-8">
          {steps.map((step) => (
            <div key={step._id} className={`bg-[#111113] border ${editing === step._id ? 'border-indigo-500' : 'border-slate-800'} rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl`}>
              <div className="flex flex-col md:flex-row">

                {/* Visual Area */}
                <div className="md:w-80 h-56 md:h-auto bg-slate-900 relative">
                  <img src={step.img} alt={step.alt} className="w-full h-full object-cover" />
                  {isUpdating && editing === step._id && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Data Area */}
                <div className="p-8 flex-1">
                  {editing === step._id ? (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Title"
                        />
                        <input
                          className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={formData.highlight}
                          onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                          placeholder="Highlight Label"
                        />
                      </div>
                      <textarea
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white h-28 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Step Description"
                      />
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <input
                          type="file"
                          className="text-xs file:bg-indigo-600 file:border-none file:text-white file:px-4 file:py-2 file:rounded-lg cursor-pointer"
                          onChange={(e) => setFormData({ ...formData, img: e.target.files[0] })}
                        />
                        <div className="flex gap-3">
                          <button onClick={() => setEditing(null)} className="px-5 py-2 text-slate-400 hover:text-white transition">Cancel</button>
                          <button
                            disabled={isUpdating}
                            onClick={() => handleUpdate(step._id)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-2 rounded-xl transition disabled:opacity-50"
                          >
                            {isUpdating ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="flex-1">
                        <span className="text-indigo-500 font-bold text-xs uppercase tracking-widest">{step.highlight || "Stage"}</span>
                        <h2 className="text-2xl font-bold text-white mt-1 mb-3">{step.title}</h2>
                        <p className="text-slate-400 line-clamp-3 leading-relaxed">{step.description}</p>
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">

                        <button
                          onClick={() => handleEdit(step)}
                          className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-xl border border-white/10 transition"
                        >
                          Edit Step
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessDashboard;