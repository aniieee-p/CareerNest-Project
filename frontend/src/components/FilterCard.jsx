import React, { useState } from "react";
import {
  MapPin, IndianRupee, Briefcase, Clock, GraduationCap,
  CalendarDays, SlidersHorizontal, X, ChevronDown, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FILTER_SECTIONS = [
  {
    key: "location",
    label: "Location",
    icon: MapPin,
    color: "#27bbd2",
    grad: "linear-gradient(135deg,#27bbd2,#0ea5e9)",
    type: "radio",
    // match exact city names stored in DB
    options: ["Pune", "Bangalore", "Mumbai", "Hyderabad", "Delhi NCR"],
  },
  {
    key: "category",
    label: "Job Category",
    icon: Briefcase,
    color: "#6366f1",
    grad: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    type: "radio",
    // keywords matched against title + requirements
    options: [
      "Developer",
      "React",
      "Python",
      "Java",
      "Backend",
      "DevOps",
      "Data",
      "Designer",
      "Android",
      "Business Analyst",
    ],
  },
  {
    key: "salary",
    label: "Salary Range",
    icon: IndianRupee,
    color: "#10b981",
    grad: "linear-gradient(135deg,#10b981,#059669)",
    type: "radio",
    options: ["0–3 LPA", "3–6 LPA", "6–10 LPA", "10+ LPA"],
  },
  {
    key: "jobType",
    label: "Job Type",
    icon: Clock,
    color: "#f59e0b",
    grad: "linear-gradient(135deg,#f59e0b,#f97316)",
    type: "checkbox",
    // must match jobtype field values exactly (case-insensitive)
    options: ["Full-time", "Part-time", "Internship", "Remote", "Contract"],
  },
  {
    key: "experience",
    label: "Experience Level",
    icon: GraduationCap,
    color: "#8b5cf6",
    grad: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    type: "radio",
    options: ["Fresher", "1–3 years", "3–5 years", "5+ years"],
  },
  {
    key: "posted",
    label: "Date Posted",
    icon: CalendarDays,
    color: "#ef4444",
    grad: "linear-gradient(135deg,#ef4444,#f97316)",
    type: "radio",
    options: ["Last 24 hours", "Last 7 days", "Last 30 days"],
  },
];

/* ── individual option row ── */
const OptionRow = ({ opt, active, color, grad, type, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left relative overflow-hidden"
      style={{
        background: active
          ? `${color}14`
          : hovered
          ? "var(--cn-filter-option-hover)"
          : "transparent",
        border: active
          ? `1px solid ${color}30`
          : "1px solid transparent",
        transition: "background 0.15s ease, border-color 0.15s ease",
      }}
    >
      {/* active glow streak */}
      {active && (
        <motion.div
          layoutId={`glow-${opt}`}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at left center, ${color}18 0%, transparent 70%)`,
          }}
        />
      )}

      {/* indicator */}
      <motion.span
        animate={{
          borderColor: active ? color : "#cbd5e1",
          background: active ? color : "transparent",
          boxShadow: active ? `0 0 8px ${color}55` : "none",
        }}
        transition={{ duration: 0.18 }}
        className="shrink-0 flex items-center justify-center"
        style={{
          width: 17,
          height: 17,
          borderRadius: type === "checkbox" ? 5 : "50%",
          border: `2px solid ${active ? color : "#cbd5e1"}`,
          background: active ? color : "transparent",
          boxShadow: active ? `0 0 8px ${color}55` : "none",
          transition: "all 0.18s ease",
        }}
      >
        <AnimatePresence>
          {active && (
            <motion.svg
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15, type: "spring", stiffness: 500, damping: 20 }}
              width="9" height="9" viewBox="0 0 8 8" fill="none"
            >
              {type === "checkbox" ? (
                <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.7"
                  strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <circle cx="4" cy="4" r="2.5" fill="white" />
              )}
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.span>

      <span
        className="text-[13px] font-medium leading-none"
        style={{
          color: active ? color : hovered ? "var(--cn-text-1)" : "var(--cn-text-2)",
          fontWeight: active ? 600 : 500,
          transition: "color 0.15s ease",
        }}
      >
        {opt}
      </span>

      {/* active right dot */}
      {active && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto h-1.5 w-1.5 rounded-full shrink-0"
          style={{ background: grad }}
        />
      )}
    </motion.button>
  );
};

/* ── collapsible section ── */
const Section = ({ section, values, onChange }) => {
  const [open, setOpen] = useState(true);
  const { key, label, icon: Icon, color, grad, type, options } = section;

  const isChecked = (opt) =>
    type === "checkbox" ? (values[key] || []).includes(opt) : values[key] === opt;

  const handleChange = (opt) => {
    if (type === "checkbox") {
      const current = values[key] || [];
      const next = current.includes(opt)
        ? current.filter((v) => v !== opt)
        : [...current, opt];
      onChange(key, next.length ? next : null);
    } else {
      onChange(key, values[key] === opt ? null : opt);
    }
  };

  const activeCount =
    type === "checkbox"
      ? (values[key] || []).length
      : values[key] ? 1 : 0;

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3.5 group"
      >
        <div className="flex items-center gap-2.5">
          {/* icon tile */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: grad,
              boxShadow: `0 3px 10px ${color}40`,
            }}
          >
            <Icon size={13} className="text-white" />
          </div>

          <span className="text-[12px] font-bold tracking-widest uppercase" style={{ color: "var(--cn-text-2)" }}>
            {label}
          </span>

          {/* active badge */}
          <AnimatePresence>
            {activeCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white leading-none"
                style={{ background: grad, boxShadow: `0 2px 8px ${color}50` }}
              >
                {activeCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          <ChevronDown size={14} style={{ color: open ? color : "#94a3b8" }} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="pb-3 space-y-0.5">
              {options.map((opt) => (
                <OptionRow
                  key={opt}
                  opt={opt}
                  active={isChecked(opt)}
                  color={color}
                  grad={grad}
                  type={type}
                  onClick={() => handleChange(opt)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── main card ── */
const FilterCard = ({ filters, onChange, onClear }) => {
  const activeTotal = Object.values(filters).reduce((acc, v) => {
    if (!v) return acc;
    return acc + (Array.isArray(v) ? v.length : 1);
  }, 0);

  return (
    <div
      className="w-full rounded-2xl overflow-hidden relative"
      style={{
        background: "var(--cn-filter-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--cn-border)",
        boxShadow: "var(--cn-card-shadow)",
      }}
    >
      {/* top gradient accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px]"
        style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1,#8b5cf6)" }}
      />

      {/* subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #27bbd2 0%, transparent 50%), radial-gradient(circle at 80% 80%, #6366f1 0%, transparent 50%)",
        }}
      />

      {/* ── Header ── */}
      <div
        className="relative flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--cn-border-subtle)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#27bbd2,#6366f1)",
              boxShadow: "0 4px 12px rgba(39,187,210,0.35)",
            }}
          >
            <SlidersHorizontal size={14} className="text-white" />
          </div>
          <span className="font-extrabold text-[14.5px] tracking-tight" style={{ color: "var(--cn-text-1)" }}>
            Filters
          </span>
          <AnimatePresence>
            {activeTotal > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{
                  background: "linear-gradient(135deg,#27bbd2,#6366f1)",
                  boxShadow: "0 2px 8px rgba(39,187,210,0.4)",
                }}
              >
                {activeTotal} active
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {activeTotal > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear}
              className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
              style={{
                color: "#ef4444",
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.13)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.07)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)";
              }}
            >
              <X size={11} strokeWidth={2.5} /> Clear all
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Sections ── */}
      <div className="relative px-4 pb-2">
        {FILTER_SECTIONS.map((section, i) => (
          <div key={section.key}>
            <Section section={section} values={filters} onChange={onChange} />
            {i < FILTER_SECTIONS.length - 1 && (
              <div
                style={{
                  height: 1,
                  background: "linear-gradient(90deg,transparent,var(--cn-section-divider),transparent)",
                  margin: "0 4px",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Footer hint ── */}
      <div
        className="relative flex items-center gap-1.5 px-5 py-3"
        style={{ borderTop: "1px solid var(--cn-border-subtle)" }}
      >
        <Sparkles size={11} className="text-[#27bbd2]" />
        <span className="text-[11px] font-medium" style={{ color: "var(--cn-text-3)" }}>
          {activeTotal === 0
            ? "Select filters to narrow results"
            : `${activeTotal} filter${activeTotal > 1 ? "s" : ""} applied`}
        </span>
      </div>
    </div>
  );
};

export default FilterCard;
