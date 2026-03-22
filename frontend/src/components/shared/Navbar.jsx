import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2, Briefcase, Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const studentLinks = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Find Jobs" },
    { to: "/browse", label: "Browse" },
  ];

  const recruiterLinks = [
    { to: "/admin/companies", label: "Companies" },
    { to: "admin/jobs", label: "Jobs" },
  ];

  const links = user?.role === "recruiter" ? recruiterLinks : studentLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderColor: "rgba(39,187,210,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="p-1.5 rounded-lg"
            style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
          >
            <Briefcase size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            Career
            <span
              style={{
                background: "linear-gradient(90deg,#27bbd2,#6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nest
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: isActive(to) ? "#27bbd2" : "#475569" }}
              >
                {label}
                {isActive(to) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)" }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-[#27bbd2] text-[#27bbd2] hover:bg-[#27bbd2]/5 text-sm"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
                >
                  Get Started
                </motion.button>
              </Link>
            </>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar
                  className="cursor-pointer ring-2 ring-offset-2"
                  style={{ ringColor: "#27bbd2" }}
                >
                  <AvatarImage src={user?.profile?.profilephoto} alt={user?.fullname} />
                  <AvatarFallback
                    className="text-white font-bold text-sm"
                    style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
                  >
                    {user?.fullname?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="end">
                <div className="flex items-center gap-3 p-2 mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profile?.profilephoto} />
                    <AvatarFallback
                      className="text-white font-bold text-sm"
                      style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
                    >
                      {user?.fullname?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{user?.fullname}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[140px]">{user?.profile?.bio || user?.email}</p>
                  </div>
                </div>
                <div className="border-t pt-2 space-y-1" style={{ borderColor: "rgba(39,187,210,0.1)" }}>
                  {user?.role === "student" && (
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-[#27bbd2]/5 hover:text-[#27bbd2] transition-colors"
                    >
                      <User2 size={15} /> View Profile
                    </Link>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t px-4 py-3 space-y-1"
            style={{ borderColor: "rgba(39,187,210,0.12)", background: "rgba(255,255,255,0.95)" }}
          >
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#27bbd2] hover:bg-[#27bbd2]/5"
              >
                {label}
              </Link>
            ))}
            {!user ? (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full border-[#27bbd2] text-[#27bbd2] text-sm">Login</Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <button className="w-full px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                    Get Started
                  </button>
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t space-y-1" style={{ borderColor: "rgba(39,187,210,0.1)" }}>
                {user?.role === "student" && (
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-[#27bbd2]">
                    <User2 size={15} /> Profile
                  </Link>
                )}
                <button onClick={logoutHandler} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 w-full">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
