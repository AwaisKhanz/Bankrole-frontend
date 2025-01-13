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

const graphOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        color: "#ffffff",
        font: {
          size: 14,
          family: "Arial, sans-serif",
        },
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(255, 255, 255, 0.9)", // Light background
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
        color: "#ffffff",
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
    },
    y: {
      ticks: {
        color: "#ffffff",
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
    },
  },
  spanGaps: false,
};

const groupBetsByYearAndMonth = (bets) => {
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
    if (bet.isVerified) {
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

const BankrollView = () => {
  const { id } = useParams();
  const [bankroll, setBankroll] = useState(null);
  const [bets, setBets] = useState([]);
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [betToEdit, setBetToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBankroll();
  }, [id]);

  const [graphFilters, setGraphFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    includeStartingCapital: true,
  });

  const [graphData, setGraphData] = useState(null);

  const handleFilterChange = (key, value) => {
    setGraphFilters((prev) => ({ ...prev, [key]: value }));
  };

  const calculateGraphData = (bets) => {
    let currentCapital = graphFilters.includeStartingCapital
      ? bankroll?.startingCapital || 0
      : 0;

    const filteredBets = bets
      .filter((bet) => bet.isVerified)
      .filter((bet) => {
        const betDate = new Date(bet.date);
        return (
          graphFilters.includeStartingCapital ||
          (betDate.getFullYear() === graphFilters.year &&
            betDate.getMonth() + 1 === graphFilters.month)
        );
      });

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
  }, [bets, graphFilters]);

  const fetchBankroll = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/bankrolls/${id}`);
      setBankroll(response.data);
      setBets(response.data?.bets);
    } catch (error) {
      console.log(error);
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
    console.log(betData);

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

  const groupedBets = groupBetsByYearAndMonth(bets);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  return (
    <Box
      sx={{
        padding: "2rem",
        background: "linear-gradient(to bottom, #192232, #1e293b)",
        color: "#fff",
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
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddBet}
          sx={{ marginBottom: "1rem" }}
        >
          Add Bet
        </Button>
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
            height: "500px",
            background: "rgba(22, 73, 255, 0.1)",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "2rem",
            position: "relative",
          }}
        >
          {/* Filters Above the Graph */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 1,
            }}
          >
            <FormControl
              sx={{
                minWidth: "80px",
                maxWidth: "120px",
              }}
            >
              <Select
                value={graphFilters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  fontSize: "0.875rem", // Smaller font for compact look
                  height: "30px", // Small height
                  "& .MuiSelect-select": {
                    padding: "4px 8px", // Reduced padding inside the Select
                  },
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{
                minWidth: "80px",
                maxWidth: "120px",
              }}
            >
              <Select
                value={graphFilters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  fontSize: "0.875rem", // Smaller font for compact look
                  height: "30px", // Small height
                  "& .MuiSelect-select": {
                    padding: "4px 8px", // Reduced padding inside the Select
                  },
                }}
              >
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
            <Button
              variant={
                graphFilters.includeStartingCapital ? "contained" : "outlined"
              }
              onClick={() =>
                handleFilterChange(
                  "includeStartingCapital",
                  !graphFilters.includeStartingCapital
                )
              }
              sx={{
                textTransform: "none",
                padding: "1px 16px",
                fontSize: "0.875rem",
                fontWeight: "bold",
                borderRadius: "8px",
                backgroundColor: graphFilters.includeStartingCapital
                  ? "#1649FF"
                  : "transparent",
                color: graphFilters.includeStartingCapital
                  ? "#FFFFFF"
                  : "#1649FF",
                border: graphFilters.includeStartingCapital
                  ? "none"
                  : "2px solid #1649FF",
                boxShadow: graphFilters.includeStartingCapital
                  ? "0px 4px 12px rgba(22, 73, 255, 0.4)"
                  : "none",
                "&:hover": {
                  backgroundColor: graphFilters.includeStartingCapital
                    ? "#123FCC"
                    : "rgba(22, 73, 255, 0.1)",
                  boxShadow: "0px 6px 16px rgba(22, 73, 255, 0.4)",
                },
              }}
            >
              {graphFilters.includeStartingCapital
                ? "From Start"
                : "From Filtered Date"}
            </Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "85%",
              background: "rgba(22, 73, 255, 0.1)",
              borderRadius: "12px",
              padding: "1rem",
              marginTop: "3rem",
              marginBottom: "2rem",
            }}
          >
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
          padding: "1.5rem",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {!loading &&
          [
            {
              label: "BETS",
              value: `${bets?.length}`,
              color: "white",
            },
            {
              label: "PROFIT",
              value: `${bankroll?.stats?.totalProfit}${bankroll?.currency?.symbol}`,
              color: bankroll?.stats?.totalProfit >= 0 ? "white" : "#FF5252",
            },
            {
              label: "ROI",
              value: `${bankroll?.stats?.roi}%`,
              color: bankroll?.stats?.roi >= 0 ? "white" : "#FF5252",
            },
            {
              label: "PROGRESSION",
              value: `${bankroll?.stats?.progression}%`,
              color: bankroll?.stats?.progression >= 0 ? "white" : "#FF5252",
            },
          ].map((stat, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                backgroundColor: "#334155",
                borderRadius: "12px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Stat Value */}
              <Typography
                variant="h6"
                fontWeight="bold"
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
                  color: "rgba(255, 255, 255, 0.7)",
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
          marginTop: "1rem",
          marginBottom: "1rem",
          fontWeight: "bold",
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
            background: "#1e293b",
            padding: "1rem",
            borderRadius: "12px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          {groupedBets?.map((yearData) => (
            <Accordion
              key={yearData.year}
              sx={{
                backgroundColor: "#334155",
                color: "#ffffff",
                marginBottom: "1rem",
                borderRadius: "8px",
                boxShadow: "none",
                "&.Mui-expanded": {
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
                  border:
                    yearData.totalProfit >= 0
                      ? "2px solid #4CAF50"
                      : "2px solid #FF5252",
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
                      fontWeight: "bold",
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
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontWeight: "bold",
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
                      backgroundColor: "#192232",
                      color: "#ffffff",
                      marginBottom: "0.5rem",
                      borderRadius: "8px",
                      boxShadow: "none",
                      "&.Mui-expanded": {
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)",
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
                          fontWeight: "bold",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: "16px", md: "20px" },
                            fontWeight: "bold",
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
                            borderRadius: "8px",
                            color: "#ffffff",
                            fontWeight: "bold",
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
        "No bets"
      )}

      {betModalOpen && (
        <BetModal
          open={betModalOpen}
          bankroll={bankroll}
          onClose={() => setBetModalOpen(false)}
          onSubmit={handleBetSubmit}
          initialData={betToEdit}
        />
      )}
    </Box>
  );
};

export default BankrollView;
