import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // use .env

const MissionVision = () => {
  const [cards, setCards] = useState([]);

  // Fetch from backend
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/mission-vision`);
        const data = await res.json();
        setCards(data);
      } catch (err) {
        console.error("Error fetching mission/vision:", err);
      }
    };

    fetchCards();
  }, []);

  // Helper to color letters
  const renderColoredTitle = (text) => {
    const title = text || "Untitled";
    const colors = [
      "rgb(247, 244, 46)",
      "rgb(23, 207, 220)",
      "rgb(242, 30, 167)",
    ];
    return title.split("").map((char, i) => (
      <motion.span
        key={i}
        style={{ color: colors[i % colors.length] }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.03, duration: 0.4 }}
        viewport={{ once: true }}
      >
        {char}
      </motion.span>
    ));
  };

  if (!cards.length) {
    return (
      <section className="bg-black text-white py-16 px-6 md:px-20 text-center">
        <h2 className="text-4xl font-extrabold mb-6">Our Mission & Vision</h2>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="bg-black text-white py-16 px-6 md:px-20 overflow-hidden">
      {/* Section Title */}
      <motion.h2
        className="text-4xl font-extrabold text-center mb-16 text-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        Our Mission & Vision
      </motion.h2>

      {/* Cards container */}
      <div className="flex flex-col md:flex-row md:space-x-10 space-y-10 md:space-y-0 items-stretch">
        {cards.map((card, index) => (
          <motion.div
            key={card._id}
            className={`flex-1 h-full min-h-[360px] relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 shadow-xl border border-transparent ${card.borderColor || "border-blue-600"} ${card.shadowColor || "hover:shadow-blue-400/50"} transition duration-500 ease-in-out hover:scale-[1.03] group flex flex-col justify-between`}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: index * 0.2,
              ease: "easeOut",
            }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div>
              {/* Colored title */}
              <h3 className="text-2xl font-semibold mb-4">
                {renderColoredTitle(card.title)}
              </h3>
              <p className="text-gray-300 leading-relaxed lg:leading-8">
                {card.description || "No description provided."}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MissionVision;
