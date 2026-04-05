import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Briefcase, Send, Info, CheckCheck } from "lucide-react";
import { markOneRead, markAllRead } from "@/redux/notificationSlice";
import api from "@/utils/axiosInstance";
import { NOTIFICATION_API } from "@/utils/constant";

const typeIcon = {
    job:         <Briefcase size={13} className="text-[#27bbd2]" />,
    application: <Send size={13} className="text-[#6366f1]" />,
    system:      <Info size={13} className="text-[#f59e0b]" />,
};

const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60)   return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationDropdown = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { notifications } = useSelector(store => store.notification);
    const ref = useRef(null);

    // close on outside click
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, onClose]);

    const handleRead = async (id) => {
        dispatch(markOneRead(id));
        try { await api.patch(`${NOTIFICATION_API}/${id}/read`); } catch {}
    };

    const handleReadAll = async () => {
        dispatch(markAllRead());
        try { await api.patch(`${NOTIFICATION_API}/read-all`); } catch {}
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50"
                    style={{
                        background: "var(--cn-popover)",
                        border: "1px solid var(--cn-border)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                    }}
                >
                    {/* header */}
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--cn-border-subtle)" }}>
                        <div className="flex items-center gap-2">
                            <Bell size={14} className="text-[#27bbd2]" />
                            <span className="text-[13px] font-bold" style={{ color: "var(--cn-text-1)" }}>Notifications</span>
                        </div>
                        {notifications.some(n => !n.isRead) && (
                            <button
                                onClick={handleReadAll}
                                className="flex items-center gap-1 text-[11px] font-medium text-[#27bbd2] hover:underline"
                            >
                                <CheckCheck size={12} /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* list */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <Bell size={28} style={{ color: "var(--cn-text-3)" }} />
                                <p className="text-[13px]" style={{ color: "var(--cn-text-3)" }}>No notifications</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <button
                                    key={n._id}
                                    onClick={() => handleRead(n._id)}
                                    className="w-full text-left flex items-start gap-3 px-4 py-3 transition-colors duration-150"
                                    style={{
                                        background: n.isRead ? "transparent" : "rgba(39,187,210,0.05)",
                                        borderBottom: "1px solid var(--cn-border-subtle)",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(39,187,210,0.08)"}
                                    onMouseLeave={e => e.currentTarget.style.background = n.isRead ? "transparent" : "rgba(39,187,210,0.05)"}
                                >
                                    <div className="mt-0.5 p-1.5 rounded-full shrink-0" style={{ background: "var(--cn-tag-bg)" }}>
                                        {typeIcon[n.type] || typeIcon.system}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12.5px] leading-snug" style={{ color: "var(--cn-text-1)", fontWeight: n.isRead ? 400 : 600 }}>
                                            {n.message}
                                        </p>
                                        <p className="text-[11px] mt-0.5" style={{ color: "var(--cn-text-3)" }}>{timeAgo(n.createdAt)}</p>
                                    </div>
                                    {!n.isRead && (
                                        <span className="mt-1.5 h-2 w-2 rounded-full bg-[#27bbd2] shrink-0" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationDropdown;
