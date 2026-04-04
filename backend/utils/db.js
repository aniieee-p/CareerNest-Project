import mongoose from "mongoose";

// tried using mongoose.connect options before but wasnt needed
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
}

export default connectDB;
