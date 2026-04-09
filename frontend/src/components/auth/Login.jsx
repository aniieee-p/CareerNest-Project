import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import {
  Loader2, Eye, EyeOff, CheckCircle2, Briefcase,
  TrendingUp, Zap, GraduationCap, Building2,
  Mail, Lock, ArrowRight, Sparkles,
} from "lucide-react";
import {
  motion, AnimatePresence,
  useMotionValue, useTransform, useSpring,
} from "framer-motion";

/* ── Animated gradient blob ── */
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

/* ── Particle canvas ── */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.45 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
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

/* ── Google SVG icon ── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 12.075 17.64 9.767 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

/* ── Input wrapper with animated icon ── */
function InputField({ id, label, children }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[0.8125rem] font-semibold tracking-wide" style={{ color: "var(--cn-text-2)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Button gradient variants ── */
const btnVariants = {
  idle:    { background: "linear-gradient(90deg,#f59e0b 0%,#f97316 55%,#ef4444 100%)" },
  loading: { background: "linear-gradient(90deg,#f59e0b 0%,#f97316 55%,#ef4444 100%)" },
  success: { background: "linear-gradient(90deg,#10b981 0%,#059669 100%)" },
  error:   { background: "linear-gradient(90deg,#ef4444 0%,#dc2626 100%)" },
};

/* ── Static data ── */
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

/* ── Main component ── */
const Login = () => {
  const [input, setInput]         = useState({ email: "", password: "", role: "student" });
  const [showPass, setShowPass]   = useState(false);
  const [focusedField, setFocused] = useState(null);
  const [btnState, setBtnState]   = useState("idle");
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem("rememberMe") === "true");

  const { loading } = useSelector((s) => s.auth ?? {});
  const navigate    = useNavigate();
  const dispatch    = useDispatch();

  // Rehydrate remembered user on mount — removed: localStorage cannot restore the auth cookie,
  // so restoring user state without a valid cookie causes 401s on all API calls.
  // redux-persist handles keeping user state; the cookie handles actual auth.

  /* Parallax */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 30 });
  const leftX  = useTransform(smoothX, [-1, 1], [-4, 4]);
  const leftY  = useTransform(smoothY, [-1, 1], [-3, 3]);
  const rightX = useTransform(smoothX, [-1, 1], [2.5, -2.5]);
  const rightY = useTransform(smoothY, [-1, 1], [2, -2]);

  const onMouseMove = useCallback((e) => {
    mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
    mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  const onChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBtnState("loading");
    dispatch(setLoading(true));
    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, { ...input, rememberMe }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        setBtnState("success");
        dispatch(setUser(res.data.user));
        localStorage.setItem("token", res.data.token);
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedUser");
        toast.success(res.data.message);
        setTimeout(() => navigate(res.data.user?.role === "recruiter" ? "/admin/companies" : "/"), 650);
      }
    } catch (err) {
      setBtnState("error");
      toast.error(err.response?.data?.message || "Login failed");
      setTimeout(() => setBtnState("idle"), 1800);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const inputStyle = (field) => ({
    paddingLeft: "2.6rem",
    borderColor: focusedField === field ? "#6366f1" : "var(--cn-input-border)",
    backgroundColor: focusedField === field ? "var(--cn-input-focus)" : "var(--cn-input-bg)",
    color: "var(--cn-text-1)",
    boxShadow: focusedField === field
      ? "0 0 0 3.5px rgba(99,102,241,0.11), 0 1px 6px rgba(99,102,241,0.07)"
      : "0 1px 2px rgba(15,23,42,0.04)",
    transition: "border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease",
  });

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

        {/* Center */}
        <div className="relative z-10 space-y-8">
          <div>
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}>
              <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-white/60 mb-3 px-3 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <Sparkles size={10} /> Your Career Platform
              </span>
              <h2 className="text-[2.4rem] font-extrabold text-white leading-[1.12] tracking-[-0.02em] mt-2">
                Welcome Back to<br />
                <span style={{ background: "linear-gradient(90deg,#fff 25%,rgba(255,255,255,0.6))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Your Journey
                </span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              className="text-white/60 text-[0.9rem] mt-4 leading-relaxed max-w-88">
              Sign in to access thousands of curated opportunities matched to your profile.
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
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(22px)",
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
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
            className="w-full max-w-[28.5rem] rounded-[1.75rem] p-6 sm:p-7"
            style={{
              background: "var(--cn-auth-card)",
              border: "1px solid var(--cn-border)",
              boxShadow: "0 24px 60px rgba(15,23,42,0.12)",
            }}
          >
            <div className="mb-6">
              <h1 className="text-[1.75rem] font-extrabold tracking-[-0.02em]" style={{ color: "var(--cn-text-1)" }}>
                Sign in to CareerNest
              </h1>
              <p className="text-[0.8125rem] mt-2 leading-relaxed" style={{ color: "var(--cn-text-3)" }}>
              Don't have an account?{" "}
              <Link to="/signup"
                className="font-semibold transition-colors duration-150 hover:opacity-80"
                style={{ color: "#6366f1" }}>
                Sign up free
              </Link>
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-[1.1rem]">

            {/* Role toggle */}
            <div className="relative flex gap-1.5 p-1 rounded-xl"
              style={{ background: "var(--cn-role-bg)", border: "1px solid var(--cn-role-border)" }}>
              {[
                { value: "student",   label: "Student",   Icon: GraduationCap },
                { value: "recruiter", label: "Recruiter", Icon: Building2 },
              ].map(({ value, label, Icon }) => (
                <button key={value} type="button"
                  onClick={() => setInput({ ...input, role: value })}
                  className="relative flex-1 flex items-center justify-center gap-2 py-[0.6rem] rounded-[0.6rem] text-[0.8125rem] font-semibold transition-colors duration-150 z-10"
                  style={{ color: input.role === value ? "#fff" : "#818cf8" }}
                  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <AnimatePresence>
                    {input.role === value && (
                      <motion.span layoutId="roleHighlight"
                        className="absolute inset-0 rounded-[0.6rem]"
                        style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 2px 12px rgba(99,102,241,0.32)" }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 340, damping: 30 }} />
                    )}
                  </AnimatePresence>
                  <motion.span className="relative z-10"
                    animate={{ rotate: input.role === value ? [0, -8, 0] : 0 }}
                    transition={{ duration: 0.28 }}>
                    <Icon size={13} strokeWidth={2.2} />
                  </motion.span>
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </div>

            {/* Email */}
            <InputField id="email" label="Email address">
              <motion.div
                className="relative"
                whileHover={{ y: -1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  animate={{ color: focusedField === "email" ? "#6366f1" : "#b0bac9", scale: focusedField === "email" ? 1.1 : 1 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <Mail size={15} strokeWidth={2} />
                </motion.div>
                <input id="email" type="email" name="email" value={input.email}
                  onChange={onChange} placeholder="you@example.com" required
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  className="w-full py-[0.72rem] pr-4 rounded-xl border text-[0.8125rem] placeholder-slate-300 outline-none"
                  style={inputStyle("email")} />
              </motion.div>
            </InputField>

            {/* Password */}
            <InputField id="password" label="Password">
              <motion.div
                className="relative"
                whileHover={{ y: -1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  animate={{ color: focusedField === "password" ? "#6366f1" : "#b0bac9", scale: focusedField === "password" ? 1.1 : 1 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <Lock size={15} strokeWidth={2} />
                </motion.div>
                <input id="password" type={showPass ? "text" : "password"} name="password"
                  value={input.password} onChange={onChange} placeholder="••••••••" required
                  onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                  className="w-full py-[0.72rem] pr-11 rounded-xl border text-[0.8125rem] placeholder-slate-300 outline-none"
                  style={inputStyle("password")} />
                <motion.button type="button" onClick={() => setShowPass(!showPass)}
                  whileHover={{ color: "#475569" }}
                  whileTap={{ scale: 0.82 }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-150">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={showPass ? "off" : "on"}
                      initial={{ opacity: 0, rotate: -12, scale: 0.75 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 12, scale: 0.75 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}>
                      {showPass ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </motion.div>
              <div className="flex items-center justify-between mt-2.5">
                {/* ── Custom Remember Me checkbox ── */}
                <label className="flex items-center gap-2 cursor-pointer group select-none" htmlFor="rememberMe">
                  <span className="relative flex items-center justify-center">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    {/* Track */}
                    <motion.span
                      animate={{
                        borderColor: rememberMe ? "#27bbd2" : "#d1d5db",
                        backgroundColor: rememberMe ? "#27bbd2" : "#ffffff",
                        scale: rememberMe ? [1, 0.88, 1.08, 1] : 1,
                        boxShadow: rememberMe
                          ? "0 0 0 3px rgba(39,187,210,0.2)"
                          : "0 0 0 0px rgba(39,187,210,0)",
                      }}
                      whileHover={{
                        borderColor: "#27bbd2",
                        boxShadow: "0 0 0 3.5px rgba(39,187,210,0.18)",
                        scale: 1.08,
                      }}
                      whileTap={{ scale: 0.82 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="w-[1.05rem] h-[1.05rem] rounded-[5px] border-2 flex items-center justify-center"
                      style={{ minWidth: "1.05rem" }}
                    >
                      <AnimatePresence initial={false}>
                        {rememberMe && (
                          <motion.svg
                            key="check"
                            viewBox="0 0 10 8"
                            fill="none"
                            width="9"
                            height="7"
                            initial={{ opacity: 0, scale: 0.3, y: 2 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.3, y: 2 }}
                            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                          >
                            <motion.path
                              d="M1 4L3.8 7L9 1"
                              stroke="white"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.24, ease: "easeOut", delay: 0.04 }}
                            />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </motion.span>
                  </span>
                  <motion.span
                    animate={{ color: rememberMe ? "#27bbd2" : "#64748b" }}
                    whileHover={{ color: "#27bbd2" }}
                    transition={{ duration: 0.18 }}
                    className="text-[0.775rem] font-medium"
                  >
                    Remember me
                  </motion.span>
                </label>

                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                <Link
                  to="/forgot-password"
                  className="text-[0.75rem] font-medium relative group"
                  style={{ color: "#6366f1" }}
                >
                  Forgot password?
                </Link>
                </motion.div>
              </div>
            </InputField>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={btnState === "loading" || btnState === "success"}
              variants={btnVariants}
              animate={btnState}
              whileHover={btnState === "idle" ? { scale: 1.012, boxShadow: "0 10px 28px rgba(245,158,11,0.38)" } : {}}
              whileTap={btnState === "idle" ? { scale: 0.978 } : {}}
              className="w-full py-[0.82rem] rounded-xl text-white font-bold text-[0.8125rem] tracking-wide flex items-center justify-center gap-2 mt-0.5 overflow-hidden"
              style={{ boxShadow: "0 3px 14px rgba(245,158,11,0.22)", letterSpacing: "0.02em" }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {btnState === "loading" && (
                  <motion.span key="loading" className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.16 }}>
                    <Loader2 size={15} className="animate-spin" /> Signing in…
                  </motion.span>
                )}
                {btnState === "success" && (
                  <motion.span key="success" className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}>
                    <CheckCircle2 size={15} /> Welcome back!
                  </motion.span>
                )}
                {btnState === "error" && (
                  <motion.span key="error" className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: [0, -5, 5, -4, 4, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.38 }}>
                    Try again
                  </motion.span>
                )}
                {btnState === "idle" && (
                  <motion.span key="idle" className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.16 }}>
                    Sign In <ArrowRight size={14} strokeWidth={2.5} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            </form>

          {/* OR divider */}
          <div className="flex items-center gap-3 mt-5">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #e2e8f0)" }} />
            <span className="text-[0.72rem] text-slate-400 font-medium tracking-wide uppercase">or</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #e2e8f0)" }} />
          </div>

          {/* Google button */}
          <motion.button
            type="button"
            whileHover={{ y: -1.5, boxShadow: "0 6px 22px rgba(15,23,42,0.09)", borderColor: "#c7d2fe" }}
            whileTap={{ scale: 0.985, y: 0 }}
            onClick={() => toast.info("Google login coming soon")}
            className="w-full flex items-center justify-center gap-3 py-[0.72rem] rounded-xl border text-[0.8125rem] font-semibold mt-4"
            style={{
              background: "var(--cn-input-bg)",
              color: "var(--cn-text-1)",
              borderColor: "var(--cn-input-border)",
              boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
              transition: "box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
            }}
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>

            <p className="text-center text-[0.72rem] mt-8 leading-relaxed" style={{ color: "var(--cn-text-3)" }}>
            By signing in you agree to our{" "}
            <span className="underline cursor-pointer transition-colors duration-150" style={{ color: "var(--cn-text-2)" }}>Terms</span>{" "}&{" "}
            <span className="underline cursor-pointer transition-colors duration-150" style={{ color: "var(--cn-text-2)" }}>Privacy Policy</span>.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
