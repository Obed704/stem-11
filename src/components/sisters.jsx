import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SistersCard = () => {
  const [sisters, setSisters] = useState([]);
  const sectionRef = useRef(null);

  // Register ScrollTrigger once
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Fetch first two team members from DB
  useEffect(() => {
    const fetchSisters = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/team`);
        const data = await res.json();

        // Take only the first two members
        const firstTwo = data.slice(0, 2);

        // Prepend backend URL to images
        const formatted = firstTwo.map((sister) => ({
          ...sister,
          image: `${BACKEND_URL}${sister.image}`,
        }));

        setSisters(formatted);
      } catch (err) {
        console.error("Error fetching sisters:", err);
      }
    };

    fetchSisters();
  }, []);

  // GSAP Scroll Animations
  useEffect(() => {
    if (sisters.length > 0 && sectionRef.current) {
      const ctx = gsap.context(() => {
        // Animate the section container
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Animate the images with stagger
        gsap.fromTo(
          ".sister-image",
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            stagger: 0.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [sisters]);

  return (
    <section
      ref={sectionRef}
      className="sisters-card max-w-5xl mx-auto my-32 p-10 bg-white rounded-2xl shadow-lg border border-gray-200"
    >
      {/* Main container */}
      <div className="flex flex-col items-center gap-4">
        {/* Images row */}
        <div className="flex flex-row gap-4">
          {sisters.map((sister, index) => (
            <div
              key={index}
              className="sister-image w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-md hover:scale-105 transition-transform duration-300"
            >
              <img
                src={sister.image}
                alt={sister.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-blue-700 text-center mt-4 lg:mt-0 capitalize">
          sisters in stem
        </h2>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-base md:text-lg leading-relaxed text-justify max-w-3xl mx-auto mt-8">
        <strong>Amelia and Vienna</strong> started STEM Inspires when we moved
        to <strong>Rwanda in 2022</strong> after visiting Kigali often in our
        childhood. Having been involved with FIRST since primary school, we have
        first-hand experience with not just the method and quality of
        engineering education, but also the competitive fun FIRST offers.{" "}
        <strong>
          Together, we're inspiring students to embrace the challenge, power,
          and FUN of STEM.
        </strong>
      </p>
    </section>
  );
};

export default SistersCard;
