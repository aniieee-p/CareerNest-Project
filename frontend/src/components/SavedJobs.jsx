import React, { useRef, useCallback } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Bookmark, MapPin, IndianRupee, Clock, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { motion } from 'framer-motion'

const SavedJobCard = ({ job, onClick }) => {
    const cardRef = useRef(null)
    const spotRef = useRef(null)
    const onMove = useCallback((e) => {
        if (!cardRef.current || !spotRef.current) return
        const r = cardRef.current.getBoundingClientRect()
        spotRef.current.style.background = `radial-gradient(260px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(39,187,210,0.11), transparent 70%)`
        spotRef.current.style.opacity = "1"
    }, [])
    const onLeave = useCallback(() => { if (spotRef.current) spotRef.current.style.opacity = "0" }, [])

    const daysAgo = (date) => {
        const days = Math.floor((new Date() - new Date(date)) / (1000 * 24 * 60 * 60))
        return days === 0 ? "Today" : `${days}d ago`
    }

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.008 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={onClick}
            className="group relative cursor-pointer rounded-[22px]"
            style={{
                padding: "1px",
                background: "linear-gradient(145deg,rgba(39,187,210,0.16),rgba(99,102,241,0.1),rgba(39,187,210,0.05))",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 6px 24px rgba(39,187,210,0.06)",
                transition: "box-shadow 0.4s ease, background 0.4s ease",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = "linear-gradient(145deg,rgba(39,187,210,0.5),rgba(99,102,241,0.36),rgba(39,187,210,0.18))"
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07), 0 20px 64px rgba(39,187,210,0.16)"
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = "linear-gradient(145deg,rgba(39,187,210,0.16),rgba(99,102,241,0.1),rgba(39,187,210,0.05))"
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04), 0 6px 24px rgba(39,187,210,0.06)"
            }}
        >
            <div ref={cardRef} className="relative rounded-[21px] p-5 overflow-hidden"
                style={{ background: "var(--cn-card)", backdropFilter: "blur(16px)" }}
                onMouseMove={onMove} onMouseLeave={onLeave}>
                <div ref={spotRef} className="absolute inset-0 pointer-events-none rounded-[21px] transition-opacity duration-300" style={{ opacity: 0 }} />
                <div className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(39,187,210,0.5),transparent)" }} />

                <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="relative shrink-0">
                            <Avatar className="h-11 w-11 sm:h-12 sm:w-12 shadow-md" style={{ border: "2px solid rgba(255,255,255,0.9)" }}>
                                <AvatarImage src={job?.company?.logo} />
                                <AvatarFallback className="font-extrabold text-sm text-white"
                                    style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                                    {job?.company?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#10b981]" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-extrabold text-[15px] tracking-[-0.02em] truncate" style={{ color: "var(--cn-text-1)" }}>{job?.title}</h2>
                            <p className="text-sm font-medium" style={{ color: "var(--cn-text-2)" }}>{job?.company?.name}</p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-xs" style={{ color: "var(--cn-text-3)" }}>
                                <span className="flex items-center gap-1"><MapPin size={10} />{job?.location}</span>
                                <span className="flex items-center gap-1"><Clock size={10} />{daysAgo(job?.createdAt)}</span>
                                <span className="flex items-center gap-1"><IndianRupee size={10} />{job?.salary} LPA</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                        <Badge className="border-0 text-xs" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>{job?.jobtype}</Badge>
                        <div className="p-1.5 rounded-lg" style={{ background: "rgba(39,187,210,0.08)" }}>
                            <Bookmark size={14} className="text-[#27bbd2] fill-[#27bbd2]" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

const SavedJobs = () => {
    const navigate = useNavigate()
    const { savedJobs = [] } = useSelector(store => store.job)

    return (
        <div style={{ background: "var(--cn-page)", minHeight: "100vh" }}>
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 py-12'>
                <h1 className='text-2xl sm:text-4xl font-bold mb-2' style={{ color: "var(--cn-text-1)" }}>
                    Saved <span className='text-[#27bbd2]'>Jobs</span>
                </h1>
                <p className='mb-8' style={{ color: "var(--cn-text-2)" }}>
                    {savedJobs.length > 0 ? `${savedJobs.length} job${savedJobs.length > 1 ? 's' : ''} saved` : "Jobs you've bookmarked for later."}
                </p>

                {savedJobs.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 text-center'>
                        <div className='p-5 rounded-full mb-4' style={{ background: "rgba(39,187,210,0.1)" }}>
                            <Bookmark size={32} className='text-[#27bbd2]' />
                        </div>
                        <h2 className='text-xl font-semibold mb-2' style={{ color: "var(--cn-text-1)" }}>No saved jobs yet</h2>
                        <p className='text-sm mb-6' style={{ color: "var(--cn-text-3)" }}>Browse jobs and click the bookmark icon to save them here.</p>
                        <Button onClick={() => navigate('/jobs')} className='bg-[#27bbd2] hover:bg-[#1fa8be] rounded-full px-6'>
                            Browse Jobs
                        </Button>
                    </div>
                ) : (
                    <div className='flex flex-col gap-4'>
                        {savedJobs.map(job => (
                            <SavedJobCard
                                key={job._id}
                                job={job}
                                onClick={() => navigate(`/description/${job._id}`)}
                            />
                        ))}

                        <Button
                            variant="outline"
                            onClick={() => navigate('/jobs')}
                            className='mt-4 rounded-full border-[#27bbd2] text-[#27bbd2] hover:bg-[#27bbd2] hover:text-white'
                        >
                            Browse More Jobs
                        </Button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default SavedJobs
