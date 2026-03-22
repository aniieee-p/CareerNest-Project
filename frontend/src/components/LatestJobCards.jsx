import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, IndianRupee } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { motion } from "framer-motion";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-5 rounded-2xl cursor-pointer group transition-all"
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(39,187,210,0.15)",
        boxShadow: "0 4px 16px rgba(39,187,210,0.07)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#27bbd2";
        e.currentTarget.style.boxShadow = "0 0 24px rgba(39,187,210,0.25)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(39,187,210,0.15)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(39,187,210,0.07)";
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10 border border-gray-100">
          <AvatarImage src={job?.company?.logo} />
          <AvatarFallback
            className="font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
          >
            {job?.company?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-gray-800 text-sm">{job?.company?.name}</p>
          <p className="text-xs text-[#94a3b8] flex items-center gap-1">
            <MapPin size={10} /> India
          </p>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#27bbd2] transition-colors">
        {job?.title}
      </h3>
      <p className="text-sm text-[#475569] line-clamp-2 mb-3">{job?.description}</p>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2" }}>
          {job?.position} Openings
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
          {job?.jobtype}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
          <IndianRupee size={10} />{job?.salary} LPA
        </span>
      </div>
    </motion.div>
  );
};

export default LatestJobCards;
