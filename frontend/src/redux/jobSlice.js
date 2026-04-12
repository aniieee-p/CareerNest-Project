import { createSlice } from "@reduxjs/toolkit";

// job related state - might split this into separate slices later
const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null, 
        searchJobByText:"",
        allAppliedJobs:[],
        searchedQuery:"",
        savedJobs:[],
        loading: false,
        adminJobsLoading: false,
    },
    reducers:{
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        },
        toggleSaveJob:(state, action) => {
            const job = action.payload;
            if (!state.savedJobs) state.savedJobs = [];
            const exists = state.savedJobs.some(j => j._id === job._id);
            if (exists) {
                state.savedJobs = state.savedJobs.filter(j => j._id !== job._id);
            } else {
                state.savedJobs.push(job);
            }
        },
        setSavedJobs:(state, action) => {
            state.savedJobs = action.payload;
        },
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setAdminJobsLoading:(state, action) => {
            state.adminJobsLoading = action.payload;
        },
        removeJob:(state, action) => {
            const jobId = action.payload;
            state.allAdminJobs = state.allAdminJobs.filter(job => job._id !== jobId);
            state.allJobs = state.allJobs.filter(job => job._id !== jobId);
        }
    }
});
export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery,
    toggleSaveJob,
    setSavedJobs,
    setLoading,
    setAdminJobsLoading,
    removeJob,
} = jobSlice.actions;
export default jobSlice.reducer;
