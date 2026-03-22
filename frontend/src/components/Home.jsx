import React, { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import AIChatButton from "./AIChatButton";
import userGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Bot, Target, CalendarCheck, FileEdit, Bell, Building2,
  UserCheck, Upload, Search, Send, ArrowRight, Briefcase,
  Users, Award, CheckCircle2, Zap, ChevronRight,
} from "lucide-react";

// ─── Spotlight card wrapper ───────────────────────────────────────────────────
const SpotlightCard = ({ children, className = "", style = {}, color = "#27bbd2", glow = "rgba(39,187,210,0.15)" }) => {
  const cardRef = useRef(null);
  const spotRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !spotRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotRef.current.style.background = `radial-gradient(280px circle at ${x}px ${y}px, ${glow}, transparent 70%)`;
    spotRef.current.style.opacity = "1";
  }, [glow]);

  const handleMouseLeave = useCallback(() => {
    if (spotRef.current) spotRef.current.style.opacity = "0";
  }, []);

  return (
    <div ref={cardRef} className={`relative overflow-hidden ${className}`} style={style}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* spotlight layer */}
      <div ref={spotRef} className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
        style={{ opacity: 0, zIndex: 0 }} />
      <div className="relative" style={{ zIndex: 1 }}>{children}</div>
    </div>
  );
};

// ─── Ticker ───────────────────────────────────────────────────────────────────
const tickerItems = [
  "Software Engineer","Product Manager","UI/UX Designer","Data Analyst",
  "DevOps Engineer","Marketing Lead","React Developer","HR Manager",
  "Cloud Architect","Cybersecurity Analyst","Mobile Developer","QA Engineer",
];

const Ticker = () => (
  <div className="w-full overflow-hidden py-3.5 relative" style={{ background: "linear-gradient(90deg,#1e9db5,#27bbd2,#6366f1,#4f46e5)" }}>
    <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
      style={{ background: "linear-gradient(90deg,#1e9db5,transparent)" }} />
    <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
      style={{ background: "linear-gradient(270deg,#4f46e5,transparent)" }} />
    <div className="flex gap-12 animate-marquee whitespace-nowrap">
      {[...tickerItems, ...tickerItems].map((item, i) => (
        <span key={i} className="text-white/90 text-[13px] font-semibold flex items-center gap-3 select-none tracking-wide">
          <span className="h-1 w-1 rounded-full bg-white/40 inline-block" /> {item}
        </span>
      ))}
    </div>
  </div>
);

// ─── FadeUp ───────────────────────────────────────────────────────────────────
const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

// ─── Animated counter ─────────────────────────────────────────────────────────
const AnimatedCounter = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const steps = 60;
        const increment = end / steps;
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + increment, end);
          setCount(Math.round(cur));
          if (cur >= end) clearInterval(t);
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  const display = end >= 1000000 ? `${(count/1000000).toFixed(count >= 1000000 ? 0 : 1)}M`
    : end >= 1000 ? `${Math.round(count/1000)}K` : count;
  return <span ref={ref}>{display}{suffix}</span>;
};

// ─── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ text }) => (
  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4"
    style={{ background: "rgba(39,187,210,0.07)", border: "1px solid rgba(39,187,210,0.18)" }}>
    <Zap size={10} style={{ color: "#27bbd2" }} />
    <span className="text-[11px] font-bold tracking-[0.14em] uppercase" style={{ color: "#27bbd2" }}>{text}</span>
  </div>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  { icon: Bot,           color: "#27bbd2", bg: "rgba(39,187,210,0.08)",  glow: "rgba(39,187,210,0.15)", title: "AI Resume Parsing",    desc: "Upload once, get matched instantly with relevant roles based on your skills and experience." },
  { icon: Target,        color: "#6366f1", bg: "rgba(99,102,241,0.08)",  glow: "rgba(99,102,241,0.15)", title: "Smart Job Matching",   desc: "Filtered by skills and experience level, not just keywords — precision at scale." },
  { icon: CalendarCheck, color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  glow: "rgba(245,158,11,0.15)", title: "Date-Based Filtering", desc: "See only fresh, active listings updated every single day. No stale postings." },
  { icon: FileEdit,      color: "#27bbd2", bg: "rgba(39,187,210,0.08)",  glow: "rgba(39,187,210,0.15)", title: "In-App Resume Editor", desc: "Edit your resume based on AI-powered, role-specific suggestions in real time." },
  { icon: Bell,          color: "#6366f1", bg: "rgba(99,102,241,0.08)",  glow: "rgba(99,102,241,0.15)", title: "Real-Time Alerts",     desc: "Instant push notifications the moment a new match appears for your profile." },
  { icon: Building2,     color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  glow: "rgba(245,158,11,0.15)", title: "Company Profiles",     desc: "Research culture, reviews, and salaries before you apply — make informed decisions." },
];

const steps = [
  { icon: UserCheck, num: "01", title: "Create Profile",  desc: "Sign up and build your professional profile in minutes.", color: "#27bbd2", glow: "rgba(39,187,210,0.35)" },
  { icon: Upload,    num: "02", title: "Upload Resume",   desc: "Our AI parses your resume and extracts key skills automatically.", color: "#6366f1", glow: "rgba(99,102,241,0.35)" },
  { icon: Search,    num: "03", title: "Browse Matches",  desc: "Explore curated job listings matched precisely to your profile.", color: "#f59e0b", glow: "rgba(245,158,11,0.35)" },
  { icon: Send,      num: "04", title: "Apply & Track",   desc: "Apply with one click and track every application in real time.", color: "#10b981", glow: "rgba(16,185,129,0.35)" },
];

const stats = [
  { icon: Briefcase, end: 50000,   suffix: "+", label: "Jobs Posted",  color: "#27bbd2", numColor: "#0e7490", bg: "rgba(39,187,210,0.08)"  },
  { icon: Building2, end: 10000,   suffix: "+", label: "Companies",    color: "#6366f1", numColor: "#4338ca", bg: "rgba(99,102,241,0.08)"  },
  { icon: Users,     end: 2000000, suffix: "+", label: "Job Seekers",  color: "#f59e0b", numColor: "#b45309", bg: "rgba(245,158,11,0.08)"  },
  { icon: Award,     end: 95,      suffix: "%", label: "Success Rate", color: "#10b981", numColor: "#047857", bg: "rgba(16,185,129,0.08)"  },
];

// ─── Home ─────────────────────────────────────────────────────────────────────
const Home = () => {
  userGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => { if (user?.role === "recruiter") navigate("/admin/companies"); }, []);

  return (
    <div className="relative" style={{ backgroundColor: "#ffffff",
      backgroundImage: "radial-gradient(ellipse 80% 50% at 20% -10%, rgba(39,187,210,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 110%, rgba(99,102,241,0.06) 0%, transparent 60%)" }}>
      <Navbar />
      <HeroSection />
      <Ticker />

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-28">
        <FadeUp className="text-center mb-16">
          <SectionLabel text="Why CareerNest" />
          <h2 className="text-[2.15rem] md:text-[2.75rem] font-extrabold text-[#0f172a] leading-[1.15] tracking-[-0.02em] mt-1">
            Everything you need to{" "}
            <span style={{ background: "linear-gradient(135deg,#27bbd2 0%,#6366f1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              land your dream job
            </span>
          </h2>
          <p className="text-[#64748b] mt-4 max-w-[480px] mx-auto text-[15px] leading-[1.7]">
            From AI-powered matching to real-time alerts — every tool you need, in one place.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, color, bg, glow, title, desc }, i) => (
            <FadeUp key={title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -6, scale: 1.013 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group h-full rounded-[22px] cursor-default"
                style={{
                  padding: "1px",
                  background: "linear-gradient(145deg,rgba(39,187,210,0.14),rgba(99,102,241,0.08),rgba(39,187,210,0.04))",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.04)",
                  transition: "box-shadow 0.4s ease, background 0.4s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `linear-gradient(145deg,${color}50,${color === "#27bbd2" ? "#6366f1" : color === "#6366f1" ? "#f59e0b" : "#27bbd2"}38,${color}18)`;
                  e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.06), 0 20px 64px ${glow}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "linear-gradient(145deg,rgba(39,187,210,0.14),rgba(99,102,241,0.08),rgba(39,187,210,0.04))";
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.04)";
                }}
              >
                <SpotlightCard
                  color={color}
                  glow={glow}
                  className="h-full rounded-[21px] p-7"
                  style={{
                    background: `linear-gradient(160deg, #ffffff 0%, ${color}04 100%)`,
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {/* top accent bar */}
                  <div className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg,transparent,${color}60,transparent)` }} />

                  {/* icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 7 }}
                    transition={{ type: "spring", stiffness: 440, damping: 15 }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      background: `linear-gradient(145deg,${bg},${color}20)`,
                      boxShadow: `0 4px 18px ${glow}, inset 0 1px 0 rgba(255,255,255,0.7)`,
                    }}
                  >
                    <Icon size={20} style={{ color }} />
                  </motion.div>

                  {/* text */}
                  <h3 className="font-extrabold text-[#0f172a] mb-2.5 text-[15px] tracking-[-0.02em] leading-snug">{title}</h3>
                  <p className="text-[13px] text-[#64748b] leading-[1.72] mb-6 font-[450]">{desc}</p>

                  {/* cta */}
                  <div className="flex items-center gap-1 text-[12px] font-bold group-hover:gap-2 transition-all duration-200"
                    style={{ color }}>
                    Learn more <ChevronRight size={12} strokeWidth={2.5} />
                  </div>
                </SpotlightCard>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-28 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)" }}>
        {/* subtle teal orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(39,187,210,0.06) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
          <FadeUp className="text-center mb-20">
            <SectionLabel text="Process" />
            <h2 className="text-[2.15rem] md:text-[2.75rem] font-extrabold text-[#0f172a] leading-[1.15] tracking-[-0.02em] mt-1">
              Get hired in{" "}
              <span style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                4 simple steps
              </span>
            </h2>
            <p className="text-[#64748b] mt-4 text-[15px] leading-[1.7]">
              From signup to offer letter — the whole journey, simplified.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-[46px] left-[16%] right-[16%] h-px pointer-events-none"
              style={{ background: "repeating-linear-gradient(90deg,rgba(39,187,210,0.4) 0,rgba(39,187,210,0.4) 8px,transparent 8px,transparent 18px)" }} />

            {steps.map(({ icon: Icon, num, title, desc, color, glow }, i) => (
              <FadeUp key={num} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  className="flex flex-col items-center text-center relative group"
                >
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 380, damping: 18 }}
                    className="h-[92px] w-[92px] rounded-[22px] flex items-center justify-center mb-6 relative z-10"
                    style={{
                      background: `linear-gradient(145deg,${color},${color}bb)`,
                      boxShadow: `0 12px 32px ${glow}, 0 2px 8px rgba(0,0,0,0.08)`,
                    }}
                  >
                    <Icon size={32} className="text-white" />
                  </motion.div>
                  <span className="text-[10px] font-extrabold tracking-[0.18em] mb-2 px-2.5 py-1 rounded-full"
                    style={{ color, background: `${color}12` }}>
                    STEP {num}
                  </span>
                  <h3 className="font-bold text-[#0f172a] mb-2 text-[15px] tracking-[-0.01em]">{title}</h3>
                  <p className="text-[13.5px] text-[#64748b] leading-[1.65] max-w-[175px]">{desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#060d1f 0%,#0d1535 45%,#1a1040 75%,#0a2a4a 100%)" }}>
        {/* grid texture */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(39,187,210,0.12),transparent 70%)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,0.12),transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
          <FadeUp className="text-center mb-12">
            <p className="text-white/35 text-[11px] font-bold tracking-[0.18em] uppercase mb-2">By the numbers</p>
            <h2 className="text-[1.9rem] md:text-[2.4rem] font-extrabold text-white tracking-[-0.02em]">
              Trusted by millions of professionals
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ icon: Icon, end, suffix, label, color, bg }, i) => (
              <FadeUp key={label} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 340, damping: 22 }}
                  className="flex flex-col items-center text-center p-7 rounded-2xl relative overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = color + "44";
                    e.currentTarget.style.boxShadow = `0 0 40px ${color}18`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="p-3 rounded-xl mb-5" style={{ background: bg }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <p className="text-[2.2rem] font-extrabold text-white leading-none mb-1.5 tracking-[-0.03em]">
                    <AnimatedCounter end={end} suffix={suffix} />
                  </p>
                  <p className="text-[13px] text-white/40 font-medium">{label}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <CategoryCarousel />
      <LatestJobs />

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-28">
        <FadeUp>
          <motion.div
            whileHover={{ scale: 1.004 }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="rounded-[28px] p-12 md:p-20 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg,#060d1f 0%,#0d1535 45%,#1a1040 75%,#0a2a4a 100%)",
              boxShadow: "0 40px 100px rgba(39,187,210,0.14), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(39,187,210,0.2),transparent 70%)" }} />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(99,102,241,0.2),transparent 70%)" }} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "52px 52px" }} />

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold tracking-wider mb-7 border"
                style={{ background: "rgba(39,187,210,0.08)", borderColor: "rgba(39,187,210,0.25)", color: "#67e8f9" }}
              >
                <Bot size={11} /> AI-Powered Career Matching
              </motion.div>

              <h2 className="text-[2.2rem] md:text-[3rem] lg:text-[3.5rem] font-extrabold text-white mb-5 leading-[1.1] tracking-[-0.03em]">
                Ready to find your<br />
                <span style={{ background: "linear-gradient(90deg,#27bbd2,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  dream job?
                </span>
              </h2>
              <p className="text-white/50 text-[16px] mb-10 max-w-md mx-auto leading-[1.7]">
                Join millions of professionals who found their perfect role through CareerNest.
              </p>

              <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(245,158,11,0.5)" }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="px-9 py-4 rounded-xl font-bold text-[14px] flex items-center gap-2 text-white"
                    style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
                  >
                    Get Started Free <ArrowRight size={14} />
                  </motion.button>
                </Link>
                <Link to="/jobs">
                  <motion.button
                    whileHover={{ scale: 1.04, borderColor: "rgba(39,187,210,0.5)", color: "#67e8f9" }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="px-9 py-4 rounded-xl font-bold text-[14px] text-white/60 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    Browse Jobs
                  </motion.button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-8 flex-wrap">
                {["No credit card required", "Free forever plan", "10K+ companies"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-[12px] text-white/35">
                    <CheckCircle2 size={12} className="text-[#34d399]" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </FadeUp>
      </section>

      <Footer />
      <AIChatButton />
    </div>
  );
};

export default Home;
