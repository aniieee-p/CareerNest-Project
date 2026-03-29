import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js';
import jobRoute from './routes/job.route.js';
import applicationRoute from './routes/application.route.js';
import contactRoute from './routes/contact.route.js';
import aiRoute from './routes/ai.route.js';

dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

app.get("/home", (req, res) => {    
    return res.status(200).json({
        message: "Os coming from backend!",
        success: true
    }) 
});

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/ai", aiRoute);



app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})
