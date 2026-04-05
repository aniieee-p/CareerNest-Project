import React, { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, IndianRupee, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { motion } from "framer-motion";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const spotRef = useRef(null);

  const onMove = useCallback((e) => {
    if (!cardRef.current || !spotRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    spotRef.current.style.background = `radial-gradient(240px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(39,187,210,0.11), transparent 70%)`;
    spotRef.current.style.opacity = "1";
  }, []);

  const onLeave = useCallback(() => { if (spotRef.current) spotRef.current.style.opacity = "0"; }, []);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onClick={() => navigate(`/description/${job._id}`)}
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
      <div ref={cardRef} className="relative rounded-[21px] p-5 overflow-hidden"
        style={{ background: "var(--cn-card)", backdropFilter: "blur(16px)" }}
        onMouseMove={onMove} onMouseLeave={onLeave}>

        {/* spotlight */}
        <div ref={spotRef} className="absolute inset-0 pointer-events-none rounded-[21px] transition-opacity duration-300" style={{ opacity: 0 }} />

        {/* shimmer top line */}
        <div className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(90deg,transparent,rgba(39,187,210,0.5),transparent)" }} />

        <div className="relative">
          {/* company row */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <Avatar className="h-10 w-10 shadow-sm" style={{ border: "2px solid rgba(255,255,255,0.9)" }}>
                  <AvatarImage src={job?.company?.logo} />
                  <AvatarFallback className="font-extrabold text-sm text-white"
                    style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                    {job?.company?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#10b981]" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[13px] leading-tight tracking-[-0.01em] truncate" style={{ color: "var(--cn-text-1)" }}>{job?.company?.name}</p>
                <p className="text-[11px] text-[#94a3b8] flex items-center gap-1 mt-0.5 font-medium">
                  <MapPin size={9} strokeWidth={2.5} /> India
                </p>
              </div>
            </div>

            {/* arrow — fades in on hover */}
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg shrink-0"
              style={{ background: "rgba(39,187,210,0.08)", color: "#27bbd2" }}
              whileHover={{ scale: 1.12, rotate: -6 }}
              transition={{ type: "spring", stiffness: 440, damping: 16 }}
            >
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </motion.div>
          </div>

          {/* title */}
          <h3 className="font-extrabold text-[14.5px] tracking-[-0.02em] leading-snug mb-1.5 group-hover:text-[#0e7490] transition-colors duration-200" style={{ color: "var(--cn-text-1)" }}>
            {job?.title}
          </h3>
          <p className="text-[12.5px] line-clamp-2 mb-4 leading-[1.65] font-[450]" style={{ color: "var(--cn-text-2)" }}>{job?.description}</p>

          {/* badges */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] px-2.5 py-[3px] rounded-full font-semibold tracking-[-0.01em]"
              style={{ background: "rgba(39,187,210,0.07)", color: "#0e7490", border: "1px solid rgba(39,187,210,0.18)" }}>
              {job?.position} Openings
            </span>
            <span className="text-[11px] px-2.5 py-[3px] rounded-full font-semibold tracking-[-0.01em]"
              style={{ background: "rgba(245,158,11,0.07)", color: "#b45309", border: "1px solid rgba(245,158,11,0.18)" }}>
              {job?.jobtype}
            </span>
            <span className="text-[11px] px-2.5 py-[3px] rounded-full font-semibold flex items-center gap-0.5 tracking-[-0.01em]"
              style={{ background: "rgba(99,102,241,0.07)", color: "#4338ca", border: "1px solid rgba(99,102,241,0.18)" }}>
              <IndianRupee size={9} strokeWidth={2.5} />{job?.salary != null ? `${job.salary} LPA` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LatestJobCards;
