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
  Avatar,
  Badge,
  Tooltip,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {/* Sidebar for Desktop */}
      <Sidebar mode={mode} />

      {/* Drawer for Mobile */}
      <DrawerMenu isOpen={drawerOpen} toggleDrawer={toggleDrawer} mode={mode} />

      {/* Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: "calc(100% - 240px)" },
          ml: { md: "240px" },
          height: "64px",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {/* Menu Icon and Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{
                display: { md: "none" },
                color: theme.palette.text.primary,
                mr: 1,
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
            >
              <img
                src={mode === "dark" ? "/logo_black.png" : "/logo_white.png"}
                alt="Logo"
                style={{
                  width: "100px",
                  height: "60px",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Box>

          {/* Right side controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Subscription Badge */}
            {user?.subscription?.status === "active" && (
              <Tooltip title="Pro Subscription Active">
                <Link to="/payment" style={{ textDecoration: "none" }}>
                  <Chip
                    label="PRO"
                    size="small"
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 215, 0, 0.15)"
                          : "rgba(255, 215, 0, 0.2)",
                      color: "#B8860B",
                      fontWeight: 600,
                      border: "1px solid #B8860B",
                    }}
                  />
                </Link>
              </Tooltip>
            )}

            {/* Theme Toggle */}
            <Tooltip
              title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
            >
              <IconButton
                onClick={toggleTheme}
                size="small"
                sx={{
                  color: theme.palette.text.primary,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.04)",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                {mode === "dark" ? (
                  <Brightness7Icon fontSize="small" />
                ) : (
                  <Brightness4Icon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Tooltip title="Account">
              <IconButton
                edge="end"
                onClick={openProfileMenu}
                sx={{
                  ml: 0.5,
                  color: theme.palette.text.primary,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.04)",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(user?.username)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={closeProfileMenu}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 2,
                sx: {
                  mt: 1.5,
                  minWidth: 220,
                  borderRadius: 1,
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: theme.palette.background.paper,
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight={500}>
                  {user?.username || "User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ px: 2, py: 1.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    Subscription
                  </Typography>
                  <Chip
                    label={
                      user?.subscription?.status === "active" ? "Pro" : "Free"
                    }
                    size="small"
                    sx={{
                      backgroundColor:
                        user?.subscription?.status === "active"
                          ? "rgba(255, 215, 0, 0.15)"
                          : theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.08)",
                      color:
                        user?.subscription?.status === "active"
                          ? "#B8860B"
                          : theme.palette.text.primary,
                      fontWeight: 500,
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>

                {user?.subscription?.status !== "active" && (
                  <Button
                    component={Link}
                    to="/payment"
                    variant="outlined"
                    size="small"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1, textTransform: "none" }}
                  >
                    Upgrade to Pro
                  </Button>
                )}
              </Box>

              <Divider />

              <MenuItem
                component={Link}
                to="/profile"
                onClick={closeProfileMenu}
                sx={{ py: 1.5 }}
              >
                <Typography variant="body2">My Profile</Typography>
              </MenuItem>

              <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
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
        component="main"
        sx={{
          flexGrow: 1,
          pt: "64px",
          ml: { md: "240px" },
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {user?.subscription?.status !== "active" && (
            <Paper
              elevation={0}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(239, 68, 68, 0.15)"
                    : "#FEF2F2",
                color: theme.palette.error.main,
                p: 2,
                borderRadius: 1,
                mb: 3,
                border: `1px solid ${theme.palette.error.main}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                Your account is on the free plan. Upgrade to access all premium
                features.
              </Typography>
              <Button
                variant="contained"
                color="error"
                component={Link}
                to="/payment"
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                Upgrade Now
              </Button>
            </Paper>
          )}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
