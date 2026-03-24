import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name:'application',
    initialState:{
        applicants:null,
    },
    reducers:{
        setAllApplicants:(state,action) => {
            state.applicants = action.payload;
        },
        updateApplicationStatus:(state, action) => {
            const { id, status } = action.payload;
            if (!state.applicants?.applications) return;
            state.applicants.applications = state.applicants.applications.map(app =>
                app._id === id ? { ...app, status: status.toLowerCase() } : app
            );
        }
    }
});
export const { setAllApplicants, updateApplicationStatus } = applicationSlice.actions;
export default applicationSlice.reducer;
