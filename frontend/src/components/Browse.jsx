import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

// const randomJobs = [1, 2,45];

const Browse = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => { dispatch(setSearchedQuery("")); }
    }, [])

    const filteredJobs = searchedQuery
        ? allJobs.filter(job => {
            const q = searchedQuery.toLowerCase();
            const reqs = Array.isArray(job.requirements)
                ? job.requirements.join(" ").toLowerCase()
                : (job.requirements || "").toLowerCase();
            return (
                job.title?.toLowerCase().includes(q) ||
                job.description?.toLowerCase().includes(q) ||
                job.location?.toLowerCase().includes(q) ||
                reqs.includes(q)
            );
          })
        : allJobs;

    return (
        <div className="min-h-screen" style={{ background: "var(--cn-page)" }}>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <h1 className='font-bold text-xl my-10' style={{ color: "var(--cn-text-1)" }}>
                    {searchedQuery ? `Results for "${searchedQuery}"` : "All Jobs"} ({filteredJobs.length})
                </h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredJobs.map((job) => (
                        <Job key={job._id} job={job} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Browse
