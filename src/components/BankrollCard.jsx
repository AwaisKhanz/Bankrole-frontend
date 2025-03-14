"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  useTheme,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedIcon from "@mui/icons-material/Verified";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const BankrollCard = ({ bankroll, onEdit, onDelete, mode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    onEdit(bankroll);
    handleClose();
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(bankroll._id);
    handleClose();
  };

  const handleCardClick = () => {
    navigate(`/bankroll/${bankroll._id}`);
  };

  return (
    <Card
      elevation={0}
      onClick={handleCardClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 6px 12px rgba(0,0,0,0.3)"
              : "0 6px 12px rgba(0,0,0,0.1)",
        },
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 }, flexGrow: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {bankroll.name}
            </Typography>
            {bankroll.stats.isVerified && (
              <Tooltip title="Verified Bankroll">
                <VerifiedIcon
                  sx={{
                    color: theme.palette.success.main,
                    fontSize: "1rem",
                    ml: 0.5,
                  }}
                />
              </Tooltip>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Chip
              label={bankroll.visibility}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.7rem",
                fontWeight: 500,
                mr: 1,
                backgroundColor:
                  bankroll.visibility === "Public"
                    ? theme.palette.success.main
                    : theme.palette.primary.main,
                color: "#fff",
              }}
            />

            <IconButton
              size="small"
              onClick={handleClick}
              aria-controls={open ? "bankroll-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{
                color: theme.palette.text.secondary,
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
              <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
              id="bankroll-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={(e) => e.stopPropagation()}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 2,
                sx: {
                  minWidth: 120,
                  borderRadius: 1,
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                  mt: 1,
                },
              }}
            >
              <MenuItem onClick={handleEdit} dense>
                <EditIcon fontSize="small" sx={{ mr: 1.5 }} />
                Edit
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                onClick={handleDelete}
                dense
                sx={{ color: theme.palette.error.main }}
              >
                <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
                Delete
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{
                  color:
                    bankroll?.stats.roi >= 0
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
              >
                {bankroll?.stats.roi}%
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 500,
                  display: "block",
                }}
              >
                ROI
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{
                  color:
                    bankroll?.stats.progression >= 0
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
              >
                {bankroll.stats?.progression}%
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 500,
                  display: "block",
                }}
              >
                Progression
              </Typography>
            </Box>
          </Box>

          {/* Pending Bets */}
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 1,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {bankroll?.visibility === "Public"
                ? `${bankroll.stats.pendingBetsCount} pending bet${
                    bankroll.stats.pendingBetsCount !== 1 ? "s" : ""
                  }`
                : `${bankroll.bets?.length} bet${
                    bankroll.bets?.length !== 1 ? "s" : ""
                  }`}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BankrollCard;
