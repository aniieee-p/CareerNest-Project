import React, { useState } from "react";
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
  Upload, Sparkles
} from "lucide-react";
import Footer from "./shared/Footer";

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
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { allAppliedJobs = [], savedJobs = [] } = useSelector((store) => store.job);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const stats = [
    { icon: Send, label: "Applications", value: allAppliedJobs.length, color: "#27bbd2", bg: "rgba(39,187,210,0.1)" },
    { icon: Eye, label: "Profile Views", value: "142", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
    { icon: Briefcase, label: "Job Matches", value: "38", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    { icon: Bookmark, label: "Saved Jobs", value: savedJobs.length, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* Banner */}
      <div
        className="h-40 relative"
        style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%,white 1px,transparent 1px),radial-gradient(circle at 80% 20%,white 1px,transparent 1px)", backgroundSize: "40px 40px" }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 pb-16">
        {/* Avatar + name row */}
        <FadeUp>
          <div className="flex items-end justify-between mb-6">
            <div className="flex items-end gap-4">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
                  <AvatarImage src={user?.profile?.profilephoto} alt={user?.fullname} />
                  <AvatarFallback
                    className="text-3xl font-extrabold text-white"
                    style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
                  >
                    {user?.fullname?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-extrabold text-gray-900">{user?.fullname}</h1>
                <p className="text-sm text-[#475569]">{user?.profile?.bio || "No bio added yet"}</p>
                <Badge
                  className="mt-1 text-xs capitalize"
                  style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2", border: "1px solid rgba(39,187,210,0.2)" }}
                >
                  {user?.role}
                </Badge>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 text-[#27bbd2] hover:bg-[#27bbd2]/5 transition-colors"
              style={{ borderColor: "#27bbd2" }}
            >
              <Pen size={14} /> Edit Profile
            </motion.button>
          </div>
        </FadeUp>

        {/* Stats row */}
        <FadeUp delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map(({ icon: Icon, label, value, color, bg }) => (
              <div
                key={label}
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(39,187,210,0.15)",
                  boxShadow: "0 4px 16px rgba(39,187,210,0.07)",
                }}
              >
                <div className="p-2.5 rounded-xl" style={{ background: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-gray-900">{value}</p>
                  <p className="text-xs text-[#94a3b8]">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Profile info */}
          <FadeUp delay={0.15}>
            <div
              className="rounded-2xl p-6 md:col-span-1"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(39,187,210,0.15)",
                boxShadow: "0 4px 24px rgba(39,187,210,0.07)",
              }}
            >
              <h2 className="font-bold text-gray-900 mb-4">Contact Info</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-[#475569]">
                  <div className="p-2 rounded-lg" style={{ background: "rgba(39,187,210,0.08)" }}>
                    <Mail size={14} className="text-[#27bbd2]" />
                  </div>
                  <span className="truncate">{user?.email || "—"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#475569]">
                  <div className="p-2 rounded-lg" style={{ background: "rgba(99,102,241,0.08)" }}>
                    <Phone size={14} className="text-[#6366f1]" />
                  </div>
                  <span>{user?.phoneNumber || "—"}</span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="font-bold text-gray-900 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {user?.profile?.skills?.length > 0
                    ? user.profile.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2", border: "1px solid rgba(39,187,210,0.2)" }}
                        >
                          {skill}
                        </span>
                      ))
                    : <span className="text-sm text-[#94a3b8]">No skills added</span>
                  }
                </div>
              </div>

              {/* Resume */}
              <div className="mt-6">
                <h2 className="font-bold text-gray-900 mb-3">Resume</h2>
                {user?.profile?.resume ? (
                  <a
                    href={user.profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-[#27bbd2] hover:underline"
                  >
                    <FileText size={14} />
                    {user.profile.resumeOriginalName || "View Resume"}
                  </a>
                ) : (
                  <div
                    className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-[#27bbd2] transition-colors"
                    style={{ borderColor: "rgba(39,187,210,0.3)" }}
                    onClick={() => setOpen(true)}
                  >
                    <Upload size={20} className="text-[#27bbd2] mx-auto mb-1" />
                    <p className="text-xs text-[#94a3b8]">Upload Resume</p>
                    <p className="text-xs text-[#27bbd2] font-medium mt-1">AI Parse Resume</p>
                  </div>
                )}
              </div>
            </div>
          </FadeUp>

          {/* Right: Applied jobs */}
          <FadeUp delay={0.2}>
            <div
              className="rounded-2xl p-6 md:col-span-2"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(39,187,210,0.15)",
                boxShadow: "0 4px 24px rgba(39,187,210,0.07)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={16} className="text-[#27bbd2]" />
                <h2 className="font-bold text-gray-900">
                  {user?.role === "recruiter" ? "Account Info" : "Recent Applications"}
                </h2>
              </div>
              {user?.role === "recruiter" ? (
                <p className="text-sm text-[#94a3b8]">Manage your job postings and company profiles from the admin panel.</p>
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
