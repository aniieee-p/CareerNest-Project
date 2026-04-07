import React, { useRef, useCallback, useState } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, BookOpen, TrendingUp, Users, Target, Award,
  ArrowRight, Sparkles, Star, Brain, ChevronRight, RotateCcw,
  Briefcase, DollarSign, Zap, Loader2
} from "lucide-react";
import axios from "axios";
import { AI_API_END_POINT } from "../utils/constant";

// ── data ──────────────────────────────────────────────────────────────────────

const tips = [
  { icon: Lightbulb, color: "#27bbd2", bg: "rgba(39,187,210,0.1)",  border: "rgba(39,187,210,0.22)", tag: "Resume",    title: "Tailor Your Resume",        desc: "Customize your resume for each application. Mirror the job description's language and highlight matching skills to pass ATS filters." },
  { icon: BookOpen,  color: "#6366f1", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.22)", tag: "Growth",    title: "Keep Learning",             desc: "Stay ahead with the latest tools and trends. Certifications and side projects signal initiative and keep your profile competitive." },
  { icon: TrendingUp,color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.22)", tag: "Network",   title: "Build Your Network",        desc: "Connect with professionals on LinkedIn. Many roles are filled through referrals — a warm intro beats a cold application every time." },
  { icon: Users,     color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.22)", tag: "Interview", title: "Prepare for Interviews",    desc: "Practice STAR-method answers, research the company deeply, and prepare thoughtful questions that show genuine interest." },
  { icon: Target,    color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.22)",  tag: "Strategy",  title: "Set Clear Goals",           desc: "Define your 1-year and 5-year career targets. Clarity on direction helps you choose the right roles and say no to the wrong ones." },
  { icon: Award,     color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.22)", tag: "Brand",     title: "Build Your Personal Brand", desc: "Share insights on LinkedIn, contribute to open source, or write articles. Visibility compounds over time and attracts opportunities." },
];

const stats = [
  { value: "3×",  label: "More interviews with a tailored resume" },
  { value: "70%", label: "Of jobs filled through networking" },
  { value: "85%", label: "Employers check LinkedIn before hiring" },
];

const questions = [
  { key: "skill",       label: "What's your strongest skill?",   options: ["Coding", "Design", "Communication", "Analytics"] },
  { key: "workStyle",   label: "Preferred work style?",          options: ["Remote", "Office", "Hybrid"] },
  { key: "experience",  label: "Experience level?",              options: ["Fresher", "1–2 years", "3+ years"] },
  { key: "interest",    label: "Interest area?",                 options: ["Web Dev", "Data", "UI/UX", "DevOps", "Management"] },
  { key: "companySize", label: "Preferred company size?",        options: ["Startup", "MNC", "Mid-size"] },
];

const roleColors = ["#27bbd2", "#6366f1", "#f59e0b"];

// ── shared helpers ────────────────────────────────────────────────────────────

const useSpotlight = (glowColor = "rgba(39,187,210,0.1)") => {
  const cardRef = useRef(null);
  const spotRef = useRef(null);
  const onMove = useCallback((e) => {
    if (!cardRef.current || !spotRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    spotRef.current.style.background = `radial-gradient(260px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, ${glowColor}, transparent 70%)`;
    spotRef.current.style.opacity = "1";
  }, [glowColor]);
  const onLeave = useCallback(() => { if (spotRef.current) spotRef.current.style.opacity = "0"; }, []);
  return { cardRef, spotRef, onMove, onLeave };
};

const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// ── advice card ───────────────────────────────────────────────────────────────

const AdviceCard = ({ icon: Icon, color, bg, border, tag, title, desc }) => {
  const { cardRef, spotRef, onMove, onLeave } = useSpotlight(`${color}14`);
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.012 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative rounded-[22px] h-full"
      style={{ padding: "1px", background: `linear-gradient(145deg,${border},rgba(99,102,241,0.08),${border})`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "box-shadow 0.4s ease" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.07), 0 20px 56px ${color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
    >
      <div ref={cardRef} className="relative rounded-[21px] p-6 overflow-hidden h-full flex flex-col"
        style={{ background: "linear-gradient(160deg,#ffffff 0%,rgba(39,187,210,0.02) 100%)" }}
        onMouseMove={onMove} onMouseLeave={onLeave}>
        <div ref={spotRef} className="absolute inset-0 pointer-events-none rounded-[21px] transition-opacity duration-300" style={{ opacity: 0 }} />
        <div className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg,transparent,${color}66,transparent)` }} />
        <div className="relative flex flex-col flex-1">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10.5px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: bg, color, border: `1px solid ${border}` }}>{tag}</span>
            <motion.div whileHover={{ scale: 1.18, rotate: 10 }} transition={{ type: "spring", stiffness: 420, damping: 14 }}
              className="p-2.5 rounded-xl" style={{ background: bg, border: `1px solid ${border}` }}>
              <Icon size={18} style={{ color }} />
            </motion.div>
          </div>
          <h2 className="font-extrabold text-[#0f172a] text-[15.5px] tracking-[-0.02em] leading-snug mb-2">{title}</h2>
          <p className="text-[13px] text-[#64748b] leading-[1.7] font-[450] flex-1">{desc}</p>
          <div className="flex items-center gap-1.5 text-[12.5px] font-semibold mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color }}>
            Read more <ArrowRight size={12} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── role result card ──────────────────────────────────────────────────────────

const RoleCard = ({ role, why, skills, salary, index }) => {
  const color = roleColors[index % roleColors.length];
  const bg    = `${color}12`;
  const border= `${color}30`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="rounded-[22px] p-[1px] h-full"
      style={{ background: `linear-gradient(145deg,${border},rgba(99,102,241,0.06),${border})`, boxShadow: `0 4px 24px ${color}18` }}
    >
      <div className="rounded-[21px] p-6 h-full flex flex-col"
        style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(16px)" }}>

        {/* role name */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: bg, border: `1px solid ${border}` }}>
            <Briefcase size={17} style={{ color }} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ml-auto"
            style={{ background: bg, color, border: `1px solid ${border}` }}>
            Match #{index + 1}
          </span>
        </div>

        <h3 className="text-[16px] font-extrabold text-[#0f172a] tracking-[-0.02em] mb-2">{role}</h3>
        <p className="text-[13px] text-[#64748b] leading-[1.65] mb-4 flex-1">{why}</p>

        {/* skills */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={12} style={{ color }} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">Skills to learn</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map(s => (
              <span key={s} className="text-[11.5px] font-medium px-2.5 py-1 rounded-full"
                style={{ background: bg, color, border: `1px solid ${border}` }}>{s}</span>
            ))}
          </div>
        </div>

        {/* salary */}
        <div className="flex items-center gap-2 pt-3" style={{ borderTop: `1px solid ${border}` }}>
          <DollarSign size={13} style={{ color }} />
          <span className="text-[12.5px] font-bold" style={{ color }}>{salary}</span>
          <span className="text-[11px] text-[#94a3b8]">avg. in India</span>
        </div>
      </div>
    </motion.div>
  );
};

// ── career quiz ───────────────────────────────────────────────────────────────

const CareerQuiz = () => {
  const [step, setStep]       = useState(0);   // 0-4 = questions, 5 = loading, 6 = results
  const [answers, setAnswers] = useState({});
  const [roles, setRoles]     = useState([]);
  const [error, setError]     = useState("");

  const current = questions[step];
  const progress = Math.min((step / questions.length) * 100, 100);

  const pick = async (value) => {
    const updated = { ...answers, [current.key]: value };
    setAnswers(updated);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    // last question answered — call API
    setStep(5);
    setError("");
    try {
      const { data } = await axios.post(`${AI_API_END_POINT}/role-match`, { answers: updated });
      if (data.success) {
        setRoles(data.roles);
        setStep(6);
      } else {
        setError(data.message || "Something went wrong.");
        setStep(4);
      }
    } catch {
      setError("Could not reach the server. Please try again.");
      setStep(4);
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setRoles([]); setError(""); };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
      <FadeUp>
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="p-2 rounded-xl" style={{ background: "rgba(99,102,241,0.1)" }}>
            <Brain size={15} style={{ color: "#6366f1" }} />
          </div>
          <div>
            <h2 className="text-[19px] font-extrabold text-[#0f172a] tracking-[-0.02em]">Career Role Matcher</h2>
            <p className="text-[13px] text-[#94a3b8]">5 quick questions · AI-powered results</p>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="rounded-[24px] overflow-hidden"
          style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(99,102,241,0.15)", boxShadow: "0 8px 40px rgba(99,102,241,0.08)" }}>

          {/* progress bar */}
          {step < 5 && (
            <div className="h-1 w-full" style={{ background: "rgba(99,102,241,0.08)" }}>
              <motion.div className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }} />
            </div>
          )}

          <div className="p-5 sm:p-8">
            <AnimatePresence mode="wait">

              {/* question step */}
              {step < 5 && (
                <motion.div key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[12px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.18)" }}>
                      Question {step + 1} of {questions.length}
                    </span>
                    {step > 0 && (
                      <button onClick={() => setStep(step - 1)}
                        className="text-[12px] text-[#94a3b8] hover:text-[#6366f1] transition-colors flex items-center gap-1">
                        ← Back
                      </button>
                    )}
                  </div>

                  <h3 className="text-[20px] font-extrabold text-[#0f172a] tracking-[-0.02em] mb-6">
                    {current.label}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {current.options.map((opt) => (
                      <motion.button key={opt}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => pick(opt)}
                        className="relative px-4 py-3.5 rounded-2xl text-[13.5px] font-semibold text-left transition-all duration-200 group"
                        style={{ background: answers[current.key] === opt ? "linear-gradient(135deg,#27bbd2,#6366f1)" : "rgba(248,250,252,0.8)", color: answers[current.key] === opt ? "#fff" : "#334155", border: answers[current.key] === opt ? "1px solid transparent" : "1px solid rgba(99,102,241,0.15)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                        <span className="flex items-center justify-between">
                          {opt}
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {error && <p className="mt-4 text-[13px] text-red-500">{error}</p>}
                </motion.div>
              )}

              {/* loading */}
              {step === 5 && (
                <motion.div key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                    <Loader2 size={26} color="#fff" className="animate-spin" />
                  </div>
                  <p className="text-[15px] font-bold text-[#0f172a]">Analyzing your profile…</p>
                  <p className="text-[13px] text-[#94a3b8]">Claude AI is finding your best-fit roles</p>
                </motion.div>
              )}

              {/* results */}
              {step === 6 && (
                <motion.div key="results"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <h3 className="text-[18px] font-extrabold text-[#0f172a] tracking-[-0.02em]">Your Top Role Matches</h3>
                      <p className="text-[13px] text-[#94a3b8] mt-0.5">Based on your answers · Powered by Claude AI</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={reset}
                      className="flex items-center gap-1.5 text-[12.5px] font-semibold px-3.5 py-2 rounded-xl transition-all"
                      style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.18)" }}>
                      <RotateCcw size={13} /> Retake
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {roles.map((r, i) => <RoleCard key={i} {...r} index={i} />)}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </FadeUp>
    </section>
  );
};

// ── page ──────────────────────────────────────────────────────────────────────

const CareerAdvice = () => (
  <div className="min-h-screen" style={{ background: "#f8fafc" }}>
    <Navbar />

    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -left-28 w-[500px] h-[500px] rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle,#27bbd2,transparent 70%)", filter: "blur(72px)" }} />
        <div className="absolute -top-16 right-0 w-[360px] h-[360px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle,#6366f1,transparent 70%)", filter: "blur(64px)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 text-center">
        <FadeUp>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-semibold mb-6"
            style={{ background: "rgba(39,187,210,0.08)", border: "1px solid rgba(39,187,210,0.2)", color: "#0e7490" }}>
            <Sparkles size={13} /> Expert tips to accelerate your career
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold text-[#0f172a] tracking-[-0.03em] leading-[1.1] mb-5">
            Practical{" "}
            <span style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Career</span>{" "}
            <span className="relative inline-block">
              <span style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Advice</span>
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                <path d="M0,4 Q50,0 100,4 Q150,8 200,4" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
              </svg>
            </span>
            {" "}That Works
          </h1>
        </FadeUp>

        <FadeUp delay={0.13}>
          <p className="text-[15.5px] text-[#64748b] max-w-lg mx-auto leading-relaxed mb-10">
            Actionable guidance from industry experts to help you land your dream role and grow your career.
          </p>
        </FadeUp>

        <FadeUp delay={0.19}>
          <div className="flex flex-wrap justify-center gap-3">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(39,187,210,0.15)", boxShadow: "0 2px 12px rgba(39,187,210,0.07)" }}>
                <span className="text-[17px] font-extrabold"
                  style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {value}
                </span>
                <span className="text-[12.5px] text-[#64748b] font-medium">{label}</span>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>

      <div className="h-px max-w-5xl mx-auto"
        style={{ background: "linear-gradient(90deg,transparent,rgba(39,187,210,0.2),transparent)" }} />
    </section>

    {/* Quiz — above tip cards */}
    <div className="pt-16">
      <CareerQuiz />
    </div>

    {/* Tip Cards */}
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <FadeUp>
        <div className="flex items-center gap-3 mb-8 sm:mb-10">
          <div className="p-2 rounded-xl" style={{ background: "rgba(39,187,210,0.1)" }}>
            <Star size={15} style={{ color: "#27bbd2" }} />
          </div>
          <div>
            <h2 className="text-[19px] font-extrabold text-[#0f172a] tracking-[-0.02em]">Top Career Tips</h2>
            <p className="text-[13px] text-[#94a3b8]">Hover each card to explore</p>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tips.map((tip, i) => (
          <FadeUp key={tip.title} delay={i * 0.07}>
            <AdviceCard {...tip} />
          </FadeUp>
        ))}
      </div>
    </section>

    <Footer />
  </div>
);

export default CareerAdvice;
