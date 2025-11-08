import React from "react";
import { motion } from "framer-motion";

const colors = ["rgb(247, 244, 46)", "rgb(23, 207, 220)", "rgb(242, 30, 167)"];

const renderColoredTitle = (text) =>
  text.split("").map((char, i) => (
    <span key={i} style={{ color: colors[i % colors.length] }}>
      {char}
    </span>
  ));

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
  // Variants for staggered animations
  const listVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
      },
    }),
  };

  return (
    <footer className="relative bg-gray-900 text-white py-16 px-6 md:px-20 overflow-hidden">
      <motion.div
        className="relative grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">
            {renderColoredTitle(footerData.info.title)}
          </h3>
          <p className="mb-4 text-gray-300">{footerData.info.description}</p>

          <div className="flex gap-4 mt-4">
            {footerData.info.socials.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                className="w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg"
                style={{ backgroundColor: colors[idx % colors.length], color: "black" }}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
                aria-label={`Visit our ${social.icon} page`}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {footerData.quickLinks.map((link, idx) => (
              <motion.li
                key={idx}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={listVariants}
              >
                <a href={link.href} className="hover:text-blue-400 transition">
                  {link.name}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Programs */}
        <div>
          <h3 className="text-xl font-bold mb-4">Programs</h3>
          <ul className="space-y-2">
            {footerData.programs.map((link, idx) => (
              <motion.li
                key={idx}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={listVariants}
              >
                <a href={link.href} className="hover:text-blue-400 transition">
                  {link.name}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            {footerData.contact.map((item, idx) => (
              <motion.li
                key={idx}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={listVariants}
              >
                <a href={item.href} className="hover:text-blue-400 transition">
                  {item.text}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm relative z-10">
        &copy; {new Date().getFullYear()} STEM Inspires. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
