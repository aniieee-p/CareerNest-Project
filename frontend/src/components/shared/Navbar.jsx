import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  LogOut, User2, Briefcase, Menu, X, Bell, ChevronDown,
  Search, Moon, Sun, Bookmark, Settings,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

/* ── tiny hook: scroll position ── */
const useScrolled = (threshold = 14) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
};

/* ── tiny hook: click outside ── */
const useClickOutside = (ref, cb) => {
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [ref, cb]);
};

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const scrolled  = useScrolled();

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchVal,   setSearchVal]   = useState("");
  const [dark,        setDark]        = useState(false);

  const searchRef = useRef(null);
  useClickOutside(searchRef, () => setSearchOpen(false));

  /* dark-mode: toggle class on <html> */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) { dispatch(setUser(null)); navigate("/login"); toast.success(res.data.message); }
    } catch (e) { toast.error(e?.response?.data?.message || "Logout failed"); }
  };

  const studentLinks  = [
    { to: "/",             label: "Home" },
    { to: "/jobs",         label: "Find Jobs" },
    { to: "/browse",       label: "Browse" },
    { to: "/career-advice",label: "Advice" },
  ];
  const recruiterLinks = [
    { to: "/admin/companies", label: "Companies" },
    { to: "/admin/jobs",      label: "Jobs" },
    { to: "/recruitment",     label: "Solutions" },
  ];
  const links   = user?.role === "recruiter" ? recruiterLinks : studentLinks;
  const isActive = (p) => location.pathname === p;

  /* search submit */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) { navigate(`/jobs?q=${encodeURIComponent(searchVal.trim())}`); setSearchOpen(false); setSearchVal(""); }
  };

  /* ── shared styles ── */
  const navBg = scrolled
    ? "rgba(255,255,255,0.94)"
    : "rgba(255,255,255,0.72)";
  const navShadow = scrolled
    ? "0 4px 28px rgba(0,0,0,0.07), 0 1px 0 rgba(39,187,210,0.1)"
    : "none";
  const navBorder = scrolled
    ? "1px solid rgba(39,187,210,0.18)"
    : "1px solid rgba(39,187,210,0.07)";
  const navHeight = scrolled ? "56px" : "64px";

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: navBg,
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        borderBottom: navBorder,
        boxShadow: navShadow,
        transition: "all 0.3s ease",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-5 flex items-center justify-between gap-4"
        style={{ height: navHeight, transition: "height 0.3s ease" }}
      >

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
            className="p-1.5 rounded-xl"
            style={{
              background: "linear-gradient(135deg,#27bbd2,#6366f1)",
              boxShadow: "0 2px 12px rgba(39,187,210,0.35)",
            }}
          >
            <Briefcase size={16} className="text-white" />
          </motion.div>
          <span className="text-[18px] font-extrabold text-gray-900 tracking-[-0.025em]">
            Career
            <span style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Nest
            </span>
          </span>
        </Link>

        {/* ── Desktop Links ── */}
        <ul className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {links.map(({ to, label }) => {
            const active = isActive(to);
            return (
              <li key={to}>
                <Link to={to} className="relative px-3.5 py-2 text-[13px] font-medium rounded-xl flex items-center transition-colors duration-150"
                  style={{ color: active ? "#27bbd2" : "#475569" }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.background = "rgba(39,187,210,0.06)"; }}}
                  onMouseLeave={e => { e.currentTarget.style.color = active ? "#27bbd2" : "#475569"; e.currentTarget.style.background = "transparent"; }}
                >
                  {active && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl -z-10"
                      style={{ background: "rgba(39,187,210,0.09)" }}
                      transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    />
                  )}
                  {label}
                  {active && (
                    <motion.span layoutId="nav-bar" className="absolute bottom-[5px] left-3 right-3 h-[2px] rounded-full"
                      style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)" }}
                      transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Right cluster ── */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">

          {/* search */}
          <div ref={searchRef} className="relative">
            <AnimatePresence>
              {searchOpen ? (
                <motion.form
                  key="searchbar"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 340, damping: 26 }}
                  onSubmit={handleSearch}
                  className="flex items-center overflow-hidden rounded-xl"
                  style={{ border: "1.5px solid rgba(39,187,210,0.4)", background: "rgba(39,187,210,0.04)" }}
                >
                  <Search size={13} className="ml-2.5 shrink-0 text-[#27bbd2]" />
                  <input
                    autoFocus
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    placeholder="Search jobs…"
                    className="flex-1 bg-transparent px-2 py-1.5 text-[12.5px] text-gray-700 outline-none placeholder:text-[#94a3b8]"
                  />
                </motion.form>
              ) : (
                <motion.button
                  key="searchbtn"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-xl text-[#94a3b8] transition-colors duration-150 hover:text-[#27bbd2] hover:bg-[#27bbd2]/6"
                >
                  <Search size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* dark mode toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setDark(!dark)}
            className="p-2 rounded-xl text-[#94a3b8] transition-colors duration-150 hover:text-[#6366f1] hover:bg-[#6366f1]/6"
          >
            <AnimatePresence mode="wait">
              <motion.span key={dark ? "sun" : "moon"}
                initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 30, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {!user ? (
            <>
              <Link to="/login">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 rounded-xl text-[13px] font-semibold text-[#27bbd2] transition-colors duration-150"
                  style={{ border: "1.5px solid rgba(39,187,210,0.3)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(39,187,210,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 4px 20px rgba(39,187,210,0.38)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", boxShadow: "0 2px 10px rgba(39,187,210,0.22)" }}
                >
                  Get Started
                </motion.button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              {/* bell */}
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                className="relative p-2 rounded-xl text-[#94a3b8] hover:text-[#f59e0b] hover:bg-[#f59e0b]/6 transition-colors duration-150"
              >
                <Bell size={16} />
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                  className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#f59e0b]"
                />
              </motion.button>

              {/* avatar dropdown */}
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl transition-all duration-200"
                    style={{ border: "1.5px solid rgba(39,187,210,0.2)", background: "rgba(39,187,210,0.04)" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(39,187,210,0.5)"; e.currentTarget.style.background = "rgba(39,187,210,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(39,187,210,0.2)"; e.currentTarget.style.background = "rgba(39,187,210,0.04)"; }}
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user?.profile?.profilephoto} alt={user?.fullname} />
                      <AvatarFallback className="text-white text-xs font-bold" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                        {user?.fullname?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-semibold text-gray-700 max-w-[80px] truncate">
                      {user?.fullname?.split(" ")[0]}
                    </span>
                    <motion.span animate={{ rotate: popoverOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={12} className="text-[#94a3b8]" />
                    </motion.span>
                  </motion.button>
                </PopoverTrigger>

                <AnimatePresence>
                  {popoverOpen && (
                    <PopoverContent forceMount asChild align="end" sideOffset={8}
                      style={{ border: "1px solid rgba(39,187,210,0.15)", borderRadius: 18, padding: 8, boxShadow: "0 12px 40px rgba(0,0,0,0.12)", width: 232 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 380, damping: 26 }}
                      >
                        {/* user card */}
                        <div className="flex items-center gap-3 px-2.5 py-2.5 mb-1.5 rounded-xl"
                          style={{ background: "linear-gradient(135deg,rgba(39,187,210,0.07),rgba(99,102,241,0.05))", border: "1px solid rgba(39,187,210,0.1)" }}
                        >
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage src={user?.profile?.profilephoto} />
                            <AvatarFallback className="text-white text-xs font-bold" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                              {user?.fullname?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-gray-900 truncate">{user?.fullname}</p>
                            <p className="text-[11px] text-[#94a3b8] truncate">{user?.email}</p>
                          </div>
                        </div>

                        {/* menu items */}
                        {[
                          { icon: User2,    label: "View Profile", action: () => { setPopoverOpen(false); setTimeout(() => navigate("/profile"), 50); }, color: "#27bbd2" },
                          { icon: Bookmark, label: "Saved Jobs",   action: () => { setPopoverOpen(false); navigate("/saved-jobs"); },                  color: "#6366f1" },
                          { icon: Settings, label: "Settings",     action: () => {},                                                                   color: "#94a3b8" },
                        ].map(({ icon: Icon, label, action, color }) => (
                          <button key={label} onClick={action}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-gray-600 transition-all duration-150 group"
                            onMouseEnter={e => { e.currentTarget.style.background = `${color}0d`; e.currentTarget.style.color = color; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4b5563"; }}
                          >
                            <Icon size={14} /> {label}
                          </button>
                        ))}

                        <div className="my-1.5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} />

                        <button onClick={logoutHandler}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-gray-600 transition-all duration-150"
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.07)"; e.currentTarget.style.color = "#ef4444"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4b5563"; }}
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </motion.div>
                    </PopoverContent>
                  )}
                </AnimatePresence>
              </Popover>
            </div>
          )}
        </div>

        {/* ── Mobile toggle ── */}
        <motion.button whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <AnimatePresence mode="wait">
            <motion.span key={mobileOpen ? "x" : "menu"}
              initial={{ rotate: -20, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 20, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: "1px solid rgba(39,187,210,0.1)", background: "rgba(255,255,255,0.97)" }}
          >
            <div className="px-4 py-3 space-y-1">
              {/* mobile search */}
              <form onSubmit={handleSearch} className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2"
                style={{ background: "rgba(39,187,210,0.05)", border: "1px solid rgba(39,187,210,0.15)" }}
              >
                <Search size={13} className="text-[#27bbd2] shrink-0" />
                <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search jobs…"
                  className="flex-1 bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-[#94a3b8]"
                />
              </form>

              {links.map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors duration-150"
                  style={{ color: isActive(to) ? "#27bbd2" : "#475569", background: isActive(to) ? "rgba(39,187,210,0.07)" : "transparent" }}
                >
                  {label}
                </Link>
              ))}

              <div className="pt-2" style={{ borderTop: "1px solid rgba(39,187,210,0.08)" }}>
                {!user ? (
                  <div className="flex gap-2 pt-1">
                    <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <button className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-[#27bbd2]" style={{ border: "1.5px solid rgba(39,187,210,0.35)" }}>Login</button>
                    </Link>
                    <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <button className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>Get Started</button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl" style={{ background: "rgba(39,187,210,0.05)" }}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profile?.profilephoto} />
                        <AvatarFallback className="text-white text-xs font-bold" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                          {user?.fullname?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900">{user?.fullname}</p>
                        <p className="text-[11px] text-[#94a3b8]">{user?.email}</p>
                      </div>
                    </div>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-gray-600 hover:text-[#27bbd2] hover:bg-[#27bbd2]/6 transition-colors">
                      <User2 size={14} /> View Profile
                    </Link>
                    <Link to="/saved-jobs" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-gray-600 hover:text-[#6366f1] hover:bg-[#6366f1]/6 transition-colors">
                      <Bookmark size={14} /> Saved Jobs
                    </Link>
                    <button onClick={logoutHandler} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
