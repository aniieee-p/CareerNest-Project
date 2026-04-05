import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT, PROFILE_VIEW_API } from "@/utils/constant";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

const GRADIENTS = [
  ["#6366f1","#8b5cf6"], ["#0ea5c9","#27bbd2"], ["#f59e0b","#f97316"],
  ["#10b981","#059669"], ["#ec4899","#f43f5e"],
];
const getGradient = (name = "") => GRADIENTS[(name.charCodeAt(0) || 0) % GRADIENTS.length];

const CandidateSheet = ({ applicantId, jobRequirements = [], onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicantId) return;
    setLoading(true);
    setProfile(null);
    const fetch = async () => {
      try {
        await axios.post(`${PROFILE_VIEW_API}/${applicantId}`, {}, { withCredentials: true });
        const res = await axios.get(`${USER_API_END_POINT}/profile/${applicantId}`, { withCredentials: true });
        if (res.data.success) setProfile(res.data.user);
      } catch (e) { }
      finally { setLoading(false); }
    };
    fetch();
  }, [applicantId]);

  const skills = profile?.profile?.skills || [];
  const matched = skills.filter(s =>
    jobRequirements.some(r => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
  );
  const unmatched = skills.filter(s => !matched.includes(s));
  const matchScore = jobRequirements.length > 0 ? Math.round((matched.length / jobRequirements.length) * 100) : null;
  const [g1, g2] = getGradient(profile?.fullname || "");

  return (
    <AnimatePresence>
      {applicantId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-full z-50 w-full max-w-md overflow-y-auto"
            style={{ background: "var(--cn-card)", borderLeft: "1px solid var(--cn-border)", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
              style={{ background: "var(--cn-card)", borderColor: "var(--cn-border)" }}>
              <p className="font-bold text-sm" style={{ color: "var(--cn-text-1)" }}>Candidate Profile</p>
              <button onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{ color: "var(--cn-text-3)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--cn-text-3)"; }}>
                <X size={16} />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-32">
                <Loader2 size={28} className="animate-spin text-[#27bbd2]" />
              </div>
            ) : !profile ? (
              <p className="text-center py-20 text-sm" style={{ color: "var(--cn-text-3)" }}>Could not load profile.</p>
            ) : (
              <div className="p-6 space-y-5">

                {/* Avatar + name */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2" style={{ borderColor: "var(--cn-border)" }}>
                    <AvatarImage src={profile?.profile?.profilephoto} />
                    <AvatarFallback className="text-xl font-extrabold text-white"
                      style={{ background: `linear-gradient(135deg,${g1},${g2})` }}>
                      {profile?.fullname?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-extrabold text-lg leading-tight" style={{ color: "var(--cn-text-1)" }}>{profile?.fullname}</h2>
                    <p className="text-xs mt-1" style={{ color: "var(--cn-text-3)" }}>{profile?.profile?.bio || "No bio added"}</p>
                    <Badge className="mt-1.5 text-xs capitalize"
                      style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2", border: "1px solid rgba(39,187,210,0.2)" }}>
                      {profile?.role}
                    </Badge>
                  </div>
                </div>

                {/* Match score */}
                {matchScore !== null && (
                  <div className="rounded-2xl p-4" style={{ background: matchScore >= 60 ? "rgba(16,185,129,0.07)" : "rgba(245,158,11,0.07)", border: `1px solid ${matchScore >= 60 ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold" style={{ color: matchScore >= 60 ? "#10b981" : "#f59e0b" }}>
                        Skill Match Score
                      </p>
                      <span className="text-lg font-extrabold" style={{ color: matchScore >= 60 ? "#10b981" : "#f59e0b" }}>
                        {matchScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${matchScore}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-2 rounded-full"
                        style={{ background: matchScore >= 60 ? "linear-gradient(90deg,#10b981,#27bbd2)" : "linear-gradient(90deg,#f59e0b,#f97316)" }}
                      />
                    </div>
                    <p className="text-xs mt-2" style={{ color: "var(--cn-text-3)" }}>
                      {matched.length} of {jobRequirements.length} required skills matched
                    </p>
                  </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="rounded-2xl p-4" style={{ background: "var(--cn-page-alt)", border: "1px solid var(--cn-border)" }}>
                    <p className="text-xs font-bold mb-3" style={{ color: "var(--cn-text-1)" }}>Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {matched.map((s, i) => (
                        <span key={i} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }}>
                          <CheckCircle2 size={10} /> {s}
                        </span>
                      ))}
                      {unmatched.map((s, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: "rgba(39,187,210,0.08)", color: "#27bbd2", border: "1px solid rgba(39,187,210,0.2)" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--cn-page-alt)", border: "1px solid var(--cn-border)" }}>
                  <p className="text-xs font-bold" style={{ color: "var(--cn-text-1)" }}>Contact</p>
                  <div className="flex items-center gap-3 text-sm" style={{ color: "var(--cn-text-2)" }}>
                    <div className="p-1.5 rounded-lg" style={{ background: "rgba(39,187,210,0.08)" }}>
                      <Mail size={12} className="text-[#27bbd2]" />
                    </div>
                    {profile?.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm" style={{ color: "var(--cn-text-2)" }}>
                    <div className="p-1.5 rounded-lg" style={{ background: "rgba(99,102,241,0.08)" }}>
                      <Phone size={12} className="text-[#6366f1]" />
                    </div>
                    {profile?.phonenumber || "—"}
                  </div>
                </div>

                {/* Resume */}
                {profile?.profile?.resume && (
                  <div className="rounded-2xl p-4" style={{ background: "var(--cn-page-alt)", border: "1px solid var(--cn-border)" }}>
                    <p className="text-xs font-bold mb-2" style={{ color: "var(--cn-text-1)" }}>Resume</p>
                    <a href={profile.profile.resume} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-[#27bbd2] hover:underline">
                      <FileText size={13} />
                      {profile.profile.resumeOriginalName || "View Resume"}
                    </a>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CandidateSheet;
