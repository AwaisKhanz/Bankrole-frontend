import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getMenuItems } from "../utils/menuItems";

const DrawerMenu = ({ isOpen, toggleDrawer, mode }) => {
  const { user } = useAuth();
  const location = useLocation();
  const theme = useTheme();

  const isProUser = user?.subscription?.status === "active";
  const isAdmin = user?.role === "admin";

  const menuItems = getMenuItems(isProUser, isAdmin);

  return (
    <Drawer
      open={isOpen}
      onClose={toggleDrawer}
      sx={{
        "& .MuiDrawer-paper": {
          width: "240px",
          background: theme.palette.primary.main,
          color: mode === "dark" ? "white" : "black",
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <List>
          <img
            src={mode === "dark" ? "/logo_black.png" : "/logo_white.png"}
            alt="Logo"
            style={{
              width: "100%",
              height: "50px",
              objectFit: "cover",
              marginBottom: "1rem",
            }}
          />
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
                color:
                  location.pathname === item.path
                    ? mode === "dark"
                      ? "white"
                      : "white"
                    : "",
                "&:hover": {
                  backgroundColor: "rgba(18, 60, 182, 0.8)",
                  color: mode === "dark" ? "white" : "white",
                },
              }}
              onClick={toggleDrawer}
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
              variant="contained"
              color="primary"
              component={Link}
              to="/payment"
              sx={{ marginTop: "0.5rem" }}
              onClick={toggleDrawer}
            >
              Subscribe Now
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
