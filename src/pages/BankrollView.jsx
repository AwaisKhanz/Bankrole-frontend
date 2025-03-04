import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Line } from "react-chartjs-2";
import BetCard from "../components/BetCard";
import BetModal from "../components/BetModal";
import VerifiedIcon from "@mui/icons-material/Verified";
import api from "../services/api";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
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
  Tooltip,
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
        grouped[year].months[month].totalProfit += parseFloat(bet.profit);
        grouped[year].totalProfit += parseFloat(bet.profit);
      }
    } else {
      grouped[year].months[month].totalProfit += parseFloat(bet.profit);
      grouped[year].totalProfit += parseFloat(bet.profit);
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
  console.log(mode);
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
          color: mode === "dark" ? "white" : "black",
          font: {
            size: 14,
            family: "Arial, sans-serif",
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: mode === "dark" ? "white" : "white",
        titleColor: "#000000",
        titleFont: {
          weight: "bold",
        },
        bodyColor: "#000000", // Black body text
        borderColor: "#4CAF50", // Green border
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
            return `Capital: ${value}$`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: mode === "dark" ? "white" : "black",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: mode === "dark" ? "white" : "black",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
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
        currentCapital += parseFloat(bet.profit);
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
          borderColor: "#1649ff",
          backgroundColor: "rgba(22, 73, 255, 0.4)",
          pointBackgroundColor: "#ffffff",
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

    // ✅ Append the uploaded image
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
      } else {
        const response = await api.post("/bets", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setBets((prevBets) => [...prevBets, response.data.bet]);
      }
      fetchBankroll();
      setBetModalOpen(false);
    } catch (error) {
      console.error(error.response?.data?.message || "Error submitting bet.");
    }
  };

  const handleDeleteBet = async (bet) => {
    try {
      await api.delete(`/bets/${bet._id}`);
      toast.success("Bet deleted successfully.");
      fetchBankroll();
    } catch (error) {
      toast.error("Failed to delete bet.");
    }
  };

  const groupedBets = groupBetsByYearAndMonth(bankroll, bets);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: isViewMode ? error && "100vh" : "100%",
          color: mode === "dark" ? "white" : "black",
        }}
      >
        {errorMessage}
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
          color: mode === "dark" ? "white" : "black",
        }}
      >
        This bankroll is not shareable.
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "2rem",
        background: theme.palette.primary.main,
        minHeight: isViewMode ? "100vh" : "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          fontWeight="bold"
          gutterBottom
          sx={{
            textTransform: "uppercase",
            fontSize: { xs: "20px", md: "32px" },
            color: mode === "dark" ? "white" : "black",
          }}
        >
          {bankroll?.name}
          {bankroll?.stats.isVerified && (
            <VerifiedIcon
              sx={{
                color: "#4CAF50",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                marginLeft: "6px",
                marginBottom: "6px",
              }}
              titleAccess="Verified Bankroll"
            />
          )}
          <Chip
            label={bankroll?.visibility}
            sx={{
              backgroundColor:
                bankroll?.visibility === "Public" ? "#4CAF50" : "#1649FF",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: "bold",
              marginLeft: "8px",
              textTransform: "uppercase",
            }}
          />
        </Typography>
        {!isViewMode ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddBet}
            sx={{ marginBottom: "1rem" }}
          >
            Add Bet
          </Button>
        ) : (
          <Chip
            label={"View Mode"}
            sx={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: "bold",
              marginLeft: "8px",
              textTransform: "uppercase",
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* Chart Section */}
        <Box
          sx={{
            width: "100%",
            background: mode === "dark" ? "rgba(22, 73, 255, 0.1)" : "white",
            borderRadius: "12px",
            padding: "1rem",
            position: "relative",
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: mode === "dark" ? "white" : "black" }}
            >
              Bankroll Progression
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowFilters(!showFilters)}
                sx={{ color: mode === "dark" ? "white" : "black" }}
              >
                {showFilters ? "Hide Filters" : "Filter"}
              </Button>
              {showFilters && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={clearFilters}
                  sx={{ color: mode === "dark" ? "white" : "black" }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          </Box>

          {showFilters && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "1rem",
                mb: 2,
              }}
            >
              <FormControl sx={{ minWidth: "80px", maxWidth: "120px" }}>
                <Select
                  value={graphFilters.month || ""}
                  onChange={(e) =>
                    handleFilterChange("month", e.target.value || null)
                  }
                  displayEmpty
                  sx={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: mode === "dark" ? "white" : "black",
                    fontSize: "0.875rem",
                    height: "30px",
                    "& .MuiSelect-select": { padding: "4px 8px" },
                  }}
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
              <FormControl sx={{ minWidth: "80px", maxWidth: "120px" }}>
                <Select
                  value={graphFilters.year || ""}
                  onChange={(e) =>
                    handleFilterChange("year", e.target.value || null)
                  }
                  displayEmpty
                  sx={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: mode === "dark" ? "white" : "black",
                    fontSize: "0.875rem",
                    height: "30px",
                    "& .MuiSelect-select": { padding: "4px 8px" },
                  }}
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
            </Box>
          )}

          <Box sx={{ height: "400px" }}>
            {graphData ? (
              <Line data={graphData} options={graphOptions} />
            ) : (
              <Typography>Loading Graph...</Typography>
            )}
          </Box>
        </Box>
      </Box>
      {/* Stats Section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          padding: "1.5rem 0",
          gap: "1rem",
        }}
      >
        {!loading &&
          [
            {
              label: "BETS",
              value: `${bets?.length}`,
              color: mode === "dark" ? "white" : "black",
            },
            {
              label: "PROFIT",
              value: `${bankroll?.stats?.totalProfit}${bankroll?.currency?.symbol}`,
              color:
                bankroll?.stats?.totalProfit >= 0
                  ? mode === "dark"
                    ? "white"
                    : "black"
                  : "#FF5252",
            },
            {
              label: "ROI",
              value: `${bankroll?.stats?.roi}%`,
              color:
                bankroll?.stats?.roi >= 0
                  ? mode === "dark"
                    ? "white"
                    : "black"
                  : "#FF5252",
            },
            {
              label: "PROGRESSION",
              value: `${bankroll?.stats?.progression}%`,
              color:
                bankroll?.stats?.progression >= 0
                  ? mode === "dark"
                    ? "white"
                    : "black"
                  : "#FF5252",
            },
          ].map((stat, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,

                borderRadius: "12px",
                padding: "1.5rem",
                display: "flex",
                bgcolor:
                  mode === "dark" ? theme.palette.secondary.main : "white",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                boxShadow: 2,
                ":hover": {
                  bgcolor:
                    mode === "dark" ? theme.palette.secondary.main : "#eeeeee",
                },
              }}
            >
              {/* Stat Value */}
              <Typography
                variant="h6"
                fontWeight="500"
                sx={{
                  color: stat.color,
                  fontSize: "1.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                {stat.value}
              </Typography>

              {/* Stat Label */}
              <Typography
                variant="caption"
                sx={{
                  color: mode === "dark" ? "white" : "black",
                  textTransform: "uppercase",
                  fontSize: "0.9rem",
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
      </Box>

      {/* Bets Section */}
      <Typography
        variant="h5"
        sx={{
          marginBottom: "1rem",
          fontWeight: "bold",
          color: mode === "dark" ? "white" : "black",
        }}
      >
        Bets
      </Typography>
      {groupedBets.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            borderRadius: "12px",

            background: mode === "dark" ? theme.palette.tertiary.main : "white",
          }}
        >
          {groupedBets?.map((yearData) => (
            <Accordion
              key={yearData.year}
              sx={{
                background: theme.palette.secondary.main,
                marginBottom: "1rem",
                borderRadius: "12px",
                boxShadow: "none",
                "&.Mui-expanded": {
                  borderRadius: "12px",
                  boxShadow: mode
                    ? "0px 2px 6px rgba(0, 0, 0, 0.1)"
                    : "0px 2px 6px rgba(0, 0, 0, 0.05)",
                },
              }}
              defaultExpanded={
                yearData.year.toString() === currentYear.toString()
              }
            >
              <AccordionSummary
                sx={{
                  "&.Mui-expanded": {},
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "18px", md: "24px" },
                      fontWeight: "500",
                    }}
                  >
                    {yearData.year}
                  </Typography>
                  {/* Profit or Loss on the right */}
                  <Box
                    sx={{
                      backgroundColor:
                        yearData.totalProfit >= 0 ? "#4CAF50" : "#FF5252",
                      padding: "0.5rem 1rem",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontWeight: "500",
                    }}
                  >
                    <Typography sx={{ marginRight: "0.5rem" }}>
                      {bankroll.currency.symbol}
                      {yearData.totalProfit}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {yearData.months.map((monthData) => (
                  <Accordion
                    key={monthData.month}
                    sx={{
                      background:
                        mode === "dark"
                          ? theme.palette.primary.main
                          : "#eeeeee",
                      marginBottom: "0.5rem",
                      borderRadius: "12px",
                      boxShadow: "none",
                      "&.Mui-expanded": {
                        borderRadius: "12px",
                        boxShadow: mode
                          ? "0px 2px 6px rgba(0, 0, 0, 0.1)"
                          : "0px 2px 6px rgba(0, 0, 0, 0.05)",
                      },
                    }}
                    defaultExpanded={
                      yearData.year.toString() === currentYear.toString() &&
                      monthData.month === currentMonth
                    }
                  >
                    <AccordionSummary
                      sx={{
                        "&.Mui-expanded": {},
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems: "center",
                          fontWeight: "500",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: "16px", md: "20px" },
                            fontWeight: "500",
                          }}
                        >
                          {monthData.month}
                        </Typography>
                        {/* Profit or Loss on the right */}
                        <Box
                          sx={{
                            backgroundColor:
                              monthData.totalProfit >= 0
                                ? "#4CAF50"
                                : "#FF5252",
                            padding: "0.4rem 0.8rem",
                            borderRadius: "12px",
                            color: "#ffffff",
                            fontWeight: "500",
                          }}
                        >
                          <Typography sx={{ marginRight: "0.5rem" }}>
                            {bankroll.currency.symbol}
                            {monthData.totalProfit}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      {monthData.bets.map((bet) => (
                        <BetCard
                          isViewMode={isViewMode}
                          mode={mode}
                          bankroll={bankroll}
                          key={bet.id}
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
        <Box sx={{ color: mode === "dark" ? "white" : "black" }}>No bets</Box>
      )}

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
