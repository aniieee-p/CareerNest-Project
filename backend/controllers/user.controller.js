import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendResetEmail } from "../utils/mailer.js";

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
    const hasedPassword = await bcrypt.hash(password, 10);
    // note: typo in var name (hasedPassword) - keeping it consistent with rest of file

    let profilePhotoUrl = "";
    const file = req.file;
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    await User.create({
      fullname,
      email,
      phonenumber,
      password: hasedPassword,
      role,
      profile: {
        profilephoto: profilePhotoUrl,
      }
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
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

    //check role is correct or not
    if (role != user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
      role: user.role,
    };
    // jwt sign - 1 day expiry works fine for now
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
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
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "none", secure: true }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phonenumber, bio, skills } = req.body;
    const resumeFile = req.files?.file?.[0];
    const photoFile = req.files?.photo?.[0];

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req.id;
    let user = await User.findById(userId);
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
    if (skills) user.profile.skills = skillsArray;

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
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phonenumber,
      role: user.role,
      profile: user.profile,
    };
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No account found with that email", success: false });
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        try {
            await sendResetEmail({ email: user.email, resetUrl });
        } catch (mailError) {
            console.error("Failed to send reset email:", mailError.message);
            return res.status(500).json({ message: "Failed to send reset email. Please try again.", success: false });
        }

        return res.status(200).json({ message: "Password reset link sent to your email", success: true });
    } catch (error) {
        console.error("forgotPassword error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token", success: false });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const trackProfileView = async (req, res) => {
    try {
        const { id } = req.params;
        // don't count self-views
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
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

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

        return res.status(200).json({
            profileViews: user.profileViews || 0,
            jobMatches,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
