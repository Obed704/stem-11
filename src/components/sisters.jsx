import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SistersCard = ({ team = [], section }) => {
  const sectionRef = useRef(null);

  const founders = team
    .filter(
      (m) =>
        m.role === "Founder" &&
        (m.name === "Amelia Wyler" || m.name === "Vienna Wyler"),
    )
    .sort((a, b) => (a.name === "Amelia Wyler" ? -1 : 1));

  useEffect(() => {
    if (!founders.length || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [founders]);

  return (
    <section
      ref={sectionRef}
      className="max-w-5xl mx-auto my-32 p-10 bg-white rounded-[2rem] shadow-xl border border-gray-100 relative overflow-hidden"
    >
      {/* Decorative accent top-bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-cyan-400" />

      <div className="flex flex-col items-center gap-6">
        <div className="flex -space-x-4">
          {founders.map((f) => (
            <img
              key={f._id}
              src={f.image}
              alt={f.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg ring-1 ring-gray-100"
            />
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            {section?.title}
          </h2>
          <div className="h-1.5 w-20 bg-pink-500 mx-auto mt-3 rounded-full" />
        </div>
      </div>

      <div className="mt-10 max-w-3xl mx-auto">
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed text-center italic font-light">
          {section?.description?.map((p, i) => (
            <span
              key={i}
              className={
                p.highlight ? "text-cyan-600 font-semibold not-italic" : ""
              }
            >
              {p.text + " "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default SistersCard;
