import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="flex-1 p-6">
      <Box sx={{ position: "relative", minHeight: "100vh", padding: "2rem" }}>
        {user?.subscription?.status === "active" && (
          <Box
            sx={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "#FFD700",
              color: "#000",
              padding: "0.25rem 0.5rem",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Pro
          </Box>
        )}
        {children}
      </Box>
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
      <p className="mt-4">Use the sidebar to navigate through the app.</p>
    </div>
  );
};

export default Dashboard;
