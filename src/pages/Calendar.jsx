"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Box,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
  Stack,
  CircularProgress,
  Alert,
  alpha,
} from "@mui/material";
import api from "../services/api";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FilterListIcon from "@mui/icons-material/FilterList";

const CalendarPage = ({ mode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyData, setDailyData] = useState({});
  const [filter, setFilter] = useState("all"); // Default filter: all bankrolls
  const [bankrolls, setBankrolls] = useState([]); // Store raw bankroll data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const fetchBankrollData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/bankrolls");
      setBankrolls(response.data); // Store all bankrolls
    } catch (error) {
      console.error("Failed to fetch bankroll data:", error);
      setError("Failed to fetch bankroll data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankrollData();
  }, []);

  useEffect(() => {
    // Filter bankrolls based on selected filter and calculate daily profits
    const filteredBankrolls = bankrolls.filter((bankroll) => {
      if (filter === "all") return true;
      return bankroll.visibility.toLowerCase() === filter;
    });

    const dailyProfits = filteredBankrolls.reduce((acc, bankroll) => {
      bankroll.bets?.forEach((bet) => {
        const date = new Date(bet.date);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        let profit = 0;

        if (bet.status === "Won") {
          profit = bet.stake * (bet.odds - 1);
        } else if (bet.status === "Loss") {
          profit = -bet.stake;
        }

        if (!acc[formattedDate]) {
          acc[formattedDate] = {
            profit: 0,
            symbol: bankroll.currency?.symbol || "$",
          };
        }
        acc[formattedDate].profit += profit;
      });
      return acc;
    }, {});

    setDailyData(dailyProfits);
  }, [bankrolls, filter]); // Re-run when bankrolls or filter changes

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const getDailyProfit = (date) => {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return dailyData[formattedDate] || { profit: 0, symbol: "$" };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchBankrollData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      );
    }

    return (
      <Calendar
        value={currentDate}
        onClickDay={null} // Disable date selection
        onActiveStartDateChange={({ activeStartDate }) =>
          setCurrentDate(activeStartDate)
        }
        tileContent={({ date, view }) => {
          const dailyProfit = getDailyProfit(date);

          if (view === "month" && dailyProfit.profit !== 0) {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  backgroundColor:
                    dailyProfit.profit > 0
                      ? theme.palette.mode === "dark"
                        ? "rgba(46, 125, 50, 0.2)"
                        : "rgba(46, 125, 50, 0.1)"
                      : theme.palette.mode === "dark"
                      ? "rgba(211, 47, 47, 0.2)"
                      : "rgba(211, 47, 47, 0.1)",
                  borderRadius: "4px",
                  padding: { xs: "4px", md: "8px" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  {date.getDate()}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.65rem",
                    mb: 0.5,
                  }}
                >
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color:
                      dailyProfit.profit > 0
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  }}
                >
                  {dailyProfit.symbol}
                  {Math.abs(dailyProfit.profit).toFixed(2)}
                </Typography>
              </Box>
            );
          }
          return view === "month" ? (
            <Typography
              sx={{
                padding: { xs: "4px", md: "8px" },
                fontWeight: 500,
              }}
            >
              {date.getDate()}
            </Typography>
          ) : null;
        }}
        tileClassName={({ date }) => {
          const { profit } = getDailyProfit(date);
          if (profit > 0) return "profit-day";
          if (profit < 0) return "loss-day";
          return "neutral-day";
        }}
        className={`react-calendar ${mode === "dark" ? "dark" : "light"}`}
      />
    );
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
                Betting Calendar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your daily betting performance across all bankrolls
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", minWidth: 200 }}>
            <FilterListIcon
              sx={{ mr: 1, color: theme.palette.text.secondary }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Filter Bankrolls</InputLabel>
              <Select
                value={filter}
                onChange={handleFilterChange}
                label="Filter Bankrolls"
              >
                <MenuItem value="all">All Bankrolls</MenuItem>
                <MenuItem value="public">Public Bankrolls</MenuItem>
                <MenuItem value="private">Private Bankrolls</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {renderContent()}
      </Paper>
    </Box>
  );
};

export default CalendarPage;
