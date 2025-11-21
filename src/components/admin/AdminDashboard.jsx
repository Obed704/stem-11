import React from "react";
import { NavLink } from "react-router-dom";
import NavigationButtons from "./Button";

const AdminDashboard = () => {
  const colors = [
    "rgb(247, 244, 46)",   // yellow
    "rgb(23, 207, 220)",   // cyan
    "rgb(242, 30, 167)"    // pink
  ];

  const pages = [
    { name: "Change Password", path: "/change-password" },
    { name: "Emails", path: "/admin-emails" },
    { name: "Champions", path: "/admin-champions" },
    { name: "Mission & Vision", path: "/admin-vision-mission" },
    { name: "Sponsors", path: "/admin-sponsors" },
    { name: "Team", path: "/admin-team" },
    { name: "Resources", path: "/admin-resources" },
    { name: "Donation Page Images", path: "/admin-donation" },
    { name: "Education", path: "/admin-education" },
    { name: "Recruiting", path: "/admin-recruiting-process" },
    { name: "Project Slides", path: "/admin-project-slide" },
    { name: "Champions Gallery", path: "/admin-gallery" },
    { name: "Testimonials / Comments", path: "/admin-testimonials" },
    { name: "Our Commitment", path: "/admin-banner" },
    { name: "Payments and Donations", path: "/admin-payments" },
    { name: "Change map and fll statement", path: "/fll-map" },
    { name: "First Tech Challenge", path: "/admin-ftc" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <NavigationButtons/>
      <div className="max-w-6xl mx-auto bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {/* Grid of Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((p, i) => (
            <NavLink
              key={p.path}
              to={p.path}
              className={({ isActive }) =>
                `relative p-6 rounded-xl shadow-lg overflow-hidden text-white transform transition-all duration-700 hover:scale-105 
                ${isActive ? "ring-4 ring-pink-400" : ""}`
              }
              style={{
                background: `linear-gradient(45deg, ${colors[i % 3]}, ${colors[(i + 1) % 3]})`,
                animation: "gradientMove 12s ease infinite",
                backgroundSize: "300% 300%",
                filter: "brightness(0.9)",
              }}
            >
              <h2 className="text-xl font-semibold drop-shadow-md">{p.name}</h2>
              <p className="text-sm mt-2 opacity-80">
                Manage {p.name.toLowerCase()} content
              </p>

              {/* Subtle pink overlay */}
              <div className="absolute inset-0 bg-pink-500/10 opacity-0 hover:opacity-30 transition-opacity duration-700 rounded-xl"></div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Gradient Animation */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;
