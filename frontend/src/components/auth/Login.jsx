import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2, Eye, EyeOff, CheckCircle2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  "AI-powered job matching tailored to your skills",
  "Access to 50,000+ verified job listings",
  "Real-time application tracking & alerts",
];

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "", role: "student" });
  const [showPass, setShowPass] = useState(false);
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/20">
            <Briefcase size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">CareerNest</span>
        </Link>

        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-white mb-4 leading-tight"
          >
            Welcome Back to Your Career Journey
          </motion.h2>
          <p className="text-white/75 text-lg mb-8">
            Sign in to access thousands of opportunities waiting for you.
          </p>
          <div className="space-y-4">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 size={18} className="text-white mt-0.5 shrink-0" />
                <span className="text-white/85 text-sm">{b}</span>
              </motion.div>
            ))}
          </div>

          {/* Mock stat card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <p className="text-white/70 text-xs mb-1">New jobs this week</p>
            <p className="text-3xl font-extrabold text-white">+1,248</p>
            <p className="text-white/60 text-xs mt-1">Across 200+ companies</p>
          </motion.div>
        </div>

        <p className="text-white/40 text-xs">© {new Date().getFullYear()} CareerNest</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="p-1.5 rounded-lg" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Career<span style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nest</span>
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Sign in to your account</h1>
          <p className="text-sm text-[#94a3b8] mb-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#27bbd2] font-semibold hover:underline">Sign up free</Link>
          </p>

          <form onSubmit={submitHandler} className="space-y-5">
            {/* Role selector */}
            <div className="flex gap-3">
              {["student", "recruiter"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setInput({ ...input, role: r })}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all border-2"
                  style={{
                    borderColor: input.role === r ? "#27bbd2" : "#e2e8f0",
                    background: input.role === r ? "rgba(39,187,210,0.08)" : "transparent",
                    color: input.role === r ? "#27bbd2" : "#94a3b8",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: "#e2e8f0" }}
                onFocus={e => e.target.style.borderColor = "#27bbd2"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all pr-11"
                  style={{ borderColor: "#e2e8f0" }}
                  onFocus={e => e.target.style.borderColor = "#27bbd2"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="text-right mt-1.5">
                <Link to="/forgot-password" className="text-xs text-[#27bbd2] hover:underline">Forgot password?</Link>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Please wait</> : "Sign In"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
