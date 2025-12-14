import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { ROUTES } from "../constants";
import { Loading } from "./ui";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

