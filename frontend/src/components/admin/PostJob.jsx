import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { useSelector } from "react-redux";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, Briefcase, MapPin, IndianRupee, Clock, Users, FileText, Tag, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const jobTypes = ["Full-time", "Part-time", "Remote", "Internship", "Contract"];

const PostJob = () => {
  const [input, setInput] = useState({
    title: "", description: "", requirements: "", salary: "",
    location: "", jobType: "", experience: "", position: 0, companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies = [] } = useSelector((store) => store.company);

  const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find((c) => c.name.toLowerCase() === value);
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    borderColor: "#e2e8f0",
    outline: "none",
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm transition-all bg-white";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-xs font-bold tracking-widest text-[#27bbd2] uppercase mb-1">Recruiter</p>
          <h1 className="text-3xl font-extrabold text-gray-900">Post a New Job</h1>
          <p className="text-sm text-[#94a3b8] mt-1">Fill in the details below to publish your job listing</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form
              onSubmit={submitHandler}
              className="rounded-2xl p-8 space-y-5"
              style={{
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(39,187,210,0.18)",
                boxShadow: "0 8px 32px rgba(39,187,210,0.08)",
              }}
            >
              {/* Job Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <Briefcase size={14} className="text-[#27bbd2]" /> Job Title
                </label>
                <input
                  type="text" name="title" value={input.title}
                  onChange={changeEventHandler} placeholder="e.g. Senior React Developer"
                  required className={inputClass} style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = "#27bbd2"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <FileText size={14} className="text-[#6366f1]" /> Job Description
                </label>
                <textarea
                  name="description" value={input.description}
                  onChange={changeEventHandler} placeholder="Describe the role, responsibilities..."
                  rows={4} required
                  className={inputClass + " resize-none"} style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = "#27bbd2"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <Tag size={14} className="text-[#f59e0b]" /> Requirements
                </label>
                <input
                  type="text" name="requirements" value={input.requirements}
                  onChange={changeEventHandler} placeholder="e.g. React, Node.js, 3+ years experience"
                  className={inputClass} style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = "#27bbd2"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                    <MapPin size={14} className="text-[#27bbd2]" /> Location
                  </label>
                  <input
                    type="text" name="location" value={input.location}
                    onChange={changeEventHandler} placeholder="e.g. Bangalore, Remote"
                    className={inputClass} style={fieldStyle}
                    onFocus={e => e.target.style.borderColor = "#27bbd2"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                    <IndianRupee size={14} className="text-[#10b981]" /> Salary (LPA)
                  </label>
                  <input
                    type="text" name="salary" value={input.salary}
                    onChange={changeEventHandler} placeholder="e.g. 12"
                    className={inputClass} style={fieldStyle}
                    onFocus={e => e.target.style.borderColor = "#27bbd2"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                    <Clock size={14} className="text-[#6366f1]" /> Experience Level
                  </label>
                  <input
                    type="text" name="experience" value={input.experience}
                    onChange={changeEventHandler} placeholder="e.g. 2-4 years"
                    className={inputClass} style={fieldStyle}
                    onFocus={e => e.target.style.borderColor = "#27bbd2"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                    <Users size={14} className="text-[#f59e0b]" /> No. of Positions
                  </label>
                  <input
                    type="number" name="position" value={input.position}
                    onChange={changeEventHandler} min={1}
                    className={inputClass} style={fieldStyle}
                    onFocus={e => e.target.style.borderColor = "#27bbd2"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
              </div>

              {/* Job Type chips */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInput({ ...input, jobType: type })}
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all border-2"
                      style={{
                        borderColor: input.jobType === type ? "#27bbd2" : "#e2e8f0",
                        background: input.jobType === type ? "rgba(39,187,210,0.1)" : "transparent",
                        color: input.jobType === type ? "#27bbd2" : "#94a3b8",
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company select */}
              {companies.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                    <Building2 size={14} className="text-[#6366f1]" /> Company
                  </label>
                  <Select onValueChange={selectChangeHandler}>
                    <SelectTrigger className="w-full rounded-xl border" style={{ borderColor: "#e2e8f0" }}>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies.map((company) => (
                          <SelectItem key={company._id} value={company.name.toLowerCase()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {companies.length === 0 && (
                <p className="text-xs text-red-500 font-semibold text-center py-2">
                  * Please register a company first before posting a job
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 mt-2"
                style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Posting...</> : "Post Job →"}
              </motion.button>
            </form>
          </motion.div>

          {/* Preview panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <p className="text-xs font-bold tracking-widest text-[#94a3b8] uppercase mb-3">Live Preview</p>
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(39,187,210,0.2)",
                  boxShadow: "0 8px 32px rgba(39,187,210,0.1)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
                  >
                    {input.title?.charAt(0)?.toUpperCase() || "J"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{input.title || "Job Title"}</p>
                    <p className="text-xs text-[#94a3b8]">{input.location || "Location"}</p>
                  </div>
                </div>
                <p className="text-xs text-[#475569] line-clamp-3 mb-3">
                  {input.description || "Job description will appear here..."}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {input.jobType && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "rgba(39,187,210,0.1)", color: "#27bbd2" }}>
                      {input.jobType}
                    </span>
                  )}
                  {input.salary && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                      ₹{input.salary} LPA
                    </span>
                  )}
                  {input.experience && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
                      {input.experience}
                    </span>
                  )}
                </div>
                <div
                  className="w-full py-2 rounded-xl text-center text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
                >
                  Apply Now
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
