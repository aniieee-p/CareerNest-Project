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
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 py-12'>
                <h1 className='text-4xl font-bold text-gray-900 mb-2'>Recruitment <span className='text-[#27bbd2]'>Solutions</span></h1>
                <p className='text-gray-500 mb-10'>Everything you need to hire the right people, faster.</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-12'>
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className='p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all'>
                            <div className='bg-[#e0f7fa] p-3 rounded-full w-fit mb-4'>
                                <Icon size={22} className='text-[#27bbd2]' />
                            </div>
                            <h2 className='font-bold text-lg text-gray-800 mb-2'>{title}</h2>
                            <p className='text-sm text-gray-500'>{desc}</p>
                        </div>
                    ))}
                </div>
                <div className='bg-[#e0f7fa] rounded-2xl p-8 text-center'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>Ready to hire?</h2>
                    <p className='text-gray-500 mb-6 text-sm'>Register your company and start posting jobs today.</p>
                    <button
                        onClick={() => navigate('/admin/companies/create')}
                        className='bg-[#27bbd2] hover:bg-[#1fa8be] text-white px-8 py-3 rounded-full font-semibold transition-colors'
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
