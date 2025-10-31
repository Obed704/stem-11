// src/components/Footer.jsx
import React from "react";

const colors = ["rgb(247, 244, 46)", "rgb(23, 207, 220)", "rgb(242, 30, 167)"];

const renderColoredTitle = (text) => {
  return text.split("").map((char, i) => (
    <span key={i} style={{ color: colors[i % colors.length] }}>
      {char}
    </span>
  ));
};

const footerData = {
  info: {
    title: "STEM Inspires",
    description:
      "Inspiring the next generation of innovators through hands-on STEM education.",
    socials: [
      { icon: "S", href: "#" },
      { icon: "T", href: "#" },
      { icon: "E", href: "#" },
      { icon: "M", href: "#" },
    ],
  },
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "Our Project", href: "/ourProjects" },
    { name: "Donate", href: "/donate" },
    { name: "Champions", href: "/champions" },
  ],
  programs: [
    { name: "Resources", href: "/resources" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  contact: [
    { text: "info@steminspires.tech", href: "mailto:info@steminspires.tech" },
    { text: "(555) 123-4567", href: "#" },
    { text: "123 STEM Avenue", href: "#" },
    { text: "Tech City, TC 10001", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-white py-16 px-6 md:px-20 overflow-hidden hover:cursor-pointer">
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        {/* Info */}
        <div>
          {/* ✅ “STEM Inspires” fully colorized */}
          <h3 className="text-xl font-bold mb-4">
            {renderColoredTitle(footerData.info.title)}
          </h3>
          <p className="mb-4 text-gray-300">{footerData.info.description}</p>

          {/* ✅ Colored circular social icons */}
          <div className="flex gap-4 mt-4">
            {footerData.info.socials.map((social, idx) => (
              <span
                key={idx}
                className={`w-10 h-10 flex items-center justify-center hover:cursor-pointer rounded-full text-black font-bold text-lg hover:scale-110 transition-transform`}
                style={{
                  backgroundColor: colors[idx % colors.length],
                }}
                aria-label={`Visit our ${social.icon} page`}
              >
                {social.icon}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {footerData.quickLinks.map((link, idx) => (
              <li key={idx}>
                <a href={link.href} className="hover:text-blue-400 transition">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Programs */}
        <div>
          <h3 className="text-xl font-bold mb-4">Programs</h3>
          <ul className="space-y-2">
            {footerData.programs.map((link, idx) => (
              <li key={idx}>
                <a href={link.href} className="hover:text-blue-400 transition">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            {footerData.contact.map((item, idx) => (
              <li key={idx}>
                <a href={item.href} className="hover:text-blue-400 transition">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm relative z-10">
        &copy; {new Date().getFullYear()} STEM Inspires. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
