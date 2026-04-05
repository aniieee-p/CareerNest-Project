import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import api from '@/utils/axiosInstance'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'
import { Users, ArrowLeft, UserCheck, UserX, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const Applicants = () => {
  const params   = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { applicants } = useSelector(s => s.application)

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`)
        dispatch(setAllApplicants(res.data.job))
      } catch (e) {

      }
    }
    fetchApplicants()
  }, [])

  const apps     = applicants?.applications ?? []
  const total    = apps.length
  const accepted = apps.filter(a => a.status === "accepted").length
  const rejected = apps.filter(a => a.status === "rejected").length
  const pending  = total - accepted - rejected

  const stats = [
    { label: "Total",    value: total,    icon: Users,     accent: "#27bbd2", bg: "linear-gradient(135deg,#ecfeff,#cffafe)" },
    { label: "Accepted", value: accepted, icon: UserCheck, accent: "#10b981", bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)" },
    { label: "Pending",  value: pending,  icon: Clock,     accent: "#f59e0b", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)" },
    { label: "Rejected", value: rejected, icon: UserX,     accent: "#ef4444", bg: "linear-gradient(135deg,#fef2f2,#fee2e2)" },
  ]

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,var(--cn-page) 0%,var(--cn-page-alt) 60%,var(--cn-page) 100%)" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/jobs")}
            className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-150"
            style={{ background: "var(--cn-back-btn-bg)", borderColor: "var(--cn-back-btn-border)", color: "var(--cn-back-btn-text)", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#27bbd2"; e.currentTarget.style.color = "#27bbd2" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--cn-back-btn-border)"; e.currentTarget.style.color = "var(--cn-back-btn-text)" }}
          >
            <ArrowLeft size={16} />
          </motion.button>

          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#10b981,#27bbd2)", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}
            >
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight leading-none" style={{ color: "var(--cn-text-1)" }}>
                Applicants
                {total > 0 && (
                  <span className="ml-2.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                    {total}
                  </span>
                )}
              </h1>
              <p className="text-xs mt-1" style={{ color: "var(--cn-text-3)" }}>People who applied for this position</p>
            </div>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, accent, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 + i * 0.07 }}
              whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(15,23,42,0.09)" }}
              className="relative rounded-2xl p-4 border overflow-hidden cursor-default"
              style={{ background: "var(--cn-stat-bg)", borderColor: "var(--cn-stat-border)", boxShadow: "var(--cn-card-shadow)", transition: "box-shadow 0.2s ease, transform 0.2s ease" }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                style={{ background: `linear-gradient(90deg,${accent},${accent}88)` }}
              />
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: bg }}
              >
                <Icon size={17} style={{ color: accent }} strokeWidth={2} />
              </div>
              <p className="text-[1.75rem] font-extrabold leading-none" style={{ color: "var(--cn-text-1)" }}>{value}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: "var(--cn-text-2)" }}>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Table card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="rounded-2xl border overflow-hidden"
          style={{ background: "var(--cn-table-bg)", borderColor: "var(--cn-table-border)", boxShadow: "var(--cn-card-shadow)" }}
        >
          <ApplicantsTable jobRequirements={applicants?.requirements || []} />
        </motion.div>

      </div>
    </div>
  )
}

export default Applicants
