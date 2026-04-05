import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance'; // ✅ use interceptor
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import { MapPin, Briefcase, IndianRupee, Users, Calendar, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job ?? {});
    const { user } = useSelector(store => store.auth ?? {});
    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [applyLoading, setApplyLoading] = useState(false); // ✅ new

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ✅ APPLY JOB FIXED
    const applyJobHandler = async () => {
        try {
            setApplyLoading(true);

            const res = await axiosInstance.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`
            );

            if (res.data.success) {
                setIsApplied(true);

                dispatch(setSingleJob({
                    ...singleJob,
                    applications: [
                        ...singleJob.applications,
                        { applicant: user?._id }
                    ]
                }));

                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to apply"
            );
        } finally {
            setApplyLoading(false);
        }
    };

    useEffect(() => {
        dispatch(setSingleJob(null));
        setLoading(true);

        const fetchSingleJob = async () => {
            try {
                const res = await axiosInstance.get(
                    `${JOB_API_END_POINT}/get/${jobId}`
                );

                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));

                    setIsApplied(
                        res.data.job.applications.some(
                            a => a.applicant === user?._id
                        )
                    );
                }
            } catch (error) {
                toast.error("Failed to load job");
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

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className='flex items-center gap-1 text-sm mb-6'
                >
                    <ArrowLeft size={16} /> Back to Jobs
                </button>

                {loading ? (
                    <div className='flex justify-center py-32'>
                        <Loader2 size={32} className='animate-spin' />
                    </div>
                ) : (
                    <>
                        {/* HEADER */}
                        <div className='border p-6 mb-6 rounded-xl'>

                            <div className='flex justify-between flex-wrap gap-4'>

                                <div>
                                    <h1 className='text-2xl font-bold'>
                                        {singleJob?.title}
                                    </h1>
                                    <p>{singleJob?.company?.name}</p>
                                </div>

                                {/* ✅ APPLY BUTTON FIX */}
                                {user?.role !== 'recruiter' && (
                                    <Button
                                        onClick={applyJobHandler}
                                        disabled={isApplied || applyLoading}
                                    >
                                        {applyLoading
                                            ? "Applying..."
                                            : isApplied
                                            ? "Already Applied"
                                            : "Apply Now"}
                                    </Button>
                                )}

                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default JobDescription;