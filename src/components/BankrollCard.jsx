import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedIcon from "@mui/icons-material/Verified";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const BankrollCard = ({ bankroll, onEdit, onDelete, mode }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (onDelete) onDelete(bankroll._id);
  };

  return (
    <Box
      onClick={() => navigate(`/bankroll/${bankroll._id}`)}
      sx={{
        borderRadius: "8px",

        overflow: "hidden",

        transform: "scale(1)",
        transition: "transform 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <Card
        sx={{
          borderRadius: "12px",
          boxShadow: "none",
          bgcolor: mode === "dark" ? theme.palette.secondary.main : "#eeeeee",
          position: "relative",
        }}
      >
        <CardContent>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" fontWeight="bold">
                {bankroll.name}
              </Typography>
              {/* ✅ Blue Verified Tick */}
              {bankroll.stats.isVerified && (
                <VerifiedIcon
                  sx={{
                    color: "#4CAF50",
                    fontSize: "1.2rem",
                    marginLeft: "6px",
                  }}
                  titleAccess="Verified Bankroll"
                />
              )}
            </Box>

            <Box>
              <Chip
                label={bankroll.visibility}
                sx={{
                  backgroundColor:
                    bankroll.visibility === "Public" ? "#4CAF50" : "#1649FF",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  marginRight: "8px",
                  textTransform: "uppercase",
                }}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the card click
                  onEdit(bankroll);
                }}
                sx={{ marginRight: "8px" }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the card click
                  handleDelete();
                }}
                sx={{ color: "#FF5252" }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              marginTop: "1rem",
              paddingTop: "1rem", // Add padding above the top border
              borderTop:
                mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.2)" // Dark mode border
                  : "1px solid rgba(0, 0, 0, 0.1)", // Light mode border
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  color:
                    bankroll?.stats.roi >= 0
                      ? mode === "dark"
                        ? "white"
                        : "black"
                      : "#FF5252",
                  fontWeight: "bold",
                }}
              >
                {bankroll?.stats.roi}%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "black",
                  textTransform: "uppercase",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                ROI
              </Typography>
            </Box>
            <Box
              sx={{
                width: "1px",
                height: "50px",
                backgroundColor:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.2)"
                    : `${theme.palette.grey[300]}`,
                alignSelf: "stretch",
              }}
            ></Box>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  color:
                    bankroll?.stats.progression >= 0
                      ? mode === "dark"
                        ? "white"
                        : "black"
                      : "#FF5252",
                  fontWeight: "bold",
                }}
              >
                {bankroll.stats?.progression}%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "black",
                  textTransform: "uppercase",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                PROGRESSION
              </Typography>
            </Box>
          </Box>

          {/* Pending Bets */}
          <Box
            sx={{
              marginTop: "1rem",
              textAlign: "center",
              bgcolor: theme.palette.primary.main,
              color: mode === "dark" ? "white" : "black",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            <Typography variant="body2">
              {bankroll.stats.pendingBetsCount} pending bet(s)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BankrollCard;
