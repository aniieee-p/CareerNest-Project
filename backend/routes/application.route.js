import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isRecruiter from '../middlewares/isRecruiter.js';
import { applyJob, getAppliedJobs, getApplicants, updateStatus } from '../controllers/application.controller.js';

const router = express.Router();

router.route('/apply/:id').get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, isRecruiter, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, isRecruiter, updateStatus);

export default router;