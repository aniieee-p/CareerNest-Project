import { Job } from "../models/job.model.js";

// admin posts a job
export const PostJob = async (req, res) => {
    try {
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
        return res.status(201).json({
            message: "Job posted successfully.",
            success: true,
            job
        });
    } catch (error) {
        console.log(error);
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
    console.log(error);        
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
        console.log(error);
    }
}
// how many jobs has been created by a admin
export const getAdminJobs = async (req, res) => {
    try {
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
        console.log(error);
    }

}  