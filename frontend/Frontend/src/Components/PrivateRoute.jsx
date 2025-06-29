import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Not logged in → redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Logged in but not admin → redirect to homepage
    return <Navigate to="/" replace />;
  }

  // Access granted
  return children;
};

export default PrivateRoute;
