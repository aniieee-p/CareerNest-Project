const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const USER_API_END_POINT        = `${BASE}/user`;
export const JOB_API_END_POINT         = `${BASE}/job`;
export const APPLICATION_API_END_POINT = `${BASE}/application`;
export const COMPANY_API_END_POINT     = `${BASE}/company`;
export const CONTACT_API_END_POINT     = `${BASE}/contact`;
export const AI_API_END_POINT          = `${BASE}/ai`;
export const PROFILE_STATS_API         = `${BASE}/user/profile/stats`;
export const PROFILE_VIEW_API          = `${BASE}/user/profile/view`;
export const SAVED_JOBS_API            = `${BASE}/user/saved-jobs`;
export const AI_PARSE_RESUME_API       = `${BASE}/ai/parse-resume`;
