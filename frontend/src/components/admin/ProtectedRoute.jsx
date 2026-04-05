import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth ?? {});

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Wrong role (not recruiter)
  if (user.role !== "recruiter") {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;