import React, { useEffect, useRef } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import userGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Bot, Target, CalendarCheck, FileEdit, Bell, Building2,
  UserCheck, Upload, Search, Send, ArrowRight, Briefcase, Users, TrendingUp, Award
} from "lucide-react";

// ── Marquee ticker ──────────────────────────────────────────────────────────
const tickerItems = [
  "Software Engineer", "Product Manager", "UI/UX Designer", "Data Analyst",
  "DevOps Engineer", "Marketing Lead", "React Developer", "HR Manager",
  "Cloud Architect", "Cybersecurity Analyst", "Mobile Developer", "QA Engineer",
];

const Ticker = () => (
  <div
    className="w-full overflow-hidden py-3"
    style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)" }}
  >
    <div className="flex gap-8 animate-marquee whitespace-nowrap">
      {[...tickerItems, ...tickerItems].map((item, i) => (
        <span key={i} className="text-white text-sm font-medium flex items-center gap-2">
          <span className="text-white/60">✦</span> {item}
        </span>
      ))}
    </div>
  </div>
);

// ── Features ─────────────────────────────────────────────────────────────────
const features = [
  { icon: Bot, color: "#27bbd2", bg: "rgba(39,187,210,0.1)", title: "AI Resume Parsing", desc: "Upload once, get matched instantly with relevant roles." },
  { icon: Target, color: "#6366f1", bg: "rgba(99,102,241,0.1)", title: "Smart Job Matching", desc: "Filtered by skills and experience, not just keywords." },
  { icon: CalendarCheck, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", title: "Date-Based Filtering", desc: "See only fresh, active listings updated daily." },
  { icon: FileEdit, color: "#27bbd2", bg: "rgba(39,187,210,0.1)", title: "In-App Resume Editor", desc: "Edit your resume based on AI-powered suggestions." },
  { icon: Bell, color: "#6366f1", bg: "rgba(99,102,241,0.1)", title: "Real-Time Alerts", desc: "Instant notifications for new job matches." },
  { icon: Building2, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", title: "Company Profiles", desc: "Research companies thoroughly before applying." },
];

const FadeUp = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

// ── Steps ─────────────────────────────────────────────────────────────────────
const steps = [
  { icon: UserCheck, num: "01", title: "Create Profile", desc: "Sign up and build your professional profile in minutes." },
  { icon: Upload, num: "02", title: "Upload Resume", desc: "Our AI parses your resume and extracts key skills." },
  { icon: Search, num: "03", title: "Browse Matches", desc: "Explore curated job listings matched to your profile." },
  { icon: Send, num: "04", title: "Apply & Track", desc: "Apply with one click and track every application." },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = [
  { icon: Briefcase, value: "50K+", label: "Jobs Posted" },
  { icon: Building2, value: "10K+", label: "Companies" },
  { icon: Users, value: "2M+", label: "Job Seekers" },
  { icon: Award, value: "95%", label: "Success Rate" },
];

const Home = () => {
  userGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "recruiter") navigate("/admin/companies");
  }, []);

  return (
    <div className="bg-[#f8fafc]">
      <Navbar />
      <HeroSection />

      {/* Ticker */}
      <Ticker />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <FadeUp>
          <p className="text-center text-xs font-bold tracking-widest text-[#27bbd2] uppercase mb-2">Why CareerNest</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-12">
            Everything You Need to{" "}
            <span style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Land Your Dream Job
            </span>
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, color, bg, title, desc }, i) => (
            <FadeUp key={title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl cursor-default transition-all"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(39,187,210,0.15)",
                  boxShadow: "0 4px 24px rgba(39,187,210,0.07)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#27bbd2";
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(39,187,210,0.25)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(39,187,210,0.15)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(39,187,210,0.07)";
                }}
              >
                <div className="p-3 rounded-xl w-fit mb-4" style={{ background: bg }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeUp>
            <p className="text-center text-xs font-bold tracking-widest text-[#27bbd2] uppercase mb-2">Process</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-14">
              Get Hired in{" "}
              <span style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                4 Simple Steps
              </span>
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
              style={{ background: "repeating-linear-gradient(90deg,#27bbd2 0,#27bbd2 8px,transparent 8px,transparent 16px)" }}
            />
            {steps.map(({ icon: Icon, num, title, desc }, i) => (
              <FadeUp key={num} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center relative">
                  <div
                    className="h-20 w-20 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                    style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", boxShadow: "0 8px 24px rgba(39,187,210,0.3)" }}
                  >
                    <Icon size={28} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-[#27bbd2] tracking-widest mb-1">{num}</span>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="py-14"
        style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <FadeUp key={label} delay={i * 0.08}>
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-xl bg-white/15 mb-3">
                    <Icon size={22} className="text-white" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{value}</p>
                  <p className="text-sm text-white/75 mt-1">{label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Category Carousel */}
      <CategoryCarousel />

      {/* Latest Jobs */}
      <LatestJobs />

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <FadeUp>
          <div
            className="rounded-3xl p-12 text-center"
            style={{
              background: "linear-gradient(135deg,#27bbd2,#6366f1)",
              boxShadow: "0 20px 60px rgba(39,187,210,0.3)",
            }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to Find Your Dream Job?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join millions of professionals who found their perfect role through CareerNest.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2"
                  style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)", color: "white" }}
                >
                  Get Started Free <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link to="/jobs">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-xl font-bold text-sm border-2 border-white/50 text-white hover:bg-white/10 transition-colors"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
