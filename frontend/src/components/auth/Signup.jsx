import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2, Eye, EyeOff, CheckCircle2, Briefcase, Upload } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  "Get matched with jobs that fit your exact skills",
  "AI parses your resume automatically",
  "Track all applications in one dashboard",
];

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "", email: "", phonenumber: "", password: "", role: "", file: "",
  });
  const [showPass, setShowPass] = useState(false);
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });
  const changeFileHandler = (e) => setInput({ ...input, file: e.target.files?.[0] });

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phonenumber", input.phonenumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("file", input.file);
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
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
            Join CareerNest Today
          </motion.h2>
          <p className="text-white/75 text-lg mb-8">
            Create your free account and start your journey to the perfect role.
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
            <p className="text-white/70 text-xs mb-1">Professionals joined this month</p>
            <p className="text-3xl font-extrabold text-white">+8,400</p>
            <p className="text-white/60 text-xs mt-1">And growing every day</p>
          </motion.div>
        </div>

        <p className="text-white/40 text-xs">© {new Date().getFullYear()} CareerNest</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="p-1.5 rounded-lg" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Career<span style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nest</span>
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h1>
          <p className="text-sm text-[#94a3b8] mb-8">
            Already have an account?{" "}
            <Link to="/login" className="text-[#27bbd2] font-semibold hover:underline">Sign in</Link>
          </p>

          <form onSubmit={submitHandler} className="space-y-4">
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

            {[
              { label: "Full Name", name: "fullname", type: "text", placeholder: "John Doe" },
              { label: "Email address", name: "email", type: "email", placeholder: "you@example.com" },
              { label: "Phone Number", name: "phonenumber", type: "text", placeholder: "+91 9876543210" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={input[name]}
                  onChange={changeEventHandler}
                  placeholder={placeholder}
                  required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: "#e2e8f0" }}
                  onFocus={e => e.target.style.borderColor = "#27bbd2"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            ))}

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
            </div>

            {/* Profile photo upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Photo (optional)</label>
              <label
                className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-[#27bbd2] hover:bg-[#27bbd2]/3"
                style={{ borderColor: "#e2e8f0" }}
              >
                <Upload size={16} className="text-[#94a3b8]" />
                <span className="text-sm text-[#94a3b8]">
                  {input.file ? input.file.name : "Click to upload photo"}
                </span>
                <input type="file" accept="image/*" onChange={changeFileHandler} className="hidden" />
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 mt-2"
              style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Please wait</> : "Create Account"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
