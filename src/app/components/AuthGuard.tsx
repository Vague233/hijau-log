import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../lib/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
