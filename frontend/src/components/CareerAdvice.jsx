import React from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Lightbulb, BookOpen, TrendingUp, Users } from 'lucide-react'

const tips = [
    {
        icon: Lightbulb,
        title: "Tailor Your Resume",
        desc: "Customize your resume for each job application. Highlight skills that match the job description to increase your chances."
    },
    {
        icon: BookOpen,
        title: "Keep Learning",
        desc: "Stay updated with the latest technologies and trends in your field. Online courses and certifications can boost your profile."
    },
    {
        icon: TrendingUp,
        title: "Build Your Network",
        desc: "Connect with professionals on LinkedIn. Networking can open doors to opportunities that aren't publicly posted."
    },
    {
        icon: Users,
        title: "Prepare for Interviews",
        desc: "Practice common interview questions, research the company, and prepare thoughtful questions to ask your interviewer."
    },
]

const CareerAdvice = () => {
    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 py-12'>
                <h1 className='text-4xl font-bold text-gray-900 mb-2'>Career <span className='text-[#27bbd2]'>Advice</span></h1>
                <p className='text-gray-500 mb-10'>Tips and guidance to help you land your dream job.</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {tips.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className='p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all'>
                            <div className='bg-[#e0f7fa] p-3 rounded-full w-fit mb-4'>
                                <Icon size={22} className='text-[#27bbd2]' />
                            </div>
                            <h2 className='font-bold text-lg text-gray-800 mb-2'>{title}</h2>
                            <p className='text-sm text-gray-500'>{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CareerAdvice
