import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Edit2, MoreHorizontal, Building2, ExternalLink, Trash2,
  Calendar, Plus, Search, Sparkles,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

const GRADIENTS = [
  ["#6366f1","#8b5cf6"], ["#0ea5c9","#27bbd2"], ["#f59e0b","#f97316"],
  ["#10b981","#059669"], ["#ec4899","#f43f5e"], ["#3b82f6","#6366f1"],
]
const getGradient = (name = "") => GRADIENTS[name.charCodeAt(0) % GRADIENTS.length]

const PAGE_SIZE_OPTIONS = [5, 10, 20]

/* ── Tooltip wrapper ── */
function Tip({ label, children }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ duration: 0.12 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-lg text-[11px] font-medium text-white pointer-events-none z-50"
            style={{ background: "#1e293b", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
          >
            {label}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
              style={{ borderTopColor: "#1e293b" }} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

const CompaniesTable = ({ sortOrder = "newest" }) => {
  const { companies = [], searchCompanyByText } = useSelector(s => s.company)
  const [rows,     setRows]     = useState([])
  const [page,     setPage]     = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const navigate = useNavigate()

  useEffect(() => {
    let list = companies.filter(c => {
      if (!searchCompanyByText) return true
      return c?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
    })
    if (sortOrder === "newest") list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sortOrder === "oldest") list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    if (sortOrder === "name")   list = [...list].sort((a, b) => a.name?.localeCompare(b.name))
    setRows(prev => {
      const sameIds = prev.length === list.length && prev.every((r, i) => r._id === list[i]._id)
      return sameIds ? prev : list
    })
    setPage(1)
  }, [companies, searchCompanyByText, sortOrder])

  /* ── Empty state ── */
  if (!rows.length) {
    const isSearch = Boolean(searchCompanyByText)
    return (
      <div className="relative overflow-hidden">

        {/* soft background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle,#6366f1,transparent 70%)" }} />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle,#27bbd2,transparent 70%)" }} />
        </div>

        <div className="relative flex flex-col items-center justify-center py-20 px-6 text-center">

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative mb-7"
          >
            {/* outer ring */}
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-3xl"
              style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(39,187,210,0.15))", margin: "-10px" }}
            />
            {/* icon tile */}
            <div className="relative w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
              {/* mini building SVG illustration */}
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                {/* building body */}
                <rect x="10" y="18" width="32" height="26" rx="3" fill="url(#bldGrad)" opacity="0.9"/>
                {/* roof */}
                <path d="M8 20L26 8L44 20" stroke="url(#roofGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                {/* windows row 1 */}
                <rect x="16" y="24" width="6" height="5" rx="1.5" fill="white" opacity="0.85"/>
                <rect x="30" y="24" width="6" height="5" rx="1.5" fill="white" opacity="0.85"/>
                {/* windows row 2 */}
                <rect x="16" y="33" width="6" height="5" rx="1.5" fill="white" opacity="0.6"/>
                <rect x="30" y="33" width="6" height="5" rx="1.5" fill="white" opacity="0.6"/>
                {/* door */}
                <rect x="22" y="35" width="8" height="9" rx="2" fill="white" opacity="0.9"/>
                {/* sparkle */}
                <circle cx="42" cy="12" r="2.5" fill="#f59e0b" opacity="0.8"/>
                <circle cx="10" cy="14" r="1.5" fill="#27bbd2" opacity="0.7"/>
                <defs>
                  <linearGradient id="bldGrad" x1="10" y1="18" x2="42" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1"/>
                    <stop offset="1" stopColor="#27bbd2"/>
                  </linearGradient>
                  <linearGradient id="roofGrad" x1="8" y1="20" x2="44" y2="8" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8b5cf6"/>
                    <stop offset="1" stopColor="#0ea5c9"/>
                  </linearGradient>
                </defs>
              </svg>

              {/* floating sparkle dot */}
              <motion.div
                animate={{ y: [-3, 3, -3], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", boxShadow: "0 2px 8px rgba(245,158,11,0.4)" }}
              >
                <Sparkles size={10} className="text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="space-y-2 mb-7"
          >
            <h3 className="text-lg font-extrabold tracking-tight" style={{ color: "var(--cn-text-1)" }}>
              {isSearch ? "No results found" : "No companies added yet"}
            </h3>
            <p className="text-sm max-w-[280px] leading-relaxed mx-auto" style={{ color: "var(--cn-text-3)" }}>
              {isSearch
                ? <>No companies match <span className="font-semibold" style={{ color: "var(--cn-text-2)" }}>"{searchCompanyByText}"</span>. Try a different keyword.</>
                : "Start building your recruiter profile by registering your first company. It only takes a minute."}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            {!isSearch && (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 12px 28px rgba(99,102,241,0.35)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/admin/companies/create")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg,#27bbd2,#6366f1)",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.28)",
                }}
              >
                <Plus size={15} strokeWidth={2.8} />
                Add New Company
              </motion.button>
            )}
            <motion.button
              whileHover={{ borderColor: "#6366f1", color: "#6366f1" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(isSearch ? "#" : "/admin/companies/create")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors duration-150"
              style={{ borderColor: "var(--cn-border-input)", color: "var(--cn-text-2)", background: "var(--cn-sort-bg)", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}
            >
              {isSearch ? <><Search size={13}/> Clear search</> : "Learn more"}
            </motion.button>
          </motion.div>

          {/* hint chips */}
          {!isSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 mt-8 flex-wrap justify-center"
            >
              {["Add logo & details", "Post jobs instantly", "Track applicants"].map((tip, i) => (
                <motion.span
                  key={tip}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.52 + i * 0.08 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border"
                  style={{ background: "var(--cn-surface-hover)", color: "#6366f1", borderColor: "rgba(99,102,241,0.3)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                  {tip}
                </motion.span>
              ))}
            </motion.div>
          )}

        </div>
      </div>
    )
  }

  /* pagination */
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const paged      = rows.slice((page - 1) * pageSize, page * pageSize)
  const from       = rows.length === 0 ? 0 : (page - 1) * pageSize + 1
  const to         = Math.min(page * pageSize, rows.length)

  return (
    <div>
      {/* ── scrollable table area ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">

          {/* Header */}
          <thead>
            <tr style={{ background: "var(--cn-page-alt)" }}>
              <th className="px-4 sm:px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest border-b w-8"
                style={{ color: "var(--cn-text-3)", borderColor: "var(--cn-table-border)" }}>
                #
              </th>
              {[
                { label: "Company"    },
                { label: "Registered", icon: <Calendar size={10} className="inline mb-0.5 mr-1" />, hidden: "hidden sm:table-cell" },
                { label: "Status", hidden: "hidden sm:table-cell"     },
                { label: "Actions", right: true },
              ].map(({ label, icon, right, hidden = "" }) => (
                <th key={label}
                  className={`px-4 sm:px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest border-b ${right ? "text-right" : "text-left"} ${hidden}`}
                  style={{ color: "var(--cn-text-3)", borderColor: "var(--cn-table-border)" }}>
                  {icon}{label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            <AnimatePresence initial={false}>
              {paged.map((company, i) => {
                const globalIdx = (page - 1) * pageSize + i
                const isEven    = i % 2 === 0
                const [g1, g2]  = getGradient(company.name)
                const dateStr   = new Date(company.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "short", year: "numeric",
                })

                return (
                  <motion.tr
                    key={company._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="group border-b cursor-default"
                    style={{
                      background: isEven ? "var(--cn-table-bg)" : "var(--cn-page-alt)",
                      borderColor: "var(--cn-table-border)",
                      transition: "background 0.15s ease, box-shadow 0.15s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "var(--cn-table-row-hover)"
                      e.currentTarget.style.boxShadow  = "inset 3px 0 0 #6366f1"
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = isEven ? "var(--cn-table-bg)" : "var(--cn-page-alt)"
                      e.currentTarget.style.boxShadow  = "none"
                    }}
                  >
                    {/* Row number */}
                    <td className="px-4 sm:px-6 py-4 text-xs font-mono select-none" style={{ color: "var(--cn-text-3)" }}>
                      {String(globalIdx + 1).padStart(2, "0")}
                    </td>

                    {/* Company */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2 sm:gap-3.5">
                        <div className="relative shrink-0">
                          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2"
                            style={{ borderColor: "var(--cn-surface)", boxShadow: "0 2px 8px rgba(15,23,42,0.1)" }}>
                            <AvatarImage src={company.logo} className="object-cover rounded-xl" />
                            <AvatarFallback
                              className="rounded-xl text-white text-sm font-extrabold"
                              style={{ background: `linear-gradient(135deg,${g1},${g2})` }}>
                              {company.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[0.8rem] sm:text-[0.875rem] leading-tight truncate" style={{ color: "var(--cn-text-1)" }}>
                            {company.name}
                          </p>
                          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--cn-text-3)" }}>{company.location || "Location not set"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} style={{ color: "var(--cn-text-3)" }} className="shrink-0" />
                        <span className="text-xs font-medium" style={{ color: "var(--cn-text-2)" }}>{dateStr}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                        style={{ background: "rgba(16,185,129,0.1)", color: "#059669", borderColor: "rgba(16,185,129,0.25)" }}>
                        <motion.span
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"
                        />
                        Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center justify-end gap-1">

                        <Tip label="Edit">
                          <motion.button
                            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                            onClick={() => navigate(`/admin/companies/${company._id}`)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                            style={{ color: "#94a3b8" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.color = "#6366f1" }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8" }}
                          >
                            <Edit2 size={14} />
                          </motion.button>
                        </Tip>

                        <Tip label="View">
                          <motion.button
                            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                            onClick={() => navigate(`/admin/companies/${company._id}`)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                            style={{ color: "#94a3b8" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(39,187,210,0.1)"; e.currentTarget.style.color = "#27bbd2" }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8" }}
                          >
                            <ExternalLink size={14} />
                          </motion.button>
                        </Tip>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Tip label="More">
                              <motion.button
                                whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                                style={{ color: "#94a3b8" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "var(--cn-surface-hover)"; e.currentTarget.style.color = "var(--cn-text-2)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8" }}
                              >
                                <MoreHorizontal size={15} />
                              </motion.button>
                            </Tip>
                          </PopoverTrigger>
                          <PopoverContent align="end"
                            className="w-40 p-1.5 rounded-xl"
                            style={{ background: "var(--cn-popover)", border: "1px solid var(--cn-border)", boxShadow: "0 8px 28px rgba(15,23,42,0.15)" }}>
                            <button onClick={() => navigate(`/admin/companies/${company._id}`)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors duration-150"
                              style={{ color: "var(--cn-text-2)" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.color = "#6366f1"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--cn-text-2)"; }}>
                              <Edit2 size={13} /> Edit details
                            </button>
                            <button onClick={() => navigate(`/admin/companies/${company._id}`)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors duration-150"
                              style={{ color: "var(--cn-text-2)" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(39,187,210,0.1)"; e.currentTarget.style.color = "#27bbd2"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--cn-text-2)"; }}>
                              <ExternalLink size={13} /> View profile
                            </button>
                            <div className="my-1" style={{ borderTop: "1px solid var(--cn-border-subtle)" }} />
                            <button onClick={() => toast.error("Delete coming soon")}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors duration-150"
                              style={{ color: "#ef4444" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                              <Trash2 size={13} /> Delete
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

      {/* ── Pagination footer ── */}
      <div className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ background: "var(--cn-page-alt)", borderColor: "var(--cn-table-border)" }}>

        {/* left: count + rows-per-page */}
        <div className="flex items-center gap-3">
          <p className="text-xs" style={{ color: "var(--cn-text-3)" }}>
            {rows.length === 0
              ? "No results"
              : <><span className="font-semibold" style={{ color: "var(--cn-text-2)" }}>{from}–{to}</span> of <span className="font-semibold" style={{ color: "var(--cn-text-2)" }}>{rows.length}</span> companies</>
            }
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: "var(--cn-text-3)" }}>Rows</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="text-xs font-semibold border rounded-lg px-2 py-1 outline-none cursor-pointer"
              style={{ color: "var(--cn-text-2)", borderColor: "var(--cn-border-input)", background: "var(--cn-sort-bg)", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* right: page controls */}
        <div className="flex items-center gap-1">
          {/* first */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setPage(1)} disabled={page === 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: "var(--cn-text-2)" }}
            onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.background = "var(--cn-table-row-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <ChevronsLeft size={14} />
          </motion.button>

          {/* prev */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: "var(--cn-text-2)" }}
            onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.background = "var(--cn-table-row-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <ChevronLeft size={14} />
          </motion.button>

          {/* page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
            .reduce((acc, n, idx, arr) => {
              if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…")
              acc.push(n)
              return acc
            }, [])
            .map((n, idx) =>
              n === "…"
                ? <span key={`ellipsis-${idx}`} className="w-7 text-center text-xs" style={{ color: "var(--cn-text-3)" }}>…</span>
                : (
                  <motion.button key={n} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                    onClick={() => setPage(n)}
                    className="w-7 h-7 rounded-lg text-xs font-semibold transition-all duration-150"
                    style={{
                      background: page === n ? "linear-gradient(135deg,#6366f1,#27bbd2)" : "transparent",
                      color:      page === n ? "#fff" : "var(--cn-text-2)",
                      boxShadow:  page === n ? "0 2px 8px rgba(99,102,241,0.3)" : "none",
                    }}
                  >
                    {n}
                  </motion.button>
                )
            )
          }

          {/* next */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: "var(--cn-text-2)" }}
            onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.background = "var(--cn-table-row-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <ChevronRight size={14} />
          </motion.button>

          {/* last */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setPage(totalPages)} disabled={page === totalPages}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: "var(--cn-text-2)" }}
            onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.background = "var(--cn-table-row-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <ChevronsRight size={14} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default CompaniesTable
