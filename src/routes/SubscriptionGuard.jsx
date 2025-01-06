import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SubscriptionGuard = ({ children }) => {
  const { user } = useAuth();
  if (user?.subscription && user?.subscription?.status !== "active") {
    return <Navigate to="/payment" />;
  }

  return children;
};

export default SubscriptionGuard;
