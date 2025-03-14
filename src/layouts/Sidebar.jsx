import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Chip,
  useTheme,
  Divider,
  Avatar,
  Paper,
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
      component="aside"
      sx={{
        width: "240px",
        height: "100vh",
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <img
          src={mode === "dark" ? "/logo_black.png" : "/logo_white.png"}
          alt="Logo"
          style={{
            width: "80%",
            height: "50px",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* User Profile Section */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {getInitials(user?.username)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              {user?.username || "User"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                maxWidth: "160px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Chip
            label={isProUser ? "Pro Plan" : "Free Plan"}
            size="small"
            sx={{
              backgroundColor: isProUser
                ? "rgba(255, 215, 0, 0.15)"
                : theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.08)",
              color: isProUser ? "#B8860B" : theme.palette.text.primary,
              fontWeight: 500,
              fontSize: "0.75rem",
              height: "24px",
            }}
          />
          {!isProUser && (
            <Button
              component={Link}
              to="/payment"
              size="small"
              variant="text"
              color="primary"
              sx={{
                ml: "auto",
                fontSize: "0.75rem",
                textTransform: "none",
                fontWeight: 500,
                p: 0,
              }}
            >
              Upgrade
            </Button>
          )}
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
          },
        }}
      >
        {menuItems.map((section, index) => (
          <Box key={section.title} sx={{ mb: 2, mt: index === 0 ? 2 : 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              sx={{
                px: 3,
                py: 1,
                display: "block",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {section.title}
            </Typography>

            <List sx={{ px: 2 }} dense>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem
                    key={item.name}
                    component={Link}
                    to={item.path}
                    disablePadding
                    sx={{
                      mb: 0.5,
                      borderRadius: 1,
                      overflow: "hidden",
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                      backgroundColor: isActive
                        ? theme.palette.mode === "dark"
                          ? "rgba(25, 118, 210, 0.15)"
                          : "rgba(25, 118, 210, 0.08)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        px: 1.5,
                        py: 1,
                      }}
                    >
                      {item.icon && (
                        <ListItemIcon
                          sx={{
                            minWidth: 36,
                            color: isActive
                              ? theme.palette.primary.main
                              : theme.palette.text.secondary,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            fontWeight={isActive ? 600 : 400}
                          >
                            {item.name}
                          </Typography>
                        }
                      />
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Upgrade Banner */}
      {!isProUser && (
        <Paper
          elevation={0}
          sx={{
            m: 2,
            p: 2,
            borderRadius: 1,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(25, 118, 210, 0.15)"
                : "rgba(25, 118, 210, 0.08)",
            border: `1px solid ${theme.palette.primary.main}`,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Upgrade to Pro
          </Typography>
          <Typography variant="caption" color="text.secondary" paragraph>
            Get access to all premium features and tools.
          </Typography>
          <Button
            component={Link}
            to="/payment"
            variant="contained"
            color="primary"
            size="small"
            fullWidth
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
    </Box>
  );
};

export default Sidebar;
