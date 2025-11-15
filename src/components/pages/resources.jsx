import React, { useEffect, useState } from "react";
import Navbar from "../Header";
import Footer from "../Footer";

const brandColors = {
  yellow: "rgb(247, 244, 46)",
  cyan: "rgb(23, 207, 220)",
  pink: "rgb(242, 30, 167)",
};

const DownloadsPage = () => {
  const [downloads, setDownloads] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadingDownloads, setLoadingDownloads] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/downloads`);
        if (!res.ok) throw new Error("Failed to fetch downloads");
        const data = await res.json();
        const formatted = data.map((d) => ({
          ...d,
          image: `${BACKEND_URL}/${d.image}`,
        }));
        setDownloads(formatted);
      } catch (err) {
        console.error("Error fetching downloads:", err);
      } finally {
        setLoadingDownloads(false);
      }
    };

    const fetchVideos = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/videos`);
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchDownloads();
    fetchVideos();
  }, [BACKEND_URL]);

  return (
    <>
      <Navbar />

      {/* Downloads Section - Compact File Cards */}
      <section
        className="px-4 py-12 sm:py-20 py-20"
        style={{ backgroundColor: brandColors.cyan }}
      >
        <h2
          className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8"
          style={{ color: brandColors.pink }}
        >
          Download Files
        </h2>

        {loadingDownloads ? (
          <p className="text-white text-center text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 justify-center max-w-7xl mx-auto">
            {downloads.map((item) => (
              <div
                key={item._id}
                className="relative group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden w-full aspect-square max-w-[160px] sm:max-w-[180px]"
              >
                {/* Image */}
                <div className="h-20 sm:h-24">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* File Name */}
                <div className="p-2 text-center">
                  <h3
                    className="text-xs sm:text-sm font-medium truncate"
                    style={{ color: brandColors.cyan }}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-85 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center items-center p-3 text-center">
                  <p className="text-xs mb-2 line-clamp-2">{item.description}</p>
                  {item.fileType && item.fileSize && (
                    <div className="flex justify-between w-full text-xs mb-2 px-1">
                      <span>{item.fileType}</span>
                      <span>{item.fileSize}</span>
                    </div>
                  )}
                  <a
                    href={item.linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 px-3 py-1.5 text-xs rounded bg-pink-500 hover:bg-pink-600 transition"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Videos Section - Compact Video Grid */}
      <section
        className="px-4 py-12 sm:py-16"
        style={{
          background: `linear-gradient(135deg, ${brandColors.pink}, ${brandColors.yellow})`,
        }}
      >
        <h2
          className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8"
          style={{ color: brandColors.cyan }}
        >
          Watch Our Playlists
        </h2>

        {loadingVideos ? (
          <p className="text-white text-center text-sm">Loading videos...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 justify-center max-w-7xl mx-auto">
            {videos.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col w-full max-w-[160px] sm:max-w-[180px]"
              >
                {/* Video Thumbnail (Embedded iframe) */}
                <div className="aspect-video">
                  <iframe
                    src={item.embedUrl}
                    title={item.title}
                    className="w-full h-full rounded-t-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>

                {/* Video Info */}
                <div className="p-2 flex flex-col flex-1">
                  <h3
                    className="text-xs sm:text-sm font-medium line-clamp-1"
                    style={{ color: brandColors.cyan }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 flex-1 mt-1">
                    {item.description}
                  </p>
                  <a
                    href={item.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-center text-xs py-1 px-2 rounded bg-pink-500 hover:bg-pink-600 transition text-white"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
};

export default DownloadsPage;