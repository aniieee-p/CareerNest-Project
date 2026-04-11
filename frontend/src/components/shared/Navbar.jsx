import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, User, BookmarkIcon, Building2, Menu, X, Moon, Sun, ChevronDown, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
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
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
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
    <nav className={`sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-gray-950/80 dark:border-gray-800 transition-shadow duration-300 ${
      scrolled ? 'shadow-sm' : ''
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 transition-transform duration-200 group-hover:scale-105">
                <span className="text-sm font-bold text-white">CN</span>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                CareerNest
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActivePath(item.path)
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="h-9 w-9 rounded-lg p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {!user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-9 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button 
                      size="sm"
                      className="h-9 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 text-white hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Get started
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Notifications for students */}
                  {user.role === "student" && (
                    <div className="relative">
                      <NotificationDropdown />
                    </div>
                  )}
                  
                  {/* User Menu */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex h-9 items-center space-x-2 rounded-lg px-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                      >
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src={user?.profile?.profilePhoto}
                            alt={user?.fullname}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-xs text-white">
                            {user?.fullname?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-3 w-3 text-gray-500 transition-transform duration-200" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-56 p-0 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2" 
                      align="end"
                      sideOffset={8}
                    >
                      {/* User Info Header */}
                      <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={user?.profile?.profilePhoto}
                              alt={user?.fullname}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm">
                              {user?.fullname?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {user?.fullname}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => navigate("/profile")}
                          className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200"
                        >
                          <User className="mr-3 h-4 w-4" />
                          Profile
                        </button>
                        
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
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 rounded-lg p-0 transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Slide-in Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Drawer */}
        <div className={`fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-md border-l border-gray-100 dark:bg-gray-950/95 dark:border-gray-800 shadow-xl transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <span className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Menu
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="h-8 w-8 rounded-lg p-0 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Drawer Content */}
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
              {/* Navigation Links */}
              <div className="space-y-2 mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Navigation
                </h3>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center rounded-lg px-3 py-3 text-base font-medium transition-all duration-200 ${
                      isActivePath(item.path)
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Settings */}
              <div className="space-y-2 mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Settings
                </h3>
                <button
                  onClick={toggleDarkMode}
                  className="flex w-full items-center rounded-lg px-3 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200"
                >
                  {darkMode ? (
                    <>
                      <Sun className="mr-3 h-5 w-5" />
                      Light mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-3 h-5 w-5" />
                      Dark mode
                    </>
                  )}
                </button>
              </div>

              {/* User Section */}
              {user && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Account
                  </h3>
                  <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullname}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                        {user?.fullname?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user?.fullname}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  {user.role === "student" && (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center rounded-lg px-3 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="mr-3 h-5 w-5" />
                        View Profile
                      </Link>
                      <Link
                        to="/saved-jobs"
                        className="flex items-center rounded-lg px-3 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <BookmarkIcon className="mr-3 h-5 w-5" />
                        Saved Jobs
                      </Link>
                    </>
                  )}
                  
                  {user.role === "recruiter" && (
                    <Link
                      to="/admin/companies"
                      className="flex items-center rounded-lg px-3 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Building2 className="mr-3 h-5 w-5" />
                      Manage Companies
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-4">
              {!user ? (
                <div className="space-y-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-lg transition-all duration-200">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-200">
                      Get started
                    </Button>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    logoutHandler();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center rounded-lg px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200 border border-red-200 dark:border-red-800"
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
