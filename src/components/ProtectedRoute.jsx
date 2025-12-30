import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
}

export default ProtectedRoute;
