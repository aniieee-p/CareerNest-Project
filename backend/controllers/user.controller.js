import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendResetEmail } from "../utils/mailer.js";

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { fullname, email, phonenumber, password, role } = req.body;

    if (!fullname || !email || !phonenumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePhotoUrl = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    await User.create({
      fullname,
      email,
      phonenumber,
      password: hashedPassword,
      role,
      profile: {
        profilephoto: profilePhotoUrl,
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password, role, rememberMe } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // safe user object
    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phonenumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/", // 🔥 IMPORTANT
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: safeUser,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ================= LOGOUT =================
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        secure: true,
        sameSite: "None", // 🔥 FIXED
        path: "/",
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phonenumber, bio, skills } = req.body;

    const resumeFile = req.files?.file?.[0];
    const photoFile = req.files?.photo?.[0];

    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phonenumber) user.phonenumber = phonenumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");

    if (resumeFile) {
      const fileUri = getDataUri(resumeFile);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "raw",
        folder: "resumes",
      });
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = resumeFile.originalname;
    }

    if (photoFile) {
      const fileUri = getDataUri(photoFile);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.profilephoto = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "No account found with that email", success: false });

        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        try {
            await sendResetEmail({ email: user.email, resetUrl });
        } catch (mailError) {
            return res.status(500).json({ message: "Failed to send reset email. Please try again.", success: false });
        }
        return res.status(200).json({ message: "Password reset link sent to your email", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ message: "Invalid or expired reset token", success: false });

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// ================= TRACK PROFILE VIEW =================
export const trackProfileView = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.id === id) {
            const user = await User.findById(id).select("profileViews");
            return res.status(200).json({ profileViews: user?.profileViews || 0, success: true });
        }
        const user = await User.findByIdAndUpdate(
            id,
            { $inc: { profileViews: 1 } },
            { new: true }
        ).select("profileViews");
        if (!user) return res.status(404).json({ message: "User not found", success: false });
        return res.status(200).json({ profileViews: user.profileViews, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// ================= GET PROFILE STATS =================
export const getProfileStats = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("profileViews profile.skills");
        if (!user) return res.status(404).json({ message: "User not found", success: false });

        const { Job } = await import("../models/job.model.js");
        const skills = user.profile?.skills || [];
        let jobMatches = 0;
        if (skills.length > 0) {
            jobMatches = await Job.countDocuments({
                requirements: { $in: skills.map(s => new RegExp(s, "i")) }
            });
        }
        return res.status(200).json({ profileViews: user.profileViews || 0, jobMatches, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// ================= GET PUBLIC PROFILE =================
export const getPublicProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select(
            "fullname email phonenumber role profile profileViews createdAt"
        );
        if (!user) return res.status(404).json({ message: "User not found", success: false });
        return res.status(200).json({ user, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};
