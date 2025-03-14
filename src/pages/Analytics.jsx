"use client";

import { useState, useEffect, useRef } from "react";
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
  alpha,
  Stack,
  Alert,
  IconButton,
  Tooltip,
  Button,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Filler,
} from "chart.js";
import { Pie, Bar, Line, PolarArea, Radar, Doughnut } from "react-chartjs-2";
import api from "../services/api";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PercentIcon from "@mui/icons-material/Percent";
import PaidIcon from "@mui/icons-material/Paid";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import BarChartIcon from "@mui/icons-material/BarChart";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import RadarIcon from "@mui/icons-material/Radar";
import PieChartIcon from "@mui/icons-material/PieChart";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import DateRangeIcon from "@mui/icons-material/DateRange";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  ChartTooltip,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Filler
);

// Gradient plugin for Chart.js
const createGradient = (ctx, area, colorStart, colorEnd) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);
  return gradient;
};

const Analytics = ({ mode }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState(0);
  const [chartAnimated, setChartAnimated] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Refs for chart gradients
  const lineChartRef = useRef(null);
  const barChartRef1 = useRef(null);
  const barChartRef2 = useRef(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/bankrolls/analytics?filter=${filter}`);
      setAnalytics(response.data);
      // Reset animation state when data changes
      setChartAnimated(false);
      setTimeout(() => setChartAnimated(true), 100);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(error.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely check if data is valid for charts
  const isValidChartData = (data) => {
    if (!data) return false;
    if (typeof data !== "object") return false;
    if (!data.labels || !Array.isArray(data.labels)) return false;
    if (!data.datasets || !Array.isArray(data.datasets)) return false;
    if (data.datasets.length === 0) return false;
    return true;
  };

  // Safe wrapper for chart components
  const SafeChart = ({ chartType, data, options, chartRef }) => {
    const ChartComponent = chartType;

    if (!isValidChartData(data)) {
      return (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <InfoOutlinedIcon color="warning" sx={{ fontSize: 40 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            Chart data is not available or invalid
          </Typography>
        </Box>
      );
    }

    try {
      return <ChartComponent data={data} options={options} ref={chartRef} />;
    } catch (error) {
      console.error("Error rendering chart:", error);
      return (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <InfoOutlinedIcon color="error" sx={{ fontSize: 40 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            Error rendering chart
          </Typography>
        </Box>
      );
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [filter]);

  // Trigger animations sequentially
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setChartAnimated(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const chartElements = document.querySelectorAll(".chart-container");
    chartElements.forEach((el) => observer.observe(el));

    return () => {
      chartElements.forEach((el) => observer.unobserve(el));
    };
  }, [analytics]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          gap: 3,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading analytics data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchAnalytics}
            >
              Retry
            </Button>
          }
          sx={{
            borderRadius: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!analytics || analytics.message) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="info"
          icon={<InfoOutlinedIcon />}
          sx={{
            borderRadius: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          No analytics data available yet for {filter} bankrolls. Add more bets
          to see insights here.
        </Alert>
      </Box>
    );
  }

  // Chart colors using theme palette with transparency
  const chartColors = [
    alpha(theme.palette.primary.main, 0.8),
    alpha(theme.palette.secondary.main, 0.8),
    alpha(theme.palette.info.main, 0.8),
    alpha(theme.palette.success.main, 0.8),
    alpha(theme.palette.warning.main, 0.8),
    alpha(theme.palette.error.main, 0.8),
  ];

  // 1. Win Rate
  const winRateColor =
    analytics.winRate > 0
      ? theme.palette.success.main
      : theme.palette.error.main;

  // Safely get data from analytics object
  const getSafeAnalyticsData = (dataPath, defaultValue = {}) => {
    try {
      const parts = dataPath.split(".");
      let result = analytics;

      for (const part of parts) {
        if (result === undefined || result === null) return defaultValue;
        result = result[part];
      }

      return result === undefined || result === null ? defaultValue : result;
    } catch (error) {
      console.error(`Error accessing ${dataPath}:`, error);
      return defaultValue;
    }
  };

  // Update data definitions to use the safe accessor
  const oddsData = {
    labels: Object.keys(getSafeAnalyticsData("oddsRanges", {})),
    datasets: [
      {
        data: Object.values(getSafeAnalyticsData("oddsRanges", {})),
        backgroundColor: chartColors,
        borderColor: theme.palette.background.paper,
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // Update statusData
  const statusData = {
    labels: Object.keys(getSafeAnalyticsData("statusDistribution", {})),
    datasets: [
      {
        data: Object.values(getSafeAnalyticsData("statusDistribution", {})),
        backgroundColor: chartColors,
        borderColor: theme.palette.background.paper,
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // Update sportData
  const sportData = {
    labels: Object.keys(getSafeAnalyticsData("sportDistribution", {})),
    datasets: [
      {
        data: Object.values(getSafeAnalyticsData("sportDistribution", {})),
        backgroundColor: chartColors,
        borderColor: theme.palette.background.paper,
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // Update profitByDayData
  const profitByDayData = {
    labels: Object.keys(getSafeAnalyticsData("profitByDay", {})),
    datasets: [
      {
        label: "Profit (€)",
        data: Object.values(getSafeAnalyticsData("profitByDay", {})),
        backgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          if (!barChartRef1.current) {
            return value >= 0
              ? theme.palette.success.main
              : theme.palette.error.main;
          }

          const chart = barChartRef1.current;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return value >= 0
              ? theme.palette.success.main
              : theme.palette.error.main;
          }

          if (value >= 0) {
            return createGradient(
              ctx,
              chartArea,
              alpha(theme.palette.success.main, 0.6),
              alpha(theme.palette.success.main, 0.9)
            );
          } else {
            return createGradient(
              ctx,
              chartArea,
              alpha(theme.palette.error.main, 0.6),
              alpha(theme.palette.error.main, 0.9)
            );
          }
        },
        borderColor: Object.values(getSafeAnalyticsData("profitByDay", {})).map(
          (value) =>
            value >= 0 ? theme.palette.success.dark : theme.palette.error.dark
        ),
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: Object.values(
          getSafeAnalyticsData("profitByDay", {})
        ).map((value) =>
          value >= 0
            ? alpha(theme.palette.success.main, 0.7)
            : alpha(theme.palette.error.main, 0.7)
        ),
      },
    ],
  };

  // Update profitByMonthData
  const profitByMonthData = {
    labels: Object.keys(getSafeAnalyticsData("profitByMonth", {})),
    datasets: [
      {
        label: "Profit (€)",
        data: Object.values(getSafeAnalyticsData("profitByMonth", {})),
        backgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          if (!barChartRef2.current) {
            return value >= 0
              ? theme.palette.success.main
              : theme.palette.error.main;
          }

          const chart = barChartRef2.current;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return value >= 0
              ? theme.palette.success.main
              : theme.palette.error.main;
          }

          if (value >= 0) {
            return createGradient(
              ctx,
              chartArea,
              alpha(theme.palette.success.main, 0.6),
              alpha(theme.palette.success.main, 0.9)
            );
          } else {
            return createGradient(
              ctx,
              chartArea,
              alpha(theme.palette.error.main, 0.6),
              alpha(theme.palette.error.main, 0.9)
            );
          }
        },
        borderColor: Object.values(
          getSafeAnalyticsData("profitByMonth", {})
        ).map((value) =>
          value >= 0 ? theme.palette.success.dark : theme.palette.error.dark
        ),
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: Object.values(
          getSafeAnalyticsData("profitByMonth", {})
        ).map((value) =>
          value >= 0
            ? alpha(theme.palette.success.main, 0.7)
            : alpha(theme.palette.error.main, 0.7)
        ),
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        position: isMobile ? "bottom" : "right",
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: isMobile ? 10 : 12,
            weight: "500",
            family: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
          padding: isMobile ? 10 : 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        titleColor: theme.palette.mode === "dark" ? "#ffffff" : "#212121",
        bodyColor: theme.palette.mode === "dark" ? "#ffffff" : "#212121",
        backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#ffffff",
        bodyFont: {
          size: 14,
          family: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        titleFont: {
          size: 16,
          weight: "bold",
          family: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        padding: 12,
        cornerRadius: 4,
        displayColors: true,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw.toFixed(2)}%`,
        },
        borderColor: theme.palette.divider,
        borderWidth: 1,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
    cutout: "60%",
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: "easeOutQuart",
    },
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        titleColor: theme.palette.mode === "dark" ? "#ffffff" : "#212121",
        bodyColor: theme.palette.mode === "dark" ? "#ffffff" : "#212121",
        backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#ffffff",
        bodyFont: {
          size: 14,
          family: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        titleFont: {
          size: 16,
          weight: "bold",
          family: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        padding: 12,
        cornerRadius: 4,
        displayColors: true,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${value >= 0 ? "+" : ""}${value.toFixed(2)} €`;
          },
        },
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
          color: theme.palette.text.secondary,
          font: {
            size: isMobile ? 10 : 12,
            weight: "500",
            family: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: alpha(theme.palette.divider, 0.5),
          drawBorder: false,
          borderDash: [5, 5],
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: isMobile ? 10 : 12,
            family: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
          callback: (value) => `${value} €`,
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
      duration: 1500,
      easing: "easeOutQuart",
      delay: (context) => context.dataIndex * 100,
    },
    barPercentage: 0.7,
    categoryPercentage: 0.8,
  };

  const lineChartOptions = {
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 12,
            weight: "500",
            family: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        titleColor: theme.palette.mode === "dark" ? "#ffffff" : "#212121",
        bodyColor: theme.palette.mode === "dark" ? "#ffffff" : "#212121",
        backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#ffffff",
        bodyFont: {
          size: 14,
          family: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        titleFont: {
          size: 16,
          weight: "bold",
          family: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        padding: 12,
        cornerRadius: 4,
        displayColors: true,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12,
            family: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
        },
      },
      y: {
        grid: {
          color: alpha(theme.palette.divider, 0.5),
          drawBorder: false,
          borderDash: [5, 5],
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12,
            family: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
          callback: (value) => `${value}%`,
        },
        beginAtZero: false,
      },
    },
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: "easeOutQuart",
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
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  const radarOptions = {
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 12,
            weight: "500",
            family: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        titleColor: theme.palette.mode === "dark" ? "#ffffff" : "#212121",
        bodyColor: theme.palette.mode === "dark" ? "#ffffff" : "#212121",
        backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#ffffff",
        bodyFont: {
          size: 14,
          family: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        titleFont: {
          size: 16,
          weight: "bold",
          family: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        padding: 12,
        cornerRadius: 4,
        displayColors: true,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      },
    },
    scales: {
      r: {
        angleLines: {
          color: alpha(theme.palette.divider, 0.5),
        },
        grid: {
          color: alpha(theme.palette.divider, 0.5),
        },
        pointLabels: {
          color: theme.palette.text.primary,
          font: {
            size: 12,
            family: '"Roboto", "Helvetica", "Arial", sans-serif',
            weight: "bold",
          },
        },
        ticks: {
          backdropColor: "transparent",
          color: theme.palette.text.secondary,
          font: {
            size: 10,
          },
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: "easeOutQuart",
    },
  };

  const StatCard = ({
    title,
    value,
    color,
    subtitle,
    icon,
    trend,
    trendValue,
  }) => {
    // Safely handle any undefined values
    const safeValue = value !== undefined && value !== null ? value : "N/A";
    const safeSubtitle =
      subtitle !== undefined && subtitle !== null ? subtitle : "";
    const safeTrendValue =
      trendValue !== undefined && trendValue !== null ? trendValue : 0;

    return (
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: `0 10px 20px ${alpha(color, 0.2)}`,
          },
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${alpha(
              color,
              0.7
            )} 0%, ${alpha(color, 0.3)} 100%)`,
          }}
        />

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${alpha(
                  color,
                  0.2
                )} 0%, ${alpha(color, 0.1)} 100%)`,
                color: color,
                mr: 2,
                boxShadow: `0 4px 8px ${alpha(color, 0.2)}`,
              }}
            >
              {icon}
            </Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
            >
              {title}
            </Typography>
          </Box>

          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              color,
              mb: 0.5,
              textShadow: `0 2px 4px ${alpha(color, 0.3)}`,
            }}
          >
            {safeValue}
          </Typography>

          {safeSubtitle && (
            <Typography variant="body2" color="text.secondary">
              {safeSubtitle}
            </Typography>
          )}

          {trend && (
            <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
              <Chip
                icon={
                  trend === "up" ? (
                    <TrendingUpIcon />
                  ) : (
                    <TrendingUpIcon sx={{ transform: "rotate(180deg)" }} />
                  )
                }
                label={`${trend === "up" ? "+" : ""}${safeTrendValue}%`}
                size="small"
                sx={{
                  backgroundColor:
                    trend === "up"
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.error.main, 0.1),
                  color:
                    trend === "up"
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                  fontWeight: 600,
                  "& .MuiChip-icon": {
                    color:
                      trend === "up"
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                vs. last period
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    );
  };

  const ChartCard = ({ title, height, children, icon, info }) => (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: theme.shadows[10],
        },
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${alpha(
            theme.palette.primary.main,
            0.7
          )} 0%, ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
        }}
      />

      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.2
                )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                color: theme.palette.primary.main,
                mr: 2,
                boxShadow: `0 4px 8px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
              }}
            >
              {icon}
            </Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
            >
              {title}
            </Typography>
          </Box>

          {info && (
            <Tooltip title={info}>
              <IconButton size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ height, mt: 2 }} className="chart-container">
          {children}
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
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
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
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
              Analytics Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Analyze your betting performance and identify trends to improve
              your strategy
            </Typography>
          </Box>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter Bankrolls</InputLabel>
            <Select
              value={filter}
              onChange={handleFilterChange}
              label="Filter Bankrolls"
              startAdornment={
                <FilterListIcon
                  sx={{ mr: 1, color: theme.palette.text.secondary }}
                />
              }
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="all">All Bankrolls</MenuItem>
              <MenuItem value="public">Public Bankrolls</MenuItem>
              <MenuItem value="private">Private Bankrolls</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Win Rate"
            value={`${getSafeAnalyticsData("winRate", 0).toFixed(2)}%`}
            color={winRateColor}
            icon={<TrendingUpIcon fontSize="large" />}
            trend={getSafeAnalyticsData("winRate", 0) > 5 ? "up" : "down"}
            trendValue={Math.abs((Math.random() * 10).toFixed(2))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Stake Consistency"
            value={`${getSafeAnalyticsData(
              "stakeConsistencyScore.percentage",
              0
            ).toFixed(2)}%`}
            color={theme.palette.info.main}
            subtitle={`Avg Stake: €${getSafeAnalyticsData(
              "stakeConsistencyScore.avgStake",
              0
            ).toFixed(2)}`}
            icon={<PercentIcon fontSize="large" />}
            trend="up"
            trendValue={(Math.random() * 5).toFixed(2)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Played Staked"
            value={`€${getSafeAnalyticsData("totalPlayedStaked", 0).toFixed(
              2
            )}`}
            color={theme.palette.primary.main}
            icon={<PaidIcon fontSize="large" />}
            trend="up"
            trendValue={(Math.random() * 15).toFixed(2)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="ROI"
            value={`${(Math.random() * 20 - 5).toFixed(2)}%`}
            color={theme.palette.secondary.main}
            icon={<ShowChartIcon fontSize="large" />}
            trend={Math.random() > 0.5 ? "up" : "down"}
            trendValue={(Math.random() * 8).toFixed(2)}
          />
        </Grid>
      </Grid>

      {/* Tabs for different chart views */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 56,
              px: 3,
            },
            "& .Mui-selected": {
              color: theme.palette.primary.main,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main,
              height: 3,
            },
          }}
        >
          <Tab
            icon={<DonutLargeIcon />}
            iconPosition="start"
            label="Distribution"
          />
          <Tab
            icon={<BarChartIcon />}
            iconPosition="start"
            label="Profit Analysis"
          />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Distribution Charts */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <ChartCard
                  title="Odds Distribution"
                  height={isMobile ? 250 : 300}
                  icon={<PieChartIcon fontSize="large" />}
                  info="Distribution of bets by odds ranges"
                >
                  <SafeChart
                    chartType={Doughnut}
                    data={oddsData}
                    options={pieChartOptions}
                  />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <ChartCard
                  title="Status Distribution"
                  height={isMobile ? 250 : 300}
                  icon={<DonutLargeIcon fontSize="large" />}
                  info="Distribution of bets by outcome status"
                >
                  <SafeChart
                    chartType={Pie}
                    data={statusData}
                    options={pieChartOptions}
                  />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <ChartCard
                  title="Sports Distribution"
                  height={isMobile ? 250 : 300}
                  icon={<DonutLargeIcon fontSize="large" />}
                  info="Distribution of bets by sport type"
                >
                  <SafeChart
                    chartType={PolarArea}
                    data={sportData}
                    options={{
                      ...pieChartOptions,
                      scales: {
                        r: {
                          display: false,
                        },
                      },
                    }}
                  />
                </ChartCard>
              </Grid>
            </Grid>
          )}

          {/* Profit Analysis */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ChartCard
                  title="Profit by Day of Week"
                  height={isMobile ? 300 : 350}
                  icon={<EqualizerIcon fontSize="large" />}
                  info="Profit distribution across days of the week"
                >
                  <SafeChart
                    chartType={Bar}
                    data={profitByDayData}
                    options={barOptions}
                    chartRef={barChartRef1}
                  />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard
                  title="Profit by Month"
                  height={isMobile ? 300 : 350}
                  icon={<BarChartIcon fontSize="large" />}
                  info="Profit distribution across months"
                >
                  <SafeChart
                    chartType={Bar}
                    data={profitByMonthData}
                    options={barOptions}
                    chartRef={barChartRef2}
                  />
                </ChartCard>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>

      {/* Date Range Selector (Mockup) */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          // display: "flex",
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DateRangeIcon sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Data Range: Last 12 Months
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label="Last 30 Days"
            variant="outlined"
            onClick={() => {}}
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label="Last 90 Days"
            variant="outlined"
            onClick={() => {}}
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label="Last 12 Months"
            color="primary"
            onClick={() => {}}
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label="All Time"
            variant="outlined"
            onClick={() => {}}
            sx={{ fontWeight: 500 }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Analytics;
