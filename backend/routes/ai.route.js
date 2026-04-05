import express from "express";
import { roleMatch, parseResume, chat } from "../controllers/ai.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/chat", chat);
router.post("/role-match", roleMatch);
router.post("/parse-resume", isAuthenticated, singleUpload, parseResume);

export default router;
