import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.id }).sort({ createdAt: -1 });
        return res.status(200).json({ notifications, success: true });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.id },
            { isRead: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ message: "Notification not found", success: false });
        return res.status(200).json({ notification, success: true });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.id, isRead: false }, { isRead: true });
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
