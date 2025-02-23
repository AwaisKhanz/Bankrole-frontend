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
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../context/AuthContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const DashboardLayout = ({ toggleTheme, mode }) => {
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
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        color: mode === "dark" ? "white" : "black",
      }}
    >
      {/* Sidebar for Desktop */}
      <Sidebar mode={mode} />

      {/* Drawer for Mobile */}
      <DrawerMenu isOpen={drawerOpen} toggleDrawer={toggleDrawer} mode={mode} />

      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: "calc(100% - 240px)" },
          ml: { md: "240px" },
          height: "64px",
          background: theme.palette.primary.main,
          boxShadow: "none",
          borderBottom: mode !== "dark" && "1px solid #e0e0e0",
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
              src={mode === "dark" ? "/logo_black.png" : "/logo_white.png"}
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
            {/* Theme Toggle */}
            <IconButton onClick={toggleTheme} sx={{ marginRight: "1rem" }}>
              {mode === "dark" ? (
                <Brightness7Icon sx={{ color: "yellow" }} />
              ) : (
                <Brightness4Icon sx={{ color: "#333" }} />
              )}
            </IconButton>
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
              <MenuItem
                sx={{
                  borderBottom:
                    mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.2)"
                      : "1px solid #e0e0e0",
                  mb: "1rem",
                }}
              >
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

              <MenuItem component={Link} to="/profile">
                <Typography variant="body2">Profile</Typography>
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
