import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/userContext";
import LoadingAnimation from "./loadingAnimation";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useUser();
  const location = useLocation();

  if (loading) return <LoadingAnimation message="Checking your account..." fullScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}
