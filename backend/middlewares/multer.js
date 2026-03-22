import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");
export const multiUpload = multer({storage}).fields([
    { name: "file", maxCount: 1 },
    { name: "photo", maxCount: 1 }
]);
