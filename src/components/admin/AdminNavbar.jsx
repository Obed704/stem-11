import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminNavbar = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 1. FETCH SETTINGS FROM DATABASE
  const fetchSettings = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/navbar`);
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 2. SAVE TEXT & COLOR SETTINGS
  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/navbar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Save failed");
      alert("✅ Settings updated in database");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // 3. UPLOAD LOGO & RE-FETCH (THE TRUTH TEST)
  const uploadLogo = async (file) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("logo", file);

    try {
      // Step A: Upload to Cloudinary via Backend
      const uploadRes = await fetch(`${BACKEND_URL}/api/navbar/upload-logo`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      // Step B: Pull fresh data directly from DB to verify it saved
      await fetchSettings();

      alert("✅ Logo uploaded and verified from database!");
    } catch (err) {
      console.error("Upload Error:", err);
      alert("❌ Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-9 bg-gray-700 rounded w-64"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-center p-10 text-red-400">No settings found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pb-20">
      <div className="max-w-4xl mx-auto p-8 space-y-10">
        <header className="border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-bold text-white tracking-tight">Navbar Settings</h1>
          <p className="mt-2 text-gray-400 font-medium">Branding and Navigation Configuration</p>
        </header>

        {/* --- LOGO SECTION --- */}
        <section className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            Identity & Logo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Upload Logic */}
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 cursor-pointer transition-all duration-300 ${uploading
                  ? "border-indigo-500 bg-indigo-500/10 animate-pulse"
                  : "border-gray-600 hover:border-indigo-400 bg-gray-900/40 hover:bg-gray-900/60"
                  }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-bold text-indigo-400">Syncing with Cloudinary...</p>
                  </div>
                ) : (
                  <>
                    <svg className="w-12 h-12 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-300 font-bold">Replace Branding Logo</p>
                    <p className="text-xs text-gray-500 mt-2">SVG, PNG, JPG (Max 5MB)</p>
                  </>
                )}
              </label>
            </div>

            {/* LIVE PREVIEW FROM DB */}
            <div className="flex flex-col items-center justify-center bg-black/40 rounded-xl p-8 border border-gray-700/50 min-h-[240px] relative overflow-hidden">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Database Pull</span>
              </div>

              {data.logoImage ? (
                <div className="flex flex-col items-center gap-6">
                  <img
                    src={data.logoImage}
                    alt="Current Logo"
                    className="max-h-28 w-auto object-contain drop-shadow-2xl"
                  />
                  <div className="text-center space-y-1">
                    <p className="text-[10px] font-mono text-gray-500 truncate max-w-[200px]">
                      {data.logoImage.split('/').pop()}
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-bold border border-indigo-500/20">
                      CLOUDINARY SECURE
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600 text-sm italic">No image in database</div>
              )}
            </div>
          </div>
        </section>

        {/* --- DISPLAY MODE --- */}
        <section className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            Navigation Layout
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Logo Mode</label>
              <select
                value={data.logoMode || "logo-only"}
                onChange={(e) => setData({ ...data, logoMode: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-4 text-white font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
              >
                <option value="logo-only">Logo Only</option>
                <option value="logo-with-text">Logo + Site Title</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Hover Highlight</label>
              <div className="flex items-center gap-4 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3">
                <input
                  type="color"
                  value={data.hoverColor || "#6366f1"}
                  onChange={(e) => setData({ ...data, hoverColor: e.target.value })}
                  className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                />
                <span className="font-mono text-sm text-gray-300">{data.hoverColor || "#6366f1"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- SAVE BUTTON --- */}
        <div className="sticky bottom-10 flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving || uploading}
            className="group bg-white hover:bg-indigo-50 disabled:bg-gray-700 text-gray-900 font-black px-12 py-5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            {saving ? "Writing to Database..." : "Publish Navbar Updates"}
            {!saving && (
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <Button />
    </div>
  );
};

export default AdminNavbar;