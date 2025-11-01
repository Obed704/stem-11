import React, { useState } from "react";
import { Link } from "react-router-dom";

// ✅ Backend URL from .env
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Navbar = ({
  textColor = "text-white",
  hoverColor = "text-yellow-400",
  fixed = true,
  navLinksProp = null,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const defaultLinks = [
    { name: "Home", link: "/" },
    { name: "Our Project", link: "/ourProjects" },
    { name: "Donate", link: "/donate" },
    { name: "Champions", link: "/champions" },
    { name: "Resources", link: "/resources" },
    { name: "FTC", link: "/ftc" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  const navLinks = navLinksProp || defaultLinks;

  const renderColoredTitle = (text) => {
    const colors = ["rgb(247, 244, 46)", "rgb(23, 207, 220)", "rgb(242, 30, 167)"];
    return text.split("").map((char, i) => (
      <span key={i} style={{ color: colors[i % colors.length] }}>
        {char}
      </span>
    ));
  };

  // ✅ Load logo from backend
  const logoSrc = `${BACKEND_URL}/welcomeSlide/logo.avif`;

  return (
    <nav
      className={`${
        fixed ? "fixed" : "absolute"
      } top-0 left-0 w-full bg-black/60 flex justify-between items-center px-8 py-3 z-50 transition-all duration-300`}
    >
      {/* Logo Section */}
      <Link
        to="/"
        className={`flex items-center gap-2 text-2xl font-bold transition-transform duration-300 hover:scale-105 ${textColor}`}
      >
        <img
          src={logoSrc}
          alt="STEM Inspires Logo"
          className="h-10 w-10 object-contain rounded-full"
        />
        <span>{renderColoredTitle("STEM")}</span>
        <span> </span>
        <span>{renderColoredTitle("Inspires")}</span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden lg:flex gap-6 items-center">
        {navLinks.map(({ name, link }) => (
          <Link
            key={name}
            to={link}
            className={`relative group transition-colors duration-300 pb-2 ${textColor} hover:${hoverColor}`}
          >
            {name}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}
      </div>

      {/* Hamburger Menu */}
      <div
        className="lg:hidden flex flex-col gap-1 cursor-pointer z-50 mb-4"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="w-6 h-0.5 bg-white transition-all duration-300"></span>
        <span className="w-6 h-0.5 bg-white transition-all duration-300"></span>
        <span className="w-6 h-0.5 bg-white transition-all duration-300"></span>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-black bg-opacity-95 flex flex-col items-center justify-center gap-8 text-2xl lg:hidden transform transition-transform duration-300 ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {navLinks.map(({ name, link }) => (
          <Link
            key={name}
            to={link}
            className={`relative group transition ${textColor} hover:${hoverColor}`}
            onClick={() => setMenuOpen(false)}
          >
            {name}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
