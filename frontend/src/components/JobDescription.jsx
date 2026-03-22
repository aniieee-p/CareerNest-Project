import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import { MapPin, Briefcase, IndianRupee, Users, Calendar, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setIsApplied(true);
                dispatch(setSingleJob({ ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        dispatch(setSingleJob(null));
        setLoading(true);
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(a => a.applicant === user?._id));
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto my-10 px-4'>
                <button onClick={() => navigate(-1)} className='flex items-center gap-1 text-sm text-gray-400 hover:text-[#27bbd2] mb-6 transition-colors'>
                    <ArrowLeft size={16} /> Back to Jobs
                </button>

                {loading ? (
                    <div className='flex items-center justify-center py-32'>
                        <Loader2 size={32} className='animate-spin text-[#27bbd2]' />
                    </div>
                ) : (
                    <>
                        {/* Header Card */}
                        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6'>
                            <div className='flex items-start justify-between gap-4 flex-wrap'>
                                <div className='flex items-center gap-4'>
                                    <Avatar className="h-16 w-16 border border-gray-100 shadow-sm">
                                        <AvatarImage src={singleJob?.company?.logo} />
                                        <AvatarFallback className="font-bold text-xl text-white" style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                                            {singleJob?.company?.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h1 className='font-bold text-2xl text-gray-900'>{singleJob?.title}</h1>
                                        <p className='text-gray-500 text-sm mt-1'>{singleJob?.company?.name}</p>
                                        <div className='flex items-center gap-1 text-xs text-gray-400 mt-1'>
                                            <MapPin size={12} /> {singleJob?.location}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={isApplied ? null : applyJobHandler}
                                    disabled={isApplied}
                                    className={`px-8 py-5 rounded-xl font-semibold ${isApplied ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'text-white'}`}
                                    style={!isApplied ? { background: "linear-gradient(135deg,#27bbd2,#6366f1)" } : {}}
                                >
                                    {isApplied ? 'Already Applied' : 'Apply Now'}
                                </Button>
                            </div>

                            <div className='flex items-center gap-2 flex-wrap mt-5'>
                                <Badge className='border-0 text-[#27bbd2]' style={{ background: "rgba(39,187,210,0.1)" }}>{singleJob?.position} Positions</Badge>
                                <Badge className='border-0 text-[#f59e0b]' style={{ background: "rgba(245,158,11,0.1)" }}>{singleJob?.jobtype}</Badge>
                                <Badge className='border-0 text-[#6366f1] flex items-center gap-1' style={{ background: "rgba(99,102,241,0.1)" }}>
                                    <IndianRupee size={11} />{singleJob?.salary} LPA
                                </Badge>
                            </div>
                        </div>

                        {/* Details Card */}
                        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
                            <h2 className='font-bold text-lg text-gray-800 mb-4 pb-3 border-b border-gray-100'>Job Details</h2>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
                                {[
                                    { icon: Briefcase, label: "Role", value: singleJob?.title },
                                    { icon: MapPin, label: "Location", value: singleJob?.location },
                                    { icon: Clock, label: "Experience", value: `${singleJob?.experienceLevel} yrs` },
                                    { icon: IndianRupee, label: "Salary", value: `${singleJob?.salary} LPA` },
                                    { icon: Users, label: "Applicants", value: singleJob?.applications?.length },
                                    { icon: Calendar, label: "Posted", value: singleJob?.createdAt?.split("T")[0] },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className='flex items-center gap-3 p-3 rounded-lg bg-gray-50'>
                                        <div className='bg-[#27bbd2]/10 p-2 rounded-full'>
                                            <Icon size={14} className='text-[#27bbd2]' />
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-400'>{label}</p>
                                            <p className='text-sm font-medium text-gray-800'>{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className='font-bold text-base text-gray-800 mb-2'>Description</h2>
                            <p className='text-sm text-gray-600 leading-relaxed'>{singleJob?.description}</p>

                            {singleJob?.requirements?.length > 0 && (
                                <>
                                    <h2 className='font-bold text-base text-gray-800 mt-5 mb-3'>Requirements</h2>
                                    <div className='flex flex-wrap gap-2'>
                                        {singleJob.requirements.map((req, i) => (
                                            <span key={i} className='bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full'>{req}</span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default JobDescription;
