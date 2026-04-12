import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isRecruiter from "../middlewares/isRecruiter.js";
import { PostJob , getAllJobs, getAdminJobs, getJobById, deleteJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, isRecruiter, PostJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, isRecruiter, getAdminJobs);

// Test route to debug
router.delete("/delete/:id", (req, res, next) => {
    console.log("DELETE route hit:", req.params.id, req.method, req.url);
    next();
}, isAuthenticated, isRecruiter, deleteJob);

router.route("/get/:id").get(isAuthenticated, getJobById);
  


export default router;
