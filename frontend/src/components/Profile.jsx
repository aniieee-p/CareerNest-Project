import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Edit3,
  FileText,
  Upload,
  CheckCircle2,
  User,
  Briefcase,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import api from "@/utils/axiosInstance";
import { PROFILE_STATS_API, PROFILE_VIEW_API } from "@/utils/constant";

import AppliedJobTable from "./AppliedJobTable";
import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const Profile = () => {
  const { user } = useSelector((store) => store.auth ?? {});
  const { allAppliedJobs = [], savedJobs = [], allJobs = [] } = useSelector((store) => store.job ?? {});

  console.log('Profile component loaded, user:', user);
  console.log('Current URL:', window.location.href);

  const navigate = useNavigate();
  useGetAppliedJobs();
  useGetAllJobs();

  const [open, setOpen] = useState(false);
  const [profileStats, setProfileStats] = useState({ profileViews: 0, jobMatches: 0 });

  const profileComplete = !!(user?.profile?.bio && user?.profile?.skills?.length && user?.profile?.resume);
  const completionChecks = [
    !!user?.profile?.profilePhoto,
    !!user?.profile?.bio,
    !!user?.profile?.skills?.length,
    !!user?.profile?.resume,
    !!user?.phoneNumber,
  ];
  const profileCompletion = Math.round((completionChecks.filter(Boolean).length / completionChecks.length) * 100);

  React.useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchProfileStats = async () => {
      try {
        // Get current profile stats
        const statsRes = await api.get(PROFILE_STATS_API);
        if (statsRes.data.success) {
          setProfileStats(prev => ({
            ...prev,
            profileViews: statsRes.data.profileViews ?? 0
          }));
        }
      } catch (error) {
        console.log('Profile stats fetch failed:', error);
      }
    };

    const calculateJobMatches = () => {
      console.log('=== JOB MATCHES CALCULATION DEBUG ===');
      console.log('User skills from Redux:', user?.profile?.skills);
      
      const rawSkills = user?.profile?.skills || [];
      // Filter out empty strings and whitespace-only strings
      const userSkills = rawSkills.filter(skill => skill && skill.trim().length > 0);
      
      console.log('Filtered user skills:', userSkills);
      console.log('User skills length after filtering:', userSkills.length);
      console.log('All jobs count:', allJobs?.length);
      
      if (!userSkills.length || !allJobs?.length) {
        console.log('No valid skills or no jobs - setting matches to 0');
        setProfileStats(prev => ({ ...prev, jobMatches: 0 }));
        return;
      }
      
      const skills = userSkills.map(s => s.toLowerCase());
      console.log('Lowercase skills:', skills);
      
      const matches = allJobs.filter(job => {
        if (!job.requirements?.length) return false;
        
        return job.requirements.some(req =>
          skills.some(skill =>
            req.toLowerCase().includes(skill) || skill.includes(req.toLowerCase())
          )
        );
      });
      
      console.log('Total matching jobs:', matches.length);
      setProfileStats(prev => ({ ...prev, jobMatches: matches.length }));
    };

    fetchProfileStats();
    calculateJobMatches();
  }, [user?._id, allJobs, user?.profile?.skills]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--cn-page-alt)", position: "relative", zIndex: 10 }}>
      <Navbar />

      {/* Gradient Banner */}
      <div
        className="h-36 sm:h-44 md:h-52 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#27bbd2 0%,#6366f1 60%,#8b5cf6 100%)", zIndex: 1 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 50%,rgba(255,255,255,0.08) 1px,transparent 1px),radial-gradient(circle at 85% 20%,rgba(255,255,255,0.08) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: "linear-gradient(to top,rgba(0,0,0,0.12),transparent)" }}
        />
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-4 pt-4 pb-8 w-full" style={{ position: "relative", zIndex: 5 }}>
        {/* Profile Header Card */}
        <div className="rounded-2xl p-6 mb-6 -mt-16 sm:-mt-20" style={{ 
          background: "var(--cn-surface)", 
          border: "1px solid var(--cn-border)",
          boxShadow: "var(--cn-card-shadow)",
          position: "relative",
          zIndex: 10
        }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt={user?.fullname}
                  />
                  <AvatarFallback className="bg-[#27bbd2] text-white text-xl">
                    {user?.fullname?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span
                  className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 bg-emerald-400"
                  style={{ borderColor: "var(--cn-surface)" }}
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--cn-text-1)" }}>
                  {user?.fullname}
                </h2>
                <p className="text-sm mb-2" style={{ color: "var(--cn-text-3)" }}>
                  Student
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-xs px-2 py-1 rounded-full" style={{ 
                    background: "rgba(39,187,210,0.1)", 
                    color: "#27bbd2" 
                  }}>
                    <User className="h-3 w-3 mr-1" />
                    Student Account
                  </div>
                  {profileComplete ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                      <CheckCircle2 size={12} /> Complete
                    </span>
                  ) : (
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}
                    >
                      {profileCompletion}% complete
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 shrink-0"
            >
              <Edit3 className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Profile</span>
            </Button>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: "var(--cn-text-2)" }}>
                  <User className="h-4 w-4 mr-2" />
                  Full Name
                </label>
                <div className="p-3 rounded-lg" style={{ 
                  background: "var(--cn-input-bg)", 
                  border: "1px solid var(--cn-border-input)",
                  color: "var(--cn-text-1)"
                }}>
                  {user?.fullname || 'Not provided'}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: "var(--cn-text-2)" }}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </label>
                <div className="p-3 rounded-lg" style={{ 
                  background: "var(--cn-input-bg)", 
                  border: "1px solid var(--cn-border-input)",
                  color: "var(--cn-text-1)"
                }}>
                  {user?.email || 'Not provided'}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2" style={{ color: "var(--cn-text-2)" }}>
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number
                </label>
                <div className="p-3 rounded-lg" style={{ 
                  background: "var(--cn-input-bg)", 
                  border: "1px solid var(--cn-border-input)",
                  color: "var(--cn-text-1)"
                }}>
                  {user?.phoneNumber || 'Not provided'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: "var(--cn-text-2)" }}>
                  Bio
                </label>
                <div className="p-3 rounded-lg min-h-[80px]" style={{ 
                  background: "var(--cn-input-bg)", 
                  border: "1px solid var(--cn-border-input)",
                  color: "var(--cn-text-1)"
                }}>
                  {user?.profile?.bio || 'No bio provided'}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: "var(--cn-text-2)" }}>
                  Skills
                </label>
                <div className="p-3 rounded-lg min-h-[60px]" style={{ 
                  background: "var(--cn-input-bg)", 
                  border: "1px solid var(--cn-border-input)",
                  color: "var(--cn-text-1)"
                }}>
                  {user?.profile?.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {user.profile.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2", border: "1px solid rgba(39,187,210,0.2)" }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: "var(--cn-text-3)" }}>No skills added yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" style={{ position: "relative", zIndex: 5 }}>
          <div className="rounded-2xl p-6" style={{ 
            background: "var(--cn-surface)", 
            border: "1px solid var(--cn-border)",
            boxShadow: "var(--cn-card-shadow)",
            position: "relative",
            zIndex: 5
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold" style={{ color: "var(--cn-text-1)" }}>
                  {profileStats.profileViews}
                </h3>
                <p className="text-sm" style={{ color: "var(--cn-text-3)" }}>
                  Profile Views
                </p>
              </div>
              <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ background: "rgba(39,187,210,0.1)" }}>
                <User className="h-6 w-6 text-[#27bbd2]" />
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl p-6" style={{ 
            background: "var(--cn-surface)", 
            border: "1px solid var(--cn-border)",
            boxShadow: "var(--cn-card-shadow)",
            position: "relative",
            zIndex: 5
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold" style={{ color: "var(--cn-text-1)" }}>
                  {profileStats.jobMatches}
                </h3>
                <p className="text-sm" style={{ color: "var(--cn-text-3)" }}>
                  Job Matches
                </p>
              </div>
              <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ background: "rgba(39,187,210,0.1)" }}>
                <Briefcase className="h-6 w-6 text-[#27bbd2]" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Strength Card */}
        <div className="rounded-2xl p-6 mb-6" style={{ 
          background: "var(--cn-surface)", 
          border: "1px solid var(--cn-border)",
          boxShadow: "var(--cn-card-shadow)"
        }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: "var(--cn-text-1)" }}>
              Profile Strength
            </h3>
            <span className="text-sm font-semibold" style={{ color: profileCompletion >= 80 ? "#10b981" : "#27bbd2" }}>
              {profileCompletion}%
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden mb-3" style={{ background: "rgba(15,23,42,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%`, background: "linear-gradient(90deg,#27bbd2,#6366f1)" }}
            />
          </div>
          <p className="text-sm" style={{ color: "var(--cn-text-3)" }}>
            Add a photo, bio, phone number, skills, and resume to make your profile more recruiter-ready.
          </p>
          
          {/* Resume Section */}
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--cn-border)" }}>
            <label className="flex items-center text-sm font-medium mb-2" style={{ color: "var(--cn-text-2)" }}>
              <FileText className="h-4 w-4 mr-2" />
              Resume
            </label>
            {user?.profile?.resume ? (
              <a
                href={user.profile.resume}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 text-sm font-semibold p-3 rounded-lg hover:underline"
                style={{ background: "rgba(39,187,210,0.08)", border: "1px solid rgba(39,187,210,0.2)", color: "#27bbd2" }}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <FileText size={16} />
                  <span className="truncate">{user.profile.resumeOriginalName || "View Resume"}</span>
                </span>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: "rgba(39,187,210,0.12)", color: "#27bbd2" }}
                >
                  PDF
                </span>
              </a>
            ) : (
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all"
                style={{ borderColor: "rgba(39,187,210,0.3)" }}
                onClick={() => setOpen(true)}
              >
                <Upload size={20} className="text-[#27bbd2] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#27bbd2]">Upload Resume</p>
                <p className="text-xs mt-1" style={{ color: "var(--cn-text-3)" }}>
                  PDF format recommended
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="rounded-2xl p-6" style={{ 
          background: "var(--cn-surface)", 
          border: "1px solid var(--cn-border)",
          boxShadow: "var(--cn-card-shadow)"
        }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#27bbd2]" />
              <h3 className="text-lg font-semibold" style={{ color: "var(--cn-text-1)" }}>
                Recent Applications
              </h3>
            </div>
            {allAppliedJobs.length > 0 && (
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2", border: "1px solid rgba(39,187,210,0.2)" }}
              >
                {allAppliedJobs.length} total
              </span>
            )}
          </div>
          <AppliedJobTable />
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
      <Footer />
    </div>
  );
};

export default Profile;
