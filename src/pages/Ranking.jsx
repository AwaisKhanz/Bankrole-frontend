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

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend);

const Ranking = ({ mode }) => {
  const [topBankrolls, setTopBankrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRow, setSelectedRow] = useState(null);
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
    try {
      const response = await api.get("/bankrolls/top", {
        params: {
          search: searchParams.get("search") || "",
          page: pagination.page + 1,
          limit: pagination.pageSize,
        },
      });
      setTopBankrolls(response.data);
    } catch (error) {
      console.error("Error fetching top bankrolls:", error);
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
            "#4CAF50", // Won - Vibrant green
            "#F44336", // Loss - Vibrant red
            "#FFC107", // Void - Amber
            "#9C27B0", // Cash Out - Purple
          ],
          borderColor:
            mode === "dark" ? theme.palette.background.paper : "#ffffff",
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  };

  // Update the getSportBetData function with better colors
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
            "#2196F3", // Football - Blue
            "#E91E63", // Tennis - Pink
            "#FF9800", // Basketball - Orange
            "#00BCD4", // Volleyball - Cyan
            "#3F51B5", // American Football - Indigo
            "#03A9F4", // Ice Hockey - Light Blue
            "#607D8B", // Other Sport - Blue Grey
          ],
          borderColor:
            mode === "dark" ? theme.palette.background.paper : "#ffffff",
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
            }}
          >
            <Looks3Icon />
          </Avatar>
        );
      default:
        return (
          <Avatar
            sx={{
              bgcolor: theme.palette.grey[200],
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
        return getRankIcon(rank);
      },
    },
    {
      field: "name",
      headerName: "Bankroll Name",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row?.name || "N/A",
      renderCell: (params) => (
        <Typography variant="body1" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "_id",
      headerName: "Id",
      flex: 1,
      minWidth: 250,
      valueGetter: (value, row) => row?.userId?._id || "N/A",
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: theme.palette.text.secondary,
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "profitPercentage",
      headerName: "Profit %",
      flex: 0.5,
      minWidth: 150,
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
              fontWeight: "bold",
              "& .MuiChip-label": {
                padding: "0 10px",
              },
            }}
          />
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 2,
        height: "100%",
      }}
    >
      {/* Main Ranking Table */}
      <Paper
        elevation={2}
        sx={{
          flex: selectedRow ? 3 : 1,
          overflow: "hidden",
          borderRadius: 2,
          transition: "all 0.3s ease",
        }}
      >
        <Box
          sx={{
            p: 2,
            // borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.default,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Top Bankrolls Ranking
          </Typography>
        </Box>

        <Box sx={{ height: "calc(100% - 64px)" }}>
          <DataGrid
            rows={topBankrolls}
            columns={columns}
            pagination
            pageSize={pagination.pageSize}
            getRowId={(row) => row._id}
            pageSizeOptions={[10, 25, 50, 100]}
            rowHeight={60}
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
              top: 8,
              bottom: 8,
            })}
            disableRowSelectionOnClick
            onRowClick={(params) => setSelectedRow(params.row)}
            sx={{
              border: "none",
              height: "100% !important",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.background.default,
                // borderBottom: `1px solid ${theme.palette.divider}`,
                fontSize: "0.875rem",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell": {
                // borderBottom: `1px solid ${theme.palette.divider}`,
                fontSize: "0.875rem",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
                cursor: "pointer",
              },
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: `${theme.palette.primary.light}20`,
                "&:hover": {
                  backgroundColor: `${theme.palette.primary.light}30`,
                },
              },
              "& .MuiDataGrid-footerContainer": {
                // borderTop: `1px solid ${theme.palette.divider}`,
              },
            }}
          />
        </Box>
      </Paper>

      {/* Details Panel */}
      {selectedRow && (
        <Paper
          elevation={3}
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
        >
          <Box
            sx={{
              p: 2,
              // borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.default,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Bankroll Details
            </Typography>
            <IconButton
              size="small"
              onClick={() => setSelectedRow(null)}
              sx={{
                bgcolor: theme.palette.action.hover,
                "&:hover": {
                  bgcolor: theme.palette.action.selected,
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: 3, overflow: "auto" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {selectedRow.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              ID: {selectedRow.userId?._id || "N/A"}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              {/* ROI Card */}
              <Grid item xs={12} sm={6}>
                <Card
                  elevation={1}
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    // border: `1px solid ${theme.palette.divider}`,
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
                      <Typography variant="body2" fontWeight="medium">
                        ROI
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
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
                  elevation={1}
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    // border: `1px solid ${theme.palette.divider}`,
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
                      <Typography variant="body2" fontWeight="medium">
                        Winning Rate
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
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

            <Grid container spacing={3}>
              {/* % OF STATS BET (Pie Chart) */}
              <Grid item xs={12} md={6}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    height: "100%",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <CardHeader
                    title="Bet Status Distribution"
                    titleTypographyProps={{
                      variant: "subtitle1",
                      fontWeight: "bold",
                    }}
                    sx={{
                      p: 2,
                      // borderBottom: `1px solid ${theme.palette.divider}`,
                      bgcolor:
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
                      p: 3,
                      pt: 4,
                      "&:last-child": { pb: 4 },
                    }}
                  >
                    <Box sx={{ height: 240, width: "100%", maxWidth: 300 }}>
                      <Pie
                        data={getStatusBetData(selectedRow)}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              position: "top",
                              labels: {
                                boxWidth: 15,
                                font: {
                                  size: 12,
                                  weight: "bold",
                                },
                                color: theme.palette.text.primary,
                              },
                            },
                            tooltip: {
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(0,0,0,0.8)"
                                  : "rgba(255,255,255,0.9)",
                              titleColor:
                                theme.palette.mode === "dark" ? "#fff" : "#000",
                              bodyColor:
                                theme.palette.mode === "dark" ? "#fff" : "#000",
                              // borderColor: theme.palette.divider,
                              borderWidth: 1,
                              padding: 12,
                              cornerRadius: 8,
                              titleFont: {
                                weight: "bold",
                              },
                            },
                          },
                          cutout: "60%",
                          animation: {
                            animateScale: true,
                            animateRotate: true,
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
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    height: "100%",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <CardHeader
                    title="Sport Bet Distribution"
                    titleTypographyProps={{
                      variant: "subtitle1",
                      fontWeight: "bold",
                    }}
                    sx={{
                      p: 2,
                      // borderBottom: `1px solid ${theme.palette.divider}`,
                      bgcolor:
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
                      p: 3,
                      pt: 4,
                      "&:last-child": { pb: 4 },
                    }}
                  >
                    <Box sx={{ height: 240, width: "100%", maxWidth: 300 }}>
                      <Pie
                        data={getSportBetData(selectedRow)}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              position: "top",
                              labels: {
                                boxWidth: 15,
                                font: {
                                  size: 12,
                                  weight: "bold",
                                },
                                color: theme.palette.text.primary,
                              },
                            },
                            tooltip: {
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(0,0,0,0.8)"
                                  : "rgba(255,255,255,0.9)",
                              titleColor:
                                theme.palette.mode === "dark" ? "#fff" : "#000",
                              bodyColor:
                                theme.palette.mode === "dark" ? "#fff" : "#000",
                              borderColor: theme.palette.divider,
                              borderWidth: 1,
                              padding: 12,
                              cornerRadius: 8,
                              titleFont: {
                                weight: "bold",
                              },
                            },
                          },
                          cutout: "60%",
                          animation: {
                            animateScale: true,
                            animateRotate: true,
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Ranking;
