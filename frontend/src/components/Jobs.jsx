import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import Footer from "./shared/Footer";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [localQuery, setLocalQuery] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchedQuery) {
      const filtered = allJobs.filter((job) =>
        job.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
        job.salary?.toString().includes(searchedQuery)
      );
      setFilterJobs(filtered);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  const handleSearch = () => {
    dispatch(setSearchedQuery(localQuery));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* Hero bar */}
      <div
        className="py-10 px-4"
        style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-6 text-center"
          >
            Browse 50,000+ Jobs
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 bg-white rounded-2xl p-2 max-w-2xl mx-auto"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
          >
            <Search className="ml-2 h-5 w-5 text-[#94a3b8] shrink-0" />
            <input
              type="text"
              placeholder="Job title, skill or keyword..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 outline-none text-gray-700 bg-transparent py-2 text-sm"
            />
            <div className="flex items-center gap-2 border-l pl-3 mr-1" style={{ borderColor: "#e2e8f0" }}>
              <MapPin size={14} className="text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Location"
                className="outline-none text-gray-700 bg-transparent text-sm w-24"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSearch}
              className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
            >
              Search
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 shrink-0 hidden md:block">
            <FilterCard />
          </div>

          {/* Jobs grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-[#94a3b8]">
                <span className="font-semibold text-gray-900">{filterJobs.length}</span> job{filterJobs.length !== 1 ? "s" : ""} found
              </p>
              <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                <Briefcase size={13} />
                Sorted by relevance
              </div>
            </div>

            {filterJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div
                  className="h-20 w-20 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(39,187,210,0.08)" }}
                >
                  <Search size={32} className="text-[#27bbd2]" />
                </div>
                <p className="font-semibold text-gray-700 mb-1">No jobs found</p>
                <p className="text-sm text-[#94a3b8]">Try adjusting your filters or search terms</p>
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
      <Footer />
    </div>
  );
};

export default Jobs;
