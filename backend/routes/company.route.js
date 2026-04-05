import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isRecruiter from "../middlewares/isRecruiter.js";
import { 
    getCompany,
    getCompanyById,
    registerCompany,
    updateCompany
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, isRecruiter, registerCompany);
router.route("/get").get(isAuthenticated, isRecruiter, getCompany); 
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, isRecruiter, singleUpload, updateCompany);

export default router;