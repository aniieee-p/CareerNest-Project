import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold">
        <span className="text-[#27bbd2]">Explore </span> Latest Job
        Opportunities
      </h1>
      <div className="grid grid-cols-3 gap-4 my-5">
        {allJobs.length <= 0 ? (
          <span>No Jobs Available Right Now</span>
        ) : (
          allJobs
            ?.slice(0, 6)
            .map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
