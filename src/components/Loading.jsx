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
        minHeight: "100vh",
        padding: { xs: "1rem", sm: "2rem" },
        backgroundColor: theme.palette.background.default,
        backgroundImage:
          mode === "dark"
            ? "linear-gradient(135deg, #0a2463 0%, #1649ff 50%, #0a2463 100%)"
            : "linear-gradient(135deg, #c5d5ff 0%, #1649ff 50%, #0d3ad9 100%)",
        backgroundSize: "cover",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            mode === "dark"
              ? "radial-gradient(circle at 50% 50%, rgba(61, 90, 254, 0.2) 0%, rgba(22, 73, 255, 0) 50%)"
              : "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 60%)",
          opacity: 0.8,
          zIndex: 1,
        },
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
