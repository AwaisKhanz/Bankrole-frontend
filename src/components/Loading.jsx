"use client";

import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Paper,
  Fade,
  Avatar,
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const Loading = ({ message = "Loading...", size = 40, mode }) => {
  const theme = useTheme();
  const [currentIcon, setCurrentIcon] = useState(0);
  const icons = [
    <HourglassEmptyIcon key="hourglass" sx={{ fontSize: 48 }} />,
    <AccessTimeIcon key="accessTime" sx={{ fontSize: 48 }} />,
    <AutorenewIcon key="autorenew" sx={{ fontSize: 48 }} />,
  ];

  // Rotate through icons for a more dynamic effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: "100vh",
        padding: "1rem",
        backgroundColor: theme.palette.background.default,
        backgroundImage:
          mode === "dark"
            ? "linear-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.2) 1px, transparent 1px)"
            : "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "3rem",
            borderRadius: "12px",
            maxWidth: "400px",
            width: "100%",
            backgroundColor: theme.palette.background.paper,
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <Box sx={{ position: "relative", mb: 4 }}>
            <CircularProgress
              size={100}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
              }}
            />
            <Avatar
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: theme.palette.primary.main,
                width: 60,
                height: 60,
              }}
            >
              <Fade in={true} timeout={500}>
                {icons[currentIcon]}
              </Fade>
            </Avatar>
          </Box>

          <Typography
            variant="h4"
            color={theme.palette.text.primary}
            sx={{
              fontWeight: 600,
              mb: 2,
              textAlign: "center",
            }}
          >
            {message}
          </Typography>

          <Typography
            variant="body1"
            color={theme.palette.text.secondary}
            sx={{ textAlign: "center" }}
          >
            Please wait while we prepare your content...
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Loading;
