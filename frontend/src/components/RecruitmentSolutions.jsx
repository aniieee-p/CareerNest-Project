import React, { useRef, useCallback } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Building2, Users, BarChart2, CheckCircle } from 'lucide-react'
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
        <div style={{ background: "var(--cn-page)", minHeight: "100vh" }}>
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 py-12'>
                <h1 className='text-2xl sm:text-4xl font-bold mb-2' style={{ color: "var(--cn-text-1)" }}>
                    Recruitment <span className='text-[#27bbd2]'>Solutions</span>
                </h1>
                <p className='mb-8 sm:mb-10' style={{ color: "var(--cn-text-2)" }}>Everything you need to hire the right people, faster.</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12'>
                    {features.map(({ icon, title, desc }, i) => (
                        <FeatureCard key={title} icon={icon} title={title} desc={desc} index={i} />
                    ))}
                </div>
                <div className='rounded-2xl p-5 sm:p-8 text-center' style={{ background: "rgba(39,187,210,0.08)", border: "1px solid rgba(39,187,210,0.2)" }}>
                    <h2 className='text-2xl font-bold mb-2' style={{ color: "var(--cn-text-1)" }}>Ready to hire?</h2>
                    <p className='mb-6 text-sm' style={{ color: "var(--cn-text-2)" }}>Register your company and start posting jobs today.</p>
                    <button
                        onClick={() => navigate('/admin/companies/create')}
                        className='text-white px-8 py-3 rounded-full font-semibold transition-colors'
                        style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
                    >
                        Get Started
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default RecruitmentSolutions
