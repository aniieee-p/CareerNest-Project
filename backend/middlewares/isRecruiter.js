const isRecruiter = (req, res, next) => {
  if (req.role !== "recruiter") {
    return res.status(403).json({ message: "Access denied. Recruiters only.", success: false });
  }
  next();
};

export default isRecruiter;
