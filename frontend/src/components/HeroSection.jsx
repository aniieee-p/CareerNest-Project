import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search, Briefcase, Users, Building2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const stats = [
  { icon: Briefcase, label: "Jobs Posted", value: "10,000+", color: "text-[#27bbd2]", bg: "bg-[#27bbd2]/10" },
  { icon: Users, label: "Job Seekers", value: "50,000+", color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10" },
  { icon: Building2, label: "Companies", value: "1,200+", color: "text-[#6366f1]", bg: "bg-[#6366f1]/10" },
];

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="relative overflow-hidden py-24" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #fefce8 50%, #eef2ff 100%)" }}>
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#27bbd2] opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6366f1] opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#f59e0b] opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-4xl mx-auto text-center px-4 flex flex-col gap-6">
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto px-5 py-2 rounded-full font-semibold text-sm tracking-wide border"
          style={{ background: "linear-gradient(90deg,#27bbd215,#6366f115)", borderColor: "#27bbd230", color: "#0e7490" }}
        >
          🚀 India's Fastest Growing Job Portal
        </motion.span>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900"
        >
          Find, Apply &{" "}
          <span style={{ background: "linear-gradient(90deg, #27bbd2, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Land Your
          </span>
          <br />
          Dream Career
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-500 text-lg max-w-xl mx-auto"
        >
          Connect with top companies across India. Thousands of opportunities waiting for you.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex w-full max-w-2xl mx-auto items-center gap-4 pl-5 rounded-full bg-white border"
          style={{ boxShadow: "0 8px 32px rgba(39,187,210,0.15), 0 2px 8px rgba(99,102,241,0.08)", borderColor: "#27bbd230" }}
        >
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Job title, company or keyword..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchJobHandler()}
            className="outline-none border-none w-full py-4 text-gray-700 bg-transparent"
          />
          <Button
            onClick={searchJobHandler}
            className="rounded-r-full px-6 py-6 text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #27bbd2, #6366f1)" }}
          >
            Search
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center gap-8 mt-4 flex-wrap"
        >
          {stats.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="flex items-center gap-3 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/80 shadow-sm">
              <div className={`${bg} p-2 rounded-full`}>
                <Icon size={18} className={color} />
              </div>
              <div className="text-left">
                <p className={`font-bold text-sm ${color}`}>{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
