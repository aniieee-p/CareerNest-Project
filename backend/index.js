import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './utils/db.js';

import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js';
import jobRoute from './routes/job.route.js';
import applicationRoute from './routes/application.route.js';
import contactRoute from './routes/contact.route.js';
import aiRoute from './routes/ai.route.js';

const app = express();

// trust proxy (important for cookies on Render)
app.set("trust proxy", 1);

// CORS configuration
const allowedOrigins = [
  "https://careernest-anisha.netlify.app",
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/ai", aiRoute);

// health check
app.get("/", (req, res) => {
  res.send("API is running");
});

// PORT
const PORT = process.env.PORT || 3000;

// connect DB then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("DB connection failed, server not started:", error);
  });