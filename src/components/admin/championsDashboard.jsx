import { useEffect, useState } from "react";
import axios from "axios";
import NavigationButtons from "./Button";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ChampionDashboard() {
  const [champions, setChampions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    season: "",
    description: "",
    roadToVictory: "",
    alt: "",
    showHeader: true,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchChampions = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/champions`);
      setChampions(res.data);
    } catch (error) {
      console.error("Error fetching champions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value)
    );
    if (file) data.append("image", file);

    try {
      if (editingId) {
        await axios.put(`${BACKEND_URL}/api/champions/${editingId}`, data);
      } else {
        await axios.post(`${BACKEND_URL}/api/champions`, data);
      }

      resetForm();
      fetchChampions();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/champions/${id}`);
      fetchChampions();
    } catch (error) {
      console.error("Error deleting champion:", error);
    }
  };

  // ✅ FIXED: Do NOT dump MongoDB object into form state
  const handleEdit = (champ) => {
    setFormData({
      title: champ.title || "",
      season: champ.season || "",
      description: champ.description || "",
      roadToVictory: champ.roadToVictory || "",
      alt: champ.alt || "",
      showHeader: champ.showHeader ?? true,
    });
    setEditingId(champ._id);
    setPreview(champ.image ? `${BACKEND_URL}${champ.image}` : null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      season: "",
      description: "",
      roadToVictory: "",
      alt: "",
      showHeader: true,
    });
    setFile(null);
    setPreview(null);
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        Loading champions…
      </div>
    );
  }

  return (
    <>
      <NavigationButtons />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-10">
        <h1 className="text-4xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-cyan-400 to-pink-500 animate-gradient mt-6">
          Champion Dashboard
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/80 p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-2xl font-semibold mb-6">
            {editingId ? "Edit Champion" : "Add New Champion"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="input"
              required
            />

            <input
              type="text"
              placeholder="Season"
              value={formData.season}
              onChange={(e) =>
                setFormData({ ...formData, season: e.target.value })
              }
              className="input"
              required
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="input md:col-span-2"
              required
            />

            <textarea
              placeholder="Road To Victory"
              value={formData.roadToVictory}
              onChange={(e) =>
                setFormData({ ...formData, roadToVictory: e.target.value })
              }
              className="input md:col-span-2"
              required
            />

            <input
              type="text"
              placeholder="Alt Text"
              value={formData.alt}
              onChange={(e) =>
                setFormData({ ...formData, alt: e.target.value })
              }
              className="input"
            />

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-cyan-400 rounded-xl cursor-pointer hover:bg-gray-700">
              <p className="text-cyan-400 font-semibold mt-4">
                Upload Champion Image
              </p>
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>

            {preview && (
              <div className="md:col-span-2 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-48 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <button className="w-full mt-6 bg-gradient-to-r from-pink-500 via-cyan-400 to-yellow-400 text-black font-semibold py-3 rounded-lg">
            {editingId ? "Update Champion" : "Add Champion"}
          </button>
        </form>

        {/* TABLE */}
        <div className="max-w-6xl mx-auto bg-gray-900/80 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6">Champions List</h2>

          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Season</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {champions.map((c) => (
                <tr key={c._id} className="border-b border-gray-700">
                  <td className="p-3">
                    {c.image && (
                      <img
                        src={`${BACKEND_URL}${c.image}`}
                        alt={c.alt}
                        className="w-20 h-14 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="p-3">{c.title}</td>
                  <td className="p-3">{c.season}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(c)}
                      className="mr-2 px-3 py-1 bg-yellow-400 text-black rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="px-3 py-1 bg-red-600 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {champions.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 py-6">
                    No champions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
    </>
  );
}
