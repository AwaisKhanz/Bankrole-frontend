"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
  alpha,
} from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import api from "../services/api";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const Analytics = ({ mode }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // Default filter
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/bankrolls/analytics?filter=${filter}`);
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={4} color="primary" />
      </Box>
    );
  }

  if (!analytics || analytics.message) {
    return (
      <Box sx={{ textAlign: "center", mt: 5, p: 3 }}>
        <Typography variant="h5" color="text.secondary">
          No analytics data available yet for {filter} bankrolls.
        </Typography>
      </Box>
    );
  }

  const isDark = mode === "dark";
  const backgroundColor = isDark ? "#1e293b" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#000000";
  const chartTextColor = isDark ? "#E0E0E0" : "#424770";
  const chartColors = [
    "#3f51b5", // Indigo (primary)
    "#2196f3", // Blue
    "#00acc1", // Cyan
    "#43a047", // Green
    "#ff9800", // Orange
    "#f44336", // Red
  ];

  // 1. Win Rate
  const winRateColor =
    analytics.winRate > 0
      ? theme.palette.success.main
      : theme.palette.error.main;

  // 4. Odds Ranges Data for Pie Chart
  const oddsData = {
    labels: Object.keys(analytics.oddsRanges),
    datasets: [
      {
        data: Object.values(analytics.oddsRanges),
        backgroundColor: chartColors,
        borderColor: backgroundColor,
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // 5. Status Distribution for Pie Chart
  const statusData = {
    labels: Object.keys(analytics.statusDistribution),
    datasets: [
      {
        data: Object.values(analytics.statusDistribution),
        backgroundColor: chartColors,
        borderColor: backgroundColor,
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // 6. Sports Distribution for Pie Chart
  const sportData = {
    labels: Object.keys(analytics.sportDistribution),
    datasets: [
      {
        data: Object.values(analytics.sportDistribution),
        backgroundColor: chartColors,
        borderColor: backgroundColor,
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // 7. Profit by Day for Bar Chart
  const profitByDayData = {
    labels: Object.keys(analytics.profitByDay),
    datasets: [
      {
        label: "Profit (€)",
        data: Object.values(analytics.profitByDay),
        backgroundColor: Object.values(analytics.profitByDay).map(
          (value) => (value >= 0 ? "#4CAF50" : "#F44336") // Solid green for positive, red for negative
        ),
        borderColor: Object.values(analytics.profitByDay).map(
          (value) => (value >= 0 ? "#388E3C" : "#D32F2F") // Darker green/red for borders
        ),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // 8. Profit by Month for Bar Chart
  const profitByMonthData = {
    labels: Object.keys(analytics.profitByMonth),
    datasets: [
      {
        label: "Profit (€)",
        data: Object.values(analytics.profitByMonth),
        backgroundColor: Object.values(analytics.profitByMonth).map(
          (value) => (value >= 0 ? "#4CAF50" : "#F44336") // Solid green for positive, red for negative
        ),
        borderColor: Object.values(analytics.profitByMonth).map(
          (value) => (value >= 0 ? "#388E3C" : "#D32F2F") // Darker green/red for borders
        ),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        position: isMobile ? "bottom" : "right",
        labels: {
          color: chartTextColor,
          font: {
            size: isMobile ? 10 : 12,
            weight: "bold",
          },
          padding: isMobile ? 10 : 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        titleColor: chartTextColor,
        bodyColor: chartTextColor,
        backgroundColor: isDark ? alpha("#000000", 0.9) : alpha("#ffffff", 0.9),
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
          weight: "bold",
        },
        padding: 12,
        cornerRadius: 4,
        displayColors: true,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw.toFixed(2)}%`,
        },
      },
      datalabels: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
    cutout: "50%",
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        titleColor: chartTextColor,
        bodyColor: chartTextColor,
        backgroundColor: isDark ? alpha("#000000", 0.9) : alpha("#ffffff", 0.9),
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
          weight: "bold",
        },
        padding: 12,
        cornerRadius: 4,
        displayColors: true,
      },
      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: chartTextColor,
          font: {
            size: isMobile ? 10 : 12,
            weight: "bold",
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: isDark ? alpha("#ffffff", 0.1) : alpha("#000000", 0.1),
          drawBorder: false,
        },
        ticks: {
          color: chartTextColor,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
        beginAtZero: true,
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  const StatCard = ({ title, value, color, subtitle }) => (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        backgroundColor: isDark
          ? alpha(theme.palette.background.paper, 0.8)
          : theme.palette.background.paper,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
        borderLeft: `4px solid ${color}`,
      }}
    >
      <CardContent sx={{ textAlign: "center", p: 3 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color, fontWeight: "bold", my: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const ChartCard = ({ title, height, children }) => (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        backgroundColor: isDark
          ? alpha(theme.palette.background.paper, 0.8)
          : theme.palette.background.paper,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
        borderTop: `4px solid ${theme.palette.primary.main}`,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
          textAlign="center"
          sx={{ fontWeight: "medium" }}
        >
          {title}
        </Typography>
        <Box sx={{ height, mt: 2 }}>{children}</Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: { xs: "16px", sm: "24px", md: "32px" },
        backgroundColor: "transparent",
        color: textColor,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: "16px",
          backgroundColor,
          boxShadow: isDark
            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
            : "0 8px 32px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          sx={{
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            color: isDark ? "white" : "black",
          }}
        >
          Analytics Dashboard
        </Typography>

        {/* Filter Dropdown */}
        <FormControl
          sx={{
            mb: 4,
            width: { xs: "100%", sm: "50%", md: "300px" },
            mx: "auto",
          }}
        >
          <InputLabel>Filter Bankrolls</InputLabel>
          <Select
            value={filter}
            onChange={handleFilterChange}
            label="Filter Bankrolls"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark
                  ? alpha("#ffffff", 0.3)
                  : alpha("#000000", 0.23),
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark
                  ? alpha("#ffffff", 0.5)
                  : alpha("#000000", 0.5),
              },
            }}
          >
            <MenuItem value="all">All Bankrolls</MenuItem>
            <MenuItem value="public">Public Bankroll</MenuItem>
            <MenuItem value="private">Private Bankroll</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ mb: 4, opacity: 0.6 }} />

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Win Rate"
              value={`${analytics.winRate.toFixed(2)}%`}
              color={winRateColor}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Stake Consistency"
              value={`${analytics.stakeConsistencyScore.percentage.toFixed(
                2
              )}%`}
              color={theme.palette.info.main}
              subtitle={`Avg Stake: €${analytics.stakeConsistencyScore.avgStake.toFixed(
                2
              )}`}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Total Played Staked"
              value={`€${analytics.totalPlayedStaked.toFixed(2)}`}
              color={theme.palette.primary.secondary}
            />
          </Grid>
        </Grid>

        {/* Distribution Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <ChartCard title="Odds Distribution" height={isMobile ? 200 : 250}>
              <Pie data={oddsData} options={pieChartOptions} />
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartCard
              title="Status Distribution"
              height={isMobile ? 200 : 250}
            >
              <Pie data={statusData} options={pieChartOptions} />
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartCard
              title="Sports Distribution"
              height={isMobile ? 200 : 250}
            >
              <Pie data={sportData} options={pieChartOptions} />
            </ChartCard>
          </Grid>
        </Grid>

        {/* Profit Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ChartCard
              title="Profit by Day of Week"
              height={isMobile ? 250 : 300}
            >
              <Bar data={profitByDayData} options={barOptions} />
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartCard title="Profit by Month" height={isMobile ? 250 : 300}>
              <Bar data={profitByMonthData} options={barOptions} />
            </ChartCard>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Analytics;
