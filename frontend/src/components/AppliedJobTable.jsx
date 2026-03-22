import React from "react";
import { useSelector } from "react-redux";
import { Briefcase, Building2, Calendar } from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", bg: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "rgba(245,158,11,0.3)" },
  accepted: { label: "Accepted", bg: "rgba(16,185,129,0.1)", color: "#10b981", border: "rgba(16,185,129,0.3)" },
  rejected: { label: "Rejected", bg: "rgba(239,68,68,0.1)", color: "#ef4444", border: "rgba(239,68,68,0.3)" },
};

const AppliedJobTable = () => {
  const { allAppliedJobs = [] } = useSelector((store) => store.job);

  if (allAppliedJobs.length === 0) {
    return (
      <div className="text-center py-10">
        <Briefcase size={32} className="text-[#27bbd2] mx-auto mb-2 opacity-40" />
        <p className="text-sm text-[#94a3b8]">No applications yet</p>
        <p className="text-xs text-[#94a3b8] mt-1">Start applying to jobs to track them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allAppliedJobs.map((appliedJob) => {
        const status = appliedJob?.status?.toLowerCase() || "pending";
        const cfg = statusConfig[status] || statusConfig.pending;
        return (
          <div
            key={appliedJob._id}
            className="flex items-center justify-between p-4 rounded-xl transition-all"
            style={{
              background: "rgba(248,250,252,0.8)",
              border: "1px solid rgba(39,187,210,0.1)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
              >
                {appliedJob.job?.company?.name?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{appliedJob.job?.title || "—"}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-[#94a3b8] flex items-center gap-1">
                    <Building2 size={10} /> {appliedJob.job?.company?.name || "—"}
                  </span>
                  <span className="text-xs text-[#94a3b8] flex items-center gap-1">
                    <Calendar size={10} /> {appliedJob?.createdAt?.split("T")[0]}
                  </span>
                </div>
              </div>
            </div>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
            >
              {cfg.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AppliedJobTable;
