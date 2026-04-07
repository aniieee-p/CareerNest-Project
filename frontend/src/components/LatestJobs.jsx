import React, { useRef } from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
      <div ref={ref} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#27bbd2] uppercase mb-1">Latest Openings</p>
          <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: "var(--cn-text-1)" }}>
            <span style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Explore{" "}
            </span>
            Latest Opportunities
          </h2>
          <p className="text-sm text-[#94a3b8] mt-1">Fresh listings updated daily</p>
        </div>
        <Link to="/jobs">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 text-[#27bbd2] hover:bg-[#27bbd2]/5 transition-colors self-start sm:self-auto"
            style={{ borderColor: "#27bbd2" }}
          >
            View All <ArrowRight size={14} />
          </motion.button>
        </Link>
      </div>

      {allJobs.length === 0 ? (
        <p className="text-[#94a3b8] text-sm">No jobs available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allJobs.slice(0, 6).map((job, i) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <LatestJobCards job={job} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestJobs;
