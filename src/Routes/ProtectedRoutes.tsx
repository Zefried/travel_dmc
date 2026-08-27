import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import type { ReactNode } from "react";

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: ReactNode; // since we're wrapping other components
  allowedRoles?: string[];
}) => {
  const authContext = useContext(AuthContext);
  const role = authContext?.user?.role;

  // prevent flicker
  if (!authContext || authContext.isLoading) return null;

  // not logged in
  if (!authContext.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // role check
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>; // safe render
};