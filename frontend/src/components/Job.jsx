import React from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Clock, IndianRupee } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSaveJob } from '@/redux/jobSlice'
import { toast } from 'sonner'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { savedJobs } = useSelector(store => store.job);
    const isSaved = savedJobs?.some(j => j._id === job?._id);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const timeDifference = new Date() - createdAt;
        const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
        return days === 0 ? "Today" : `${days}d ago`;
    };

    const handleSave = (e) => {
        e.stopPropagation();
        dispatch(toggleSaveJob(job));
        toast.success(isSaved ? "Job removed from saved" : "Job saved");
    };

    return (
        <div
            className='group p-5 rounded-xl bg-white border transition-all duration-200 cursor-pointer hover:-translate-y-1'
            style={{ borderColor: "rgba(99,102,241,0.12)", boxShadow: "0 2px 12px rgba(39,187,210,0.06)" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 30px rgba(39,187,210,0.15)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(39,187,210,0.06)"}
        >
            {/* Header */}
            <div className='flex items-center justify-between mb-3'>
                <span className='text-xs text-gray-400 flex items-center gap-1'>
                    <Clock size={12} /> {daysAgoFunction(job?.createdAt)}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSave}
                    className={`rounded-full h-8 w-8 transition-colors ${isSaved ? 'text-[#f59e0b] bg-[#f59e0b]/10' : 'hover:bg-[#27bbd2]/10 hover:text-[#27bbd2]'}`}
                >
                    <Bookmark size={16} className={isSaved ? 'fill-[#f59e0b]' : ''} />
                </Button>
            </div>

            {/* Company */}
            <div className='flex items-center gap-3 mb-3'>
                <Avatar className="h-12 w-12 border border-gray-100 shadow-sm">
                    <AvatarImage src={job?.company?.logo} />
                    <AvatarFallback className="font-bold text-sm text-white" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                        {job?.company?.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className='font-semibold text-gray-800'>{job?.company?.name}</h1>
                    <p className='text-xs text-gray-400 flex items-center gap-1'>
                        <MapPin size={11} /> {job?.location || "India"}
                    </p>
                </div>
            </div>

            {/* Title & Description */}
            <div className='mb-3'>
                <h1 className='font-bold text-base text-gray-900 mb-1 group-hover:text-[#27bbd2] transition-colors'>{job?.title}</h1>
                <p className='text-sm text-gray-500 line-clamp-2'>{job?.description}</p>
            </div>

            {/* Badges */}
            <div className='flex items-center gap-2 flex-wrap mb-4'>
                <Badge className='border-0 text-xs text-[#27bbd2]' style={{ background: "rgba(39,187,210,0.1)" }}>
                    {job?.position} Positions
                </Badge>
                <Badge className='border-0 text-xs text-[#f59e0b]' style={{ background: "rgba(245,158,11,0.1)" }}>
                    {job?.jobtype}
                </Badge>
                <Badge className='border-0 text-xs text-[#6366f1] flex items-center gap-1' style={{ background: "rgba(99,102,241,0.1)" }}>
                    <IndianRupee size={10} />{job?.salary} LPA
                </Badge>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-3'>
                <Button
                    onClick={() => navigate(`/description/${job?._id}`)}
                    variant="outline"
                    className="flex-1 border-[#27bbd2] text-[#27bbd2] hover:bg-[#27bbd2] hover:text-white transition-colors"
                >
                    View Details
                </Button>
                <Button
                    onClick={handleSave}
                    className="flex-1 text-white transition-all"
                    style={isSaved
                        ? { background: "#f1f5f9", color: "#94a3b8" }
                        : { background: "linear-gradient(135deg,#27bbd2,#6366f1)" }
                    }
                >
                    {isSaved ? 'Saved ✓' : 'Save Job'}
                </Button>
            </div>
        </div>
    )
}

export default Job
