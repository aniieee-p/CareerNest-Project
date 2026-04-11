import React, { useRef, useCallback } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Building2, Users, BarChart2, CheckCircle, Rocket, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
    { icon: Building2, title: "Post Jobs Easily", desc: "Create and manage job listings in minutes with our simple recruiter dashboard." },
    { icon: Users, title: "Find Top Talent", desc: "Access thousands of qualified candidates actively looking for opportunities." },
    { icon: BarChart2, title: "Track Applications", desc: "Manage all applicants in one place and update their status with ease." },
    { icon: CheckCircle, title: "Verified Profiles", desc: "All candidates have verified profiles with resumes and skill sets." },
]

const CARD_COLORS = ["#27bbd2", "#6366f1", "#f59e0b", "#10b981"]

const FeatureCard = ({ icon: Icon, title, desc, index }) => {
    const color = CARD_COLORS[index % CARD_COLORS.length]
    const cardRef = useRef(null)
    const spotRef = useRef(null)
    const onMove = useCallback((e) => {
        if (!cardRef.current || !spotRef.current) return
        const r = cardRef.current.getBoundingClientRect()
        spotRef.current.style.background = `radial-gradient(260px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, ${color}18, transparent 70%)`
        spotRef.current.style.opacity = "1"
    }, [color])
    const onLeave = useCallback(() => { if (spotRef.current) spotRef.current.style.opacity = "0" }, [])

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.013 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="group rounded-[22px]"
            style={{
                padding: "1px",
                background: `linear-gradient(145deg,${color}28,rgba(99,102,241,0.08),${color}0a)`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.04)",
                transition: "box-shadow 0.4s ease, background 0.4s ease",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = `linear-gradient(145deg,${color}55,rgba(99,102,241,0.3),${color}22)`
                e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.06), 0 20px 64px ${color}28`
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = `linear-gradient(145deg,${color}28,rgba(99,102,241,0.08),${color}0a)`
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.04)"
            }}
        >
            <div ref={cardRef} className="relative rounded-[21px] p-6 overflow-hidden h-full"
                style={{ background: "var(--cn-card)", backdropFilter: "blur(16px)" }}
                onMouseMove={onMove} onMouseLeave={onLeave}>
                <div ref={spotRef} className="absolute inset-0 pointer-events-none rounded-[21px] transition-opacity duration-300" style={{ opacity: 0 }} />
                <div className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg,transparent,${color}60,transparent)` }} />
                <div className="relative">
                    <motion.div whileHover={{ scale: 1.1, rotate: 7 }} transition={{ type: "spring", stiffness: 440, damping: 15 }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                        style={{ background: `${color}18`, boxShadow: `0 4px 18px ${color}28`, border: `1px solid ${color}30` }}>
                        <Icon size={20} style={{ color }} />
                    </motion.div>
                    <h2 className="font-extrabold text-[15px] tracking-[-0.02em] mb-2" style={{ color: "var(--cn-text-1)" }}>{title}</h2>
                    <p className="text-[13px] leading-[1.72]" style={{ color: "var(--cn-text-2)" }}>{desc}</p>
                </div>
            </div>
        </motion.div>
    )
}

const RecruitmentSolutions = () => {
    const navigate = useNavigate()
    return (
        <div style={{ background: "linear-gradient(160deg,var(--cn-page) 0%,var(--cn-page-alt) 60%,var(--cn-page) 100%)", minHeight: "100vh" }}>
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 sm:px-6 py-10'>

                {/* ── Page header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", boxShadow: "0 4px 14px rgba(39,187,210,0.35)" }}>
                            <Rocket size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none" style={{ color: "var(--cn-text-1)" }}>
                                Recruitment Solutions
                            </h1>
                            <p className="text-xs mt-1" style={{ color: "var(--cn-text-3)" }}>Everything you need to hire the right people, faster</p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.04, boxShadow: "0 10px 28px rgba(39,187,210,0.35)" }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate('/admin/companies/create')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold self-start sm:self-auto"
                        style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", boxShadow: "0 4px 14px rgba(39,187,210,0.25)" }}
                    >
                        <ArrowRight size={15} strokeWidth={2.8} />
                        Get Started
                    </motion.button>
                </motion.div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12'>
                    {features.map(({ icon, title, desc }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.08 + i * 0.08, ease: "easeOut" }}
                        >
                            <FeatureCard icon={icon} title={title} desc={desc} index={i} />
                        </motion.div>
                    ))}
                </div>

                {/* ── CTA card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.32 }}
                    className='rounded-2xl p-5 sm:p-8 text-center border'
                    style={{ background: "var(--cn-table-bg)", borderColor: "var(--cn-table-border)", boxShadow: "var(--cn-card-shadow)" }}
                >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", boxShadow: "0 4px 14px rgba(39,187,210,0.3)" }}>
                        <Rocket size={20} className="text-white" />
                    </div>
                    <h2 className='text-xl font-extrabold mb-2 tracking-tight' style={{ color: "var(--cn-text-1)" }}>Ready to hire?</h2>
                    <p className='mb-6 text-sm' style={{ color: "var(--cn-text-3)" }}>Register your company and start posting jobs today.</p>
                    <motion.button
                        whileHover={{ scale: 1.04, boxShadow: "0 10px 28px rgba(39,187,210,0.35)" }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate('/admin/companies/create')}
                        className='inline-flex items-center gap-2 text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors'
                        style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)", boxShadow: "0 4px 14px rgba(39,187,210,0.25)" }}
                    >
                        <ArrowRight size={15} strokeWidth={2.8} />
                        Get Started
                    </motion.button>
                </motion.div>
            </div>
            <Footer />
        </div>
    )
}

export default RecruitmentSolutions
