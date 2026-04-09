import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({ message: "Job id is required.", success: false });
        }
        if (req.role !== "student") {
            return res.status(403).json({ message: "Only students can apply for jobs.", success: false });
        }
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if(existingApplication){
            return res.status(400).json({ message: "You have already applied for this job.", success: false });
        }
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({ message: "Job not found.", success: false });
        }
        const application = await Application.create({ job: jobId, applicant: userId });
        job.applications.push(application._id);
        await job.save();
        // notify applicant
        await Notification.create({
            userId: userId,
            message: `Your application for "${job.title}" was submitted successfully.`,
            type: "application",
            jobId: job._id,
        });
        return res.status(201).json({ message: "Application submitted successfully.", success: true, application });
    } catch (error) {
        console.error(error.message);
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            populate: { path: 'company' }
        });
        if(!applications){
            return res.status(404).json({ message: "No applications found.", success: false });
        }
        return res.status(200).json({ message: "Applied jobs retrieved successfully.", success: true, applications });
    } catch (error) {
        console.error(error.message);
    }
};

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: { path: 'applicant' }
        });
        if(!job){
            return res.status(404).json({ message: "Job not found.", success: false });
        }
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error(error.message);
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({ message: "Status is required.", success: false });
        }
        const application = await Application.findOne({ _id: applicationId });
        if(!application){
            return res.status(404).json({ message: "Application not found.", success: false });
        }
        application.status = status.toLowerCase();
        await application.save();
        // notify applicant about status change
        const populated = await application.populate({ path: "job", select: "title" });
        const statusMsg = {
            accepted: `Congratulations! Your application for "${populated.job?.title}" was accepted.`,
            rejected: `Your application for "${populated.job?.title}" was not selected this time.`,
            shortlisted: `You've been shortlisted for "${populated.job?.title}". Stay tuned!`,
        };
        const msg = statusMsg[status.toLowerCase()] || `Your application status was updated to "${status}".`;
        await Notification.create({ userId: application.applicant, message: msg, type: "application", jobId: populated.job?._id });
        return res.status(200).json({ message: "Application status updated successfully.", success: true });
    } catch (error) {
        console.error(error.message);
    }
};
