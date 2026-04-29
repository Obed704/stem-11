import React, { useEffect, useState } from "react";
import NavigationButtons from "./Button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TAILWIND_COLORS = {
  "#ef4444": "border-red-500", "#f97316": "border-orange-500",
  "#f59e0b": "border-amber-500", "#22c55e": "border-green-500",
  "#3b82f6": "border-blue-500", "#6366f1": "border-indigo-500",
  "#a855f7": "border-purple-500", "#ec4899": "border-pink-500",
};

const EducationDashboard = () => {
  const [educationItems, setEducationItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // New state for progress
  const [isUploading, setIsUploading] = useState(false);  // New state for status

  const [formData, setFormData] = useState({
    title: "", description: "", borderColor: "border-indigo-500", alt: "", img: null,
  });

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/education`)
      .then((res) => res.json())
      .then((data) => { setEducationItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleEdit = (item) => {
    setEditing(item._id);
    setPreview(null);
    setUploadProgress(0);
    setFormData({
      title: item.title,
      description: item.description,
      borderColor: item.borderColor || "border-indigo-500",
      alt: item.alt || "",
      img: null,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, img: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = (id) => {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("borderColor", formData.borderColor);
    form.append("alt", formData.alt);
    if (formData.img) form.append("img", formData.img);

    setIsUploading(true);

    const xhr = new XMLHttpRequest();

    // 📊 TRACK PROGRESS
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    });

    // ✅ ON SUCCESS
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const updatedItem = JSON.parse(xhr.responseText);
        setEducationItems(prev => prev.map(item => item._id === id ? updatedItem : item));
        setEditing(null);
        alert("✅ Changes Saved!");
      } else {
        alert("❌ Error updating element");
      }
      setIsUploading(false);
      setUploadProgress(0);
    };

    // ❌ ON ERROR
    xhr.onerror = () => {
      alert("❌ Network Error");
      setIsUploading(false);
    };

    xhr.open("PUT", `${BACKEND_URL}/api/education/${id}`);
    xhr.send(form);
  };

  if (loading) return <div className="text-white p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <NavigationButtons />
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-400">Education Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {educationItems.map((item) => (
          <div key={item._id} className={`border-2 ${item.borderColor} rounded-2xl p-5 bg-gray-800 shadow-xl transition-all`}>

            <img
              src={editing === item._id && preview ? preview : item.img}
              alt={item.alt}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            {editing === item._id ? (
              <div className="space-y-4">
                <input
                  className="w-full bg-gray-700 p-2 rounded"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  disabled={isUploading}
                />
                <textarea
                  className="w-full bg-gray-700 p-2 rounded"
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  disabled={isUploading}
                />
                <input type="file" className="text-xs" onChange={handleFileChange} disabled={isUploading} />

                {/* 🚀 PROGRESS BAR UI */}
                {isUploading && (
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="text-[10px] text-center mt-1 text-indigo-300">Uploading: {uploadProgress}%</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(item._id)}
                    disabled={isUploading}
                    className={`${isUploading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'} px-4 py-2 rounded flex-1 transition`}
                  >
                    {isUploading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    disabled={isUploading}
                    className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="text-gray-400 text-sm mt-2">{item.description}</p>
                <button
                  onClick={() => handleEdit(item)}
                  className="mt-4 w-full border border-indigo-500 py-2 rounded hover:bg-indigo-500 transition"
                >
                  Edit Element
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationDashboard;