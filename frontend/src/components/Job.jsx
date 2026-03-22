import React from "react";
import { Bookmark, MapPin, Clock, IndianRupee } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveJob } from "@/redux/jobSlice";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.job);
  const isSaved = savedJobs?.some((j) => j._id === job?._id);

  const daysAgo = (mongodbTime) => {
    const diff = new Date() - new Date(mongodbTime);
    const days = Math.floor(diff / (1000 * 24 * 60 * 60));
    return days === 0 ? "Today" : `${days}d ago`;
  };

  const handleSave = (e) => {
    e.stopPropagation();
    dispatch(toggleSaveJob(job));
    toast.success(isSaved ? "Removed from saved" : "Job saved");
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group rounded-2xl p-5 cursor-pointer transition-all"
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
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#94a3b8] flex items-center gap-1">
          <Clock size={11} /> {daysAgo(job?.createdAt)}
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSave}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            background: isSaved ? "rgba(245,158,11,0.1)" : "rgba(39,187,210,0.06)",
            color: isSaved ? "#f59e0b" : "#94a3b8",
          }}
        >
          <Bookmark size={15} className={isSaved ? "fill-[#f59e0b]" : ""} />
        </motion.button>
      </div>

      {/* Company */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-11 w-11 border border-gray-100 shadow-sm">
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
            <MapPin size={10} /> {job?.location || "India"}
          </p>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#27bbd2] transition-colors">
        {job?.title}
      </h3>
      <p className="text-sm text-[#475569] line-clamp-2 mb-3">{job?.description}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2" }}>
          {job?.position} Positions
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
          {job?.jobtype}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
          <IndianRupee size={10} />{job?.salary} LPA
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(`/description/${job?._id}`)}
          className="flex-1 py-2 rounded-xl text-sm font-semibold border-2 text-[#27bbd2] hover:bg-[#27bbd2]/5 transition-colors"
          style={{ borderColor: "#27bbd2" }}
        >
          View Details
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={isSaved
            ? { background: "#f1f5f9", color: "#94a3b8" }
            : { background: "linear-gradient(135deg,#27bbd2,#6366f1)" }
          }
        >
          {isSaved ? "Saved ✓" : "Save Job"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Job;
