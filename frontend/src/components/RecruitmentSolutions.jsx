import React from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Building2, Users, BarChart2, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const features = [
    { icon: Building2, title: "Post Jobs Easily", desc: "Create and manage job listings in minutes with our simple recruiter dashboard." },
    { icon: Users, title: "Find Top Talent", desc: "Access thousands of qualified candidates actively looking for opportunities." },
    { icon: BarChart2, title: "Track Applications", desc: "Manage all applicants in one place and update their status with ease." },
    { icon: CheckCircle, title: "Verified Profiles", desc: "All candidates have verified profiles with resumes and skill sets." },
]

const RecruitmentSolutions = () => {
    const navigate = useNavigate()
    return (
        <div style={{ background: "var(--cn-page)", minHeight: "100vh" }}>
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 py-12'>
                <h1 className='text-4xl font-bold mb-2' style={{ color: "var(--cn-text-1)" }}>
                    Recruitment <span className='text-[#27bbd2]'>Solutions</span>
                </h1>
                <p className='mb-10' style={{ color: "var(--cn-text-2)" }}>Everything you need to hire the right people, faster.</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-12'>
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className='p-6 rounded-xl shadow-sm hover:shadow-md transition-all'
                          style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)" }}>
                            <div className='p-3 rounded-full w-fit mb-4' style={{ background: "rgba(39,187,210,0.1)" }}>
                                <Icon size={22} className='text-[#27bbd2]' />
                            </div>
                            <h2 className='font-bold text-lg mb-2' style={{ color: "var(--cn-text-1)" }}>{title}</h2>
                            <p className='text-sm' style={{ color: "var(--cn-text-2)" }}>{desc}</p>
                        </div>
                    ))}
                </div>
                <div className='rounded-2xl p-8 text-center' style={{ background: "rgba(39,187,210,0.08)", border: "1px solid rgba(39,187,210,0.2)" }}>
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
