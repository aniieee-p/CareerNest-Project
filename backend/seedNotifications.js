/**
 * Seed dummy notifications for testing.
 * Usage: node backend/seedNotifications.js <userId>
 * Example: node backend/seedNotifications.js 664abc123def456789012345
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { Notification } from './models/notification.model.js';
import connectDB from './utils/db.js';

const userId = process.argv[2];
if (!userId) { console.error("Usage: node seedNotifications.js <userId>"); process.exit(1); }

const samples = [
    { message: "New job posted in your field: Frontend Developer at TechCorp.", type: "job" },
    { message: "Your application was shortlisted for Backend Engineer at Infosys.", type: "application" },
    { message: "A new job matching your skills was posted in Bangalore.", type: "job" },
    { message: "Your profile was viewed by a recruiter.", type: "system" },
    { message: "Congratulations! Your application for UI/UX Designer was accepted.", type: "application" },
];

await connectDB();
await Notification.insertMany(samples.map(s => ({ ...s, userId })));
console.log(`✅ Inserted ${samples.length} notifications for user ${userId}`);
await mongoose.disconnect();
