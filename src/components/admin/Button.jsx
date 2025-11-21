import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FloatingNavigationButtons = () => {
  const navigate = useNavigate();
  const [gradientPos, setGradientPos] = useState(0);

  // Animate gradient
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPos((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50); // Adjust speed here

    return () => clearInterval(interval);
  }, []);

  const gradientStyle = {
    background: `linear-gradient(270deg, rgb(247,244,46), rgb(23,207,220), rgb(242,30,167))`,
    backgroundSize: "600% 600%",
    backgroundPosition: `${gradientPos}% 50%`,
    color: "white",
    fontWeight: "600",
    padding: "12px 24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
    marginBottom: "10px",
  };

  const handleHover = (e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
  };

  const handleLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 9999, // make sure it floats above all content
      }}
    >
      <div
        style={gradientStyle}
        onClick={() => navigate("/")}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        Home
      </div>
      <div
        style={gradientStyle}
        onClick={() => navigate("/admin-dashboard")}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        Admin Dashboard
      </div>
    </div>
  );
};

export default FloatingNavigationButtons;
