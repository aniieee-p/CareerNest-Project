import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import {
  Loader2, Mail, CheckCircle2, Briefcase,
  TrendingUp, Zap, ArrowRight, Sparkles, ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

/* ── Shared: Gradient blob ── */
function GradientBlob({ style, delay = 0, duration = 8 }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ filter: "blur(72px)", ...style }}
      animate={{ scale: [1, 1.18, 0.95, 1], opacity: [0.55, 0.75, 0.5, 0.55] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ── Shared: Particle canvas ── */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.45 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ── Button gradient variants ── */
const btnVariants = {
  idle:    { background: "linear-gradient(90deg,#f59e0b 0%,#f97316 55%,#ef4444 100%)" },
  loading: { background: "linear-gradient(90deg,#f59e0b 0%,#f97316 55%,#ef4444 100%)" },
};

const benefits = [
  { icon: Zap,          text: "AI-powered job matching tailored to your skills" },
  { icon: TrendingUp,   text: "Access to 50,000+ verified job listings" },
  { icon: CheckCircle2, text: "Real-time application tracking & alerts" },
];
const stats = [
  { value: "50K+", label: "Live Jobs" },
  { value: "12K+", label: "Companies" },
  { value: "98%",  label: "Match Rate" },
];

const ForgotPassword = () => {
  const [email, setEmail]     = useState("");
  const [btnState, setBtnState] = useState("idle");
  const [sent, setSent]       = useState(false);
  const [focused, setFocused] = useState(false);

  /* Parallax */
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 30 });
  const leftX   = useTransform(smoothX, [-1, 1], [-4, 4]);
  const leftY   = useTransform(smoothY, [-1, 1], [-3, 3]);
  const rightX  = useTransform(smoothX, [-1, 1], [2.5, -2.5]);
  const rightY  = useTransform(smoothY, [-1, 1], [2, -2]);

  const onMouseMove = useCallback((e) => {
    mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
    mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBtnState("loading");
    try {
      const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email }, { timeout: 60000 });
      if (res.data.success) {
        setSent(true);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. The server may be waking up — try again.");
    } finally {
      setBtnState("idle");
    }
  };

  const inputStyle = {
    paddingLeft: "2.6rem",
    borderColor: focused ? "#6366f1" : "var(--cn-input-border)",
    backgroundColor: focused ? "var(--cn-input-focus)" : "var(--cn-input-bg)",
    color: "var(--cn-text-1)",
    boxShadow: focused
      ? "0 0 0 3.5px rgba(99,102,241,0.11), 0 1px 6px rgba(99,102,241,0.07)"
      : "0 1px 2px rgba(15,23,42,0.04)",
    transition: "border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease",
  };

  return (
    <div className="h-screen flex font-sans select-none overflow-hidden">

      {/* ══ LEFT PANEL ══ */}
      <motion.div
        style={{ x: leftX, y: leftY }}
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12 sticky top-0 h-screen"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(145deg,#0ea5c9 0%,#6366f1 52%,#4338ca 100%)" }} />

        <GradientBlob delay={0}   duration={9}  style={{ width: 380, height: 380, top: -100, left: -100, background: "rgba(14,165,201,0.55)" }} />
        <GradientBlob delay={2}   duration={11} style={{ width: 320, height: 320, bottom: -80, right: -80, background: "rgba(99,102,241,0.6)" }} />
        <GradientBlob delay={4}   duration={7}  style={{ width: 260, height: 260, top: "40%", left: "55%", background: "rgba(167,139,250,0.35)" }} />
        <GradientBlob delay={1.5} duration={13} style={{ width: 200, height: 200, top: "20%", left: "10%", background: "rgba(255,255,255,0.08)" }} />
        <ParticleCanvas />

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }} className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <motion.div whileHover={{ rotate: 8, scale: 1.1 }}
              className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}>
              <Briefcase size={20} className="text-white" />
            </motion.div>
            <span className="text-2xl font-extrabold text-white tracking-tight">CareerNest</span>
          </Link>
        </motion.div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}>
              <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-white/60 mb-3 px-3 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <Sparkles size={10} /> Account Recovery
              </span>
              <h2 className="text-[2.4rem] font-extrabold text-white leading-[1.12] tracking-[-0.02em] mt-2">
                Reset Your<br />
                <span style={{ background: "linear-gradient(90deg,#fff 25%,rgba(255,255,255,0.6))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Password
                </span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              className="text-white/60 text-[0.9rem] mt-4 leading-relaxed max-w-88">
              Enter your email and we'll send you a secure link to get back into your account.
            </motion.p>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            {benefits.map(({ icon: Icon, text }, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3.5 group cursor-default">
                <motion.div whileHover={{ scale: 1.12, rotate: 5 }}
                  className="shrink-0 w-[2.1rem] h-[2.1rem] rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.13)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <Icon size={14} strokeWidth={2.2} className="text-white" />
                </motion.div>
                <span className="text-white/75 text-[0.8125rem] leading-snug group-hover:text-white/95 transition-colors duration-150">{text}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, type: "spring", stiffness: 75 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl p-5 transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.1)", backdropFilter: "blur(22px)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}>
            <p className="text-white/50 text-[0.7rem] font-semibold uppercase tracking-widest mb-4">Platform at a glance</p>
            <div className="grid grid-cols-3 gap-4">
              {stats.map(({ value, label }, i) => (
                <motion.div key={i} className="text-center"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 + i * 0.08 }}>
                  <p className="text-[1.6rem] font-extrabold text-white leading-none">{value}</p>
                  <p className="text-white/50 text-[0.7rem] mt-1.5 font-medium">{label}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/15 flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white/30"
                    style={{ background: `hsl(${200 + i * 30},70%,65%)` }} />
                ))}
              </div>
              <p className="text-white/55 text-[0.72rem]">+1,248 new jobs this week</p>
            </div>
          </motion.div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="relative z-10 text-white/30 text-[0.7rem] tracking-wide">
          © {new Date().getFullYear()} CareerNest. All rights reserved.
        </motion.p>
      </motion.div>

      {/* Divider */}
      <div className="hidden lg:block w-px self-stretch"
        style={{ background: "linear-gradient(to bottom,transparent,#e2e8f0 20%,#e2e8f0 80%,transparent)" }} />

      {/* ══ RIGHT PANEL ══ */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ background: "var(--cn-auth-right)" }}
      >
      <motion.div
        style={{ x: rightX, y: rightY }}
        className="min-h-full flex items-center justify-center px-4 sm:px-8 py-10"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="p-1.5 rounded-lg" style={{ background: "linear-gradient(135deg,#0ea5c9,#6366f1)" }}>
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="text-lg font-extrabold" style={{ color: "var(--cn-text-1)" }}>
              Career<span style={{ background: "linear-gradient(90deg,#0ea5c9,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nest</span>
            </span>
          </Link>

          {/* Icon badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg,#eef2ff,#e0e7ff)", border: "1px solid #c7d2fe" }}
          >
            <Mail size={22} strokeWidth={1.8} style={{ color: "#6366f1" }} />
          </motion.div>

          {/* Step indicator */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="flex items-center gap-2 mb-6"
          >
            {["Enter email", "Check inbox", "Reset done"].map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold"
                    style={{
                      background: i === 0 ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "#e8edf4",
                      color: i === 0 ? "#fff" : "#94a3b8",
                    }}>
                    {i + 1}
                  </div>
                  <span className="text-[0.7rem] font-medium"
                    style={{ color: i === 0 ? "#6366f1" : "#94a3b8" }}>
                    {step}
                  </span>
                </div>
                {i < 2 && <div className="flex-1 h-px" style={{ background: "#e8edf4", maxWidth: "1.5rem" }} />}
              </React.Fragment>
            ))}
          </motion.div>

          <div className="mb-8">
            <h1 className="text-[1.65rem] font-extrabold tracking-[-0.02em] leading-tight" style={{ color: "var(--cn-text-1)" }}>
              Recover your account<br />
              <span style={{ background: "linear-gradient(90deg,#6366f1,#0ea5c9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                securely
              </span>
            </h1>
            <p className="text-[0.8125rem] mt-2 leading-relaxed" style={{ color: "var(--cn-text-3)" }}>
              Enter your email and we'll send you a secure reset link — expires in 1 hour.
            </p>
          </div>

          {sent ? (
            /* ── Success state ── */
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
            >
              {/* Step indicator — step 2 active */}
              <div className="flex items-center gap-2 mb-6">
                {["Enter email", "Check inbox", "Reset done"].map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold"
                        style={{
                          background: i <= 1 ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "#e8edf4",
                          color: i <= 1 ? "#fff" : "#94a3b8",
                        }}>
                        {i < 1 ? <CheckCircle2 size={11} strokeWidth={3} /> : i + 1}
                      </div>
                      <span className="text-[0.7rem] font-medium"
                        style={{ color: i <= 1 ? "#6366f1" : "#94a3b8" }}>
                        {step}
                      </span>
                    </div>
                    {i < 2 && <div className="flex-1 h-px" style={{ background: i < 1 ? "#6366f1" : "#e8edf4", maxWidth: "1.5rem" }} />}
                  </React.Fragment>
                ))}
              </div>

              <div className="rounded-2xl p-6 text-center"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
                <motion.div
                  initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)" }}
                >
                  <CheckCircle2 size={26} strokeWidth={2} style={{ color: "#16a34a" }} />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[0.9375rem] font-bold mb-1" style={{ color: "var(--cn-text-1)" }}>
                  Check your inbox
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="text-[0.8rem] leading-relaxed" style={{ color: "var(--cn-text-2)" }}>
                  We sent a reset link to{" "}
                  <span className="font-semibold" style={{ color: "var(--cn-text-1)" }}>{email}</span>.
                  <br />It expires in <span className="font-semibold" style={{ color: "var(--cn-text-1)" }}>1 hour</span>.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
                  className="text-[0.75rem] mt-3" style={{ color: "var(--cn-text-3)" }}>
                  Didn't receive it?{" "}
                  <button type="button" onClick={() => setSent(false)}
                    className="font-semibold hover:opacity-70 transition-opacity duration-150"
                    style={{ color: "#6366f1" }}>
                    Resend
                  </button>
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[0.8125rem] font-semibold tracking-wide" style={{ color: "var(--cn-text-2)" }}>
                  Email address
                </label>
                <div className="relative">
                  <motion.div
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    animate={{ color: focused ? "#6366f1" : "#b0bac9", scale: focused ? 1.1 : 1 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <Mail size={15} strokeWidth={2} />
                  </motion.div>
                  <input
                    id="email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    className="w-full py-[0.72rem] pr-4 rounded-xl border text-[0.8125rem] placeholder-slate-300 outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>

              <motion.button
                type="submit" disabled={btnState === "loading"}
                variants={btnVariants}
                animate={btnState}
                whileHover={btnState === "idle" ? { scale: 1.012, boxShadow: "0 10px 28px rgba(245,158,11,0.38)" } : {}}
                whileTap={btnState === "idle" ? { scale: 0.978 } : {}}
                className="w-full py-[0.82rem] rounded-xl text-white font-bold text-[0.8125rem] tracking-wide flex items-center justify-center gap-2 mt-1 overflow-hidden"
                style={{ boxShadow: "0 3px 14px rgba(245,158,11,0.22)", letterSpacing: "0.02em" }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {btnState === "loading" ? (
                    <motion.span key="loading" className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.16 }}>
                      <Loader2 size={15} className="animate-spin" /> Sending…
                    </motion.span>
                  ) : (
                    <motion.span key="idle" className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.16 }}>
                      Send Reset Link <ArrowRight size={14} strokeWidth={2.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          )}

          <div className="mt-7 text-center">
            <Link to="/login"
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold transition-opacity duration-150 hover:opacity-70"
              style={{ color: "#6366f1" }}>
              <ArrowLeft size={14} strokeWidth={2.5} /> Back to Sign In
            </Link>
          </div>

          <p className="text-center text-[0.72rem] mt-6 leading-relaxed" style={{ color: "var(--cn-text-3)" }}>
            By continuing you agree to our{" "}
            <span className="underline cursor-pointer transition-colors duration-150" style={{ color: "var(--cn-text-2)" }}>Terms</span>{" "}&{" "}
            <span className="underline cursor-pointer transition-colors duration-150" style={{ color: "var(--cn-text-2)" }}>Privacy Policy</span>.
          </p>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
