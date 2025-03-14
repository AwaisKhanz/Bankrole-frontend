import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Tooltip,
  Alert,
  Collapse,
  Paper,
  Chip,
  Divider,
  Stack,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PaidIcon from "@mui/icons-material/Paid";
import SpeedIcon from "@mui/icons-material/Speed";

const getVerificationAlert = (bet, theme) => {
  if (bet.verificationStatus === "Pending") {
    return (
      <Alert
        severity="warning"
        icon={<WarningAmberIcon fontSize="inherit" />}
        sx={{
          borderRadius: 0,
          py: 0.75,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 193, 7, 0.15)"
              : "rgba(255, 193, 7, 0.1)",
          color: theme.palette.warning.main,
          "& .MuiAlert-icon": {
            color: theme.palette.warning.main,
          },
        }}
      >
        This bet is pending verification
      </Alert>
    );
  }
  if (bet.verificationStatus === "Rejected") {
    return (
      <Alert
        severity="error"
        icon={<ErrorOutlineIcon fontSize="inherit" />}
        sx={{
          borderRadius: 0,
          py: 0.75,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(244, 67, 54, 0.15)"
              : "rgba(244, 67, 54, 0.1)",
          color: theme.palette.error.main,
          "& .MuiAlert-icon": {
            color: theme.palette.error.main,
          },
        }}
      >
        This bet verification has been rejected
      </Alert>
    );
  }
  if (bet.verificationStatus === "Accepted") {
    return (
      <Alert
        severity="success"
        icon={<CheckCircleOutlineIcon fontSize="inherit" />}
        sx={{
          borderRadius: 0,
          py: 0.75,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(76, 175, 80, 0.15)"
              : "rgba(76, 175, 80, 0.1)",
          color: theme.palette.success.main,
          "& .MuiAlert-icon": {
            color: theme.palette.success.main,
          },
        }}
      >
        This bet has been verified
      </Alert>
    );
  }
  return null;
};

const BetCard = ({ bet, onEdit, onDelete, bankroll, mode, isViewMode }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  // Check if bet is within 24 hours of creation
  const createdAt = new Date(bet.createdAt || bet._id.getTimestamp()); // Adjust based on backend data
  const now = new Date();
  const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60); // Convert ms to hours
  const isPublicBankroll = bankroll?.visibility === "Public";
  const isWithin24Hours = hoursSinceCreation < 24;
  const canDelete = !isPublicBankroll || !isWithin24Hours;
  const canEdit = !(isPublicBankroll && bet.verificationStatus === "Pending");

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Won":
        return theme.palette.success.main;
      case "Loss":
        return theme.palette.error.main;
      case "Void":
        return theme.palette.grey[500];
      case "Cashout":
        return theme.palette.warning.main;
      default: // Pending
        return theme.palette.info.main;
    }
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: 1,
        overflow: "hidden",
        transition: "box-shadow 0.2s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[2],
        },
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Verification Alert */}
      {bankroll?.visibility !== "Private" && getVerificationAlert(bet, theme)}

      {/* Header Section */}
      <Box
        onClick={!isViewMode ? handleExpand : undefined}
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          cursor: !isViewMode ? "pointer" : "default",
          transition: "background-color 0.3s ease",
          "&:hover": !isViewMode
            ? {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
              }
            : {},
        }}
      >
        {/* Status Badge */}
        <Chip
          label={bet.status}
          size="small"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "30px",
            height: "100%",
            borderRadius: "0 4px 4px 0",
            backgroundColor: getStatusColor(bet.status),
            color: "#fff",
            fontWeight: 500,
            fontSize: "0.75rem",
            "& .MuiChip-label": {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(90deg)",
              whiteSpace: "nowrap",
              padding: 0,
              width: "auto",
              maxWidth: "none",
            },
          }}
        />

        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {!isViewMode && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleExpand();
              }}
              size="small"
              sx={{
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
              {expanded ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )}
            </IconButton>
          )}

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <CalendarTodayIcon
                fontSize="small"
                sx={{ mr: 0.75, color: theme.palette.text.secondary }}
              />
              <Typography variant="caption" color="text.secondary">
                {new Date(bet.date).toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SportsSoccerIcon
                fontSize="small"
                sx={{ mr: 0.75, color: theme.palette.primary.main }}
              />
              <Typography variant="subtitle2" fontWeight={600}>
                {bet.label}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Section - Desktop */}
        <Box
          sx={{
            display: {
              xs: "none", // Hide on small screens
              md: "flex", // Show on medium and larger screens
            },
            alignItems: "center",
            gap: 3,
            mr: 8, // Space for status badge
          }}
        >
          {/* Odds */}
          <Box sx={{ textAlign: "center", minWidth: 60 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 0.5,
              }}
            >
              <SpeedIcon
                fontSize="small"
                sx={{ mr: 0.5, color: theme.palette.text.secondary }}
              />
              <Typography variant="body2" fontWeight={600}>
                {bet.odds}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Odds
            </Typography>
          </Box>

          {/* Stake */}
          <Box sx={{ textAlign: "center", minWidth: 60 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 0.5,
              }}
            >
              <PaidIcon
                fontSize="small"
                sx={{ mr: 0.5, color: theme.palette.text.secondary }}
              />
              <Typography variant="body2" fontWeight={600}>
                {bankroll?.currency?.symbol || "$"}
                {bet.stake}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Stake
            </Typography>
          </Box>

          {/* Gain */}
          <Box sx={{ textAlign: "center", minWidth: 60 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 0.5,
              }}
            >
              {bet.gain >= 0 ? (
                <TrendingUpIcon
                  fontSize="small"
                  sx={{ mr: 0.5, color: theme.palette.success.main }}
                />
              ) : (
                <TrendingDownIcon
                  fontSize="small"
                  sx={{ mr: 0.5, color: theme.palette.error.main }}
                />
              )}
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  color:
                    bet.gain >= 0
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
              >
                {bankroll?.currency?.symbol || "$"}
                {Math.abs(bet.gain)}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Gain
            </Typography>
          </Box>

          {/* Profit */}
          <Box sx={{ textAlign: "center", minWidth: 60 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 0.5,
              }}
            >
              {bet.profit >= 0 ? (
                <TrendingUpIcon
                  fontSize="small"
                  sx={{ mr: 0.5, color: theme.palette.success.main }}
                />
              ) : (
                <TrendingDownIcon
                  fontSize="small"
                  sx={{ mr: 0.5, color: theme.palette.error.main }}
                />
              )}
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  color:
                    bet.profit >= 0
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
              >
                {bankroll?.currency?.symbol || "$"}
                {Math.abs(bet.profit)}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Profit
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Details Section */}
      <Collapse in={expanded} timeout="auto" unmountOnExit={true}>
        <Divider />
        <Box
          sx={{
            p: 2,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
          }}
        >
          {!isViewMode && (
            <Box>
              {isPublicBankroll && isWithin24Hours && (
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(33, 150, 243, 0.15)"
                        : "rgba(33, 150, 243, 0.1)",
                  }}
                >
                  <Typography variant="body2">
                    Cannot delete this bet within 24 hours of upload. Please
                    contact support if needed.
                  </Typography>
                </Alert>
              )}

              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Tooltip
                  title={
                    isPublicBankroll && bet.verificationStatus === "Pending"
                      ? "Cannot edit while verification is pending"
                      : "Edit this bet"
                  }
                >
                  <span>
                    <IconButton
                      onClick={() => canEdit && onEdit(bet)}
                      disabled={!canEdit}
                      size="small"
                      sx={{
                        color: canEdit
                          ? theme.palette.primary.main
                          : theme.palette.action.disabled,
                        backgroundColor: canEdit
                          ? theme.palette.mode === "dark"
                            ? "rgba(25, 118, 210, 0.15)"
                            : "rgba(25, 118, 210, 0.1)"
                          : undefined,
                        "&:hover": canEdit
                          ? {
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(25, 118, 210, 0.25)"
                                  : "rgba(25, 118, 210, 0.2)",
                            }
                          : {},
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip
                  title={
                    isPublicBankroll && isWithin24Hours
                      ? "Deletion locked for 24 hours. Contact support."
                      : "Delete this bet"
                  }
                >
                  <span>
                    <IconButton
                      onClick={() => canDelete && onDelete(bet)}
                      disabled={!canDelete}
                      size="small"
                      sx={{
                        color: canDelete
                          ? theme.palette.error.main
                          : theme.palette.action.disabled,
                        backgroundColor: canDelete
                          ? theme.palette.mode === "dark"
                            ? "rgba(211, 47, 47, 0.15)"
                            : "rgba(211, 47, 47, 0.1)"
                          : undefined,
                        "&:hover": canDelete
                          ? {
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(211, 47, 47, 0.25)"
                                  : "rgba(211, 47, 47, 0.2)",
                            }
                          : {},
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default BetCard;
