import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Chip,
  useTheme,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getMenuItems } from "../utils/menuItems";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const theme = useTheme();

  const isProUser = user?.subscription?.status === "active";
  const isAdmin = user?.role === "admin";

  const menuItems = getMenuItems(isProUser, isAdmin);

  return (
    <Box
      sx={{
        width: "240px",
        height: "100vh",
        background: theme.palette.primary.main,
        color: "#FFFFFF",
        display: { xs: "none", md: "block" },
        position: "fixed",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          padding: "1rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
          Welcome, {user?.username || "Guest"}
        </Typography>
        {user?.subscription?.status === "active" ? (
          <Chip
            label="Pro Plan"
            sx={{
              background: "#FFD700",
              color: "#000",
              fontWeight: "bold",
              marginTop: "0.5rem",
            }}
          />
        ) : (
          <Chip
            label="Free Plan"
            sx={{
              background: "#FFFFFF",
              color: "#1649FF",
              fontWeight: "bold",
              marginTop: "0.5rem",
            }}
          />
        )}
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.name}
            component={Link}
            to={item.path}
            sx={{
              padding: "1rem",
              backgroundColor:
                location.pathname === item.path ? "#123cb6" : "inherit",
              fontWeight: location.pathname === item.path ? "bold" : "normal",
              "&:hover": {
                backgroundColor: "rgba(18, 60, 182, 0.8)",
              },
            }}
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
      {user?.subscription?.status !== "active" && (
        <Box
          sx={{
            padding: "1rem",
            background: "#E53E3E",
            textAlign: "center",
            position: "absolute",
            bottom: "0",
            width: "100%",
          }}
        >
          <Typography variant="body2" color="#FFFFFF">
            Upgrade to access all features.
          </Typography>
          <Button
            component={Link}
            variant="contained"
            color="primary"
            to="/payment"
            sx={{ marginTop: "0.5rem" }}
          >
            Subscribe Now
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
