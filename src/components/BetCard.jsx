import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Collapse,
  IconButton,
  useTheme,
} from "@mui/material";
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
        sx={{ backgroundColor: "#FFEB3B", color: "#000" }}
      >
        This bet is pending verification.
      </Alert>
    );
  }
  if (bet.verificationStatus === "Rejected") {
    return (
      <Alert
        severity="error"
        sx={{ backgroundColor: "#FFCDD2", color: "#000" }}
      >
        This bet verification has been rejected. Please correct your
        verification code.
      </Alert>
    );
  }
  return null;
};

const BetCard = ({ bet, onEdit, onDelete, bankroll, mode }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      sx={{
        marginBottom: "1rem",
        background: theme.palette.secondary.main,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Verification Alert */}
      {bankroll?.visibility !== "Private" && getVerificationAlert(bet)}

      {/* Header Section */}
      <Box
        onClick={handleExpand}
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
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
                ? "#4CAF50" // Green for Won
                : bet.status === "Loss"
                ? "#FF5252" // Red for Loss
                : bet.status === "Void"
                ? "#9E9E9E" // Grey for Void
                : bet.status === "Cashout"
                ? "#FFB300" // Amber/Yellow for Cashout
                : "#B0BEC5", // Light Grey for Pending (default)
            padding: "0rem 0.3rem",
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
            writingMode: "vertical-rl",
            textAlign: "center",
            fontWeight: "500",
            fontSize: "0.9rem",
            height: "100%",
            color: "white",
          }}
        >
          {bet.status}
        </Box>
        {/* Left Section */}
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <IconButton onClick={handleExpand}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body2">
              {new Date(bet.date).toLocaleString()}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "500" }}>
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
            gap: "40px",
            mr: "50px",
          }}
        >
          {/* Odds */}
          <Box textAlign="center">
            <Typography
              sx={{ fontWeight: "500", fontSize: { xs: "18px", md: "20px" } }}
            >
              {bet.odds}
            </Typography>
            <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
              Odds
            </Typography>
          </Box>

          {/* Stake */}
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{ fontWeight: "500", fontSize: { xs: "18px", md: "20px" } }}
            >
              {bet.stake}€
            </Typography>
            <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
              Stake
            </Typography>
          </Box>

          {/* Gain */}
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{
                fontWeight: "500",
                color: bet.gain >= 0 ? "#4CAF50" : "#FF5252",
                fontSize: { xs: "18px", md: "20px" },
              }}
            >
              {bet.gain}€
            </Typography>
            <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
              Gain
            </Typography>
          </Box>

          {/* Profit */}
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{
                fontWeight: "500",
                color: bet.profit >= 0 ? "#4CAF50" : "#FF5252",
                fontSize: { xs: "18px", md: "20px" },
              }}
            >
              {bet.profit}€
            </Typography>
            <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
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
            background: theme.palette.secondary.main,
            borderTop:
              mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : `1px solid ${theme.palette.primary.main}`,
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
                sx={{ fontWeight: "500", color: "#ffffff" }}
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
                sx={{ fontWeight: "500", color: "#ffffff" }}
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
                  fontWeight: "500",
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
                  fontWeight: "500",
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
