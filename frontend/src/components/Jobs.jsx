import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from "./FilterCard";
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.salary.toString().includes(searchedQuery)
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div style={{ background: "linear-gradient(160deg,#f0f9ff 0%,#fefce8 50%,#eef2ff 100%)", minHeight: "100vh" }}>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-6 px-4 pb-10'>
                <div className='flex gap-5'>
                    <div className='w-[22%] shrink-0'>
                        <FilterCard />
                    </div>
                    {filterJobs.length <= 0 ? (
                        <div className='flex-1 flex items-center justify-center'>
                            <div className='text-center py-20'>
                                <p className='text-4xl mb-3'>🔍</p>
                                <p className='text-gray-500 font-medium'>No jobs found</p>
                                <p className='text-gray-400 text-sm mt-1'>Try adjusting your filters</p>
                            </div>
                        </div>
                    ) : (
                        <div className='flex-1 h-[88vh] overflow-y-auto pb-5 pr-1'>
                            <p className='text-sm text-gray-400 mb-4'>{filterJobs.length} job{filterJobs.length !== 1 ? 's' : ''} found</p>
                            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
                                {filterJobs.map((job) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.25 }}
                                        key={job?._id}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Jobs
