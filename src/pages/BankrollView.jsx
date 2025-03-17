"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
  Paper,
  Grid,
  Stack,
  Tooltip,
  CircularProgress,
  Alert,
  InputLabel,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import BetCard from "../components/BetCard";
import BetModal from "../components/BetModal";
import VerifiedIcon from "@mui/icons-material/Verified";
import api from "../services/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import PercentIcon from "@mui/icons-material/Percent";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartTooltip,
  Legend,
  Filler
);

const groupBetsByYearAndMonth = (bankroll, bets) => {
  const grouped = {};

  bets.forEach((bet) => {
    const date = new Date(bet.date);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });

    if (!grouped[year]) grouped[year] = { months: {}, totalProfit: 0 };
    if (!grouped[year].months[month])
      grouped[year].months[month] = { bets: [], totalProfit: 0 };

    // Add the bet to the corresponding month
    grouped[year].months[month].bets.push(bet);

    // Only include verified bets in totalProfit aggregation
    if (bankroll.visibility === "Public") {
      if (bet.isVerified) {
        grouped[year].months[month].totalProfit += Number.parseFloat(
          bet.profit
        );
        grouped[year].totalProfit += Number.parseFloat(bet.profit);
      }
    } else {
      grouped[year].months[month].totalProfit += Number.parseFloat(bet.profit);
      grouped[year].totalProfit += Number.parseFloat(bet.profit);
    }
  });

  const sortedYears = Object.keys(grouped)
    .sort((a, b) => b - a)
    .map((year) => {
      const months = Object.keys(grouped[year].months)
        .sort((a, b) => {
          const monthMap = {
            January: 0,
            February: 1,
            March: 2,
            April: 3,
            May: 4,
            June: 5,
            July: 6,
            August: 7,
            September: 8,
            October: 9,
            November: 10,
            December: 11,
          };
          return monthMap[b] - monthMap[a];
        })
        .map((month) => ({
          month,
          bets: grouped[year].months[month].bets,
          totalProfit: grouped[year].months[month].totalProfit.toFixed(2),
        }));

      return {
        year,
        months,
        totalProfit: grouped[year].totalProfit.toFixed(2),
      };
    });

  return sortedYears;
};

const BankrollView = ({ mode, isViewMode }) => {
  const { id } = useParams();
  const [bankroll, setBankroll] = useState(null);
  const [bets, setBets] = useState([]);
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [betToEdit, setBetToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isShareable, setIsShareable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();

  useEffect(() => {
    fetchBankroll();
  }, [id]);

  const [graphFilters, setGraphFilters] = useState({
    month: null, // Default to null for all data
    year: null, // Default to null for all data
    includeStartingCapital: true,
  });
  const [graphData, setGraphData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    setGraphFilters((prev) => ({ ...prev, [key]: value }));
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 14,
            family: '"Roboto", "Helvetica", "Arial", sans-serif',
            weight: 500,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#ffffff",
        titleColor: theme.palette.mode === "dark" ? "#ffffff" : "#212121",
        bodyColor: theme.palette.mode === "dark" ? "#ffffff" : "#212121",
        titleFont: {
          weight: "bold",
        },
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 10,
        callbacks: {
          title: (tooltipItems) => {
            // Show the date as the title
            return tooltipItems[0].label;
          },
          label: (tooltipItem) => {
            // Show the capital amount
            const value = tooltipItem.raw; // Get the data value
            return `Capital: ${bankroll?.currency?.symbol || "$"}${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
          },
        },
        grid: {
          display: false, // Hide x-axis grid
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
          },
        },
        grid: {
          display: false, // Hide x-axis grid
        },
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
    spanGaps: false,
  };

  const calculateGraphData = (bets) => {
    let currentCapital = graphFilters.includeStartingCapital
      ? bankroll?.startingCapital || 0
      : 0;

    const filteredBets = bets
      .filter((bet) =>
        bankroll.visibility === "Public" ? bet.isVerified : true
      )
      .filter((bet) => {
        const betDate = new Date(bet.date);
        const matchesYear = graphFilters.year
          ? betDate.getFullYear() === graphFilters.year
          : true;
        const matchesMonth = graphFilters.month
          ? betDate.getMonth() + 1 === graphFilters.month
          : true;
        return matchesYear && matchesMonth;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

    const graphPoints = filteredBets.reduce(
      (acc, bet) => {
        currentCapital += Number.parseFloat(bet.profit);
        acc.push(currentCapital);
        return acc;
      },
      [currentCapital]
    );

    setGraphData({
      labels: [
        graphFilters.includeStartingCapital ? "Start" : "Filtered Start",
        ...filteredBets.map((bet) => new Date(bet.date).toLocaleDateString()),
      ],
      datasets: [
        {
          label: "Bankroll Progression",
          data: graphPoints,
          borderColor: theme.palette.primary.main,
          backgroundColor: `${theme.palette.primary.main}20`,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: theme.palette.background.paper,
          pointBorderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    });
  };

  useEffect(() => {
    if (bets && bankroll) {
      calculateGraphData(bets);
    }
  }, [bets, bankroll, graphFilters]);

  const clearFilters = () => {
    setGraphFilters({
      month: null,
      year: null,
      includeStartingCapital: true,
    });
    setShowFilters(false); // Hide filters after clearing
  };

  const fetchBankroll = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/bankrolls/${id}`);
      setBankroll(response.data);
      setBets(response.data?.bets);
      if (isViewMode) {
        setIsShareable(response.data?.isShareable || false);
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error.message || "Failed to fetch bankroll.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBet = () => {
    setBetToEdit(null);
    setBetModalOpen(true);
  };

  const handleEditBet = (bet) => {
    setBetToEdit(bet);
    setBetModalOpen(true);
  };

  const handleBetSubmit = async (betData) => {
    const formData = new FormData();

    // Append all fields to FormData
    formData.append("date", betData.date.toISOString());
    formData.append("sport", betData.sport);
    formData.append("label", betData.label);
    formData.append("odds", betData.odds);
    formData.append("stake", betData.stake);
    formData.append("status", betData.status);
    formData.append("bankrollId", bankroll._id);

    // Append the uploaded image
    if (betData.verificationImage) {
      formData.append("verificationImage", betData.verificationImage);
    }

    // Append cashout-related fields if status is "Cashout"
    if (betData.status === "Cashout") {
      if (betData?.cashoutImage) {
        formData.append("cashoutImage", betData.cashoutImage);
      }
      if (betData?.cashoutAmount) {
        formData.append("cashoutAmount", betData.cashoutAmount);
      }
    }

    try {
      if (betToEdit) {
        const response = await api.put(`/bets/${betToEdit._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setBets((prevBets) =>
          prevBets.map((bet) =>
            bet._id === response.data.bet._id ? response.data.bet : bet
          )
        );
        toast.success("Bet updated successfully");
      } else {
        const response = await api.post("/bets", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setBets((prevBets) => [...prevBets, response.data.bet]);
        toast.success("Bet added successfully");
      }
      fetchBankroll();
      setBetModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting bet");
    }
  };

  const handleDeleteBet = async (bet) => {
    try {
      await api.delete(`/bets/${bet._id}`);
      toast.success("Bet deleted successfully");
      fetchBankroll();
    } catch (error) {
      toast.error("Failed to delete bet");
    }
  };

  const groupedBets = groupBetsByYearAndMonth(
    bankroll || { visibility: "Private" },
    bets
  );
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: isViewMode ? "100vh" : "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: isViewMode ? "100vh" : "50vh",
          p: 3,
        }}
      >
        <Alert
          severity="error"
          sx={{ maxWidth: 500 }}
          action={
            <Button color="inherit" size="small" onClick={fetchBankroll}>
              Retry
            </Button>
          }
        >
          {errorMessage}
        </Alert>
      </Box>
    );
  }

  if (isViewMode && !isShareable) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 3,
        }}
      >
        <Alert severity="info" sx={{ maxWidth: 500 }}>
          This bankroll is not shareable
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        backgroundColor: theme.palette.background.default,
        minHeight: isViewMode ? "100vh" : "100%",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Typography variant="h4" fontWeight={600}>
                {bankroll?.name}
              </Typography>
              {bankroll?.stats?.isVerified && (
                <Tooltip title="Verified Bankroll">
                  <VerifiedIcon
                    sx={{
                      color: theme.palette.success.main,
                      ml: 1,
                      fontSize: "1.25rem",
                    }}
                  />
                </Tooltip>
              )}
              <Chip
                label={bankroll?.visibility}
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor:
                    bankroll?.visibility === "Public"
                      ? theme.palette.success.main
                      : theme.palette.primary.main,
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "0.7rem",
                  height: 20,
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Track your betting performance and analyze your results
            </Typography>
          </Box>

          {!isViewMode ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddBet}
              sx={{
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              Add Bet
            </Button>
          ) : (
            <Chip
              label="View Mode"
              sx={{
                backgroundColor: theme.palette.info.main,
                color: "#fff",
                fontWeight: 500,
              }}
            />
          )}
        </Stack>
      </Paper>

      {/* Chart Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
          mb: 3,
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ShowChartIcon
              sx={{ color: theme.palette.primary.main, mr: 1.5 }}
            />
            <Typography variant="h6" fontWeight={600}>
              Bankroll Progression
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              {showFilters ? "Hide Filters" : "Filter"}
            </Button>

            {showFilters && (
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                startIcon={<ClearAllIcon />}
                onClick={clearFilters}
                sx={{
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Clear
              </Button>
            )}
          </Box>
        </Box>

        {showFilters && (
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.02)",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={graphFilters.month || ""}
                    onChange={(e) =>
                      handleFilterChange("month", e.target.value || null)
                    }
                    label="Month"
                  >
                    <MenuItem value="">All Months</MenuItem>
                    {Array.from({ length: 12 }, (_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("en-US", {
                          month: "long",
                        })}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={graphFilters.year || ""}
                    onChange={(e) =>
                      handleFilterChange("year", e.target.value || null)
                    }
                    label="Year"
                  >
                    <MenuItem value="">All Years</MenuItem>
                    {Array.from(
                      { length: 5 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Starting Capital</InputLabel>
                  <Select
                    value={graphFilters.includeStartingCapital}
                    onChange={(e) =>
                      handleFilterChange(
                        "includeStartingCapital",
                        e.target.value
                      )
                    }
                    label="Starting Capital"
                  >
                    <MenuItem value={true}>Include</MenuItem>
                    <MenuItem value={false}>Exclude</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        <Box sx={{ p: 3 }}>
          <Box sx={{ height: 400 }}>
            {graphData ? (
              <Line data={graphData} options={graphOptions} />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No data available for chart
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {!loading &&
          [
            {
              label: "BETS",
              value: `${bets?.length || 0}`,
              icon: (
                <SportsSoccerIcon
                // sx={{ fontSize: "2rem", color: theme.palette.primary.main }}
                />
              ),
              color: theme.palette.text.primary,
            },
            {
              label: "PROFIT",
              value: `${bankroll?.currency?.symbol || "$"}${
                bankroll?.stats?.totalProfit || 0
              }`,
              icon: (
                <TrendingUpIcon
                // sx={{ fontSize: "2rem", color: theme.palette.success.main }}
                />
              ),
              color:
                (bankroll?.stats?.totalProfit || 0) >= 0
                  ? theme.palette.success.main
                  : theme.palette.error.main,
            },
            {
              label: "ROI",
              value: `${bankroll?.stats?.roi || 0}%`,
              icon: (
                <PercentIcon
                // sx={{ fontSize: "2rem", color: theme.palette.info.main }}
                />
              ),
              color:
                (bankroll?.stats?.roi || 0) >= 0
                  ? theme.palette.success.main
                  : theme.palette.error.main,
            },
            {
              label: "PROGRESSION",
              value: `${bankroll?.stats?.progression || 0}%`,
              icon: (
                <ShowChartIcon
                // sx={{ fontSize: "2rem", color: theme.palette.warning.main }}
                />
              ),
              color:
                (bankroll?.stats?.progression || 0) >= 0
                  ? theme.palette.success.main
                  : theme.palette.error.main,
            },
          ].map((stat, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  height: "100%",
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[2],
                  },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ mb: 1 }}>{stat.icon}</Box>

                <Typography
                  variant="h5"
                  fontWeight={600}
                  sx={{
                    color: stat.color,
                    mb: 0.5,
                  }}
                >
                  {stat.value}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
      </Grid>

      {/* Bets Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SportsSoccerIcon
              sx={{ color: theme.palette.primary.main, mr: 1.5 }}
            />
            <Typography variant="h6" fontWeight={600}>
              Bets
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {groupedBets.length > 0 ? (
            <Box>
              {groupedBets?.map((yearData) => (
                <Accordion
                  key={yearData.year}
                  defaultExpanded={
                    yearData.year.toString() === currentYear.toString()
                  }
                  disableGutters
                  elevation={0}
                  sx={{
                    mb: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    overflow: "hidden",
                    "&:before": {
                      display: "none",
                    },
                    "&.Mui-expanded": {
                      margin: 0,
                      mb: 2,
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.02)",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      minHeight: 56,
                      "&.Mui-expanded": {
                        minHeight: 56,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {yearData.year}
                      </Typography>

                      <Chip
                        label={`${bankroll?.currency?.symbol || "$"}${
                          yearData.totalProfit
                        }`}
                        size="small"
                        sx={{
                          backgroundColor:
                            Number(yearData.totalProfit) >= 0
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0 }}>
                    {yearData.months.map((monthData) => (
                      <Accordion
                        key={monthData.month}
                        disableGutters
                        elevation={0}
                        sx={{
                          border: "none",
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          "&:last-child": {
                            borderBottom: "none",
                          },
                          "&:before": {
                            display: "none",
                          },
                          "&.Mui-expanded": {
                            margin: 0,
                          },
                        }}
                        defaultExpanded={
                          yearData.year.toString() === currentYear.toString() &&
                          monthData.month === currentMonth
                        }
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.03)"
                                : "rgba(0, 0, 0, 0.01)",
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            minHeight: 48,
                            "&.Mui-expanded": {
                              minHeight: 48,
                            },
                            pl: 3,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={800}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              {monthData.month}
                            </Typography>

                            <Chip
                              label={`${bankroll?.currency?.symbol || "$"}${
                                monthData.totalProfit
                              }`}
                              size="small"
                              sx={{
                                backgroundColor:
                                  Number(monthData.totalProfit) >= 0
                                    ? theme.palette.success.main
                                    : theme.palette.error.main,
                                color: "#fff",
                                fontWeight: 500,
                                height: 20,
                                fontSize: "0.7rem",
                              }}
                            />
                          </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: 2 }}>
                          {monthData.bets.map((bet) => (
                            <BetCard
                              isViewMode={isViewMode}
                              mode={mode}
                              bankroll={bankroll}
                              key={bet._id}
                              bet={bet}
                              onEdit={handleEditBet}
                              onDelete={handleDeleteBet}
                            />
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <SportsSoccerIcon
                sx={{
                  fontSize: 48,
                  color: theme.palette.text.secondary,
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                No Bets Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {!isViewMode
                  ? "Add your first bet to start tracking your performance"
                  : "This bankroll has no bets yet"}
              </Typography>

              {!isViewMode && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddBet}
                  sx={{
                    fontWeight: 500,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  Add Your First Bet
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {betModalOpen && (
        <BetModal
          open={betModalOpen}
          bankroll={bankroll}
          onClose={() => setBetModalOpen(false)}
          onSubmit={handleBetSubmit}
          initialData={betToEdit}
          mode={mode}
        />
      )}
    </Box>
  );
};

export default BankrollView;
