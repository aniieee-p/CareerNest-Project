import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, Calendar, ArrowRight } from "lucide-react";

const statusConfig = {
  pending:  { label: "Pending",  bg: "rgba(245,158,11,0.1)",  color: "#f59e0b", border: "rgba(245,158,11,0.3)"  },
  accepted: { label: "Accepted", bg: "rgba(16,185,129,0.1)",  color: "#10b981", border: "rgba(16,185,129,0.3)"  },
  rejected: { label: "Rejected", bg: "rgba(239,68,68,0.1)",   color: "#ef4444", border: "rgba(239,68,68,0.3)"   },
};

const RECENT_LIMIT = 5;

const AppliedJobTable = () => {
  const { allAppliedJobs = [] } = useSelector((store) => store.job);
  const navigate = useNavigate();

  const valid = allAppliedJobs.filter(a => a?.job);

  if (valid.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase size={32} className="text-[#27bbd2] mx-auto mb-3 opacity-40" />
        <p className="text-sm font-medium" style={{ color: "var(--cn-text-2)" }}>No applications yet</p>
        <p className="text-xs mt-1" style={{ color: "var(--cn-text-3)" }}>Start applying to jobs to track them here</p>
        <button
          onClick={() => navigate("/jobs")}
          className="mt-4 text-xs font-semibold text-[#27bbd2] hover:underline"
        >
          Browse Jobs →
        </button>
      </div>
    );
  }

  const recent = valid.slice(0, RECENT_LIMIT);
  const hasMore = valid.length > RECENT_LIMIT;

  return (
    <div className="flex flex-col gap-2">
      {recent.map((appliedJob) => {
        const status = appliedJob?.status?.toLowerCase() || "pending";
        const cfg    = statusConfig[status] || statusConfig.pending;
        const jobId  = appliedJob.job?._id;

        return (
          <div
            key={appliedJob._id}
            onClick={() => jobId && navigate(`/description/${jobId}`)}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-4 rounded-xl transition-all group"
            style={{
              background: "var(--cn-stat-bg)",
              border: "1px solid var(--cn-border)",
              cursor: jobId ? "pointer" : "default",
            }}
            onMouseEnter={e => { if (jobId) e.currentTarget.style.borderColor = "rgba(39,187,210,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--cn-border)"; }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
              >
                {appliedJob.job?.company?.name?.charAt(0) || "?"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--cn-text-1)" }}>
                  {appliedJob.job?.title || "—"}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 mt-0.5 flex-wrap">
                  <span className="text-xs flex items-center gap-1" style={{ color: "var(--cn-text-3)" }}>
                    <Building2 size={10} /> {appliedJob.job?.company?.name || "—"}
                  </span>
                  <span className="text-xs flex items-center gap-1" style={{ color: "var(--cn-text-3)" }}>
                    <Calendar size={10} /> {appliedJob?.createdAt?.split("T")[0]}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 sm:ml-3 self-end sm:self-auto">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
              >
                {cfg.label}
              </span>
              {jobId && (
                <ArrowRight
                  size={13}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[#27bbd2]"
                />
              )}
            </div>
          </div>
        );
      })}

      {/* View all link */}
      {hasMore && (
        <button
          onClick={() => navigate("/jobs")}
          className="mt-1 text-xs font-semibold text-[#27bbd2] hover:underline self-end"
        >
          +{valid.length - RECENT_LIMIT} more · View all →
        </button>
      )}
    </div>
  );
};

export default AppliedJobTable;
