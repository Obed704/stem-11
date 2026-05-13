import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "./AdminLayout";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const normalizeYouTubeUrl = (url) => {
  if (!url) return null;
  try {
    if (url.includes("embed/")) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("playlist?list=")) {
      const list = url.split("list=")[1].split("&")[0];
      return `https://www.youtube.com/embed/videoseries?list=${list}`;
    }
    return url;
  } catch {
    return null;
  }
};

const LoadingSpinner = () => (
  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function AdminResources() {
  const [downloads, setDownloads] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("downloads");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const [downloadForm, setDownloadForm] = useState({
    title: "", description: "", fileType: "PDF",
    fileSize: "", file: null, externalLink: "", imageFile: null,
  });

  const [videoForm, setVideoForm] = useState({
    title: "", description: "", videoUrl: "",
  });

  const [editing, setEditing] = useState({ downloads: null, videos: null });

  const API = {
    downloads: `${BACKEND_URL}/api/downloads`,
    videos: `${BACKEND_URL}/api/videos`,
  };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [d, v] = await Promise.all([axios.get(API.downloads), axios.get(API.videos)]);
      setDownloads(d.data);
      setVideos(v.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleDownloadSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("title", downloadForm.title);
    formData.append("description", downloadForm.description);
    formData.append("fileType", downloadForm.fileType);
    formData.append("fileSize", downloadForm.fileSize);
    if (downloadForm.file) formData.append("file", downloadForm.file);
    if (downloadForm.imageFile) formData.append("image", downloadForm.imageFile);
    if (downloadForm.externalLink) formData.append("linkHref", downloadForm.externalLink);
    const url = editing.downloads ? `${API.downloads}/${editing.downloads}` : API.downloads;
    try {
      await axios[editing.downloads ? "put" : "post"](url, formData, { headers: { "Content-Type": "multipart/form-data" } });
      resetDownloadForm();
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save download");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    const embedUrl = normalizeYouTubeUrl(videoForm.videoUrl);
    if (!embedUrl) { setError("Invalid YouTube URL"); return; }
    setLoading(true);
    setError("");
    const payload = { title: videoForm.title, description: videoForm.description, embedUrl };
    const url = editing.videos ? `${API.videos}/${editing.videos}` : API.videos;
    try {
      await axios[editing.videos ? "put" : "post"](url, payload);
      resetVideoForm();
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save video");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type.slice(0, -1)}?`)) return;
    try {
      setLoading(true);
      await axios.delete(`${API[type]}/${id}`);
      fetchAll();
    } catch {
      setError("Deletion failed");
    } finally {
      setLoading(false);
    }
  };

  const resetDownloadForm = () => {
    setDownloadForm({ title: "", description: "", fileType: "PDF", fileSize: "", file: null, externalLink: "", imageFile: null });
    setEditing((prev) => ({ ...prev, downloads: null }));
    setError("");
    setFormOpen(false);
  };

  const resetVideoForm = () => {
    setVideoForm({ title: "", description: "", videoUrl: "" });
    setEditing((prev) => ({ ...prev, videos: null }));
    setError("");
    setFormOpen(false);
  };

  const openEditDownload = (item) => {
    setEditing((prev) => ({ ...prev, downloads: item._id }));
    setDownloadForm({ title: item.title, description: item.description, fileType: item.fileType, fileSize: item.fileSize, file: null, externalLink: item.linkHref || "", imageFile: null });
    setActiveTab("downloads");
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditVideo = (item) => {
    setEditing((prev) => ({ ...prev, videos: item._id }));
    setVideoForm({ title: item.title, description: item.description, videoUrl: item.embedUrl });
    setActiveTab("videos");
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isEditing = editing[activeTab];

  return (
    <AdminLayout title="Resources" subtitle="Downloads_&_Videos">
      {/* Tab Switcher */}
      <div className="flex gap-3 mb-6 md:mb-8">
        {["downloads", "videos"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setError(""); }}
            className={`flex-1 sm:flex-none px-5 md:px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-[0.15em] transition-all border ${activeTab === tab
              ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

        {/* ── Form: mobile toggle button ── */}
        <div className="lg:hidden">
          {!formOpen ? (
            <button
              onClick={() => setFormOpen(true)}
              className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-blue-500 transition-all"
            >
              + {isEditing ? `Edit ${activeTab.slice(0, -1)}` : `Add ${activeTab.slice(0, -1)}`}
            </button>
          ) : null}
        </div>

        {/* ── Form Panel ── */}
        <div className={`lg:col-span-4 ${!formOpen ? "hidden lg:block" : "block"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gray-800/50 border border-white/5 p-6 md:p-8 rounded-3xl backdrop-blur-md lg:sticky lg:top-6"
            >
              <div className="flex items-center justify-between mb-5 md:mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-blue-400">
                  {isEditing ? `// Edit_${activeTab.slice(0, -1)}` : "Files"}
                </h2>
                {/* Mobile close */}
                <button
                  onClick={() => { activeTab === "downloads" ? resetDownloadForm() : resetVideoForm(); }}
                  className="lg:hidden w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                >
                  ✕
                </button>
              </div>

              {error && (
                <p className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs mb-4 font-mono">
                  {error}
                </p>
              )}

              {activeTab === "downloads" ? (
                <form onSubmit={handleDownloadSubmit} className="space-y-4">
                  <input
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 md:p-4 text-sm focus:border-blue-500 outline-none transition-colors text-white"
                    placeholder="Resource Title"
                    value={downloadForm.title}
                    onChange={(e) => setDownloadForm({ ...downloadForm, title: e.target.value })}
                    required
                  />
                  <textarea
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 md:p-4 text-sm focus:border-blue-500 outline-none h-24 md:h-32 text-white"
                    placeholder="Short description..."
                    value={downloadForm.description}
                    onChange={(e) => setDownloadForm({ ...downloadForm, description: e.target.value })}
                  />
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1">
                      Main File (.pdf, .zip)
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setDownloadForm({ ...downloadForm, file: e.target.files[0] })}
                      className="w-full mt-1 text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1">
                      Thumbnail Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setDownloadForm({ ...downloadForm, imageFile: e.target.files[0] })}
                      className="w-full mt-1 text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-purple-600 file:text-white"
                    />
                  </div>
                  <input
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 md:p-4 text-sm focus:border-blue-500 outline-none text-white"
                    placeholder="External Link (Optional)"
                    value={downloadForm.externalLink}
                    onChange={(e) => setDownloadForm({ ...downloadForm, externalLink: e.target.value })}
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      disabled={loading}
                      type="submit"
                      className="flex-1 bg-blue-600 py-3 md:py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                    >
                      {loading ? <LoadingSpinner /> : (editing.downloads ? "Update_Asset" : "Push_to_Cloud")}
                    </button>
                    {editing.downloads && (
                      <button onClick={resetDownloadForm} type="button" className="px-5 bg-gray-700 rounded-xl hover:bg-gray-600 text-[10px] font-black uppercase text-white">
                        Abort
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVideoSubmit} className="space-y-4">
                  <input
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 md:p-4 text-sm focus:border-blue-500 outline-none text-white"
                    placeholder="Video Title"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    required
                  />
                  <input
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 md:p-4 text-sm focus:border-blue-500 outline-none text-white"
                    placeholder="YouTube URL"
                    value={videoForm.videoUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                    required
                  />
                  <textarea
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 md:p-4 text-sm focus:border-blue-500 outline-none h-24 md:h-32 text-white"
                    placeholder="Video description..."
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      disabled={loading}
                      type="submit"
                      className="flex-1 bg-blue-600 py-3 md:py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                    >
                      {loading ? <LoadingSpinner /> : (editing.videos ? "Update_Stream" : "Publish_Video")}
                    </button>
                    {editing.videos && (
                      <button onClick={resetVideoForm} type="button" className="px-5 bg-gray-700 rounded-xl hover:bg-gray-600 text-[10px] font-black uppercase text-white">
                        Abort
                      </button>
                    )}
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Content Grid ── */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeTab === "downloads" ? (
              downloads.length === 0 ? (
                <p className="col-span-2 text-center py-16 text-gray-600 font-mono text-xs uppercase tracking-widest">
                  No_Downloads_Found
                </p>
              ) : downloads.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-800/30 border border-white/5 p-4 md:p-5 rounded-2xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <span className="bg-blue-600/20 text-blue-400 text-[8px] font-black px-2 py-1 rounded uppercase">
                        {item.fileType}
                      </span>
                      {/* Actions: always visible on mobile, hover on desktop */}
                      <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditDownload(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete("downloads", item._id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:text-white hover:bg-red-500 transition-all"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-100 mb-1 text-sm md:text-base">{item.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-600">{item.fileSize || "N/A"}</span>
                    {item.imageUrl && (
                      <img src={item.imageUrl} className="w-8 h-8 rounded object-cover" alt="thumb" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              videos.length === 0 ? (
                <p className="col-span-2 text-center py-16 text-gray-600 font-mono text-xs uppercase tracking-widest">
                  No_Videos_Found
                </p>
              ) : videos.map((item) => (
                <div key={item._id} className="bg-gray-800/30 border border-white/5 p-4 md:p-5 rounded-2xl group">
                  <div className="aspect-video mb-3 md:mb-4 rounded-xl overflow-hidden bg-black">
                    <iframe src={item.embedUrl} className="w-full h-full pointer-events-none" title={item.title} />
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-100 text-sm">{item.title}</h3>
                      <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                    {/* Actions: always visible on mobile */}
                    <div className="flex gap-2 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditVideo(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete("videos", item._id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:text-white hover:bg-red-500 transition-all"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}