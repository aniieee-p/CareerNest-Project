import React, { useState, useEffect } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { motion } from "framer-motion";
import {
  Mail, Phone, Pen, FileText, Send, Eye, Briefcase, Bookmark,
  Upload, Sparkles, CheckCircle2
} from "lucide-react";
import Footer from "./shared/Footer";
import api from "@/utils/axiosInstance";
import { PROFILE_STATS_API, PROFILE_VIEW_API } from "@/utils/constant";

const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
  >
    {children}
  </motion.div>
);

const Profile = () => {
  const { user } = useSelector((store) => store.auth ?? {});
  const navigate = useNavigate();
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [profileStats, setProfileStats] = useState({ profileViews: 0, jobMatches: 0 });
  const { allAppliedJobs = [], savedJobs = [] } = useSelector((store) => store.job ?? {});
  const isRecruiter = user?.role === "recruiter";

  React.useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const res = await api.get(PROFILE_STATS_API);
        if (res.data.success) setProfileStats({
          profileViews: res.data.profileViews ?? 0,
          jobMatches: res.data.jobMatches ?? 0,
        });
      } catch (e) {}
    };
    const trackView = async () => {
      try { await api.post(`${PROFILE_VIEW_API}/${user._id}`, {}); } catch (e) {}
    };
    fetchStats();
    trackView();
  }, [user?._id]);

  const stats = [
    { icon: Send,      label: "Applications", value: isRecruiter ? 0 : allAppliedJobs.length,   color: "#27bbd2", bg: "rgba(39,187,210,0.12)" },
    { icon: Eye,       label: "Profile Views", value: profileStats.profileViews,                 color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
    { icon: Briefcase, label: "Job Matches",   value: isRecruiter ? 0 : profileStats.jobMatches, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    { icon: Bookmark,  label: "Saved Jobs",    value: savedJobs.length,                          color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  ];

  const profileComplete = !!(user?.profile?.bio && user?.profile?.skills?.length && user?.profile?.resume);

  return (
    <div className="min-h-screen" style={{ background: "var(--cn-profile-bg)" }}>
      <Navbar />

      {/* Banner */}
      <div className="h-36 sm:h-44 md:h-52 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#27bbd2 0%,#6366f1 60%,#8b5cf6 100%)" }}>
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle at 15% 50%,rgba(255,255,255,0.08) 1px,transparent 1px),radial-gradient(circle at 85% 20%,rgba(255,255,255,0.08) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: "linear-gradient(to top,rgba(0,0,0,0.12),transparent)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">

        {/* Profile header card — overlaps banner */}
        <FadeUp>
          <div className="relative -mt-16 sm:-mt-20 rounded-2xl p-5 sm:p-7 mb-5 flex flex-col sm:flex-row sm:items-end gap-5"
            style={{
              background: "var(--cn-card)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--cn-border)",
              boxShadow: "0 8px 40px rgba(39,187,210,0.10), 0 2px 8px rgba(0,0,0,0.06)",
            }}>

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 shadow-xl"
                style={{ border: "4px solid var(--cn-surface)" }}>
                <AvatarImage src={user?.profile?.profilephoto} alt={user?.fullname} />
                <AvatarFallback className="text-2xl sm:text-3xl font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                  {user?.fullname?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 bg-emerald-400"
                style={{ borderColor: "var(--cn-surface)" }} />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: "var(--cn-text-1)" }}>
                  {user?.fullname || "Your Name"}
                </h1>
                <Badge className="text-[11px] capitalize px-2.5 py-0.5 font-semibold"
                  style={{ background: "rgba(39,187,210,0.12)", color: "#27bbd2", border: "1px solid rgba(39,187,210,0.25)" }}>
                  {user?.role}
                </Badge>
                {profileComplete && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                    <CheckCircle2 size={12} /> Complete
                  </span>
                )}
              </div>
              <p className="text-sm mb-2.5 line-clamp-2" style={{ color: "var(--cn-text-2)" }}>
                {user?.profile?.bio || "No bio added yet — click Edit Profile to add one"}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--cn-text-3)" }}>
                <span className="flex items-center gap-1.5"><Mail size={11} />{user?.email}</span>
                {user?.phoneNumber && <span className="flex items-center gap-1.5"><Phone size={11} />{user.phoneNumber}</span>}
              </div>
            </div>

            {/* Edit button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 self-start sm:self-auto"
              style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", color: "#fff", boxShadow: "0 4px 14px rgba(39,187,210,0.3)" }}
            >
              <Pen size={13} /> Edit Profile
            </motion.button>
          </div>
        </FadeUp>

        {/* Stats */}
        <FadeUp delay={0.08}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5">
            {stats.map(({ icon: Icon, label, value, color, bg }) => (
              <motion.div key={label}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "var(--cn-card)", backdropFilter: "blur(12px)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-card-shadow)" }}>
                <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: bg }}>
                  <Icon size={17} style={{ color }} />
                </div>
                <div>
                  <p className="text-xl font-extrabold leading-none mb-0.5" style={{ color: "var(--cn-text-1)" }}>{value}</p>
                  <p className="text-[11px] font-medium" style={{ color: "var(--cn-text-3)" }}>{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeUp>

        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          {/* Left sidebar */}
          <FadeUp delay={0.14}>
            <div className="md:col-span-1 space-y-4">

              {/* Contact */}
              <div className="rounded-2xl p-5"
                style={{ background: "var(--cn-card)", backdropFilter: "blur(12px)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-card-shadow)" }}>
                <h2 className="text-sm font-bold mb-3" style={{ color: "var(--cn-text-1)" }}>Contact Info</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-xs rounded-xl px-3 py-2.5"
                    style={{ background: "rgba(39,187,210,0.06)", color: "var(--cn-text-2)" }}>
                    <Mail size={12} className="text-[#27bbd2] shrink-0" />
                    <span className="truncate">{user?.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs rounded-xl px-3 py-2.5"
                    style={{ background: "rgba(99,102,241,0.06)", color: "var(--cn-text-2)" }}>
                    <Phone size={12} className="text-[#6366f1] shrink-0" />
                    <span>{user?.phoneNumber || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="rounded-2xl p-5"
                style={{ background: "var(--cn-card)", backdropFilter: "blur(12px)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-card-shadow)" }}>
                <h2 className="text-sm font-bold mb-3" style={{ color: "var(--cn-text-1)" }}>Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {user?.profile?.skills?.length > 0
                    ? user.profile.skills.map((skill, i) => (
                        <span key={i} className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2", border: "1px solid rgba(39,187,210,0.2)" }}>
                          {skill}
                        </span>
                      ))
                    : <button onClick={() => setOpen(true)} className="text-xs text-[#27bbd2] hover:underline">+ Add skills</button>
                  }
                </div>
              </div>

              {/* Resume */}
              <div className="rounded-2xl p-5"
                style={{ background: "var(--cn-card)", backdropFilter: "blur(12px)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-card-shadow)" }}>
                <h2 className="text-sm font-bold mb-3" style={{ color: "var(--cn-text-1)" }}>Resume</h2>
                {user?.profile?.resume ? (
                  <a href={user.profile.resume} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-[#27bbd2] px-3 py-2.5 rounded-xl hover:underline"
                    style={{ background: "rgba(39,187,210,0.08)", border: "1px solid rgba(39,187,210,0.2)" }}>
                    <FileText size={13} />
                    {user.profile.resumeOriginalName || "View Resume"}
                  </a>
                ) : (
                  <div className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all"
                    style={{ borderColor: "rgba(39,187,210,0.3)" }}
                    onClick={() => setOpen(true)}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#27bbd2"; e.currentTarget.style.background = "rgba(39,187,210,0.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(39,187,210,0.3)"; e.currentTarget.style.background = "transparent"; }}>
                    <Upload size={18} className="text-[#27bbd2] mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-[#27bbd2]">Upload Resume</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--cn-text-3)" }}>PDF · AI parsed</p>
                  </div>
                )}
              </div>

            </div>
          </FadeUp>

          {/* Right: Applications */}
          <FadeUp delay={0.2}>
            <div className="rounded-2xl p-5 sm:p-6 md:col-span-3"
              style={{ background: "var(--cn-card)", backdropFilter: "blur(12px)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-card-shadow)" }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ background: "rgba(39,187,210,0.1)" }}>
                    <Sparkles size={14} className="text-[#27bbd2]" />
                  </div>
                  <h2 className="font-bold" style={{ color: "var(--cn-text-1)" }}>
                    {isRecruiter ? "Account Info" : "Recent Applications"}
                  </h2>
                </div>
                {!isRecruiter && allAppliedJobs.length > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2", border: "1px solid rgba(39,187,210,0.2)" }}>
                    {allAppliedJobs.length} total
                  </span>
                )}
              </div>
              {isRecruiter ? (
                <div className="rounded-xl p-4 text-sm"
                  style={{ background: "rgba(99,102,241,0.06)", color: "var(--cn-text-2)", border: "1px solid rgba(99,102,241,0.15)" }}>
                  Manage your job postings and company profiles from the admin panel.
                </div>
              ) : (
                <AppliedJobTable />
              )}
            </div>
          </FadeUp>

        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
      <Footer />
    </div>
  );
};

export default Profile;
