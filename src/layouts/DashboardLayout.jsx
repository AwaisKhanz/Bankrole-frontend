import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DrawerMenu from "./DrawerMenu";
import { Link, Outlet } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Chip,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const { user, logOut } = useAuth();
  const theme = useTheme();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const openProfileMenu = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const closeProfileMenu = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    closeProfileMenu();
    logOut();
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", color: "white" }}>
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Drawer for Mobile */}
      <DrawerMenu isOpen={drawerOpen} toggleDrawer={toggleDrawer} />

      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: "calc(100% - 240px)" },
          ml: { md: "240px" },
          height: "64px",
          background: "#192232",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: { xs: "space-between" },
          }}
        >
          {/* Menu Icon */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <img
              src="/logo_black.png"
              alt="Logo"
              style={{
                width: "150px",
                height: "64px",
                objectFit: "cover",
              }}
            />
          </Box>

          {/* Profile Menu */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {user?.subscription?.status === "active" && (
              <Link to={"/payment"}>
                <Chip
                  label="Pro"
                  sx={{
                    background: "#FFD700",
                    color: "#000",
                    fontWeight: "bold",
                    marginRight: "0.5rem",
                  }}
                />
              </Link>
            )}
            <IconButton edge="end" color="inherit" onClick={openProfileMenu}>
              <AccountCircleIcon />
            </IconButton>
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={closeProfileMenu}
              sx={{ mt: "40px" }}
            >
              <MenuItem>
                <Typography variant="body2">
                  <strong>Email:</strong> {user?.email}
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography
                  component={Link}
                  to={"/payment"}
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <strong>Plan:</strong>
                  <Chip
                    label={
                      user?.subscription?.status === "active" ? "Pro" : "Free"
                    }
                    sx={{
                      background:
                        user?.subscription?.status === "active"
                          ? "#FFD700"
                          : "#E0E0E0",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <Typography variant="body2" color="error">
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          mt: { xs: "64px", md: "64px" },
          padding: { xs: "1rem", md: "2rem" },
          marginLeft: { md: "240px" },
          background: theme.palette.tertiary.main,
          width: "100%",
          overflowY: "auto",
        }}
      >
        {user?.subscription?.status !== "active" && (
          <Box
            sx={{
              background: "#FEE2E2",
              color: "#B91C1C",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Your subscription is inactive.{" "}
            <Button
              variant="contained"
              color="error"
              href="/payment"
              sx={{ marginLeft: "1rem" }}
            >
              Subscribe Now
            </Button>
          </Box>
        )}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
