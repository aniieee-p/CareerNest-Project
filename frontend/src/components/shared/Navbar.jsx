import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, User, BookmarkIcon, Building2, Menu, X, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { setUser } from "../../redux/authSlice";
import api from "../../utils/axiosInstance";
import { toast } from "sonner";
import NotificationDropdown from "../NotificationDropdown";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const isDark = savedDarkMode === 'true'; // Default to false (light mode) if not set
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await api.get("/user/logout");
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  const navItems = user?.role === "recruiter" 
    ? [
        { name: "Companies", path: "/admin/companies" },
        { name: "Jobs", path: "/admin/jobs" },
      ]
    : [
        { name: "Find Jobs", path: "/jobs" },
        { name: "Browse", path: "/browse" },
        { name: "Advice", path: "/career-advice" },
      ];

  const isActivePath = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
      scrolled ? 'shadow-sm' : ''
    }`} style={{ 
      backgroundColor: 'var(--cn-nav-bg)', 
      borderBottom: scrolled ? '1px solid var(--cn-nav-border)' : 'none'
    }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/careernest-favicon-glass.svg" 
                alt="CareerNest Logo" 
                className="h-8 w-8 transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-xl font-semibold hidden sm:block">
                <span style={{ color: 'var(--cn-text-1)' }}>Career</span>
                <span className="text-[#27bbd2]">Nest</span>
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? "text-[#27bbd2]"
                    : "hover:text-[#27bbd2]"
                }`}
                style={{ 
                  color: isActivePath(item.path) ? '#27bbd2' : 'var(--cn-text-2)' 
                }}
              >
                {item.name}
                {isActivePath(item.path) && (
                  <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#27bbd2] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-white/5"
              style={{ color: 'var(--cn-text-2)' }}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {!user ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login">
                  <button className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-white/5" style={{ color: 'var(--cn-text-2)' }}>
                    Sign in
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-[#27bbd2] rounded-lg hover:bg-[#1fa8be] transition-colors duration-200">
                    Get started
                  </button>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                {/* Notifications for students */}
                {user.role === "student" && (
                  <div className="relative">
                    <NotificationDropdown />
                  </div>
                )}
                
                {/* User Avatar Dropdown */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors duration-200">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.profile?.profilePhoto}
                          alt={user?.fullname}
                        />
                        <AvatarFallback className="bg-[#27bbd2] text-white text-sm">
                          {user?.fullname?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-56 p-0 animate-in fade-in-0 zoom-in-95" 
                    align="end"
                    sideOffset={8}
                    style={{ backgroundColor: 'var(--cn-popover)', borderColor: 'var(--cn-border)' }}
                  >
                    {/* User Info */}
                    <div className="p-3 border-b" style={{ borderColor: 'var(--cn-border)' }}>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={user?.profile?.profilePhoto}
                            alt={user?.fullname}
                          />
                          <AvatarFallback className="bg-[#27bbd2] text-white">
                            {user?.fullname?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--cn-text-1)' }}>
                            {user?.fullname}
                          </p>
                          <p className="text-xs truncate" style={{ color: 'var(--cn-text-3)' }}>
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => navigate(user.role === "recruiter" ? "/admin/profile" : "/profile")}
                        className="flex w-full items-center px-3 py-2 text-sm transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-white/5"
                        style={{ color: 'var(--cn-text-2)' }}
                      >
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </button>
                      
                      {user.role === "student" && (
                        <button
                          onClick={() => navigate("/saved-jobs")}
                          className="flex w-full items-center px-3 py-2 text-sm transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-white/5"
                          style={{ color: 'var(--cn-text-2)' }}
                        >
                          <BookmarkIcon className="mr-3 h-4 w-4" />
                          Saved Jobs
                        </button>
                      )}
                      
                      <button
                        onClick={logoutHandler}
                        className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-white/5"
              style={{ color: 'var(--cn-text-2)' }}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Drawer */}
        <div className={`fixed right-0 top-0 h-full w-80 max-w-[85vw] backdrop-blur-md shadow-xl transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`} style={{ 
          backgroundColor: 'var(--cn-mobile-drawer)', 
          borderLeft: '1px solid var(--cn-border)' 
        }}>
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--cn-border)' }}>
            <span className="text-lg font-semibold text-[#27bbd2]">
              Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-white/5"
              style={{ color: 'var(--cn-text-2)' }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-6">
              {/* Navigation Links */}
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                      isActivePath(item.path)
                        ? "bg-[#27bbd2]/10 text-[#27bbd2]"
                        : "hover:bg-gray-100/50 dark:hover:bg-white/5"
                    }`}
                    style={{ 
                      color: isActivePath(item.path) ? '#27bbd2' : 'var(--cn-text-2)' 
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* User Section (if logged in) */}
              {user && (
                <div className="pt-4 border-t" style={{ borderColor: 'var(--cn-border)' }}>
                  <div className="flex items-center p-3 rounded-lg mb-3" style={{ backgroundColor: 'var(--cn-surface-hover)' }}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullname}
                      />
                      <AvatarFallback className="bg-[#27bbd2] text-white">
                        {user?.fullname?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--cn-text-1)' }}>
                        {user?.fullname}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--cn-text-3)' }}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Link
                      to={user.role === "recruiter" ? "/admin/profile" : "/profile"}
                      className="flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-white/5"
                      style={{ color: 'var(--cn-text-2)' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="mr-3 h-5 w-5" />
                      Profile
                    </Link>
                    
                    {user.role === "student" && (
                      <Link
                        to="/saved-jobs"
                        className="flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-white/5"
                        style={{ color: 'var(--cn-text-2)' }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <BookmarkIcon className="mr-3 h-5 w-5" />
                        Saved Jobs
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t" style={{ borderColor: 'var(--cn-border)' }}>
              {!user ? (
                <div className="space-y-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-3 text-sm font-medium rounded-lg border transition-colors duration-200" style={{ color: 'var(--cn-text-2)', borderColor: 'var(--cn-border)' }}>
                      Sign in
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-3 text-sm font-medium text-white bg-[#27bbd2] rounded-lg hover:bg-[#1fa8be] transition-colors duration-200">
                      Get started
                    </button>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    logoutHandler();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 border border-red-200 dark:border-red-800"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;