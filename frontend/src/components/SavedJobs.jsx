import React from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Bookmark, MapPin, IndianRupee, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
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
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 py-12'>
                <h1 className='text-4xl font-bold text-gray-900 mb-2'>
                    Saved <span className='text-[#27bbd2]'>Jobs</span>
                </h1>
                <p className='text-gray-500 mb-8'>
                    {savedJobs.length > 0 ? `${savedJobs.length} job${savedJobs.length > 1 ? 's' : ''} saved` : "Jobs you've bookmarked for later."}
                </p>

                {savedJobs.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 text-center'>
                        <div className='bg-[#e0f7fa] p-5 rounded-full mb-4'>
                            <Bookmark size={32} className='text-[#27bbd2]' />
                        </div>
                        <h2 className='text-xl font-semibold text-gray-700 mb-2'>No saved jobs yet</h2>
                        <p className='text-gray-400 text-sm mb-6'>Browse jobs and click the bookmark icon to save them here.</p>
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
                                className='p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer'
                            >
                                <div className='flex items-start justify-between gap-4'>
                                    <div className='flex items-center gap-4'>
                                        <Avatar className="h-12 w-12 border border-gray-100">
                                            <AvatarImage src={job?.company?.logo} />
                                            <AvatarFallback className="bg-[#e0f7fa] text-[#27bbd2] font-bold">
                                                {job?.company?.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h2 className='font-bold text-gray-900'>{job?.title}</h2>
                                            <p className='text-sm text-gray-500'>{job?.company?.name}</p>
                                            <div className='flex items-center gap-3 mt-1 text-xs text-gray-400'>
                                                <span className='flex items-center gap-1'><MapPin size={11} />{job?.location}</span>
                                                <span className='flex items-center gap-1'><Clock size={11} />{daysAgo(job?.createdAt)}</span>
                                                <span className='flex items-center gap-1'><IndianRupee size={11} />{job?.salary} LPA</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 shrink-0'>
                                        <Badge className='bg-orange-50 text-orange-500 border-0 text-xs'>{job?.jobtype}</Badge>
                                        <Bookmark size={16} className='text-[#27bbd2] fill-[#27bbd2]' />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            variant="outline"
                            onClick={() => navigate('/jobs')}
                            className='mt-4 border-[#27bbd2] text-[#27bbd2] hover:bg-[#27bbd2] hover:text-white rounded-full'
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
