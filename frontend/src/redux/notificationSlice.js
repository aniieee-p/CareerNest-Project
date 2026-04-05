import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: { notifications: [] },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        markOneRead: (state, action) => {
            const n = state.notifications.find(n => n._id === action.payload);
            if (n) n.isRead = true;
        },
        markAllRead: (state) => {
            state.notifications.forEach(n => { n.isRead = true; });
        },
    },
});

export const { setNotifications, markOneRead, markAllRead } = notificationSlice.actions;
export default notificationSlice.reducer;
