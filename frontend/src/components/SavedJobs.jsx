import React from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Bookmark, MapPin, IndianRupee, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

const SavedJobs = () => {
    const navigate = useNavigate()
    const { savedJobs = [] } = useSelector(store => store.job)

    const daysAgo = (date) => {
        const days = Math.floor((new Date() - new Date(date)) / (1000 * 24 * 60 * 60))
        return days === 0 ? "Today" : `${days}d ago`
    }

    return (
        <div style={{ background: "var(--cn-page)", minHeight: "100vh" }}>
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 py-12'>
                <h1 className='text-4xl font-bold mb-2' style={{ color: "var(--cn-text-1)" }}>
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
                            <div
                                key={job._id}
                                onClick={() => navigate(`/description/${job._id}`)}
                                className='p-5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer'
                                style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)" }}
                            >
                                <div className='flex items-start justify-between gap-4'>
                                    <div className='flex items-center gap-4'>
                                        <Avatar className="h-12 w-12" style={{ border: "1px solid var(--cn-border)" }}>
                                            <AvatarImage src={job?.company?.logo} />
                                            <AvatarFallback className="font-bold text-[#27bbd2]" style={{ background: "rgba(39,187,210,0.1)" }}>
                                                {job?.company?.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h2 className='font-bold' style={{ color: "var(--cn-text-1)" }}>{job?.title}</h2>
                                            <p className='text-sm' style={{ color: "var(--cn-text-2)" }}>{job?.company?.name}</p>
                                            <div className='flex items-center gap-3 mt-1 text-xs' style={{ color: "var(--cn-text-3)" }}>
                                                <span className='flex items-center gap-1'><MapPin size={11} />{job?.location}</span>
                                                <span className='flex items-center gap-1'><Clock size={11} />{daysAgo(job?.createdAt)}</span>
                                                <span className='flex items-center gap-1'><IndianRupee size={11} />{job?.salary} LPA</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 shrink-0'>
                                        <Badge className='border-0 text-xs' style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>{job?.jobtype}</Badge>
                                        <Bookmark size={16} className='text-[#27bbd2] fill-[#27bbd2]' />
                                    </div>
                                </div>
                            </div>
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
