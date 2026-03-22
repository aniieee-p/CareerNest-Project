import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phonenumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
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
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;




