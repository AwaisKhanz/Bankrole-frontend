import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../services/api"; // Replace with your actual API service
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BankrollCard = ({ bankroll, onEdit, onDelete }) => {
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
        boxShadow: "0px 4px 12px #192232",
        transform: "scale(1)",
        transition: "transform 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0px 6px 16px #192232",
        },
      }}
    >
      <Card
        sx={{
          borderRadius: "12px",
          boxShadow: "none",
          bgcolor: theme.palette.secondary.main,
          color: "white",
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
            <Typography variant="h6" fontWeight="bold">
              {bankroll.name}
            </Typography>
            <Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the card click
                  onEdit(bankroll);
                }}
                sx={{ color: "#FFFFFF", marginRight: "8px" }}
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
              borderTop: "1px solid rgba(255, 255, 255, 0.2)", // Top border
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
                  color: bankroll?.stats.roi >= 0 ? "white" : "#FF5252",
                  fontWeight: "bold",
                }}
              >
                {bankroll?.stats.roi}%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
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
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                alignSelf: "stretch",
              }}
            ></Box>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  color: bankroll?.stats.progression >= 0 ? "white" : "#FF5252",
                  fontWeight: "bold",
                }}
              >
                {bankroll.stats?.progression}%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
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
              backgroundColor: "#1e293b",
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
