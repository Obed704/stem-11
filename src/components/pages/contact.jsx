import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Header.jsx";
import Footer from "../Footer.jsx";
import ChatBolt from "../ChatBolt.jsx";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ContactUs = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    customSubject: "",
    message: "",
  });

  const [presetSubject, setPresetSubject] = useState("");

  // Pre-fill subject from query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selected = params.get("subject");
    if (selected) {
      setFormData((prev) => ({ ...prev, customSubject: selected }));
      setPresetSubject(selected);
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Only one subject allowed: either dropdown or custom subject
    if (id === "subject") {
      setFormData((prev) => ({ ...prev, subject: value, customSubject: "" }));
    } else if (id === "customSubject") {
      setFormData((prev) => ({ ...prev, customSubject: value, subject: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalSubject = formData.customSubject || formData.subject;

    if (!finalSubject) {
      alert("Please select or type a subject before sending.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, subject: finalSubject }),
      });

      if (!res.ok) throw new Error("Server error");

      alert("Thank you! We'll get back to you within 24 hours.");
      setFormData({ name: "", email: "", subject: "", customSubject: "", message: "" });
      setPresetSubject("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <section
        className="min-h-screen flex items-center justify-center p-4 pt-32 relative"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${BACKEND_URL}/contact/contact-bg.jpg) center/cover no-repeat`,
        }}
      >
        <div className="relative w-full max-w-4xl">
          <div className="bg-gradient-to-tr from-purple-900/50 via-indigo-900/50 to-black/90 shadow-2xl rounded-2xl overflow-hidden border border-white/20">
            <div className="p-10 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-2">Contact Us</h2>
                <p className="text-gray-300 text-lg">We'd love to hear from you. Let's connect!</p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Name */}
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="peer bg-transparent w-full px-4 py-4 rounded-lg border-2 border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white transition placeholder-transparent"
                      placeholder="Name"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 -top-3 text-gray-200 text-xs transition-all peer-focus:-top-3 peer-focus:text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400"
                    >
                      Name *
                    </label>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="peer bg-transparent w-full px-4 py-4 rounded-lg border-2 border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white transition placeholder-transparent"
                      placeholder="Email"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 -top-3 text-gray-200 text-xs transition-all peer-focus:-top-3 peer-focus:text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400"
                    >
                      Email *
                    </label>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    {presetSubject ? (
                      <div className="text-white px-4 py-3 bg-black/30 border-2 border-gray-500 rounded-lg animate-fadeIn">
                        Subject: {presetSubject}
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          id="customSubject"
                          placeholder="Type your own subject"
                          value={formData.customSubject}
                          onChange={handleChange}
                          className="text-white bg-transparent w-full px-4 py-3 rounded-lg border-2 border-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition placeholder-gray-400 animate-fadeIn"
                        />

                        <select
                          id="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="text-gray-400 bg-transparent w-full px-4 py-3 rounded-lg border-2 border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition animate-fadeIn"
                        >
                          <option value="">Or select from list</option>
                          <option value="Donating Money">Donating Money</option>
                          <option value="Used Pieces for FTC">Used Pieces for FTC</option>
                          <option value="Used Pieces for FLL">Used Pieces for FLL</option>
                          <option value="Sharing Skills">Sharing Skills</option>
                          <option value="Helping Hand">Helping Hand</option>
                          <option value="Take It To Your School">Take It To Your School</option>
                        </select>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col justify-between space-y-6">
                  <div className="relative flex-1">
                    <textarea
                      id="message"
                      rows="8"
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleChange}
                      className="peer bg-transparent w-full px-4 py-4 rounded-lg border-2 border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white transition h-full resize-none placeholder-transparent animate-fadeIn"
                    />
                    <label
                      htmlFor="message"
                      className="absolute left-4 -top-3 text-gray-200 text-xs transition-all peer-focus:-top-3 peer-focus:text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400"
                    >
                      Message
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 via-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-fadeIn"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-black/70 text-center px-8 py-4 border-t border-white/20">
              <p className="text-gray-400 text-sm">
                We'll get back to you within 24 hours. For urgent inquiries, email us at
                <a
                  className="text-blue-400 underline ml-1"
                  href="mailto:amelia@steminspires.tech"
                >
                  amelia@steminspires.tech
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <ChatBolt />
      <Footer />
    </>
  );
};

export default ContactUs;
