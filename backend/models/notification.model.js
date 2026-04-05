import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message:   { type: String, required: true },
    type:      { type: String, enum: ["job", "application", "system"], default: "system" },
    jobId:     { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null },
    isRead:    { type: Boolean, default: false },
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);
