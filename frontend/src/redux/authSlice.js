import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
        },
        resetAuth: () => initialState,
    }
});
export const { setLoading, setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
