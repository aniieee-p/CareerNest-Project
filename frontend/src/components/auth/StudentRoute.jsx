import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const StudentRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth ?? {});

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Wrong role (not student)
  if (user.role !== "student") {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
};

export default StudentRoute;