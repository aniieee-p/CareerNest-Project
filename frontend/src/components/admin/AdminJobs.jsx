import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import AdminJobsTable from './AdminJobsTable'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Briefcase, Plus, Search, SlidersHorizontal, CheckCircle2, TrendingUp, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title",  label: "Title A–Z"    },
]

const AdminJobs = () => {
  useGetAllAdminJobs()
  const [input,      setInput]      = useState("")
  const [sort,       setSort]       = useState("newest")
  const [filterOpen, setFilterOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { allAdminJobs = [] } = useSelector(s => s.job)

  useEffect(() => { dispatch(setSearchJobByText(input)) }, [input])

  const total    = allAdminJobs.length
  const thisWeek = allAdminJobs.filter(j => (Date.now() - new Date(j.createdAt)) < 7 * 86400000).length
  const lastWeek = allAdminJobs.filter(j => {
    const age = Date.now() - new Date(j.createdAt)
    return age >= 7 * 86400000 && age < 14 * 86400000
  }).length
  const weekTrend = lastWeek === 0 ? null : Math.round(((thisWeek - lastWeek) / lastWeek) * 100)

  const stats = [
    { label: "Total Jobs",      value: total,    icon: Briefcase,    accent: "#f59e0b", bg: "rgba(245,158,11,0.12)",  sub: "All posted listings"       },
    { label: "New This Week",   value: thisWeek, icon: TrendingUp,   accent: "#10b981", bg: "rgba(16,185,129,0.12)",  sub: "vs last 7 days", trend: weekTrend },
    { label: "Active Listings", value: total,    icon: CheckCircle2, accent: "#27bbd2", bg: "rgba(39,187,210,0.12)",  sub: "Currently live"             },
  ]

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,var(--cn-page) 0%,var(--cn-page-alt) 60%,var(--cn-page) 100%)" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }}>
              <Briefcase size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none" style={{ color: "var(--cn-text-1)" }}>Jobs</h1>
              <p className="text-xs mt-1" style={{ color: "var(--cn-text-3)" }}>Manage and monitor your posted job listings</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 10px 28px rgba(245,158,11,0.35)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/admin/jobs/create")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold self-start sm:self-auto"
            style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", boxShadow: "0 4px 14px rgba(245,158,11,0.25)" }}
          >
            <Plus size={15} strokeWidth={2.8} /> New Job
          </motion.button>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, accent, bg, sub, trend }, i) => {
            const barPct = total > 0 ? Math.round((value / total) * 100) : 0
            return (
              <motion.div key={label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 + i * 0.08 }}
                whileHover={{ y: -4, boxShadow: `0 16px 40px rgba(15,23,42,0.1), 0 0 0 1px ${accent}22` }}
                className="relative rounded-2xl p-4 sm:p-5 border overflow-hidden cursor-default"
                style={{ background: "var(--cn-stat-bg)", borderColor: "var(--cn-stat-border)", boxShadow: "var(--cn-card-shadow)", transition: "box-shadow 0.2s ease, transform 0.2s ease" }}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg,${accent},${accent}88)` }} />
                <div className="absolute -right-3 -bottom-3 opacity-[0.04] pointer-events-none">
                  <Icon size={80} strokeWidth={1} />
                </div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: bg, boxShadow: `0 4px 12px ${accent}22` }}>
                    <Icon size={20} style={{ color: accent }} strokeWidth={2} />
                  </div>
                  {trend !== null && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ background: trend >= 0 ? "rgba(5,150,105,0.12)" : "rgba(239,68,68,0.12)", color: trend >= 0 ? "#059669" : "#ef4444" }}>
                      {Math.abs(trend)}%
                    </motion.div>
                  )}
                </div>
                <p className="text-[1.6rem] sm:text-[2rem] font-extrabold leading-none tracking-tight" style={{ color: "var(--cn-text-1)" }}>{value}</p>
                <p className="text-[0.8rem] font-semibold mt-1" style={{ color: "var(--cn-text-2)" }}>{label}</p>
                <p className="text-[0.72rem] mt-0.5" style={{ color: "var(--cn-text-3)" }}>{sub}</p>
                <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--cn-tag-bg)" }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg,${accent},${accent}bb)` }}
                    initial={{ width: 0 }} animate={{ width: `${barPct}%` }}
                    transition={{ duration: 0.8, delay: 0.35 + i * 0.08, ease: "easeOut" }} />
                </div>
                <p className="text-[0.68rem] mt-1.5 text-right" style={{ color: "var(--cn-text-3)" }}>{barPct}% of total</p>
              </motion.div>
            )
          })}
        </div>

        {/* Toolbar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5"
        >
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder="Search by title or company…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm placeholder-slate-400 outline-none transition-all duration-200"
              style={{ borderColor: "var(--cn-border-input)", background: "var(--cn-sort-bg)", color: "var(--cn-text-1)", boxShadow: "0 1px 4px rgba(15,23,42,0.04)" }}
              onFocus={e => { e.target.style.borderColor = "#f59e0b"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)" }}
              onBlur={e  => { e.target.style.borderColor = "var(--cn-border-input)"; e.target.style.boxShadow = "0 1px 4px rgba(15,23,42,0.04)" }}
            />
          </div>
          <div className="relative">
            <motion.button whileHover={{ borderColor: "#f59e0b" }} whileTap={{ scale: 0.97 }}
              onClick={() => setFilterOpen(v => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium"
              style={{ borderColor: "var(--cn-sort-border)", background: "var(--cn-sort-bg)", color: "var(--cn-sort-text)", boxShadow: "0 1px 4px rgba(15,23,42,0.04)" }}>
              <SlidersHorizontal size={14} />
              {SORT_OPTIONS.find(o => o.value === sort)?.label}
            </motion.button>
            <AnimatePresence>
              {filterOpen && (
                <motion.div initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 rounded-xl border p-1.5 z-20"
                  style={{ background: "var(--cn-sort-bg)", borderColor: "var(--cn-sort-border)", boxShadow: "0 8px 28px rgba(15,23,42,0.15)" }}>
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => { setSort(opt.value); setFilterOpen(false) }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors duration-150"
                      style={{ color: sort === opt.value ? "#f59e0b" : "var(--cn-sort-text)", background: sort === opt.value ? "var(--cn-sort-item-active-bg)" : "transparent", fontWeight: sort === opt.value ? 600 : 400 }}>
                      {opt.label}
                      {sort === opt.value && <CheckCircle2 size={12} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Table card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="rounded-2xl border overflow-hidden"
          style={{ background: "var(--cn-table-bg)", borderColor: "var(--cn-table-border)", boxShadow: "var(--cn-card-shadow)" }}>
          <AdminJobsTable sortOrder={sort} />
        </motion.div>
      </div>
    </div>
  )
}

export default AdminJobs
