import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";
import User from "../models/user.model.js";

// admin posts a job
export const PostJob = async (req, res) => {
    try {
        if (req.role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can post jobs.", success: false });
        }
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        // TODO: add better validation later
        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({
                message: "Something is missing.",
                 success: false
            })
         };
         const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobtype: jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
         });
        // fire-and-forget: notify all students about new job
        User.find({ role: "student" }).select("_id").lean().then(students => {
            const notes = students.map(s => ({
                userId: s._id,
                message: `New job posted: "${title}" in ${location}.`,
                type: "job",
                jobId: job._id,
            }));
            if (notes.length) Notification.insertMany(notes).catch(() => {});
        }).catch(() => {});
        return res.status(201).json({
            message: "Job posted successfully.",
            success: true,
            job
        });
    } catch (error) {
        console.error("job controller error:", error.message);
        return res.status(500).json({ message: "Server error", success: false });
    }
}
export const getAllJobs = async (req, res) => {
    try{
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if(!jobs){
            return res.status(404).json({
            message: "No jobs found.",
            success: false
            })  
        }
        // console.log("jobs fetched:", jobs.length) // debug
        return res.status(200).json({
            jobs,
            success: true,
        })
    } catch (error) {
    console.error(error.message);        
    }
}
// student can apply for a job
export const getJobById = async (req, res) => {
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if(!job){
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        };
        return res.status(200).json({
            job,
            success: true
        });
    }   catch (error) {
        console.error(error.message);
    }
}
// how many jobs has been created by a admin
export const getAdminJobs = async (req, res) => {
    try {
        if (req.role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can access admin jobs.", success: false });
        }
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({ path: "company" }).sort({ createdAt: -1 });
        if(!jobs){
           return res.status(404).json({
              message: "No jobs found.",
              success: false
            })       
        };
        return res.status(200).json({
            jobs,
            success: true
        });  

    } catch (error) {
        console.error(error.message);
    }

}  

// delete a job (recruiter only)
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        console.log("Delete job request:", { jobId, userId, role: req.role }); // Debug log

        // Validate jobId
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            });
        }

        // Find the job and check if it exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        console.log("Job found:", { jobId: job._id, createdBy: job.created_by, userId }); // Debug log

        // Check if the logged-in recruiter owns this job
        if (job.created_by.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You can only delete jobs you created.",
                success: false
            });
        }

        // Delete the job
        await Job.findByIdAndDelete(jobId);

        console.log("Job deleted successfully:", jobId); // Debug log

        return res.status(200).json({
            message: "Job deleted successfully.",
            success: true
        });

    } catch (error) {
        console.error("Delete job error:", error.message);
        console.error("Full error:", error); // More detailed error logging
        return res.status(500).json({ 
            message: "Server error", 
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
