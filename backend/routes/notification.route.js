import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/",              isAuthenticated, getNotifications);
router.patch("/:id/read",    isAuthenticated, markAsRead);
router.patch("/read-all",    isAuthenticated, markAllAsRead);

export default router;
