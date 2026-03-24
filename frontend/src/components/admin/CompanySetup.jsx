import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { ArrowLeft, Loader2, Building2, Globe, MapPin, FileText, Upload, CheckCircle2 } from 'lucide-react'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { motion, AnimatePresence } from 'framer-motion'

const FIELDS = [
  { name: "name",        label: "Company Name",  icon: Building2, placeholder: "e.g. Acme Corp",              type: "text",  accent: "#6366f1" },
  { name: "description", label: "Description",   icon: FileText,  placeholder: "What does your company do?",  type: "text",  accent: "#27bbd2" },
  { name: "website",     label: "Website",       icon: Globe,     placeholder: "https://yourcompany.com",     type: "text",  accent: "#10b981" },
  { name: "location",    label: "Location",      icon: MapPin,    placeholder: "e.g. Bangalore, India",       type: "text",  accent: "#f59e0b" },
]

const CompanySetup = () => {
  const params = useParams()
  useGetCompanyById(params.id)

  const [input,    setInput]    = useState({ name: "", description: "", website: "", location: "", file: null })
  const [loading,  setLoading]  = useState(false)
  const [focused,  setFocused]  = useState(null)
  const [preview,  setPreview]  = useState(null)
  const [saved,    setSaved]    = useState(false)

  const { singleCompany } = useSelector(s => s.company)
  const navigate = useNavigate()

  useEffect(() => {
    setInput({
      name:        singleCompany.name        || "",
      description: singleCompany.description || "",
      website:     singleCompany.website     || "",
      location:    singleCompany.location    || "",
      file:        null,
    })
    if (singleCompany.logo) setPreview(singleCompany.logo)
  }, [singleCompany])

  const onChange = e => setInput({ ...input, [e.target.name]: e.target.value })

  const onFile = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setInput({ ...input, file })
    setPreview(URL.createObjectURL(file))
  }

  const onSubmit = async e => {
    e.preventDefault()
    const fd = new FormData()
    fd.append("name",        input.name)
    fd.append("description", input.description)
    fd.append("website",     input.website)
    fd.append("location",    input.location)
    if (input.file) fd.append("file", input.file)
    try {
      setLoading(true)
      const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, fd,
        { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true })
      if (res.data.success) {
        toast.success(res.data.message)
        setSaved(true)
        setTimeout(() => { setSaved(false); navigate("/admin/companies") }, 1200)
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#f0f4ff 0%,#f8fafc 60%,#f0fdfa 100%)" }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/admin/companies")}
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 bg-white text-slate-500 shrink-0 transition-all duration-150"
              style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b" }}>
              <ArrowLeft size={16} />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg,#6366f1,#27bbd2)", boxShadow: "0 4px 12px rgba(99,102,241,0.25)" }}>
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">Company Setup</h1>
                <p className="text-xs text-slate-400 mt-0.5">Update your company profile and branding</p>
              </div>
            </div>
          </div>

          {/* Form card */}
          <form onSubmit={onSubmit}
            className="bg-white rounded-3xl border border-slate-100 overflow-hidden"
            style={{ boxShadow: "0 8px 40px rgba(15,23,42,0.08)" }}>

            {/* Logo upload section */}
            <div className="px-8 pt-8 pb-6 border-b border-slate-50">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Company Logo</p>
              <div className="flex items-center gap-5">
                <div className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 transition-all duration-200"
                  style={{ background: preview ? "transparent" : "#f8faff" }}>
                  {preview
                    ? <img src={preview} alt="logo" className="w-full h-full object-cover" />
                    : <Building2 size={24} className="text-slate-300" />
                  }
                </div>
                <div>
                  <label htmlFor="logo-upload"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer border border-slate-200 bg-white text-slate-600 transition-all duration-150"
                    style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569" }}>
                    <Upload size={14} /> Upload Logo
                  </label>
                  <input id="logo-upload" type="file" accept="image/*" onChange={onFile} className="hidden" />
                  <p className="text-xs text-slate-400 mt-1.5">PNG, JPG up to 2MB. Recommended 200×200px.</p>
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FIELDS.map(({ name, label, icon: Icon, placeholder, type, accent }) => (
                <div key={name} className={name === "description" ? "sm:col-span-2" : ""}>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    <Icon size={11} style={{ color: accent }} /> {label}
                  </label>
                  <div className="relative">
                    <Icon size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150"
                      style={{ color: focused === name ? accent : "#cbd5e1" }} />
                    <input
                      type={type} name={name} value={input[name]}
                      onChange={onChange} placeholder={placeholder}
                      onFocus={() => setFocused(name)} onBlur={() => setFocused(null)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-300 outline-none transition-all duration-200"
                      style={{
                        borderColor: focused === name ? accent : "#e2e8f0",
                        boxShadow: focused === name ? `0 0 0 3px ${accent}18` : "0 1px 3px rgba(15,23,42,0.04)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer actions */}
            <div className="px-8 pb-8 flex gap-3">
              <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/admin/companies")}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-500 border border-slate-200 bg-white transition-all duration-150"
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b" }}>
                Cancel
              </motion.button>

              <motion.button type="submit"
                whileHover={!loading && !saved ? { scale: 1.03, boxShadow: "0 10px 28px rgba(99,102,241,0.35)" } : {}}
                whileTap={!loading && !saved ? { scale: 0.97 } : {}}
                disabled={loading || saved}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300"
                style={{
                  background: saved
                    ? "linear-gradient(135deg,#10b981,#059669)"
                    : "linear-gradient(135deg,#27bbd2,#6366f1)",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
                }}>
                <AnimatePresence mode="wait" initial={false}>
                  {loading && (
                    <motion.span key="loading" className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                      <Loader2 size={15} className="animate-spin" /> Saving…
                    </motion.span>
                  )}
                  {saved && (
                    <motion.span key="saved" className="flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <CheckCircle2 size={15} /> Saved!
                    </motion.span>
                  )}
                  {!loading && !saved && (
                    <motion.span key="idle" className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                      Save Changes
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default CompanySetup
