import React, { useRef, useCallback } from "react";
import { Bookmark, MapPin, Clock, IndianRupee, ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveJob } from "@/redux/jobSlice";
import { toast } from "sonner";
import { motion } from "framer-motion";

const useSpotlight = (glowColor = "rgba(39,187,210,0.13)") => {
  const cardRef = useRef(null);
  const spotRef = useRef(null);
  const onMove = useCallback((e) => {
    if (!cardRef.current || !spotRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    spotRef.current.style.background = `radial-gradient(260px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, ${glowColor}, transparent 70%)`;
    spotRef.current.style.opacity = "1";
  }, [glowColor]);
  const onLeave = useCallback(() => {
    if (spotRef.current) spotRef.current.style.opacity = "0";
  }, []);
  return { cardRef, spotRef, onMove, onLeave };
};

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isSaved = savedJobs?.some((j) => j._id === job?._id);
  const { cardRef, spotRef, onMove, onLeave } = useSpotlight();

  const daysAgo = (t) => {
    const d = Math.floor((new Date() - new Date(t)) / 86400000);
    return d === 0 ? "Today" : `${d}d ago`;
  };

  const handleSave = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }
    dispatch(toggleSaveJob(job));
    toast.success(isSaved ? "Removed from saved" : "Job saved");
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.008 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative cursor-pointer rounded-[22px]"
      style={{
        padding: "1px",
        background: "linear-gradient(145deg,rgba(39,187,210,0.16),rgba(99,102,241,0.1),rgba(39,187,210,0.05))",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 6px 24px rgba(39,187,210,0.06)",
        transition: "box-shadow 0.4s ease, background 0.4s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "linear-gradient(145deg,rgba(39,187,210,0.5),rgba(99,102,241,0.36),rgba(39,187,210,0.18))";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07), 0 20px 64px rgba(39,187,210,0.16)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "linear-gradient(145deg,rgba(39,187,210,0.16),rgba(99,102,241,0.1),rgba(39,187,210,0.05))";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04), 0 6px 24px rgba(39,187,210,0.06)";
      }}
    >
      {/* inner surface */}
      <div
        ref={cardRef}
        className="relative rounded-[21px] p-5 overflow-hidden"
        style={{ background: "var(--cn-card)", backdropFilter: "blur(16px)" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* spotlight overlay */}
        <div
          ref={spotRef}
          className="absolute inset-0 pointer-events-none rounded-[21px] transition-opacity duration-300"
          style={{ opacity: 0 }}
        />

        {/* top shimmer line */}
        <div
          className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(90deg,transparent,rgba(39,187,210,0.5),transparent)" }}
        />

        <div className="relative">
          {/* header row: date + bookmark */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] text-[#94a3b8] font-medium px-2 py-0.5 rounded-full"
              style={{ background: "rgba(148,163,184,0.08)" }}
            >
              <Clock size={9} strokeWidth={2.5} /> {daysAgo(job?.createdAt)}
            </span>
            <motion.button
              whileHover={{ scale: 1.18, rotate: -10 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 460, damping: 14 }}
              onClick={handleSave}
              className="p-2 rounded-xl"
              style={{
                background: isSaved ? "rgba(245,158,11,0.1)" : "rgba(39,187,210,0.06)",
                color: isSaved ? "#f59e0b" : "#94a3b8",
                boxShadow: isSaved ? "0 0 14px rgba(245,158,11,0.22)" : "none",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              <Bookmark size={14} className={isSaved ? "fill-[#f59e0b]" : ""} />
            </motion.button>
          </div>

          {/* company row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative shrink-0">
              <Avatar className="h-11 w-11 shadow-md" style={{ border: "2px solid rgba(255,255,255,0.9)" }}>
                <AvatarImage src={job?.company?.logo} />
                <AvatarFallback
                  className="font-extrabold text-sm text-white"
                  style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
                >
                  {job?.company?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#10b981]" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[13.5px] leading-tight tracking-[-0.01em] truncate" style={{ color: "var(--cn-text-1)" }}>
                {job?.company?.name}
              </p>
              <p className="text-[11px] flex items-center gap-1 mt-0.5 font-medium" style={{ color: "var(--cn-text-3)" }}>
                <MapPin size={9} strokeWidth={2.5} /> {job?.location || "India"}
              </p>
            </div>
          </div>

          {/* title + description */}
          <h3 className="font-extrabold text-[15px] tracking-[-0.02em] leading-snug mb-1.5 transition-colors duration-200" style={{ color: "var(--cn-text-1)" }}>
            {job?.title}
          </h3>
          <p className="text-[12.5px] line-clamp-2 mb-4 leading-[1.65] font-[450]" style={{ color: "var(--cn-text-2)" }}>
            {job?.description}
          </p>

          {/* badges */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {[
              { label: `${job?.position} Positions`, bg: "rgba(39,187,210,0.07)", color: "#0e7490", border: "rgba(39,187,210,0.18)" },
              { label: job?.jobtype, bg: "rgba(245,158,11,0.07)", color: "#b45309", border: "rgba(245,158,11,0.18)" },
            ].map(({ label, bg, color, border }) => (
              <span
                key={label}
                className="text-[11px] px-2.5 py-[3px] rounded-full font-semibold tracking-[-0.01em]"
                style={{ background: bg, color, border: `1px solid ${border}` }}
              >
                {label}
              </span>
            ))}
            <span
              className="text-[11px] px-2.5 py-[3px] rounded-full font-semibold flex items-center gap-0.5 tracking-[-0.01em]"
              style={{ background: "rgba(99,102,241,0.07)", color: "#4338ca", border: "1px solid rgba(99,102,241,0.18)" }}
            >
              <IndianRupee size={9} strokeWidth={2.5} />{job?.salary} LPA
            </span>
          </div>

          {/* action buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              onClick={() => navigate(`/description/${job?._id}`)}
              className="flex-1 py-2.5 rounded-xl text-[12.5px] font-bold flex items-center justify-center gap-1.5"
              style={{ border: "1.5px solid rgba(39,187,210,0.3)", color: "#27bbd2", background: "rgba(39,187,210,0.04)", transition: "background 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(39,187,210,0.09)"; e.currentTarget.style.borderColor = "#27bbd2"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(39,187,210,0.04)"; e.currentTarget.style.borderColor = "rgba(39,187,210,0.3)"; }}
            >
              Details <ArrowRight size={11} strokeWidth={2.5} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: isSaved ? "none" : "0 0 22px rgba(39,187,210,0.3)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl text-[12.5px] font-bold"
              style={isSaved
                ? { background: "var(--cn-tag-bg)", color: "var(--cn-text-3)" }
                : { background: "linear-gradient(135deg,#27bbd2,#6366f1)", color: "#fff", boxShadow: "0 2px 12px rgba(39,187,210,0.2)" }
              }
            >
              {isSaved ? "Saved ✓" : "Save Job"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Job;
