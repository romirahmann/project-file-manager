/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("userData");

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
