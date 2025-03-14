"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Chip,
  useTheme,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Avatar,
  Tooltip,
  useMediaQuery,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  Fade,
} from "@mui/material";
import api from "../services/api"; // Replace with your actual API service
import { useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CloseIcon from "@mui/icons-material/Close";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PercentIcon from "@mui/icons-material/Percent";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import PieChartIcon from "@mui/icons-material/PieChart";
import { forwardRef } from "react";

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend);

// Transition component for the dialog
const Transition = forwardRef(function Transition(props, ref) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  return isMobile ? (
    <Slide direction="up" ref={ref} {...props} />
  ) : (
    <Fade ref={ref} {...props} />
  );
});

const Ranking = ({ mode }) => {
  const [topBankrolls, setTopBankrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get("page") || 0),
    pageSize: Number(searchParams.get("limit") || 10),
    total: 0,
  });

  // Fetch top bankrolls
  const fetchTopBankrolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/bankrolls/top", {
        params: {
          search: searchParams.get("search") || "",
          page: pagination.page + 1,
          limit: pagination.pageSize,
        },
      });
      setTopBankrolls(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.length > 0 ? response.data[0].totalCount || 0 : 0,
      }));
    } catch (error) {
      console.error("Error fetching top bankrolls:", error);
      setError("Failed to fetch top bankrolls. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopBankrolls();
  }, [searchParams]);

  useEffect(() => {
    if (
      !searchParams.has("page") ||
      !searchParams.has("limit") ||
      !searchParams.has("search")
    ) {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (!params.has("page")) params.set("page", "0");
        if (!params.has("limit")) params.set("limit", "10");
        if (!params.has("search")) params.set("search", "");
        return params;
      });
    }
  }, [searchParams, setSearchParams]);

  const handlePaginationModelChange = (model) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", model.page);
      params.set("limit", model.pageSize);
      return params;
    });
    setPagination((prev) => ({
      ...prev,
      page: model.page,
      pageSize: model.pageSize,
    }));
  };

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    // Optional: delay clearing the selected row until after the dialog closes
    setTimeout(() => {
      setSelectedRow(null);
    }, 300);
  };

  // Data for Pie Charts
  const getStatusBetData = (selectedRow) => {
    const statusBetDistribution = selectedRow?.stats?.statusBetDistribution || {
      Won: 0,
      Loss: 0,
      Void: 0,
      "Cash Out": 0,
    };

    return {
      labels: Object.keys(statusBetDistribution),
      datasets: [
        {
          data: Object.values(statusBetDistribution),
          backgroundColor: [
            theme.palette.success.main, // Won
            theme.palette.error.main, // Loss
            theme.palette.warning.main, // Void
            theme.palette.secondary.main, // Cash Out
          ],
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  };

  const getSportBetData = (selectedRow) => {
    const sportBetDistribution = selectedRow?.stats?.sportBetDistribution || {
      Football: 0,
      Tennis: 0,
      Basketball: 0,
      Volleyball: 0,
      "American Football": 0,
      "Ice Hockey": 0,
      "Other Sport": 0,
    };

    return {
      labels: Object.keys(sportBetDistribution),
      datasets: [
        {
          data: Object.values(sportBetDistribution),
          backgroundColor: [
            theme.palette.primary.main, // Football
            "#E91E63", // Tennis - Pink
            "#FF9800", // Basketball - Orange
            "#00BCD4", // Volleyball - Cyan
            "#3F51B5", // American Football - Indigo
            "#03A9F4", // Ice Hockey - Light Blue
            theme.palette.grey[500], // Other Sport
          ],
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return (
          <Avatar
            sx={{
              bgcolor: "gold",
              width: 36,
              height: 36,
              boxShadow: 2,
              color: "#000",
            }}
          >
            <EmojiEventsIcon />
          </Avatar>
        );
      case 2:
        return (
          <Avatar
            sx={{
              bgcolor: "silver",
              width: 36,
              height: 36,
              boxShadow: 1,
              color: "#000",
            }}
          >
            <LooksTwoIcon />
          </Avatar>
        );
      case 3:
        return (
          <Avatar
            sx={{
              bgcolor: "#cd7f32",
              width: 36,
              height: 36,
              boxShadow: 1,
              color: "#fff",
            }}
          >
            <Looks3Icon />
          </Avatar>
        );
      default:
        return (
          <Avatar
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.08)",
              color: theme.palette.text.primary,
              width: 36,
              height: 36,
            }}
          >
            {rank}
          </Avatar>
        );
    }
  };

  const columns = [
    {
      field: "rank",
      headerName: "Rank",
      flex: 0.5,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const sortedRowIds = params.api.getSortedRowIds();
        const rank = sortedRowIds.indexOf(params.id) + 1;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {getRankIcon(rank)}
          </Box>
        );
      },
    },
    {
      field: "name",
      headerName: "Bankroll Name",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row?.name || "N/A",
      renderCell: (params) => (
        <Box sx={{ fontWeight: 500 }}>{params.value}</Box>
      ),
    },
    {
      field: "_id",
      headerName: "User ID",
      flex: 1,
      minWidth: 200,
      valueGetter: (value, row) => row?.userId?._id || "N/A",
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: theme.palette.text.secondary,
              maxWidth: 200,
            }}
          >
            {params.value}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "profitPercentage",
      headerName: "Profit %",
      flex: 0.7,
      minWidth: 120,
      align: "right",
      headerAlign: "right",
      valueGetter: (value, row) => row?.stats?.profitPercentage || "0",
      renderCell: (params) => {
        const progressionValue = Number.parseFloat(params.value);
        return (
          <Chip
            label={`${progressionValue}%`}
            sx={{
              backgroundColor:
                progressionValue >= 0
                  ? theme.palette.success.main
                  : theme.palette.error.main,
              color: "#fff",
              fontWeight: 600,
              "& .MuiChip-label": {
                padding: "0 10px",
              },
            }}
          />
        );
      },
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      // Debounce the resize event to prevent excessive re-renders
      if (selectedRow) {
        if (window.resizeTimer) {
          clearTimeout(window.resizeTimer);
        }
        window.resizeTimer = setTimeout(() => {
          // Force a re-render of the selected row to update charts
          setSelectedRow({ ...selectedRow });
        }, 250);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.resizeTimer) {
        clearTimeout(window.resizeTimer);
      }
    };
  }, [selectedRow]);

  return (
    <Box>
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LeaderboardIcon
              sx={{
                color: theme.palette.primary.main,
                mr: 1.5,
                fontSize: "1.75rem",
              }}
            />
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                Bankroll Rankings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and compare the top performing bankrolls across the
                platform
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Main Ranking Table */}
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          transition: "all 0.3s ease",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Top Bankrolls
          </Typography>
          <Tooltip title="Click on a row to view detailed statistics">
            <IconButton size="small">
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ height: "calc(100% - 64px)" }}>
          {error ? (
            <Alert
              severity="error"
              sx={{ m: 2 }}
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={fetchTopBankrolls}
                >
                  <SportsScoreIcon fontSize="small" />
                </IconButton>
              }
            >
              {error}
            </Alert>
          ) : (
            <DataGrid
              rows={topBankrolls}
              columns={columns}
              pagination
              pageSize={pagination.pageSize}
              getRowId={(row) => row._id}
              pageSizeOptions={[10, 25, 50, 100]}
              rowHeight={70}
              rowCount={pagination.total}
              page={pagination.page}
              loading={loading}
              paginationMode="server"
              paginationModel={{
                page: pagination.page,
                pageSize: pagination.pageSize,
              }}
              autoHeight
              onPaginationModelChange={handlePaginationModelChange}
              getRowSpacing={() => ({
                top: 4,
                bottom: 4,
              })}
              disableRowSelectionOnClick
              onRowClick={handleRowClick}
              sx={{
                border: "none",
                width: "100%",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  fontWeight: 600,
                },
                "& .MuiDataGrid-cell": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                  cursor: "pointer",
                },
                "& .MuiDataGrid-row.Mui-selected": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(25, 118, 210, 0.16)"
                      : "rgba(25, 118, 210, 0.08)",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: `1px solid ${theme.palette.divider}`,
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: theme.palette.background.paper,
                },
                // Responsive adjustments
                "& .MuiDataGrid-toolbarContainer": {
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1,
                },
                "& .MuiTablePagination-root": {
                  width: "100%",
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    },
                },
              }}
              components={{
                NoRowsOverlay: () => (
                  <Stack
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ py: 5 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No bankrolls found
                    </Typography>
                  </Stack>
                ),
                LoadingOverlay: () => (
                  <Stack
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ py: 5 }}
                  >
                    <CircularProgress size={40} />
                  </Stack>
                ),
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 1,
            m: isMobile ? 0 : 2,
            height: isMobile ? "100%" : "auto",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 10,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Bankroll Details
          </Typography>
          <IconButton
            edge="end"
            onClick={handleCloseDetails}
            aria-label="close"
            size="small"
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
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          {selectedRow && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {selectedRow.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    User ID: {selectedRow.userId?._id || "N/A"}
                  </Typography>
                  <Chip
                    label={selectedRow.visibility || "Public"}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                </Box>
              </Box>

              <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
                {/* ROI Card */}
                <Grid item xs={12} sm={6}>
                  <Card
                    elevation={0}
                    variant="outlined"
                    sx={{
                      height: "100%",
                      borderRadius: 1,
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 2,
                        "&:last-child": { pb: 2 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        <TrendingUpIcon sx={{ mr: 0.5 }} fontSize="small" />
                        <Typography variant="body2" fontWeight={500}>
                          Return on Investment
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                          color:
                            Number.parseFloat(selectedRow?.stats?.roi || 0) >= 0
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                        }}
                      >
                        {selectedRow?.stats?.roi || "0"}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Winning Rate Card */}
                <Grid item xs={12} sm={6}>
                  <Card
                    elevation={0}
                    variant="outlined"
                    sx={{
                      height: "100%",
                      borderRadius: 1,
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 2,
                        "&:last-child": { pb: 2 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        <PercentIcon sx={{ mr: 0.5 }} fontSize="small" />
                        <Typography variant="body2" fontWeight={500}>
                          Winning Rate
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                          color:
                            Number.parseFloat(
                              selectedRow?.stats?.winningRate || 0
                            ) >= 50
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                        }}
                      >
                        {selectedRow?.stats?.winningRate || "0"}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PieChartIcon
                    sx={{ color: theme.palette.primary.main, mr: 1.5 }}
                  />
                  <Typography variant="h6" fontWeight={600}>
                    Distribution Analysis
                  </Typography>
                </Box>
                <Divider />
              </Box>

              <Grid container spacing={{ xs: 2, md: 3 }}>
                {/* % OF STATS BET (Pie Chart) */}
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={0}
                    variant="outlined"
                    sx={{
                      borderRadius: 1,
                      height: "100%",
                      overflow: "hidden",
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  >
                    <CardHeader
                      title="Bet Status Distribution"
                      titleTypographyProps={{
                        variant: "subtitle2",
                        fontWeight: 600,
                      }}
                      sx={{
                        p: 2,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                      }}
                    />
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: { xs: 2, sm: 3 },
                        pt: { xs: 3, sm: 4 },
                        "&:last-child": { pb: { xs: 3, sm: 4 } },
                      }}
                    >
                      <Box
                        sx={{
                          height: { xs: 220, sm: 240 },
                          width: "100%",
                          maxWidth: { xs: 260, sm: 280 },
                          margin: "0 auto",
                          position: "relative",
                        }}
                      >
                        <Pie
                          data={getStatusBetData(selectedRow)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                              legend: {
                                position: "bottom",
                                align: "center",
                                labels: {
                                  boxWidth: 12,
                                  padding: 15,
                                  font: {
                                    size: 11,
                                    weight: "bold",
                                  },
                                  color: theme.palette.text.primary,
                                  usePointStyle: true,
                                  pointStyle: "circle",
                                },
                              },
                              tooltip: {
                                backgroundColor:
                                  theme.palette.mode === "dark"
                                    ? "rgba(0,0,0,0.8)"
                                    : "rgba(255,255,255,0.9)",
                                titleColor:
                                  theme.palette.mode === "dark"
                                    ? "#fff"
                                    : "#000",
                                bodyColor:
                                  theme.palette.mode === "dark"
                                    ? "#fff"
                                    : "#000",
                                borderWidth: 1,
                                padding: 12,
                                cornerRadius: 8,
                                titleFont: {
                                  weight: "bold",
                                },
                                callbacks: {
                                  label: (context) => {
                                    const label = context.label || "";
                                    const value = context.raw || 0;
                                    const percentage = context.parsed || 0;
                                    return `${label}: ${value} (${percentage.toFixed(
                                      1
                                    )}%)`;
                                  },
                                },
                              },
                            },
                            cutout: "65%",
                            animation: {
                              animateScale: true,
                              animateRotate: true,
                              duration: 1000,
                              easing: "easeOutQuart",
                            },
                            layout: {
                              padding: {
                                top: 5,
                                bottom: 5,
                              },
                            },
                            elements: {
                              arc: {
                                borderWidth: 2,
                              },
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* % OF SPORT BET (Pie Chart) */}
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={0}
                    variant="outlined"
                    sx={{
                      borderRadius: 1,
                      height: "100%",
                      overflow: "hidden",
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  >
                    <CardHeader
                      title="Sport Bet Distribution"
                      titleTypographyProps={{
                        variant: "subtitle2",
                        fontWeight: 600,
                      }}
                      sx={{
                        p: 2,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                      }}
                    />
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: { xs: 2, sm: 3 },
                        pt: { xs: 3, sm: 4 },
                        "&:last-child": { pb: { xs: 3, sm: 4 } },
                      }}
                    >
                      <Box
                        sx={{
                          height: { xs: 220, sm: 240 },
                          width: "100%",
                          maxWidth: { xs: 260, sm: 280 },
                          margin: "0 auto",
                          position: "relative",
                        }}
                      >
                        <Pie
                          data={getSportBetData(selectedRow)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                              legend: {
                                position: "bottom",
                                align: "center",
                                labels: {
                                  boxWidth: 12,
                                  padding: 15,
                                  font: {
                                    size: 11,
                                    weight: "bold",
                                  },
                                  color: theme.palette.text.primary,
                                  usePointStyle: true,
                                  pointStyle: "circle",
                                },
                              },
                              tooltip: {
                                backgroundColor:
                                  theme.palette.mode === "dark"
                                    ? "rgba(0,0,0,0.8)"
                                    : "rgba(255,255,255,0.9)",
                                titleColor:
                                  theme.palette.mode === "dark"
                                    ? "#fff"
                                    : "#000",
                                bodyColor:
                                  theme.palette.mode === "dark"
                                    ? "#fff"
                                    : "#000",
                                borderColor: theme.palette.divider,
                                borderWidth: 1,
                                padding: 12,
                                cornerRadius: 8,
                                titleFont: {
                                  weight: "bold",
                                },
                                callbacks: {
                                  label: (context) => {
                                    const label = context.label || "";
                                    const value = context.raw || 0;
                                    const percentage = context.parsed || 0;
                                    return `${label}: ${value} (${percentage.toFixed(
                                      1
                                    )}%)`;
                                  },
                                },
                              },
                            },
                            cutout: "65%",
                            animation: {
                              animateScale: true,
                              animateRotate: true,
                              duration: 1000,
                              easing: "easeOutQuart",
                            },
                            layout: {
                              padding: {
                                top: 5,
                                bottom: 5,
                              },
                            },
                            elements: {
                              arc: {
                                borderWidth: 2,
                              },
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Ranking;
