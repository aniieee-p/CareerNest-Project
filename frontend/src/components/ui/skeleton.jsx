import React from 'react'

const Skeleton = ({ className = "", width = "100%", height = "20px", animate = true, ...props }) => {
  return (
    <div
      className={`bg-linear-to-r from-slate-200 via-slate-50 to-slate-200 rounded ${
        animate ? 'animate-pulse' : ''
      } ${className}`}
      style={{
        width,
        height,
        backgroundSize: '200% 100%',
        animation: animate ? 'shimmer 1.5s ease-in-out infinite' : 'none',
        ...props.style
      }}
      {...props}
    />
  )
}

// Predefined skeleton components
const SkeletonJobCard = ({ className = "" }) => (
  <div className={`p-4 border rounded-lg bg-white space-y-3 ${className}`}>
    <Skeleton height="60px" className="rounded-md" />
    <Skeleton width="80%" height="16px" />
    <Skeleton width="60%" height="14px" />
    <Skeleton width="40%" height="12px" />
  </div>
)

const SkeletonJobListing = ({ className = "" }) => (
  <div className={`p-4 border rounded-lg bg-white space-y-2 ${className}`}>
    <Skeleton width="70%" height="18px" />
    <Skeleton width="50%" height="14px" />
    <Skeleton width="90%" height="12px" />
    <Skeleton width="30%" height="12px" />
  </div>
)

const SkeletonTableRow = ({ className = "" }) => (
  <div className={`p-4 border-b bg-white flex items-center space-x-4 ${className}`}>
    <Skeleton width="20%" height="14px" />
    <Skeleton width="25%" height="14px" />
    <Skeleton width="15%" height="14px" />
    <Skeleton width="20%" height="14px" />
  </div>
)

const SkeletonLatestJobs = ({ className = "" }) => (
  <div className={`p-6 border rounded-lg bg-white space-y-4 ${className}`}>
    <Skeleton width="60%" height="24px" />
    <Skeleton height="180px" className="rounded-md" />
    <Skeleton width="40%" height="16px" />
  </div>
)

export { Skeleton, SkeletonJobCard, SkeletonJobListing, SkeletonTableRow, SkeletonLatestJobs }