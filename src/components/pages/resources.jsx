import React, { useEffect, useState } from "react";
import Navbar from "../Header";
import Footer from "../Footer";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DownloadsPage = () => {
  const [navbar, setNavbar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloads, setDownloads] = useState([]);
  const [videos, setVideos] = useState([]);

  // Helper to handle both Cloudinary and Local URLs
  const formatUrl = (path) => {
    if (!path) return null;
    // If it's already a full URL (Cloudinary starts with http), return it
    if (path.startsWith("http")) return path;
    // Fallback for local uploads if any remain
    return `${BACKEND_URL}/${path}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [navRes, downRes, vidRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/navbar`),
          fetch(`${BACKEND_URL}/api/downloads`),
          fetch(`${BACKEND_URL}/api/videos`),
        ]);

        const navData = await navRes.json();
        const downData = await downRes.json();
        const vidData = await vidRes.json();

        setNavbar(navData);

        // REFINED: Smart mapping for Cloudinary paths
        setDownloads(
          downData.map((d) => ({
            ...d,
            image: formatUrl(d.image),
            // Ensure the download link is also formatted correctly
            fileUrl: formatUrl(d.fileUrl || d.linkHref)
          }))
        );

        setVideos(vidData);
        setLoading(false);
      } catch (err) {
        console.error("System Error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white selection:bg-[#17cfdc] selection:text-white">
      <Navbar settings={navbar} />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 px-6 bg-white border-b border-slate-50 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900">
            The <span className="text-slate-300 italic font-light">Archive</span>
          </h1>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="w-8 h-[1px] bg-[#f21ea7]" />
            <p className="font-mono text-[8px] tracking-[0.4em] text-[#17cfdc] uppercase">
              System_Assets_Loaded
            </p>
            <span className="w-8 h-[1px] bg-[#f21ea7]" />
          </div>
        </div>
      </section>

      {/* 01 // FILES SECTION */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex items-center gap-4">
            <span className="font-mono text-[10px] text-slate-400">01_FILES</span>
            <div className="h-[1px] flex-1 bg-slate-100" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {downloads.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group flex flex-col bg-white border border-slate-100 p-3 md:p-4 rounded-sm hover:shadow-xl hover:shadow-[#17cfdc]/5 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative h-32 md:h-40 bg-slate-50 rounded-sm overflow-hidden mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-2 grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f21ea7]/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-[10px] md:text-xs font-black uppercase tracking-tight text-slate-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[9px] text-slate-500 leading-tight line-clamp-2 md:line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* REFINED: Download Button */}
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download // Works for Cloudinary if the asset is set to "attachment"
                  className="mt-4 w-full bg-[#f21ea7] text-white py-2 md:py-3 text-[9px] font-mono font-bold tracking-widest text-center uppercase hover:bg-[#17cfdc] transition-colors rounded-sm"
                >
                  {item.fileType === "PDF" ? "Open_PDF" : "Download"}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 // VIDEOS SECTION */}
      <section className="py-16 px-4 md:px-6 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex items-center gap-4">
            <span className="font-mono text-[10px] text-slate-400">02_VIDEOS</span>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {videos.map((video, index) => (
              <motion.div
                key={video._id || index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="bg-white p-2 border border-slate-200 rounded-sm"
              >
                <div className="relative aspect-video w-full bg-black rounded-sm overflow-hidden mb-4">
                  <iframe
                    src={video.embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
                <div className="px-2 pb-2">
                  <h3 className="text-sm md:text-lg font-black uppercase tracking-tight text-slate-900 line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-1 line-clamp-2 italic">
                    {video.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DownloadsPage;