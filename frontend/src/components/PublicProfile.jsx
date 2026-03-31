import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT, PROFILE_VIEW_API } from "@/utils/constant";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Mail, Phone, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((s) => s.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetch = async () => {
            try {
                // track the view
                await axios.post(`${PROFILE_VIEW_API}/${id}`, {}, { withCredentials: true });
                const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`, { withCredentials: true });
                if (res.data.success) setProfile(res.data.user);
            } catch (e) { console.log(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, [id]);

    return (
        <div className="min-h-screen" style={{ background: "var(--cn-profile-bg)" }}>
            <Navbar />

            <div className="h-40 relative" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }} />

            <div className="max-w-3xl mx-auto px-4 -mt-16 pb-16">
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-sm mb-4 mt-2 transition-colors"
                    style={{ color: "var(--cn-text-3)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#27bbd2"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--cn-text-3)"}>
                    <ArrowLeft size={15} /> Back
                </button>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <Loader2 size={32} className="animate-spin text-[#27bbd2]" />
                    </div>
                ) : !profile ? (
                    <p className="text-center py-20" style={{ color: "var(--cn-text-3)" }}>User not found.</p>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        {/* Header card */}
                        <div className="rounded-2xl border p-6 mb-5"
                            style={{ background: "var(--cn-card)", borderColor: "var(--cn-border)", boxShadow: "var(--cn-card-shadow)" }}>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20 border-4 shadow-lg" style={{ borderColor: "var(--cn-surface)" }}>
                                    <AvatarImage src={profile?.profile?.profilephoto} />
                                    <AvatarFallback className="text-2xl font-extrabold text-white"
                                        style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                                        {profile?.fullname?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-xl font-extrabold" style={{ color: "var(--cn-text-1)" }}>{profile?.fullname}</h1>
                                    <p className="text-sm mt-1" style={{ color: "var(--cn-text-2)" }}>{profile?.profile?.bio || "No bio added yet"}</p>
                                    <Badge className="mt-2 text-xs capitalize"
                                        style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2", border: "1px solid rgba(39,187,210,0.2)" }}>
                                        {profile?.role}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="rounded-2xl border p-5"
                                style={{ background: "var(--cn-card)", borderColor: "var(--cn-border)", boxShadow: "var(--cn-card-shadow)" }}>
                                <h2 className="font-bold mb-4" style={{ color: "var(--cn-text-1)" }}>Contact Info</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm" style={{ color: "var(--cn-text-2)" }}>
                                        <div className="p-2 rounded-lg" style={{ background: "rgba(39,187,210,0.08)" }}>
                                            <Mail size={13} className="text-[#27bbd2]" />
                                        </div>
                                        {profile?.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm" style={{ color: "var(--cn-text-2)" }}>
                                        <div className="p-2 rounded-lg" style={{ background: "rgba(99,102,241,0.08)" }}>
                                            <Phone size={13} className="text-[#6366f1]" />
                                        </div>
                                        {profile?.phonenumber || "—"}
                                    </div>
                                </div>

                                {profile?.profile?.resume && (
                                    <div className="mt-5">
                                        <h2 className="font-bold mb-2" style={{ color: "var(--cn-text-1)" }}>Resume</h2>
                                        <a href={profile.profile.resume} target="_blank" rel="noreferrer"
                                            className="flex items-center gap-2 text-sm text-[#27bbd2] hover:underline">
                                            <FileText size={13} />
                                            {profile.profile.resumeOriginalName || "View Resume"}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-2xl border p-5"
                                style={{ background: "var(--cn-card)", borderColor: "var(--cn-border)", boxShadow: "var(--cn-card-shadow)" }}>
                                <h2 className="font-bold mb-4" style={{ color: "var(--cn-text-1)" }}>Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile?.profile?.skills?.length > 0
                                        ? profile.profile.skills.map((s, i) => (
                                            <span key={i} className="text-xs px-3 py-1 rounded-full font-medium"
                                                style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2", border: "1px solid rgba(39,187,210,0.2)" }}>
                                                {s}
                                            </span>
                                        ))
                                        : <span className="text-sm" style={{ color: "var(--cn-text-3)" }}>No skills added</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PublicProfile;
