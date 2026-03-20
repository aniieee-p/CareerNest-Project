import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    getCompany,       // Updated to match controller
    getCompanyById,
    registerCompany,   // Updated to match controller
    updateCompany     // Updated to match controller
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany); 
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated,singleUpload, updateCompany);

export default router;