import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Added for the new animation
import Navbar from "../Header";
import SistersCard from "../sisters";
import TeamSection from "../team";
import SponsorsSection from "../sponsorSection";
import Footer from "../Footer";
import ChatBolt from "../ChatBolt";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const About = () => {
  const [navbar, setNavbar] = useState(null);
  const [team, setTeam] = useState([]);
  const [sistersSection, setSistersSection] = useState(null);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        const [navbarRes, teamRes, sistersRes, sponsorsRes] = await Promise.all(
          [
            fetch(`${BACKEND_URL}/api/navbar`),
            fetch(`${BACKEND_URL}/api/team`),
            fetch(`${BACKEND_URL}/api/sections/sisters_card`),
            fetch(`${BACKEND_URL}/api/sponsors`),
          ],
        );

        if (!navbarRes.ok || !teamRes.ok || !sistersRes.ok || !sponsorsRes.ok) {
          throw new Error("One or more requests failed");
        }

        const navbarData = await navbarRes.json();
        const teamData = await teamRes.json();
        const sistersData = await sistersRes.json();
        const sponsorsData = await sponsorsRes.json();

        if (!mounted) return;

        setNavbar(navbarData);
        setTeam(
          Array.isArray(teamData)
            ? teamData.map((m) => ({
              ...m,
              image: m.image ? `${m.image}` : "",
            }))
            : [],
        );
        setSistersSection(sistersData);
        setSponsors(Array.isArray(sponsorsData) ? sponsorsData : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchAll();
    return () => (mounted = false);
  }, []);

  // ================= NEW ANIMATED LOADER =================
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.img
            src="https://res.cloudinary.com/dashhjuuq/image/upload/v1776870899/navbar_branding/logo-1776870896262.png"
            alt="STEM Inspires"
            className="w-28 md:w-36 mx-auto mb-10"
            onError={(e) => console.log("Current path failed:", e.target.src)}
          />
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-slate-400">
              Loading .....
            </div>
            <div className="w-48 h-[1px] bg-slate-100 mx-auto overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-300"
                animate={{ x: [-200, 200] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar textColor="text-gray-300" fixed={false} settings={navbar} />
      <SistersCard team={team} section={sistersSection} />
      <TeamSection team={team} />
      <ChatBolt />
      <SponsorsSection sponsors={sponsors} />
      <Footer />
    </>
  );
};

export default About;
