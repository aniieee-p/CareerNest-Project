import React, { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Users, CheckCircle2, XCircle, Clock,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileText, Mail, Phone } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { updateApplicationStatus } from '@/redux/applicationSlice'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CandidateSheet from './CandidateSheet'

const PAGE_SIZE_OPTIONS = [5, 10, 20]

const STATUS_STYLE = {
  accepted: { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0", label: "Accepted", icon: CheckCircle2 },
  rejected: { bg: "#fef2f2", color: "#ef4444", border: "#fecaca", label: "Rejected",  icon: XCircle      },
  pending:  { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "Pending",   icon: Clock        },
}

const GRADIENTS = [
  ["#6366f1","#8b5cf6"], ["#0ea5c9","#27bbd2"], ["#f59e0b","#f97316"],
  ["#10b981","#059669"], ["#ec4899","#f43f5e"],
]
const getGradient = (name = "") => GRADIENTS[name.charCodeAt(0) % GRADIENTS.length]

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

function ActionMenu({ onAccept, onReject }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
        style={{ color: "#94a3b8" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#475569" }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8" }}>
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div style={{
          position: 'fixed', zIndex: 99999, background: '#ffffff',
          border: '1px solid #e2e8f0', borderRadius: '12px',
          boxShadow: '0 8px 28px rgba(15,23,42,0.15)', padding: '6px',
          minWidth: '140px', transform: 'translateX(-100%)'
        }}>
          <button onClick={() => { onAccept(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-emerald-600 hover:bg-emerald-50 transition-colors">
            <CheckCircle2 size={13} /> Accept
          </button>
          <button onClick={() => { onReject(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-red-500 hover:bg-red-50 transition-colors mt-0.5">
            <XCircle size={13} /> Reject
          </button>
        </div>
      )}
    </div>
  )
}

const ApplicantsTable = ({ jobRequirements = [] }) => {
  const { applicants } = useSelector(s => s.application)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [page,     setPage]     = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedId, setSelectedId] = useState(null)

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status })
      if (res.data.success) {
        dispatch(updateApplicationStatus({ id, status }))
        toast.success(res.data.message)
      }
    } catch (e) { toast.error(e.response?.data?.message || "Update failed") }
  }

  const items = applicants?.applications ?? []

  if (!items.length) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle,#10b981,transparent 70%)" }} />
        </div>
        <div className="relative flex flex-col items-center justify-center py-20 px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(145deg,#ecfdf5,#d1fae5)", boxShadow: "0 8px 32px rgba(16,185,129,0.15)" }}>
            <Users size={32} strokeWidth={1.4} style={{ color: "#10b981" }} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <h3 className="text-lg font-extrabold mb-2" style={{ color: "var(--cn-text-1)" }}>No applicants yet</h3>
            <p className="text-sm max-w-[260px] leading-relaxed mx-auto" style={{ color: "var(--cn-text-3)" }}>
              Applications will appear here once candidates start applying.
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const paged = items.slice((page - 1) * pageSize, page * pageSize)
  const from  = (page - 1) * pageSize + 1
  const to    = Math.min(page * pageSize, items.length)

  return (
    <>
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: "var(--cn-page-alt)" }}>
              <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest border-b w-8" style={{ color: "var(--cn-text-3)", borderColor: "var(--cn-table-border)" }}>#</th>
              {["Applicant", "Contact", "Resume", "Applied", "Status", "Actions"].map((h, i) => (
                <th key={h} className={`px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest border-b ${i === 5 ? "text-right" : "text-left"}`}
                  style={{ color: "var(--cn-text-3)", borderColor: "var(--cn-table-border)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {paged.map((item, i) => {
                const globalIdx = (page - 1) * pageSize + i
                const isEven    = i % 2 === 0
                const name      = item?.applicant?.fullname || ""
                const [g1, g2]  = getGradient(name)
                const rawStatus = item?.status?.toLowerCase() || "pending"
                const st        = STATUS_STYLE[rawStatus] || STATUS_STYLE.pending
                const StatusIcon = st.icon
                const dateStr   = item?.applicant?.createdAt?.split("T")[0]

                return (
                  <motion.tr key={item._id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="group border-b cursor-default"
                    style={{ background: isEven ? "var(--cn-table-bg)" : "var(--cn-page-alt)", borderColor: "var(--cn-table-border)", transition: "background 0.15s ease, box-shadow 0.15s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--cn-table-row-hover)"; e.currentTarget.style.boxShadow = "inset 3px 0 0 #10b981" }}
                    onMouseLeave={e => { e.currentTarget.style.background = isEven ? "var(--cn-table-bg)" : "var(--cn-page-alt)"; e.currentTarget.style.boxShadow = "none" }}
                  >
                    <td className="px-6 py-4 text-xs font-mono select-none" style={{ color: "var(--cn-text-3)" }}>{String(globalIdx + 1).padStart(2, "0")}</td>

                    {/* Applicant */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 rounded-xl border-2 shrink-0"
                          style={{ borderColor: "var(--cn-surface)", boxShadow: "0 2px 8px rgba(15,23,42,0.1)" }}>
                          <AvatarImage src={item?.applicant?.profile?.profilephoto} className="object-cover rounded-xl" />
                          <AvatarFallback className="rounded-xl text-white text-xs font-extrabold"
                            style={{ background: `linear-gradient(135deg,${g1},${g2})` }}>
                            {name?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-[0.875rem] leading-tight cursor-pointer hover:text-[#27bbd2] transition-colors"
                            style={{ color: "var(--cn-text-1)" }}
                            onClick={() => setSelectedId(item?.applicant?._id)}>
                            {name}
                          </p>
                          <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--cn-text-3)" }}>
                            <Mail size={10} />{item?.applicant?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--cn-text-2)" }}>
                        <Phone size={11} style={{ color: "var(--cn-text-3)" }} className="shrink-0" />
                        {item?.applicant?.phoneNumber || <span style={{ color: "var(--cn-text-3)" }}>—</span>}
                      </div>
                    </td>

                    {/* Resume */}
                    <td className="px-6 py-4">
                      {item.applicant?.profile?.resume
                        ? <a href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-500 hover:text-indigo-700 transition-colors duration-150">
                            <FileText size={12} />
                            {item?.applicant?.profile?.resumeOriginalName?.length > 16
                              ? item?.applicant?.profile?.resumeOriginalName?.slice(0, 16) + "…"
                              : item?.applicant?.profile?.resumeOriginalName}
                          </a>
                        : <span className="text-xs" style={{ color: "var(--cn-text-3)" }}>No resume</span>
                      }
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-medium" style={{ color: "var(--cn-text-2)" }}>{dateStr}</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                        style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                        <StatusIcon size={11} />
                        {st.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <ActionMenu
                        onAccept={() => statusHandler("Accepted", item?._id)}
                        onReject={() => statusHandler("Rejected", item?._id)}
                      />
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ background: "var(--cn-page-alt)", borderColor: "var(--cn-table-border)" }}>
        <div className="flex items-center gap-3">
          <p className="text-xs" style={{ color: "var(--cn-text-3)" }}>
            <span className="font-semibold" style={{ color: "var(--cn-text-2)" }}>{from}–{to}</span> of <span className="font-semibold" style={{ color: "var(--cn-text-2)" }}>{items.length}</span> applicants
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: "var(--cn-text-3)" }}>Rows</span>
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="text-xs font-semibold border rounded-lg px-2 py-1 outline-none cursor-pointer"
              style={{ color: "var(--cn-text-2)", borderColor: "var(--cn-border-input)", background: "var(--cn-sort-bg)" }}>
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[
            { icon: ChevronsLeft,  fn: () => setPage(1),                               dis: page === 1 },
            { icon: ChevronLeft,   fn: () => setPage(p => Math.max(1, p - 1)),         dis: page === 1 },
            { icon: ChevronRight,  fn: () => setPage(p => Math.min(totalPages, p + 1)),dis: page === totalPages },
            { icon: ChevronsRight, fn: () => setPage(totalPages),                      dis: page === totalPages },
          ].map(({ icon: Icon, fn, dis }, idx) => (
            <motion.button key={idx} whileHover={{ scale: dis ? 1 : 1.1 }} whileTap={{ scale: dis ? 1 : 0.9 }}
              onClick={fn} disabled={dis}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: "var(--cn-text-2)" }}
              onMouseEnter={e => !dis && (e.currentTarget.style.background = "var(--cn-table-row-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <Icon size={14} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>

    <CandidateSheet
      applicantId={selectedId}
      jobRequirements={jobRequirements}
      onClose={() => setSelectedId(null)}
    />
    </>
  )
}

export default ApplicantsTable