import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, User, Briefcase, BookmarkIcon, Building2, Menu, X, Moon, Sun } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
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
      const res = await api.post("/user/logout");
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
        { name: "Advice", path: "/advice" },
      ];

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <div>
          <Link to="/">
            <h1 className="text-2xl font-bold text-[#27bbd2]">
              CareerNest
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex font-medium items-center gap-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="text-gray-700 hover:text-[#27bbd2] transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="p-2"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="rounded-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#27bbd2] hover:bg-[#1fa8be] rounded-full">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {user.role === "student" && <NotificationDropdown />}
              
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt={user?.fullname}
                    />
                    <AvatarFallback>
                      {user?.fullname?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex gap-2 space-y-2">
                    <Avatar>
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullname}
                      />
                      <AvatarFallback>
                        {user?.fullname?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.fullname}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user?.profile?.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600">
                    {user.role === "student" && (
                      <>
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <User />
                          <Button variant="link" onClick={() => navigate("/profile")}>
                            View Profile
                          </Button>
                        </div>
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <BookmarkIcon />
                          <Button variant="link" onClick={() => navigate("/saved-jobs")}>
                            Saved Jobs
                          </Button>
                        </div>
                      </>
                    )}
                    {user.role === "recruiter" && (
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <Building2 />
                        <Button variant="link" onClick={() => navigate("/admin/companies")}>
                          Companies
                        </Button>
                      </div>
                    )}
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <LogOut />
                      <Button onClick={logoutHandler} variant="link">
                        Logout
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-2 text-gray-700 hover:text-[#27bbd2] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#27bbd2] transition-colors w-full"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            
            {!user ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#27bbd2] hover:bg-[#1fa8be] rounded-full">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 px-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt={user?.fullname}
                    />
                    <AvatarFallback>
                      {user?.fullname?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user?.fullname}</span>
                </div>
                
                {user.role === "student" && (
                  <>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-gray-700 hover:text-[#27bbd2] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      View Profile
                    </Link>
                    <Link
                      to="/saved-jobs"
                      className="block px-3 py-2 text-gray-700 hover:text-[#27bbd2] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Saved Jobs
                    </Link>
                  </>
                )}
                
                <button
                  onClick={() => {
                    logoutHandler();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#27bbd2] transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
