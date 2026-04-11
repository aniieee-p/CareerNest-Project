import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./shared/Navbar";
import FilterCard, { FILTER_SECTIONS } from "./FilterCard";
import Job from "./Job";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Briefcase, SlidersHorizontal, X, Tag } from "lucide-react";
import { setSearchedQuery, setAllJobs, setLoading } from "@/redux/jobSlice";
import Footer from "./shared/Footer";
import api from "@/utils/axiosInstance";
import { JOB_API_END_POINT } from "@/utils/constant";
import { SkeletonJobCard } from "./ui/skeleton";

const EMPTY_FILTERS = {
  location: null,
  category: null,
  salary: null,
  jobType: null,
  experience: null,
  posted: null,
};

// salary stored in rupees (e.g. 700000 = 7 LPA), convert to LPA for comparison
const salaryMatch = (job, range) => {
  if (!range) return true;
  const raw = Number(job?.salary) || 0;
  // if value > 1000 it's stored in rupees, convert to LPA; otherwise already LPA
  const lpa = raw > 1000 ? raw / 100000 : raw;
  if (range === "0–3 LPA")  return lpa >= 0  && lpa <= 3;
  if (range === "3–6 LPA")  return lpa > 3   && lpa <= 6;
  if (range === "6–10 LPA") return lpa > 6   && lpa <= 10;
  if (range === "10+ LPA")  return lpa > 10;
  return true;
};

// Map posted label → age in ms
const postedMatch = (job, range) => {
  if (!range) return true;
  const age = Date.now() - new Date(job?.createdAt);
  if (range === "Last 24 hours") return age <= 86400000;
  if (range === "Last 7 days")   return age <= 7  * 86400000;
  if (range === "Last 30 days")  return age <= 30 * 86400000;
  return true;
};

const applyFilters = (jobs, filters, query) => {
  return jobs.filter((job) => {
    // text search — title, description, location, requirements
    if (query) {
      const q = query.toLowerCase();
      const reqText = Array.isArray(job.requirements)
        ? job.requirements.join(" ").toLowerCase()
        : (job.requirements || "").toLowerCase();
      const hit =
        job.title?.toLowerCase().includes(q) ||
        job.description?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q) ||
        reqText.includes(q);
      if (!hit) return false;
    }

    // location — partial match (e.g. "Bangalore" matches "Bangalore, Karnataka")
    if (filters.location) {
      if (!job.location?.toLowerCase().includes(filters.location.toLowerCase()))
        return false;
    }

    // category — match title OR requirements array
    if (filters.category) {
      const cat = filters.category.toLowerCase();
      const reqText = Array.isArray(job.requirements)
        ? job.requirements.join(" ").toLowerCase()
        : (job.requirements || "").toLowerCase();
      const titleMatch = job.title?.toLowerCase().includes(cat);
      // also try individual words (e.g. "Frontend Developer" → "frontend", "developer")
      const words = cat.split(" ");
      const wordMatch = words.some(
        (w) => w.length > 3 && (job.title?.toLowerCase().includes(w) || reqText.includes(w))
      );
      if (!titleMatch && !wordMatch) return false;
    }

    // salary
    if (!salaryMatch(job, filters.salary)) return false;

    // job type — checkbox, any match, case-insensitive
    if (filters.jobType?.length) {
      const match = filters.jobType.some(
        (t) => job.jobtype?.toLowerCase() === t.toLowerCase()
      );
      if (!match) return false;
    }

    // experience level
    if (filters.experience) {
      const exp = filters.experience;
      const lvl = Number(job.experienceLevel) || -1;
      if (exp === "Fresher"   && lvl !== 0)                  return false;
      if (exp === "1–3 years" && !(lvl >= 1 && lvl <= 3))    return false;
      if (exp === "3–5 years" && !(lvl >= 3 && lvl <= 5))    return false;
      if (exp === "5+ years"  && lvl < 5)                    return false;
    }

    // posted date
    if (!postedMatch(job, filters.posted)) return false;

    return true;
  });
};

const Jobs = () => {
  const { allJobs, searchedQuery, loading } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  const [filters, setFilters]       = useState(EMPTY_FILTERS);
  const [localQuery, setLocalQuery] = useState(searchedQuery || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch all jobs on mount (no keyword — show everything)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        dispatch(setLoading(true));
        const res = await api.get(`${JOB_API_END_POINT}/get`);
        if (res.data.success) dispatch(setAllJobs(res.data.jobs));
      } catch { } finally {
        dispatch(setLoading(false));
      }
    };
    fetchJobs();
  }, [dispatch]);

  const filterJobs = applyFilters(allJobs, filters, localQuery);

  // sync hero search bar → local query
  useEffect(() => {
    if (searchedQuery) setLocalQuery(searchedQuery);
  }, [searchedQuery]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClear = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setLocalQuery("");
    dispatch(setSearchedQuery(""));
  }, [dispatch]);

  const handleSearch = () => dispatch(setSearchedQuery(localQuery));

  // count active filters (arrays count each item separately)
  const activeCount = Object.values(filters).reduce((acc, v) => {
    if (!v) return acc;
    return acc + (Array.isArray(v) ? v.length : 1);
  }, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--cn-page-alt)" }}>
      <Navbar />

      {/* ── Hero bar ── */}
      <div
        className="py-10 px-4"
        style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-6 text-center"
          >
            Browse 50,000+ Jobs
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl p-2 max-w-2xl mx-auto"
            style={{ background: "var(--cn-surface)", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
          >
            <div className="flex items-center flex-1 gap-2 min-w-0">
              <Search className="ml-2 h-5 w-5 text-[#94a3b8] shrink-0" />
              <input
                type="text"
                placeholder="Job title, skill or keyword..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 outline-none py-2 text-sm min-w-0"
                style={{ background: "transparent", color: "var(--cn-text-1)" }}
              />
              <div className="hidden sm:flex items-center gap-2 border-l pl-3 mr-1" style={{ borderColor: "#e2e8f0" }}>
                <MapPin size={14} className="text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Location"
                  className="outline-none py-2 text-sm w-24"
                  style={{ background: "transparent", color: "var(--cn-text-1)" }}
                  value={filters.location || ""}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value || null)
                  }
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSearch}
              className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm w-full sm:w-auto"
              style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
            >
              Search
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Active Filters ── */}
        <AnimatePresence>
          {activeCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 rounded-2xl overflow-hidden"
              style={{
                background: "var(--cn-surface-2)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid var(--cn-border)",
                boxShadow: "var(--cn-card-shadow)",
              }}
            >
              {/* header row */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid var(--cn-border-subtle)" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", boxShadow: "0 2px 8px rgba(39,187,210,0.35)" }}
                  >
                    <Tag size={11} className="text-white" />
                  </div>
                  <span className="text-[12.5px] font-bold" style={{ color: "var(--cn-text-1)" }}>Active Filters</span>
                  <motion.span
                    key={activeCount}
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", boxShadow: "0 2px 6px rgba(39,187,210,0.4)" }}
                  >
                    {activeCount}
                  </motion.span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClear}
                  className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
                  style={{ color: "#ef4444", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.13)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.07)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)"; }}
                >
                  <X size={11} strokeWidth={2.5} /> Clear all
                </motion.button>
              </div>

              {/* chips */}
              <div className="flex flex-wrap gap-2 px-4 py-3">
                <AnimatePresence>
                  {Object.entries(filters).map(([key, val]) => {
                    if (!val) return null;
                    const section = FILTER_SECTIONS.find(s => s.key === key);
                    const { color = "#27bbd2", icon: Icon } = section || {};
                    const items = Array.isArray(val) ? val : [val];
                    return items.map((v) => (
                      <motion.span
                        key={`${key}-${v}`}
                        layout
                        initial={{ scale: 0.7, opacity: 0, y: 6 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.7, opacity: 0, y: -4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 28 }}
                        className="flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-full text-[12px] font-semibold"
                        style={{
                          background: `${color}12`,
                          color,
                          border: `1px solid ${color}30`,
                          boxShadow: `0 2px 8px ${color}18`,
                        }}
                      >
                        {Icon && <Icon size={10} style={{ color, opacity: 0.8 }} />}
                        {v}
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: 90 }}
                          whileTap={{ scale: 0.85 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => {
                            if (Array.isArray(filters[key])) {
                              const next = filters[key].filter(x => x !== v);
                              handleFilterChange(key, next.length ? next : null);
                            } else {
                              handleFilterChange(key, null);
                            }
                          }}
                          className="w-4 h-4 rounded-full flex items-center justify-center ml-0.5 transition-colors duration-150"
                          style={{ background: `${color}20`, color }}
                          onMouseEnter={e => e.currentTarget.style.background = `${color}40`}
                          onMouseLeave={e => e.currentTarget.style.background = `${color}20`}
                        >
                          <X size={8} strokeWidth={2.8} />
                        </motion.button>
                      </motion.span>
                    ));
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-6">
          {/* ── Desktop sidebar ── */}
          <div className="w-72 shrink-0 hidden md:block">
            <div className="sticky top-20">
              <FilterCard
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClear}
              />
            </div>
          </div>

          {/* ── Jobs grid ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm" style={{ color: "var(--cn-text-3)" }}>
                <span className="font-semibold" style={{ color: "var(--cn-text-1)" }}>{filterJobs.length}</span>{" "}
                job{filterJobs.length !== 1 ? "s" : ""} found
              </p>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-xs text-[#94a3b8]">
                  <Briefcase size={13} /> Sorted by relevance
                </div>
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setMobileOpen(true)}
                  className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{
                    background: activeCount > 0 ? "rgba(39,187,210,0.1)" : "var(--cn-surface)",
                    color: activeCount > 0 ? "#27bbd2" : "var(--cn-text-2)",
                    border: "1px solid rgba(39,187,210,0.2)",
                  }}
                >
                  <SlidersHorizontal size={13} />
                  Filters {activeCount > 0 && `(${activeCount})`}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonJobCard key={i} />
                ))}
              </div>
            ) : filterJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div
                  className="h-20 w-20 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(39,187,210,0.08)" }}
                >
                  <Search size={32} className="text-[#27bbd2]" />
                </div>
                <p className="font-semibold mb-1" style={{ color: "var(--cn-text-1)" }}>No jobs found</p>
                <p className="text-sm" style={{ color: "var(--cn-text-3)" }}>Try adjusting your filters or search terms</p>
                {activeCount > 0 && (
                  <button
                    onClick={handleClear}
                    className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filterJobs.map((job, i) => (
                  <motion.div
                    key={job?._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full sm:w-80 z-50 md:hidden overflow-y-auto"
              style={{ background: "var(--cn-mobile-drawer)", boxShadow: "-8px 0 32px rgba(0,0,0,0.2)" }}
            >
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--cn-border-subtle)" }}>
                <span className="font-extrabold" style={{ color: "var(--cn-text-1)" }}>Filters</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--cn-text-3)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--cn-surface-hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <X size={18} />
                </button>
              </div>
              <div className="p-4">
                <FilterCard
                  filters={filters}
                  onChange={handleFilterChange}
                  onClear={handleClear}
                />
              </div>
              <div className="sticky bottom-0 p-4" style={{ background: "var(--cn-mobile-drawer)", borderTop: "1px solid var(--cn-border-subtle)" }}>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm"
                  style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
                >
                  Show {filterJobs.length} results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Jobs;
