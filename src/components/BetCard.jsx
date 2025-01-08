import React, { useState } from "react";
import { Box, Typography, Button, Collapse, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Alert, Tooltip } from "@mui/material";

const getVerificationAlert = (bet) => {
  if (bet.verificationStatus === "Pending") {
    return (
      <Alert
        severity="warning"
        sx={{ backgroundColor: "#FFEB3B", color: "#000", mb: 2 }}
      >
        This bet is pending verification.
      </Alert>
    );
  }
  if (bet.verificationStatus === "Rejected") {
    return (
      <Alert
        severity="error"
        sx={{ backgroundColor: "#FFCDD2", color: "#000", mb: 2 }}
      >
        This bet verification has been rejected. Please correct your
        verification code.
      </Alert>
    );
  }
  return null;
};

const BetCard = ({ bet, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      sx={{
        marginBottom: "1rem",
        backgroundColor: "#334155",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        color: "#fff",
      }}
    >
      {/* Verification Alert */}
      {getVerificationAlert(bet)}

      {/* Header Section */}
      <Box
        onClick={handleExpand}
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor: "#2e3b4e",
          },
        }}
      >
        {/* Status Badge */}
        <Box
          sx={{
            position: "absolute",
            top: "0",
            right: "0",
            backgroundColor:
              bet.status === "Won"
                ? "#4CAF50"
                : bet.status === "Loss"
                ? "#FF5252"
                : "#B0BEC5",
            color: "#FFFFFF",
            padding: "0rem 0.3rem",
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
            writingMode: "vertical-rl",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "0.9rem",
            height: "100%",
          }}
        >
          {bet.status}
        </Box>
        {/* Left Section */}
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <IconButton
            sx={{
              color: "#ffffff",
            }}
            onClick={handleExpand}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              {new Date(bet.date).toLocaleString()}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {bet.label}
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            display: {
              xs: "none", // Hide on small screens
              md: "flex", // Show on medium and larger screens
            },
            alignItems: "center",
            justifyContent: "space-around",
            gap: "30px",
            mr: "50px",
          }}
        >
          {/* Odds */}
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#ffffff" }}
            >
              {bet.odds}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Odds
            </Typography>
          </Box>

          {/* Stake */}
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#ffffff" }}
            >
              {bet.stake}€
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Stake
            </Typography>
          </Box>

          {/* Gain */}
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: bet.gain >= 0 ? "#4CAF50" : "#FF5252",
              }}
            >
              {bet.gain}€
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Gain
            </Typography>
          </Box>

          {/* Profit */}
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: bet.profit >= 0 ? "#4CAF50" : "#FF5252",
              }}
            >
              {bet.profit}€
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Profit
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Details Section */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            padding: "1rem",
            backgroundColor: "#2e3b4e",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Show additional data in details for small screens */}
          <Box
            sx={{
              display: {
                xs: "flex", // Show on small screens
                md: "none", // Hide on medium and larger screens
              },
              justifyContent: "space-around",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <Box textAlign="center">
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#ffffff" }}
              >
                {bet.odds}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Odds
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#ffffff" }}
              >
                {bet.stake}€
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Stake
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: bet.gain >= 0 ? "#4CAF50" : "#FF5252",
                }}
              >
                {bet.gain}€
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Gain
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: bet.profit >= 0 ? "#4CAF50" : "#FF5252",
                }}
              >
                {bet.profit}€
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Profit
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            <IconButton
              onClick={() => onEdit(bet)}
              sx={{
                color: "#1649ff",
                "&:hover": {
                  backgroundColor: "rgba(22, 73, 255, 0.1)",
                },
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => onDelete(bet)}
              sx={{
                color: "#FF5252",
                "&:hover": {
                  backgroundColor: "rgba(255, 82, 82, 0.1)",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default BetCard;
