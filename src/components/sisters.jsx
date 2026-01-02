import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SistersCard = () => {
  const [founders, setFounders] = useState([]);
  const sectionRef = useRef(null);

  // Register ScrollTrigger once
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Fetch founders from DB
  // Fetch founders from DB
  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/team`);
        const data = await res.json();

        const foundersOnly = data
          .filter(
            (member) =>
              member.role === "Founder" &&
              (member.name === "Amelia Wyler" || member.name === "Vienna Wyler")
          )
          // Force Amelia first
          .sort((a, b) => {
            if (a.name === "Amelia Wyler") return -1;
            if (b.name === "Amelia Wyler") return 1;
            return 0;
          })
          .map((founder) => ({
            ...founder,
            image: `${BACKEND_URL}${founder.image}`,
          }));

        setFounders(foundersOnly);
      } catch (err) {
        console.error("Error fetching founders:", err);
      }
    };

    fetchFounders();
  }, []);

  // GSAP Scroll Animations
  useEffect(() => {
    if (founders.length > 0 && sectionRef.current) {
      const ctx = gsap.context(() => {
        // Animate section container
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

        // Animate images with stagger
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
  }, [founders]);

  return (
    <section
      ref={sectionRef}
      className="sisters-card max-w-5xl mx-auto my-32 p-10 bg-white rounded-2xl shadow-lg border border-gray-200"
    >
      {/* Main container */}
      <div className="flex flex-col items-center gap-4">
        {/* Images row */}
        <div className="flex flex-row gap-4">
          {founders.map((founder, index) => (
            <div
              key={index}
              className="sister-image w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-md hover:scale-105 transition-transform duration-300"
            >
              <img
                src={founder.image}
                alt={founder.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <h2
          className="text-3xl md:text-4xl font-bold text-center mt-4 lg:mt-0 capitalize"
          style={{ color: "rgb(242, 30, 167)" }}
        >
          sisters in STEM
        </h2>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-base md:text-lg leading-relaxed text-justify max-w-3xl mx-auto mt-8">
        <strong style={{ color: "rgb(23, 207, 220)" }}>
          Amelia and Vienna
        </strong>{" "}
        started STEM Inspires when we moved to{" "}
        <strong style={{ color: "rgb(23, 207, 220)" }}>Rwanda in 2022</strong>{" "}
        after visiting Kigali often in our childhood. Having been involved with
        FIRST since primary school, we have first-hand experience with not just
        the method and quality of engineering education, but also the
        competitive fun FIRST offers.{" "}
        <strong style={{ color: "rgb(23, 207, 220)" }}>
          Together, we're inspiring students to embrace the challenge, power,
          and FUN of STEM.
        </strong>
      </p>
    </section>
  );
};

export default SistersCard;
