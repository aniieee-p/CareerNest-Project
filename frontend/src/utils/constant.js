const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const USER_API_END_POINT        = `${BASE}/user`;
export const JOB_API_END_POINT         = `${BASE}/job`;
export const APPLICATION_API_END_POINT = `${BASE}/application`;
export const COMPANY_API_END_POINT     = `${BASE}/company`;
export const CONTACT_API_END_POINT     = `${BASE}/contact`;
export const AI_API_END_POINT         = `${BASE}/ai`;
