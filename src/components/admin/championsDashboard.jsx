import { useEffect, useState } from "react";
import axios from "axios";
import NavigationButtons from "./Button";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const colors = ["#F7F42E", "#17CFDC", "#F21EA7"]; // Color palette

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

  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchChampions = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/champions`);
      setChampions(res.data);
    } catch (error) {
      console.error("Error fetching champions:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
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

  const handleEdit = (champ) => {
    setFormData(champ);
    setEditingId(champ._id);
    setPreview(`${BACKEND_URL}${champ.image}`);
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

  return (
    <>
      <NavigationButtons/>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-10">
        <h1 className="text-4xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-cyan-400 to-pink-500 animate-gradient mt-6">
          Champion Dashboard
        </h1>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-2xl font-semibold mb-6 text-white">
            {editingId ? "Edit Champion" : "Add New Champion"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-gray-900 text-white"
              required
            />
            <input
              type="text"
              placeholder="Season"
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              className="border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none bg-gray-900 text-white"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none md:col-span-2 bg-gray-900 text-white"
              required
            />
            <textarea
              placeholder="Road To Victory"
              value={formData.roadToVictory}
              onChange={(e) => setFormData({ ...formData, roadToVictory: e.target.value })}
              className="border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none md:col-span-2 bg-gray-900 text-white"
              required
            />
            <input
              type="text"
              placeholder="Alt Text"
              value={formData.alt}
              onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
              className="border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none bg-gray-900 text-white"
            />

            {/* Upload */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-cyan-400 rounded-xl cursor-pointer hover:bg-gray-700 transition-all">
              <div className="text-center py-4">
                <p className="text-cyan-400 font-semibold">Upload Champion Image</p>
                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>

            {preview && (
              <div className="md:col-span-2 flex justify-center mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-48 h-32 object-cover rounded-lg shadow-lg border border-gray-600 transition-transform hover:scale-105"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-pink-500 via-cyan-400 to-yellow-400 text-black font-semibold py-3 rounded-lg hover:scale-105 transition-all"
          >
            {editingId ? "Update Champion" : "Add Champion"}
          </button>
        </form>

        {/* Champions Table */}
        <div className="max-w-6xl mx-auto bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-white">Champions List</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-white">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="p-3 border text-left">Image</th>
                  <th className="p-3 border text-left">Title</th>
                  <th className="p-3 border text-left">Season</th>
                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {champions.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-gray-700 transition-colors border-b border-gray-800"
                  >
                    <td className="p-3">
                      {c.image && (
                        <img
                          src={`${BACKEND_URL}${c.image}`}
                          alt={c.alt}
                          className="w-20 h-14 object-cover rounded-md shadow-lg transition-transform hover:scale-105"
                        />
                      )}
                    </td>
                    <td className="p-3 font-medium">{c.title}</td>
                    <td className="p-3">{c.season}</td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="bg-gradient-to-r from-yellow-400 via-cyan-400 to-pink-500 px-4 py-1 rounded-lg text-black font-semibold hover:scale-105 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="bg-red-600 px-4 py-1 rounded-lg text-white font-semibold hover:scale-105 transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {champions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-400 py-4">
                      No champions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />

      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 8s ease infinite;
          }
        `}
      </style>
    </>
  );
}
