import React, { useState } from "react";
import { Search, Briefcase, Users, Building2, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  const trustChips = [
    { icon: Briefcase, label: "50K+ Jobs" },
    { icon: Building2, label: "10K+ Companies" },
    { icon: CheckCircle2, label: "Free to Use" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-20 md:py-28">
      {/* Mesh gradient blobs */}
      <div
        className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle,#27bbd2,transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle,#6366f1,transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
              style={{
                background: "rgba(39,187,210,0.06)",
                borderColor: "rgba(39,187,210,0.3)",
                color: "#27bbd2",
              }}
            >
              <Sparkles size={14} />
              ✦ AI-POWERED JOB MATCHING
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 mb-5"
            >
              Find Jobs That{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#27bbd2,#6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Match Your Future
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#475569] text-lg mb-8 max-w-lg leading-relaxed"
            >
              AI-powered resume parsing and smart matching connects you with roles that fit your skills — not just keywords.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center gap-3 bg-white rounded-2xl p-2 mb-6 border"
              style={{
                borderColor: "rgba(39,187,210,0.25)",
                boxShadow: "0 8px 32px rgba(39,187,210,0.12)",
              }}
            >
              <Search className="ml-2 h-5 w-5 text-[#94a3b8] shrink-0" />
              <input
                type="text"
                placeholder="Job title, company or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchJobHandler()}
                className="flex-1 outline-none text-gray-700 bg-transparent py-2 text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={searchJobHandler}
                className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
                style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
              >
                Search Jobs
              </motion.button>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex items-center gap-3 mb-8 flex-wrap"
            >
              <Link to="/jobs">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2"
                  style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
                >
                  Browse Jobs →
                </motion.button>
              </Link>
              <Link to="admin/jobs/create">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-xl font-semibold text-sm border-2 text-[#27bbd2] bg-transparent hover:bg-[#27bbd2]/5 transition-colors"
                  style={{ borderColor: "#27bbd2" }}
                >
                  Post a Job
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex items-center gap-4 flex-wrap"
            >
              {trustChips.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-[#475569]">
                  <Icon size={15} className="text-[#27bbd2]" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — floating cards */}
          <div className="relative hidden lg:flex items-center justify-center h-[420px]">
            {/* Main job card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute top-8 right-0 w-72 rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(39,187,210,0.2)",
                boxShadow: "0 8px 32px rgba(39,187,210,0.12)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
                >
                  G
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Senior React Developer</p>
                  <p className="text-xs text-[#94a3b8]">Google · Remote</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2" }}>Full-time</span>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>₹32 LPA</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2 rounded-xl text-white text-sm font-semibold"
                style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
              >
                Apply Now
              </motion.button>
            </motion.div>

            {/* AI Match card */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-12 left-0 w-52 rounded-2xl p-4"
              style={{
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(39,187,210,0.2)",
                boxShadow: "0 8px 32px rgba(39,187,210,0.1)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.1)" }}>
                  <TrendingUp size={14} className="text-[#10b981]" />
                </div>
                <span className="text-xs font-semibold text-gray-700">AI Match Score</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-extrabold" style={{ color: "#10b981" }}>94%</span>
                <span className="text-xs text-[#94a3b8] mb-1">match</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "94%", background: "linear-gradient(90deg,#10b981,#27bbd2)" }} />
              </div>
            </motion.div>

            {/* Stats card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 left-8 -translate-y-1/2 w-44 rounded-2xl p-4"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(99,102,241,0.2)",
                boxShadow: "0 8px 32px rgba(99,102,241,0.1)",
              }}
            >
              <p className="text-xs text-[#94a3b8] mb-1">New today</p>
              <p className="text-2xl font-extrabold text-gray-900">+248</p>
              <p className="text-xs text-[#6366f1] font-medium">jobs posted</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
