import React, { useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { motion } from 'framer-motion';
import { Code2, Layout, Server, BarChart2, Palette, Smartphone, Cloud, Brain } from 'lucide-react';

const categories = [
  { label: "Full Stack",     icon: Code2,      color: "#27bbd2" },
  { label: "Frontend",       icon: Layout,     color: "#6366f1" },
  { label: "Backend",        icon: Server,     color: "#f59e0b" },
  { label: "Data Scientist", icon: BarChart2,  color: "#10b981" },
  { label: "UI/UX Designer", icon: Palette,    color: "#6366f1" },
  { label: "Mobile App",     icon: Smartphone, color: "#f59e0b" },
  { label: "DevOps",         icon: Cloud,      color: "#27bbd2" },
  { label: "AI / ML",        icon: Brain,      color: "#10b981" },
];

const CategoryCard = ({ label, icon: Icon, color, onClick }) => {
  const cardRef = useRef(null);
  const spotRef = useRef(null);
  const onMove = useCallback((e) => {
    if (!cardRef.current || !spotRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    spotRef.current.style.background = `radial-gradient(200px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, ${color}18, transparent 70%)`;
    spotRef.current.style.opacity = "1";
  }, [color]);
  const onLeave = useCallback(() => { if (spotRef.current) spotRef.current.style.opacity = "0"; }, []);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.013 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onClick={onClick}
      className="group cursor-pointer rounded-[22px]"
      style={{
        padding: "1px",
        background: `linear-gradient(145deg,${color}28,rgba(99,102,241,0.08),${color}0a)`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.4s ease, background 0.4s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `linear-gradient(145deg,${color}55,rgba(99,102,241,0.3),${color}22)`;
        e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.06), 0 20px 64px ${color}28`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = `linear-gradient(145deg,${color}28,rgba(99,102,241,0.08),${color}0a)`;
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.04)";
      }}
    >
      <div ref={cardRef} className="relative rounded-[21px] p-4 sm:p-6 overflow-hidden flex flex-col items-center gap-3"
        style={{ background: "var(--cn-card)", backdropFilter: "blur(16px)" }}
        onMouseMove={onMove} onMouseLeave={onLeave}>
        <div ref={spotRef} className="absolute inset-0 pointer-events-none rounded-[21px] transition-opacity duration-300" style={{ opacity: 0 }} />
        <div className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg,transparent,${color}60,transparent)` }} />
        <motion.div
          whileHover={{ scale: 1.12, rotate: 7 }}
          transition={{ type: "spring", stiffness: 440, damping: 15 }}
          className="relative p-3 rounded-2xl"
          style={{ background: `${color}18`, border: `1px solid ${color}30`, boxShadow: `0 4px 14px ${color}22` }}>
          <Icon size={20} style={{ color }} />
        </motion.div>
        <span className="relative text-xs sm:text-sm font-semibold text-center" style={{ color: "var(--cn-text-2)" }}>{label}</span>
      </div>
    </motion.div>
  );
};

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="max-w-7xl mx-auto my-10 sm:my-16 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: "var(--cn-text-1)" }}>
        Browse by{" "}
        <span style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Category
        </span>
      </h2>
      <p className="text-center text-sm mb-8" style={{ color: "var(--cn-text-3)" }}>Find jobs that match your expertise</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map(({ label, icon, color }, index) => (
          <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <CategoryCard label={label} icon={icon} color={color} onClick={() => searchJobHandler(label)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousel;
