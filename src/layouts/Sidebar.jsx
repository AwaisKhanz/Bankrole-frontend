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
  ListSubheader,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getMenuItems } from "../utils/menuItems";

const Sidebar = ({ mode }) => {
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
        color: mode === "dark" ? "white" : "black",
        display: { xs: "none", md: "block" },
        position: "fixed",
        borderRight: mode !== "dark" && "1px solid #e0e0e0",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          padding: "1rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: mode === "dark" ? "white" : "black",
          }}
        >
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

      <List sx={{ padding: "1rem" }}>
        {menuItems.map((section) => (
          <React.Fragment key={section.title}>
            <ListSubheader
              sx={{
                background: theme.palette.primary.main,
                color: "#607D8B",
                fontWeight: "bold",
                textTransform: "uppercase",
                padding: "0.5rem 0",
              }}
            >
              {section.title}
            </ListSubheader>
            {section.items.map((item) => (
              <ListItem
                key={item.name}
                component={Link}
                to={item.path}
                sx={{
                  padding: "0.5rem",
                  marginBottom: "8px",
                  borderRadius: "20px",
                  backgroundColor:
                    location.pathname === item.path ? "#f6f8fe" : "",
                  color:
                    location.pathname === item.path
                      ? mode === "dark"
                        ? "#123cb6"
                        : "#123cb6"
                      : "",
                  "&:hover": {
                    backgroundColor: mode === "dark" ? "#f6f8fe" : "#f6f8fe",
                    color: mode === "dark" ? "#123cb6" : "#123cb6",
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  {item.icon}
                  <ListItemText primary={item.name} />
                </Box>
              </ListItem>
            ))}
          </React.Fragment>
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
          <Typography
            variant="body2"
            sx={{
              color: mode === "dark" ? "white" : "black",
            }}
          >
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
