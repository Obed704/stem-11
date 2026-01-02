import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios"; // Don't forget to import axios!

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ftcLink="https://www.firstinspires.org/";
// Animation variants (unchanged)
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function FTCLanding() {
  // Move hooks INSIDE the component
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/schools`)
      .then((res) => setSchools(res.data))
      .catch((err) => console.error("Failed to fetch schools:", err));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `url(${BACKEND_URL}/ftc/first-tech-challenge.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90" />
        
        <motion.div
          className="relative z-10 max-w-4xl px-6 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
            custom={0}
            variants={fadeUp}
          >
            Introducing{" "}
            <span className="text-cyan-400 drop-shadow-lg">FIRST Tech Challenge</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl mb-8 text-gray-100 max-w-2xl mx-auto"
            custom={1}
            variants={fadeUp}
          >
            Inspiring the next generation of innovators through robotics, teamwork, and real-world problem solving.
          </motion.p>

          <motion.button
            custom={2}
            variants={fadeUp}
            onClick={() =>
              (window.location.href = "/contact?subject=Joining%20FTC%20Challenge")
            }
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-xl transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join the Challenge
          </motion.button>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section
        className="py-16 sm:py-20 bg-gradient-to-b from-gray-100 to-gray-200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl font-bold mb-5"
              style={{ color: "rgb(242, 30, 167)" }}
              custom={0}
              variants={fadeUp}
            >
              About the Competition
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6"
              custom={1}
              variants={fadeUp}
            >
              FIRST® Tech Challenge students work together with their mentors to design and build robots to compete in a dynamic and exciting challenge released every September.
            </motion.p>
            <motion.a
              href={ftcLink}
              custom={2}
              variants={fadeUp}
              className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-3 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
              whileHover={{ x: 5 }}
            >
              Learn More
            </motion.a>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <img
              src={`${BACKEND_URL}/ftc/ftc-1.jpg`}
              alt="FTC Competition in action"
              className="rounded-2xl shadow-xl w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Schools Section */}
      <motion.section
        className="py-16 sm:py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-12"
            style={{ color: "rgb(23, 207, 220)" }}
            variants={fadeUp}
            custom={0}
          >
            Schools Connected
          </motion.h2>

          {schools.length === 0 ? (
            <p className="text-gray-500">Loading schools...</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {schools.map((school, index) => (
                <motion.a
                  key={school.id}
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 block transform hover:-translate-y-1"
                  custom={index}
                  variants={fadeUp}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="h-40 bg-gray-200 overflow-hidden">
                    <img
                      src={`${BACKEND_URL}${school.img}`}
                      alt={school.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                      {school.name}
                    </h3>
                    <p className="text-sm text-gray-600">{school.location}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}

          <motion.button
            onClick={() =>
              (window.location.href = "/contact?subject=Taking%20FTC%20To%20Your%20School")
            }
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-xl transition-all duration-300 transform hover:scale-105"
            variants={fadeUp}
            custom={4}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Take It To Your School
          </motion.button>
        </div>
      </motion.section>
    </>
  );
}