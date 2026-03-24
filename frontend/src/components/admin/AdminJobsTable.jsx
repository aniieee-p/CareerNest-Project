import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Briefcase, Calendar,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const GRADIENTS = [
  ["#f59e0b","#f97316"], ["#6366f1","#8b5cf6"], ["#0ea5c9","#27bbd2"],
  ["#10b981","#059669"], ["#ec4899","#f43f5e"], ["#3b82f6","#6366f1"],
]
const getGradient = (name = "") => {
  const code = name ? name.charCodeAt(0) : 0
  return GRADIENTS[code % GRADIENTS.length]
}

const PAGE_SIZE_OPTIONS = [5, 10, 20]

function Tip({ label, children }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.span initial={{ opacity: 0, y: 4, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }} transition={{ duration: 0.12 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-lg text-[11px] font-medium text-white pointer-events-none z-50"
            style={{ background: "#1e293b", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
            {label}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: "#1e293b" }} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

const TYPE_COLORS = {
  "Full-time":  { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" },
  "Part-time":  { bg: "#f5f3ff", color: "#8b5cf6", border: "#ddd6fe" },
  "Remote":     { bg: "#ecfdf5", color: "#10b981", border: "#a7f3d0" },
  "Internship": { bg: "#fff7ed", color: "#f97316", border: "#fed7aa" },
  "Contract":   { bg: "#fef9c3", color: "#ca8a04", border: "#fde68a" },
}

const AdminJobsTable = ({ sortOrder = "newest" }) => {
  const { allAdminJobs = [], searchJobByText } = useSelector(s => s.job)
  const [rows,     setRows]     = useState([])
  const [page,     setPage]     = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const navigate = useNavigate()

  useEffect(() => {
    let list = allAdminJobs.filter(job => {
      if (!searchJobByText) return true
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
      )
    })
    if (sortOrder === "newest") list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sortOrder === "oldest") list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    if (sortOrder === "title")  list = [...list].sort((a, b) => a.title?.localeCompare(b.title))
    setRows(list)
    setPage(1)
  }, [allAdminJobs, searchJobByText, sortOrder])

  /* empty state */
  if (!rows.length) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle,#f59e0b,transparent 70%)" }} />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle,#f97316,transparent 70%)" }} />
        </div>
        <div className="relative flex flex-col items-center justify-center py-20 px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(145deg,#fffbeb,#fef3c7)", boxShadow: "0 8px 32px rgba(245,158,11,0.15)" }}>
            <Briefcase size={32} strokeWidth={1.4} style={{ color: "#f59e0b" }} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <h3 className="text-lg font-extrabold text-slate-800 mb-2">
              {searchJobByText ? "No jobs found" : "No jobs posted yet"}
            </h3>
            <p className="text-sm text-slate-400 max-w-[280px] leading-relaxed mx-auto mb-6">
              {searchJobByText
                ? <>No jobs match <span className="font-semibold text-slate-600">"{searchJobByText}"</span>.</>
                : "Post your first job listing to start receiving applications."}
            </p>
          </motion.div>
          {!searchJobByText && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/admin/jobs/create")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", boxShadow: "0 4px 16px rgba(245,158,11,0.3)" }}>
              Post a Job
            </motion.button>
          )}
        </div>
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const paged = rows.slice((page - 1) * pageSize, page * pageSize)
  const from  = rows.length === 0 ? 0 : (page - 1) * pageSize + 1
  const to    = Math.min(page * pageSize, rows.length)

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: "linear-gradient(90deg,#fffdf5 0%,#fffbeb 100%)" }}>
              <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 w-8">#</th>
              {[
                { label: "Company" }, { label: "Role" },
                { label: "Posted", icon: <Calendar size={10} className="inline mb-0.5 mr-1" /> },
                { label: "Type" }, { label: "Actions", right: true },
              ].map(({ label, icon, right }) => (
                <th key={label}
                  className={`px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 ${right ? "text-right" : "text-left"}`}>
                  {icon}{label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {paged.map((job, i) => {
                const globalIdx = (page - 1) * pageSize + i
                const isEven    = i % 2 === 0
                const [g1, g2]  = getGradient(job?.company?.name || "")
                const dateStr   = new Date(job.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                const typeStyle = TYPE_COLORS[job.jobType] || { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" }

                return (
                  <motion.tr key={job._id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="group border-b border-slate-100/70 cursor-default"
                    style={{ background: isEven ? "#ffffff" : "#fffdf8", transition: "background 0.15s ease, box-shadow 0.15s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fffbeb"; e.currentTarget.style.boxShadow = "inset 3px 0 0 #f59e0b" }}
                    onMouseLeave={e => { e.currentTarget.style.background = isEven ? "#ffffff" : "#fffdf8"; e.currentTarget.style.boxShadow = "none" }}
                  >
                    <td className="px-6 py-4 text-xs text-slate-300 font-mono select-none">{String(globalIdx + 1).padStart(2, "0")}</td>

                    {/* Company */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 rounded-xl border-2 border-white shrink-0"
                          style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.1)" }}>
                          <AvatarImage src={job?.company?.logo} className="object-cover rounded-xl" />
                          <AvatarFallback className="rounded-xl text-white text-xs font-extrabold"
                            style={{ background: `linear-gradient(135deg,${g1},${g2})` }}>
                            {job?.company?.name?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-slate-700 text-[0.875rem] group-hover:text-amber-600 transition-colors duration-150">
                          {job?.company?.name}
                        </span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 font-bold text-slate-800 text-[0.875rem]">{job?.title}</td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-300 shrink-0" />
                        <span className="text-xs text-slate-500 font-medium">{dateStr}</span>
                      </div>
                    </td>

                    {/* Type badge */}
                    <td className="px-6 py-4">
                      {job.jobType ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                          style={{ background: typeStyle.bg, color: typeStyle.color, borderColor: typeStyle.border }}>
                          {job.jobType}
                        </span>
                      ) : <span className="text-slate-300 text-xs">—</span>}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Tip label="Edit">
                          <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                            onClick={() => navigate(`/admin/companies/${job._id}`)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                            style={{ color: "#94a3b8" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#fffbeb"; e.currentTarget.style.color = "#f59e0b" }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8" }}>
                            <Edit2 size={14} />
                          </motion.button>
                        </Tip>
                        <Tip label="Applicants">
                          <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                            style={{ color: "#94a3b8" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#ecfeff"; e.currentTarget.style.color = "#27bbd2" }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8" }}>
                            <Eye size={14} />
                          </motion.button>
                        </Tip>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Tip label="More">
                              <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                                style={{ color: "#94a3b8" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#475569" }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8" }}>
                                <MoreHorizontal size={15} />
                              </motion.button>
                            </Tip>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-40 p-1.5 rounded-xl border border-slate-100"
                            style={{ boxShadow: "0 8px 28px rgba(15,23,42,0.1)" }}>
                            <button onClick={() => navigate(`/admin/companies/${job._id}`)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-150">
                              <Edit2 size={13} /> Edit job
                            </button>
                            <button onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-colors duration-150">
                              <Eye size={13} /> View applicants
                            </button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ background: "linear-gradient(90deg,#fffdf8,#f8fafc)" }}>
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-400">
            {rows.length === 0 ? "No results" :
              <><span className="font-semibold text-slate-600">{from}–{to}</span> of <span className="font-semibold text-slate-600">{rows.length}</span> jobs</>}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">Rows</span>
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-2 py-1 outline-none bg-white cursor-pointer">
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[
            { icon: ChevronsLeft,  action: () => setPage(1),                          disabled: page === 1 },
            { icon: ChevronLeft,   action: () => setPage(p => Math.max(1, p - 1)),    disabled: page === 1 },
            { icon: ChevronRight,  action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: page === totalPages },
            { icon: ChevronsRight, action: () => setPage(totalPages),                 disabled: page === totalPages },
          ].map(({ icon: Icon, action, disabled }, idx) => (
            <motion.button key={idx} whileHover={{ scale: disabled ? 1 : 1.1 }} whileTap={{ scale: disabled ? 1 : 0.9 }}
              onClick={action} disabled={disabled}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: "#64748b" }}
              onMouseEnter={e => !disabled && (e.currentTarget.style.background = "#fffbeb")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <Icon size={14} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminJobsTable
