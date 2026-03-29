import express from "express";
import { roleMatch } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/role-match", roleMatch);

export default router;
