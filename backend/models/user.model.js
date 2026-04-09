import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phonenumber: {
        type: Number,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'hybrid'],
        default: 'local'
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    profile:{
        bio: {type: String},
        skills: [{type: String}],
        resume: {type: String},
        resumeOriginalName: {type: String},
        Company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
        profilephoto: {
            default: "",
            type: String
        }
    },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
    profileViews: { type: Number, default: 0 },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;




