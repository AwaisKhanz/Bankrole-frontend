"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  InputAdornment,
  Divider,
  Alert,
  useTheme,
  Slider,
  Tooltip,
  IconButton,
  alpha,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import PercentIcon from "@mui/icons-material/Percent";
import EuroIcon from "@mui/icons-material/Euro";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const RiskCalculator = ({ mode }) => {
  const [bankroll, setBankroll] = useState("");
  const [percentage, setPercentage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const theme = useTheme();

  const calculatePercentage = () => {
    setError("");
    const bankrollValue = Number.parseFloat(bankroll);
    const percentageValue = Number.parseFloat(percentage);

    if (isNaN(bankrollValue) || bankrollValue <= 0) {
      setError("Please enter a valid bankroll amount");
      setResult(null);
      return;
    }

    if (isNaN(percentageValue) || percentageValue <= 0) {
      setError("Please enter a valid percentage");
      setResult(null);
      return;
    }

    if (percentageValue > 100) {
      setError("Percentage cannot exceed 100%");
      setResult(null);
      return;
    }

    const calculatedValue = (bankrollValue * percentageValue) / 100;
    setResult({
      percentage: percentageValue,
      bankroll: bankrollValue,
      amount: calculatedValue,
    });
  };

  const clearFields = () => {
    setBankroll("");
    setPercentage("");
    setResult(null);
    setError("");
  };

  const handleSliderChange = (event, newValue) => {
    setPercentage(newValue.toString());
  };

  const getRiskLevel = (percent) => {
    if (percent <= 1)
      return { level: "Very Low", color: theme.palette.success.main };
    if (percent <= 3)
      return { level: "Low", color: theme.palette.success.light };
    if (percent <= 5)
      return { level: "Moderate", color: theme.palette.warning.light };
    if (percent <= 10)
      return { level: "High", color: theme.palette.warning.main };
    return { level: "Very High", color: theme.palette.error.main };
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${
            theme.palette.background.paper
          } 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalculateIcon
              sx={{
                color: theme.palette.primary.main,
                mr: 1.5,
                fontSize: "1.75rem",
              }}
            />
            <Box>
              <Typography
                variant="h4"
                fontWeight={600}
                gutterBottom
                sx={{
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: `0 2px 4px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                }}
              >
                Risk Calculator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calculate the optimal stake based on your bankroll and risk
                percentage
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Total Bankroll"
              variant="outlined"
              fullWidth
              type="number"
              value={bankroll}
              onChange={(e) => setBankroll(e.target.value)}
              placeholder="Enter your total bankroll"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EuroIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  Risk Percentage
                </Typography>
                <Tooltip title="The percentage of your bankroll you're willing to risk on a single bet">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Box>

              <TextField
                variant="outlined"
                fullWidth
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="Enter risk percentage"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <PercentIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <Slider
                value={Number.parseFloat(percentage) || 0}
                onChange={handleSliderChange}
                aria-labelledby="risk-percentage-slider"
                valueLabelDisplay="auto"
                step={0.5}
                marks={[
                  { value: 0, label: "0%" },
                  { value: 2, label: "2%" },
                  { value: 5, label: "5%" },
                  { value: 10, label: "10%" },
                  { value: 15, label: "15%" },
                ]}
                min={0}
                max={15}
                sx={{
                  color: theme.palette.primary.main,
                  "& .MuiSlider-thumb": {
                    height: 24,
                    width: 24,
                    backgroundColor: "#fff",
                    border: `2px solid ${theme.palette.primary.main}`,
                    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                      boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}30`,
                    },
                  },
                }}
              />

              {percentage && (
                <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" fontWeight={500}>
                    Risk Level:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      ml: 1,
                      color: getRiskLevel(Number.parseFloat(percentage)).color,
                    }}
                  >
                    {getRiskLevel(Number.parseFloat(percentage)).level}
                  </Typography>
                </Box>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={calculatePercentage}
                sx={{
                  py: 1.25,
                  fontWeight: 500,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                Calculate
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                onClick={clearFields}
                startIcon={<DeleteOutlineIcon />}
                sx={{
                  py: 1.25,
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Clear
              </Button>
            </Stack>
          </Stack>
        </Box>

        {result && (
          <>
            <Divider />
            <Box
              sx={{
                p: 3,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Calculation Result
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Bankroll:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    €{result.bankroll.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Risk Percentage:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {result.percentage}%
                  </Typography>
                </Box>

                <Divider sx={{ my: 0.5 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Recommended Stake:
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="primary"
                  >
                    €{result.amount.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  A {result.percentage}% risk level is considered{" "}
                  <strong>
                    {getRiskLevel(result.percentage).level.toLowerCase()}
                  </strong>
                  . Professional bettors typically use 1-3% of their bankroll
                  per bet.
                </Typography>
              </Alert>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default RiskCalculator;
