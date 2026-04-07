import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'
import api from '@/utils/axiosInstance'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { Building2, ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const CompanyCreate = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [companyName, setCompanyName] = useState('')
  const [loading,     setLoading]     = useState(false)
  const [focused,     setFocused]     = useState(false)

  const registerNewCompany = async () => {
    if (!companyName.trim()) { toast.error("Please enter a company name"); return }
    try {
      setLoading(true)
      const res = await api.post(`${COMPANY_API_END_POINT}/register`, { companyName })
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company))
        toast.success(res.data.message)
        navigate(`/admin/companies/${res.data.company._id}`)
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Registration failed")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,var(--cn-page) 0%,var(--cn-page-alt) 60%,var(--cn-page) 100%)" }}>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-16">

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}>

          {/* Back */}
          <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/admin/companies")}
            className="flex items-center gap-2 text-sm hover:text-[#27bbd2] mb-8 transition-colors duration-150"
            style={{ color: "var(--cn-text-3)" }}>
            <ArrowLeft size={15} /> Back to Companies
          </motion.button>

          {/* Card */}
          <div className="rounded-3xl p-5 sm:p-8 border"
            style={{ background: "var(--cn-setup-bg)", borderColor: "var(--cn-stat-border)", boxShadow: "0 8px 40px rgba(15,23,42,0.08)" }}>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, -3, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#6366f1,#27bbd2)", boxShadow: "0 8px 24px rgba(99,102,241,0.3)" }}>
                <Building2 size={28} className="text-white" />
              </motion.div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--cn-text-1)" }}>Name your company</h1>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--cn-text-3)" }}>
                What's your company called? You can always update this later from the settings.
              </p>
            </div>

            {/* Input */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--cn-text-3)" }}>
                Company Name
              </label>
              <div className="relative">
                <Building2 size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150"
                  style={{ color: focused ? "#6366f1" : "#cbd5e1" }} />
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && registerNewCompany()}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="e.g. Acme Corp, Microsoft…"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm placeholder-slate-300 outline-none transition-all duration-200"
                  style={{
                    borderColor: focused ? "#6366f1" : "var(--cn-input-border)",
                    background: "var(--cn-input-bg)",
                    color: "var(--cn-text-1)",
                    boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.12)" : "0 1px 3px rgba(15,23,42,0.05)",
                  }}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--cn-text-3)" }}>
                Use your official registered business name.
              </p>
            </div>

            {/* Hint chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["Acme Corp", "TechVentures", "BuildCo"].map(name => (
                <button key={name} type="button" onClick={() => setCompanyName(name)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border transition-all duration-150"
                  style={{ background: "var(--cn-hint-bg)", color: "var(--cn-hint-text)", borderColor: "var(--cn-hint-border)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--cn-sort-item-active-bg2)"; e.currentTarget.style.borderColor = "#6366f1" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--cn-hint-bg)"; e.currentTarget.style.borderColor = "var(--cn-hint-border)" }}>
                  <Sparkles size={9} /> {name}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/admin/companies")}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all duration-150"
                style={{ background: "var(--cn-cancel-bg)", borderColor: "var(--cn-cancel-border)", color: "var(--cn-cancel-text)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--cn-cancel-border)"; e.currentTarget.style.color = "var(--cn-cancel-text)" }}>
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 10px 28px rgba(99,102,241,0.35)" }}
                whileTap={{ scale: 0.97 }}
                onClick={registerNewCompany}
                disabled={loading || !companyName.trim()}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", boxShadow: "0 4px 14px rgba(99,102,241,0.25)" }}>
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /> Creating…</>
                  : <>Continue <ArrowRight size={14} strokeWidth={2.5} /></>}
              </motion.button>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-400 mt-6">
            You'll be able to add logo, description, and more in the next step.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default CompanyCreate
