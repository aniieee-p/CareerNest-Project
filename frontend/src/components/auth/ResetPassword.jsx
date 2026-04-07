import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import {
  Loader2, Eye, EyeOff, Lock, ArrowRight, Briefcase,
  CheckCircle2, TrendingUp, Zap, Sparkles, ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ── Gradient blob ── */
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

/* ── Password strength ── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: "" },
    { label: "Weak",   color: "#ef4444" },
    { label: "Fair",   color: "#f97316" },
    { label: "Good",   color: "#eab308" },
    { label: "Strong", color: "#22c55e" },
  ];
  return { score, ...map[score] };
}

function PasswordStrength({ password }) {
  const { score, label, color } = getStrength(password);
  if (!password) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }} className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "#e8edf4" }}>
            <motion.div className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: score >= i ? "100%" : "0%" }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              style={{ background: score >= i ? color : "transparent" }} />
          </div>
        ))}
      </div>
      <p className="text-[0.7rem] font-semibold" style={{ color }}>{label} password</p>
    </motion.div>
  );
}

const benefits = [
  { icon: ShieldCheck,  text: "Your account is protected with end-to-end encryption" },
  { icon: Zap,          text: "Instant access restored after password reset" },
  { icon: CheckCircle2, text: "Secure token expires in 1 hour for your safety" },
];
const stats = [
  { value: "50K+", label: "Live Jobs" },
  { value: "12K+", label: "Companies" },
  { value: "98%",  label: "Match Rate" },
];

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [focused, setFocused]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);

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

  const inputStyle = (field) => ({
    paddingLeft: "2.6rem",
    borderColor: focused === field ? "#6366f1" : "var(--cn-input-border)",
    backgroundColor: focused === field ? "var(--cn-input-focus)" : "var(--cn-input-bg)",
    color: "var(--cn-text-1)",
    boxShadow: focused === field
      ? "0 0 0 3.5px rgba(99,102,241,0.11), 0 1px 6px rgba(99,102,241,0.07)"
      : "0 1px 2px rgba(15,23,42,0.04)",
    transition: "border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    if (password.length < 6)  { toast.error("Password must be at least 6 characters"); return; }
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/reset-password/${token}`, { password }, { timeout: 60000 });
      if (res.data.success) {
        setDone(true);
        toast.success("Password reset successfully");
        setTimeout(() => navigate("/login"), 2200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired link");
    } finally {
      setLoading(false);
    }
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
                <Sparkles size={10} /> Secure Reset
              </span>
              <h2 className="text-[2.4rem] font-extrabold text-white leading-[1.12] tracking-[-0.02em] mt-2">
                Set a New<br />
                <span style={{ background: "linear-gradient(90deg,#fff 25%,rgba(255,255,255,0.6))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Password
                </span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              className="text-white/60 text-[0.9rem] mt-4 leading-relaxed max-w-88">
              Choose a strong password to keep your CareerNest account secure.
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
            className="rounded-2xl p-5"
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
      <div className="flex-1 overflow-y-auto" style={{ background: "var(--cn-auth-right)" }}>
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

            <AnimatePresence mode="wait">
              {done ? (
                /* ── Success state ── */
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: "rgba(34,197,94,0.12)", border: "2px solid rgba(34,197,94,0.3)" }}
                  >
                    <CheckCircle2 size={32} className="text-[#22c55e]" />
                  </motion.div>
                  <h1 className="text-[1.65rem] font-extrabold tracking-[-0.02em] mb-2" style={{ color: "var(--cn-text-1)" }}>
                    Password Reset!
                  </h1>
                  <p className="text-[0.8125rem]" style={{ color: "var(--cn-text-3)" }}>
                    Redirecting you to login…
                  </p>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.div key="form">
                  <div className="mb-8">
                    <h1 className="text-[1.65rem] font-extrabold tracking-[-0.02em] leading-tight" style={{ color: "var(--cn-text-1)" }}>
                      Reset your password
                    </h1>
                    <p className="text-[0.8125rem] mt-2" style={{ color: "var(--cn-text-3)" }}>
                      Enter a new password for your account.
                    </p>
                  </div>

                  <form onSubmit={submitHandler} className="space-y-[1.1rem]">
                    {/* New password */}
                    <div className="space-y-2">
                      <label className="block text-[0.8125rem] font-semibold tracking-wide" style={{ color: "var(--cn-text-2)" }}>
                        New password
                      </label>
                      <div className="relative">
                        <motion.div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          animate={{ color: focused === "password" ? "#6366f1" : "#b0bac9", scale: focused === "password" ? 1.1 : 1 }}
                          transition={{ duration: 0.18 }}>
                          <Lock size={15} strokeWidth={2} />
                        </motion.div>
                        <input
                          type={showPass ? "text" : "password"}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          onFocus={() => setFocused("password")}
                          onBlur={() => setFocused(null)}
                          className="w-full py-[0.72rem] pr-11 rounded-xl border text-[0.8125rem] placeholder-slate-300 outline-none"
                          style={inputStyle("password")}
                        />
                        <motion.button type="button" onClick={() => setShowPass(!showPass)}
                          whileTap={{ scale: 0.82 }}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span key={showPass ? "off" : "on"}
                              initial={{ opacity: 0, rotate: -12, scale: 0.75 }}
                              animate={{ opacity: 1, rotate: 0, scale: 1 }}
                              exit={{ opacity: 0, rotate: 12, scale: 0.75 }}
                              transition={{ duration: 0.16 }}>
                              {showPass ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                            </motion.span>
                          </AnimatePresence>
                        </motion.button>
                      </div>
                      <PasswordStrength password={password} />
                    </div>

                    {/* Confirm password */}
                    <div className="space-y-2">
                      <label className="block text-[0.8125rem] font-semibold tracking-wide" style={{ color: "var(--cn-text-2)" }}>
                        Confirm password
                      </label>
                      <div className="relative">
                        <motion.div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          animate={{ color: focused === "confirm" ? "#6366f1" : "#b0bac9", scale: focused === "confirm" ? 1.1 : 1 }}
                          transition={{ duration: 0.18 }}>
                          <Lock size={15} strokeWidth={2} />
                        </motion.div>
                        <input
                          type={showConf ? "text" : "password"}
                          value={confirm}
                          onChange={e => setConfirm(e.target.value)}
                          placeholder="••••••••"
                          required
                          onFocus={() => setFocused("confirm")}
                          onBlur={() => setFocused(null)}
                          className="w-full py-[0.72rem] pr-11 rounded-xl border text-[0.8125rem] placeholder-slate-300 outline-none"
                          style={inputStyle("confirm")}
                        />
                        <motion.button type="button" onClick={() => setShowConf(!showConf)}
                          whileTap={{ scale: 0.82 }}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span key={showConf ? "off" : "on"}
                              initial={{ opacity: 0, rotate: -12, scale: 0.75 }}
                              animate={{ opacity: 1, rotate: 0, scale: 1 }}
                              exit={{ opacity: 0, rotate: 12, scale: 0.75 }}
                              transition={{ duration: 0.16 }}>
                              {showConf ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                            </motion.span>
                          </AnimatePresence>
                        </motion.button>
                      </div>
                      {/* match indicator */}
                      {confirm && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="text-[0.7rem] font-semibold"
                          style={{ color: password === confirm ? "#22c55e" : "#ef4444" }}>
                          {password === confirm ? "Passwords match ✓" : "Passwords do not match"}
                        </motion.p>
                      )}
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.012, boxShadow: "0 10px 28px rgba(245,158,11,0.38)" } : {}}
                      whileTap={!loading ? { scale: 0.978 } : {}}
                      className="w-full py-[0.82rem] rounded-xl text-white font-bold text-[0.8125rem] tracking-wide flex items-center justify-center gap-2 mt-1 overflow-hidden"
                      style={{ background: "linear-gradient(90deg,#f59e0b 0%,#f97316 55%,#ef4444 100%)", boxShadow: "0 3px 14px rgba(245,158,11,0.22)", letterSpacing: "0.02em" }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {loading ? (
                          <motion.span key="loading" className="flex items-center gap-2"
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            <Loader2 size={15} className="animate-spin" /> Resetting…
                          </motion.span>
                        ) : (
                          <motion.span key="idle" className="flex items-center gap-2"
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            Reset Password <ArrowRight size={14} strokeWidth={2.5} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </form>

                  <p className="text-center mt-6 text-[0.8125rem]" style={{ color: "var(--cn-text-3)" }}>
                    Remember your password?{" "}
                    <Link to="/login" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: "#6366f1" }}>
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
