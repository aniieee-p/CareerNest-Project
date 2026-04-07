import React, { useState, useEffect, useRef } from "react";
import { Search, Briefcase, Building2, CheckCircle2, TrendingUp, Sparkles, ArrowRight, MapPin, Star } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const roles = ["Software Engineer","Product Manager","UI/UX Designer","Data Scientist","DevOps Engineer","React Developer","Cloud Architect","ML Engineer"];

const useTypingEffect = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = roles[roleIndex];
    let timeout;
    if (!deleting && displayed.length < current.length)
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 62);
    else if (!deleting && displayed.length === current.length)
      timeout = setTimeout(() => setDeleting(true), 2200);
    else if (deleting && displayed.length > 0)
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 32);
    else { setDeleting(false); setRoleIndex((i) => (i + 1) % roles.length); }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);
  return displayed;
};

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 2.2 + 0.8, duration: Math.random() * 12 + 10,
  delay: Math.random() * 7, opacity: Math.random() * 0.35 + 0.06,
  color: i % 4 === 0 ? "#27bbd2" : i % 4 === 1 ? "#6366f1" : i % 4 === 2 ? "#f59e0b" : "#818cf8",
}));

const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {PARTICLES.map((p) => (
      <motion.div key={p.id} className="absolute rounded-full"
        style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color, opacity: p.opacity }}
        animate={{ y: [0, -24, 0], x: [0, p.id % 2 === 0 ? 8 : -8, 0], opacity: [p.opacity, p.opacity * 2, p.opacity] }}
        transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}
  </div>
);

const Counter = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const steps = 55; let cur = 0;
        const t = setInterval(() => { cur = Math.min(cur + end / steps, end); setCount(Math.round(cur)); if (cur >= end) clearInterval(t); }, 22);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  const display = end >= 1000000 ? `${Math.round(count / 1000000)}M` : end >= 1000 ? `${Math.round(count / 1000)}K` : count;
  return <span ref={ref}>{display}{suffix}</span>;
};

const FloatCard = ({ children, className, style, floatY = [0, -12, 0], duration = 3.8, delay = 0, initX = 0, initY = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: initX, y: initY, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1, y: floatY }}
    transition={{
      opacity: { duration: 0.65, delay },
      x: { duration: 0.65, delay },
      scale: { duration: 0.65, delay },
      y: { duration, repeat: Infinity, ease: "easeInOut", delay: delay + 0.65 },
    }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const typedRole = useTypingEffect();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    if (!query.trim()) return;
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  const heroStats = [
    { icon: Briefcase,    end: 50000, suffix: "+", label: "Jobs",      color: "#67e8f9" },
    { icon: Building2,    end: 10000, suffix: "+", label: "Companies", color: "#a5b4fc" },
    { icon: CheckCircle2, end: 95,    suffix: "%", label: "Success",   color: "#6ee7b7" },
  ];

  return (
    <section className="relative overflow-hidden flex items-center"
      style={{ minHeight: "100svh", background: "linear-gradient(135deg,#060d1f 0%,#0d1535 25%,#1a1040 55%,#0a2a4a 100%)" }}>

      {/* Orbs */}
      <motion.div animate={{ scale: [1, 1.14, 1], opacity: [0.16, 0.26, 0.16] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute pointer-events-none rounded-full"
        style={{ top: "-18%", left: "-10%", width: 720, height: 720, background: "radial-gradient(circle,#27bbd2 0%,transparent 65%)" }} />
      <motion.div animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.3, 0.18] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute pointer-events-none rounded-full"
        style={{ bottom: "-22%", right: "-10%", width: 620, height: 620, background: "radial-gradient(circle,#6366f1 0%,transparent 65%)" }} />
      <motion.div animate={{ scale: [1, 1.28, 1], opacity: [0.04, 0.1, 0.04] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute pointer-events-none rounded-full"
        style={{ top: "38%", left: "40%", width: 380, height: 380, background: "radial-gradient(circle,#f59e0b 0%,transparent 65%)" }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

      <Particles />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* LEFT */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold tracking-[0.12em] mb-5 sm:mb-8 border"
              style={{ background: "rgba(39,187,210,0.08)", borderColor: "rgba(39,187,210,0.3)", color: "#67e8f9" }}
            >
              <motion.span animate={{ rotate: [0, 14, -14, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: 1.2 }}>
                <Sparkles size={11} />
              </motion.span>
              AI-POWERED JOB MATCHING
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-extrabold leading-[1.05] tracking-[-0.03em] mb-5"
              style={{ fontSize: "clamp(2.6rem,5.5vw,4.4rem)" }}
            >
              <span className="text-white block">Find your next</span>
              <span className="block" style={{
                background: "linear-gradient(90deg,#27bbd2 0%,#818cf8 50%,#27bbd2 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 4s linear infinite",
              }}>
                Dream Role
              </span>
            </motion.h1>

            {/* Typing row */}
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-white/40 text-[15px] font-medium">Now hiring</span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-bold"
                style={{ background: "rgba(39,187,210,0.1)", border: "1px solid rgba(39,187,210,0.28)", color: "#67e8f9", minWidth: 160 }}>
                {typedRole}
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.75, repeat: Infinity }}
                  className="ml-0.5 font-thin" style={{ color: "#27bbd2" }}>|</motion.span>
              </span>
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.36, duration: 0.65 }}
              className="text-white/50 text-[14px] sm:text-[16px] leading-[1.75] mb-6 sm:mb-8 max-w-full sm:max-w-[460px]"
            >
              AI-powered resume parsing and smart matching connects you with roles that truly fit — not just keywords.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl p-2 mb-4"
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
                border: focused ? "1px solid rgba(39,187,210,0.55)" : "1px solid rgba(255,255,255,0.1)",
                boxShadow: focused ? "0 0 0 3px rgba(39,187,210,0.1), 0 8px 40px rgba(0,0,0,0.3)" : "0 8px 40px rgba(0,0,0,0.25)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              <div className="flex items-center flex-1 gap-2">
                <Search className="ml-2 h-[18px] w-[18px] shrink-0 transition-colors duration-200"
                  style={{ color: focused ? "#67e8f9" : "rgba(255,255,255,0.28)" }} />
                <input type="text" placeholder="Job title, skill or keyword..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && searchJobHandler()}
                  className="flex-1 outline-none bg-transparent py-2.5 text-[14px] text-white placeholder:text-white/30 min-w-0"
                />
                <div className="hidden sm:flex items-center gap-1.5 border-l border-white/10 pl-3 mr-1">
                  <MapPin size={12} className="text-white/28" />
                  <input type="text" placeholder="Location"
                    className="outline-none bg-transparent text-[13px] text-white placeholder:text-white/22 w-20" />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 22px rgba(245,158,11,0.5)" }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                onClick={searchJobHandler}
                className="px-5 py-2.5 rounded-xl text-white font-bold text-[13px] shrink-0 w-full sm:w-auto"
                style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
              >
                Search
              </motion.button>
            </motion.div>

            {/* Trending chips */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.54 }}
              className="flex items-center gap-2 flex-wrap mb-8"
            >
              <span className="text-[11px] text-white/30 font-medium">Trending:</span>
              {["React", "Python", "Product Design", "DevOps"].map((tag) => (
                <motion.button key={tag}
                  whileHover={{ scale: 1.05, borderColor: "rgba(39,187,210,0.5)", color: "#67e8f9" }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => { dispatch(setSearchedQuery(tag)); navigate("/browse"); }}
                  className="text-[11px] px-3 py-1 rounded-full transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.4)" }}
                >
                  {tag}
                </motion.button>
              ))}            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 flex-wrap mb-10"
            >
              <Link to="/jobs">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 32px rgba(245,158,11,0.5)" }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="px-6 py-3 rounded-xl text-white font-bold text-[14px] flex items-center gap-2"
                  style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
                >
                  Browse Jobs <ArrowRight size={14} />
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.04, borderColor: "rgba(39,187,210,0.5)", color: "#67e8f9" }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="px-6 py-3 rounded-xl font-bold text-[14px] text-white/60 transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  Get Started Free
                </motion.button>
              </Link>
            </motion.div>

            {/* Inline stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.72 }}
              className="flex items-center gap-3 sm:gap-5 flex-wrap">
              {heroStats.map(({ icon: Icon, end, suffix, label, color }, i) => (
                <motion.div key={label}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.72 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <Icon size={12} style={{ color }} />
                  </div>
                  <span className="font-extrabold text-white text-[13px]"><Counter end={end} suffix={suffix} /></span>
                  <span className="text-white/35 text-[11px]">{label}</span>
                  {i < heroStats.length - 1 && <span className="text-white/15 text-xs ml-0.5">·</span>}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — floating cards */}
          <div className="relative hidden lg:flex items-center justify-center h-[520px]">

            {/* Main job card */}
            <FloatCard floatY={[0, -14, 0]} duration={3.8} delay={0.3} initX={50}
              className="absolute top-4 right-0 w-[285px]"
              style={{ background: "rgba(255,255,255,0.055)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 22, padding: 22, boxShadow: "0 28px 72px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center text-white font-extrabold text-base shrink-0"
                  style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>G</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-[13.5px] leading-tight truncate">Senior React Developer</p>
                  <p className="text-[11px] text-white/40 mt-0.5">Google · Remote</p>
                </div>
                <Star size={13} className="text-[#fcd34d] fill-[#fcd34d] shrink-0" />
              </div>
              <div className="flex gap-2 mb-4">
                <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(39,187,210,0.15)", color: "#67e8f9" }}>Full-time</span>
                <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(245,158,11,0.15)", color: "#fcd34d" }}>32 LPA</span>
              </div>
              <div className="flex items-center gap-1.5 mb-4">
                <MapPin size={10} className="text-white/28" />
                <span className="text-[11px] text-white/32">Bangalore, India</span>
              </div>
              <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 22px rgba(245,158,11,0.4)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full py-2.5 rounded-xl text-white text-[13px] font-bold"
                style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
              >
                Apply Now
              </motion.button>
            </FloatCard>

            {/* AI Match card */}
            <FloatCard floatY={[0, 15, 0]} duration={4.2} delay={0.55} initX={-40}
              className="absolute bottom-10 left-0 w-[225px]"
              style={{ background: "rgba(255,255,255,0.055)", backdropFilter: "blur(28px)", border: "1px solid rgba(16,185,129,0.22)", borderRadius: 22, padding: 20, boxShadow: "0 28px 72px rgba(0,0,0,0.55), 0 0 48px rgba(16,185,129,0.1)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.15)" }}>
                  <TrendingUp size={12} className="text-[#34d399]" />
                </div>
                <span className="text-[11px] font-bold text-white/70">AI Match Score</span>
              </div>
              <div className="flex items-end gap-1 mb-3">
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                  className="text-[2.8rem] font-extrabold leading-none tracking-[-0.04em]" style={{ color: "#34d399" }}>
                  94
                </motion.span>
                <span className="text-[18px] font-bold text-[#34d399] mb-1">%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.07)" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: "94%" }}
                  transition={{ duration: 1.5, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#10b981,#27bbd2)" }} />
              </div>
              <p className="text-[11px] text-white/32">Based on your profile</p>
            </FloatCard>

            {/* Live jobs card */}
            <FloatCard floatY={[0, -9, 0]} duration={5} delay={0.75} initY={20}
              className="absolute top-[44%] left-8 -translate-y-1/2 w-[172px]"
              style={{ background: "rgba(255,255,255,0.055)", backdropFilter: "blur(28px)", border: "1px solid rgba(99,102,241,0.28)", borderRadius: 20, padding: 18, boxShadow: "0 28px 72px rgba(0,0,0,0.55), 0 0 36px rgba(99,102,241,0.14)" }}>
              <div className="flex items-center gap-1.5 mb-2.5">
                <motion.span animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-[#34d399] block shrink-0" />
                <span className="text-[11px] text-white/38 font-medium">Live now</span>
              </div>
              <p className="text-[1.9rem] font-extrabold text-white leading-none tracking-[-0.03em]">+248</p>
              <p className="text-[11px] font-semibold mt-1.5" style={{ color: "#a5b4fc" }}>new jobs today</p>
            </FloatCard>

            {/* Notification toast */}
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.82 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-2 left-[26%] flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
              style={{ background: "rgba(16,185,129,0.1)", backdropFilter: "blur(16px)", border: "1px solid rgba(16,185,129,0.25)", boxShadow: "0 8px 28px rgba(0,0,0,0.3)" }}
            >
              <motion.span animate={{ rotate: [0, 12, -12, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 2.2 }}
                className="text-[15px]">
                🎉
              </motion.span>
              <span className="text-[11px] font-bold text-[#34d399]">New match found!</span>
            </motion.div>

            {/* Company logos strip */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 right-0 flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-[11px] text-white/30 mr-1">Hiring at</span>
              {[
                { l: "G", from: "#27bbd2", to: "#6366f1" },
                { l: "A", from: "#6366f1", to: "#818cf8" },
                { l: "M", from: "#f59e0b", to: "#ef4444" },
                { l: "N", from: "#10b981", to: "#27bbd2" },
              ].map(({ l, from, to }, i) => (
                <div key={i} className="h-7 w-7 rounded-lg flex items-center justify-center text-white text-[11px] font-extrabold"
                  style={{ background: `linear-gradient(135deg,${from},${to})` }}>
                  {l}
                </div>
              ))}
              <span className="text-[11px] text-white/30 ml-1">+2K</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom,transparent,var(--cn-page))" }} />
    </section>
  );
};

export default HeroSection;
