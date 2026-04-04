import { singleUpload, multiUpload } from "../middlewares/multer.js";
import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  forgotPassword,
  resetPassword,
  trackProfileView,
  getProfileStats,
  getPublicProfile,
  toggleSavedJob,
  getSavedJobs,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, multiUpload, updateProfile);
router.route("/profile/stats").get(isAuthenticated, getProfileStats);
router.route("/profile/view/:id").post(isAuthenticated, trackProfileView);
router.route("/profile/:id").get(isAuthenticated, getPublicProfile);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/saved-jobs").get(isAuthenticated, getSavedJobs);
router.route("/saved-jobs/:jobId").post(isAuthenticated, toggleSavedJob);

export default router;
