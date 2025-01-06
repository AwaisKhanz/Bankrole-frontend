import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

const Loading = ({ message = "Loading...", size = 40 }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: "100vh",
        padding: "1rem",
        background: theme.palette.primary.main,
      }}
    >
      <CircularProgress
        size={size}
        sx={{ marginBottom: "1rem", color: "white" }}
      />
      <Typography
        variant="body1"
        color="white"
        sx={{ fontWeight: 600, fontSize: "32px" }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
