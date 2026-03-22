import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { MapPin, IndianRupee } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/description/${job._id}`)}
            className='p-5 rounded-xl cursor-pointer hover:-translate-y-1 transition-all duration-200 group bg-white border'
            style={{ borderColor: "#e2e8f0", boxShadow: "0 2px 12px rgba(99,102,241,0.06)" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 30px rgba(39,187,210,0.15)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(99,102,241,0.06)"}
        >
            <div className='flex items-center gap-3 mb-3'>
                <Avatar className="h-10 w-10 border border-gray-100">
                    <AvatarImage src={job?.company?.logo} />
                    <AvatarFallback className="font-bold text-sm text-white" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                        {job?.company?.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className='font-semibold text-gray-800 text-sm'>{job?.company?.name}</h1>
                    <p className='text-xs text-gray-400 flex items-center gap-1'>
                        <MapPin size={10} /> India
                    </p>
                </div>
            </div>

            <h1 className='font-bold text-base text-gray-900 mb-1 group-hover:text-[#27bbd2] transition-colors'>{job?.title}</h1>
            <p className='text-sm text-gray-500 line-clamp-2 mb-3'>{job?.description}</p>

            <div className='flex items-center gap-2 flex-wrap'>
                <Badge className='border-0 text-xs text-[#27bbd2]' style={{ background: "rgba(39,187,210,0.1)" }}>
                    {job?.position} Openings
                </Badge>
                <Badge className='border-0 text-xs text-[#f59e0b]' style={{ background: "rgba(245,158,11,0.1)" }}>
                    {job?.jobtype}
                </Badge>
                <Badge className='border-0 text-xs text-[#6366f1] flex items-center gap-1' style={{ background: "rgba(99,102,241,0.1)" }}>
                    <IndianRupee size={10} />{job?.salary} LPA
                </Badge>
            </div>
        </div>
    )
}

export default LatestJobCards
