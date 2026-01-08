import { useEffect, useState } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${import.meta.env.VITE_BACKEND_URL}/api/slides`;

export default function SlidesAdmin() {
  const [slides, setSlides] = useState([]);
  const [bg, setBg] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const axiosAuth = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchSlides = async () => {
    const res = await axios.get(API);
    setSlides(res.data);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const submit = async () => {
    if (!bg) return;

    if (editId) {
      await axiosAuth.put(`${API}/${editId}`, { bg });
    } else {
      await axiosAuth.post(API, { bg });
    }

    setBg("");
    setEditId(null);
    fetchSlides();
  };

  const editSlide = (slide) => {
    setBg(slide.bg);
    setEditId(slide._id);
  };

  const deleteSlide = async (id) => {
    if (!confirm("Delete this slide?")) return;
    await axiosAuth.delete(`${API}/${id}`);
    fetchSlides();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Slides Manager
          </h1>
          <p className="text-neutral-400 mt-1">
            Manage homepage carousel images
          </p>
        </div>

        {/* Form */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-medium mb-4">
            {editId ? "Update Slide" : "Add New Slide"}
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Paste image URL here"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-600"
            />

            <button
              onClick={submit}
              className="bg-white text-black font-medium px-8 py-3 rounded-lg hover:bg-neutral-200 transition"
            >
              {editId ? "Update Slide" : "Add Slide"}
            </button>
          </div>

          {editId && (
            <button
              onClick={() => {
                setBg("");
                setEditId(null);
              }}
              className="text-sm text-neutral-400 mt-3 hover:text-neutral-200"
            >
              Cancel edit
            </button>
          )}
        </div>

        {/* Slides Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide) => (
            <div
              key={slide._id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group"
            >
              <div className="relative">
                <img
  src={`${BACKEND_URL}${slide.bg}`}
  alt="slide"
  className="h-48 w-full object-cover transition group-hover:scale-105"
/>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />
              </div>

              <div className="p-4 flex items-center justify-between">
                <button
                  onClick={() => editSlide(slide)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSlide(slide._id)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {slides.length === 0 && (
          <div className="text-center text-neutral-500 mt-20">
            No slides added yet.
          </div>
        )}
      </div>
    </div>
  );
}
