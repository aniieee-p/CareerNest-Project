import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { PostJob , getAllJobs, getAdminJobs, getJobById } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, PostJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
  


export default router;
