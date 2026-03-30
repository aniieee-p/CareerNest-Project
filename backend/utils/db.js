import mongoose from "mongoose";

// tried using mongoose.connect options before but wasnt needed
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); 
        console.log("Mongodb connected");
    } catch (error) {
        console.log("db error:", error);
    }
}

export default connectDB;
