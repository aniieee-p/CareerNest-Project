import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendResetEmail } from "../utils/mailer.js";

const googleClient = new OAuth2Client();
const GOOGLE_ONLY_MESSAGE = "This account uses Google sign-in. Please continue with Google.";
const GOOGLE_SIGNUP_REQUIRED_MESSAGE =
  "No account found with this Google email. Please complete sign up first.";

const createAuthToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );

const buildSafeUser = (user) => ({
  _id: user._id,
  fullname: user.fullname,
  email: user.email,
  phoneNumber: user.phonenumber ?? null,
  role: user.role,
  profile: user.profile,
  authProvider: user.authProvider || "local",
});

const sendAuthResponse = (res, user, message) => {
  const token = createAuthToken(user);

  return res.status(200).json({
    message,
    user: buildSafeUser(user),
    token,
    success: true,
  });
};

const isGoogleClientConfigured = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  return Boolean(clientId && clientId !== "your_google_web_client_id");
};

const buildGoogleSignupData = (payload, role) => ({
  fullname: payload.name?.trim() || payload.email?.split("@")[0] || "",
  email: payload.email?.toLowerCase().trim() || "",
  role,
  profilePhoto: payload.picture || "",
});

const syncGoogleIdentity = async (user, payload) => {
  if (user.googleId && user.googleId !== payload.sub) {
    const error = new Error("GOOGLE_ACCOUNT_MISMATCH");
    error.code = "GOOGLE_ACCOUNT_MISMATCH";
    throw error;
  }

  user.googleId = payload.sub;
  user.profile = user.profile || {};

  if (!user.profile.profilePhoto && payload.picture) {
    user.profile.profilePhoto = payload.picture;
  }

  user.authProvider = user.password ? "hybrid" : "google";
  await user.save();

  return user;
};

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { fullname, email, phonenumber, password, role } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!fullname || !email || !phonenumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
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
      email: normalizedEmail,
      phonenumber,
      password: hashedPassword,
      role,
      authProvider: "local",
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: GOOGLE_ONLY_MESSAGE,
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

    return sendAuthResponse(res, user, `Welcome back ${user.fullname}`);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ================= GOOGLE AUTH =================
export const googleAuth = async (req, res) => {
  try {
    const { credential, role, intent = "login", phonenumber, password, fullname } = req.body;

    if (!credential || !role) {
      return res.status(400).json({
        message: "Google credential and role are required",
        success: false,
      });
    }

    if (!["login", "signup"].includes(intent)) {
      return res.status(400).json({
        message: "Invalid Google auth intent",
        success: false,
      });
    }

    if (!isGoogleClientConfigured()) {
      return res.status(500).json({
        message: "Google auth is not configured on the server",
        success: false,
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase().trim();

    if (!payload?.sub || !email || !payload.email_verified) {
      return res.status(400).json({
        message: "Unable to verify your Google account",
        success: false,
      });
    }

    let user = await User.findOne({ email });

    if (user && user.role !== role) {
      return res.status(400).json({
        message: "An account with this email already exists under a different role.",
        success: false,
      });
    }

    if (intent === "login") {
      if (!user) {
        return res.status(404).json({
          message: GOOGLE_SIGNUP_REQUIRED_MESSAGE,
          requiresRegistration: true,
          signupData: buildGoogleSignupData(payload, role),
          success: false,
        });
      }

      user = await syncGoogleIdentity(user, payload);

      return sendAuthResponse(res, user, `Welcome back ${user.fullname}`);
    }

    if (user) {
      user = await syncGoogleIdentity(user, payload);
      return sendAuthResponse(res, user, `Welcome back ${user.fullname}`);
    }

    if (!phonenumber) {
      return res.status(400).json({
        message: "Phone number is required to complete Google sign up",
        success: false,
      });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    user = await User.create({
      fullname: fullname?.trim() || payload.name?.trim() || email.split("@")[0],
      email,
      phonenumber,
      password: hashedPassword,
      role,
      authProvider: hashedPassword ? "hybrid" : "google",
      googleId: payload.sub,
      profile: {
        profilePhoto: payload.picture || "",
      },
    });

    return sendAuthResponse(
      res,
      user,
      `Welcome to CareerNest, ${user.fullname}`
    );
  } catch (error) {
    if (error.code === "GOOGLE_ACCOUNT_MISMATCH") {
      return res.status(400).json({
        message: "This email is already linked to a different Google account.",
        success: false,
      });
    }

    console.error(error.message);
    return res.status(500).json({
      message: "Google sign-in failed",
      success: false,
    });
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
    console.error(error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phonenumber, bio, skills, removePhoto, removeResume } = req.body;

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
    if (email) user.email = email.toLowerCase().trim();
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

    if (removeResume === "true" && !resumeFile) {
      user.profile.resume = "";
      user.profile.resumeOriginalName = "";
    }

    if (removePhoto === "true" && !photoFile) {
      user.profile.profilePhoto = "";
    }

    if (photoFile) {
      const fileUri = getDataUri(photoFile);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.profilePhoto = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: buildSafeUser(user),
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate email input
        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        const normalizedEmail = email?.toLowerCase().trim();
        
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: "No account found with that email", success: false });
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        // Validate FRONTEND_URL environment variable
        if (!process.env.FRONTEND_URL) {
            return res.status(500).json({ 
                message: "Server configuration error. Please contact support.", 
                success: false 
            });
        }

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        // Send email with extended timeout for Render cold starts
        const emailPromise = sendResetEmail({ email: user.email, resetUrl });
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Email service timeout - server may be starting up')), 30000)
        );

        try {
            await Promise.race([emailPromise, timeoutPromise]);
            
            return res.status(200).json({ 
                message: "Password reset link sent to your email", 
                success: true 
            });
        } catch (mailError) {
            // Clean up the reset token since email failed
            try {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpiry = undefined;
                await user.save();
                console.log("Reset token cleaned up after email failure");
            } catch (cleanupError) {
                console.error("Failed to cleanup reset token:", cleanupError);
            }
            
            // Check if it's a timeout error
            if (mailError.message.includes('timeout')) {
                return res.status(408).json({ 
                    message: "Server is starting up, please wait 30 seconds and try again.", 
                    success: false 
                });
            }
            
            // Check for authentication errors
            if (mailError.code === 'EAUTH' || mailError.responseCode === 535) {
                return res.status(503).json({ 
                    message: "Email service configuration error. Please contact support.", 
                    success: false 
                });
            }
            
            // Check for specific SMTP errors
            if (mailError.code === 'ECONNECTION' || mailError.code === 'ETIMEDOUT') {
                return res.status(503).json({ 
                    message: "Email service is temporarily unavailable. Please try again later.", 
                    success: false 
                });
            }
            
            // Check for missing environment variables
            if (mailError.message.includes('EMAIL_USER') || mailError.message.includes('EMAIL_PASS')) {
                console.error("Missing email configuration environment variables");
                return res.status(503).json({ 
                    message: "Email service is not properly configured. Please contact support.", 
                    success: false 
                });
            }
            
            return res.status(500).json({ 
                message: "Failed to send reset email. Please try again.", 
                success: false,
                error: process.env.NODE_ENV === 'development' ? mailError.message : undefined
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            message: "Server error", 
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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
        user.authProvider = user.googleId ? "hybrid" : "local";
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        user.markModified('password');
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

// ================= SAVED JOBS =================
export const toggleSavedJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const user = await User.findById(req.id);
        if (!user) return res.status(404).json({ message: "User not found", success: false });

        const index = user.savedJobs.indexOf(jobId);
        if (index === -1) {
            user.savedJobs.push(jobId);
        } else {
            user.savedJobs.splice(index, 1);
        }
        await user.save();
        return res.status(200).json({ savedJobs: user.savedJobs, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.id).populate({
            path: "savedJobs",
            populate: { path: "company" },
        });
        if (!user) return res.status(404).json({ message: "User not found", success: false });
        return res.status(200).json({ savedJobs: user.savedJobs, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};
