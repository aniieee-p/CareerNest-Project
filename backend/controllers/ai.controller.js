export const roleMatch = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Answers are required."
      });
    }

    // No AI logic for now
    return res.status(200).json({
      success: true,
      roles: []
    });

  } catch (error) {
    console.error("Role match error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};