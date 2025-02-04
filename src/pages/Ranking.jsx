import React, { useEffect, useState } from "react";
import { Typography, Box, Chip, useTheme } from "@mui/material";
import api from "../services/api"; // Replace with your actual API service
import { useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Fade } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Ranking = ({ mode }) => {
  const [topBankrolls, setTopBankrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRow, setSelectedRow] = useState(null);
  const theme = useTheme();
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
          backgroundColor: ["#4CAF50", "#F44336", "#FFC107", "#9C27B0"],
          borderColor: theme.palette.background.default,
          borderWidth: 1,
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
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#C9CBCF",
          ],
          borderColor: theme.palette.background.default,
          borderWidth: 1,
        },
      ],
    };
  };

  const columns = [
    {
      field: "rank",
      headerName: "Rank",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        const sortedRowIds = params.api.getSortedRowIds();
        const rank = sortedRowIds.indexOf(params.id) + 1;
        let icon;

        switch (rank) {
          case 1:
            icon = "🥇";
            break;
          case 2:
            icon = "🥈";
            break;
          case 3:
            icon = "🥉";
            break;
          default:
            icon = rank;
        }

        return <Box sx={{ fontSize: { xs: "20px", md: "32px" } }}>{icon}</Box>;
      },
    },
    {
      field: "name",
      headerName: "Bankroll Name",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row?.name || "N/A",
    },
    {
      field: "_id",
      headerName: "Id",
      flex: 1,
      minWidth: 250,
      valueGetter: (value, row) => row?.userId?._id || "N/A",
    },
    {
      field: "profitPercentage",
      headerName: "Profit %",
      flex: 0.5,
      minWidth: 150,
      valueGetter: (value, row) => row?.stats?.profitPercentage || "0",
      renderCell: (params) => {
        const progressionValue = parseFloat(params.value);
        return (
          <Chip
            label={`${progressionValue}%`}
            sx={{
              backgroundColor: progressionValue >= 0 ? "#4CAF50" : "#F44336",
              color: "#fff",
            }}
          />
        );
      },
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box
        sx={{
          width: selectedRow ? "50%" : "100%",
          transition: "width 0.3s ease",
          height: "100%",
        }}
      >
        {/* Data Grid */}
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            height: "100%",
          }}
        >
          <DataGrid
            rows={topBankrolls}
            columns={columns}
            pagination
            pageSize={pagination.pageSize}
            getRowId={(row) => row._id}
            pageSizeOptions={[10, 50, 100]}
            rowHeight={80}
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
            getRowSpacing={(params) => ({
              top: 5, // Adjust the spacing above each row
              bottom: 5, // Adjust the spacing below each row
            })}
            disableSelectionOnClick
            onRowClick={(params) => setSelectedRow(params.row)}
            sx={{
              borderRadius: "8px",
              height: "100% !important",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              "& .MuiDataGrid-columnHeaders": {
                fontSize: "16px",
              },
              "& .MuiDataGrid-cell": {
                wordBreak: "break-word",
                borderBottom:
                  mode === "dark"
                    ? `1px solid ${theme.palette.primary.main}`
                    : `1px solid #e5e7eb`,
              },
            }}
          />
        </Box>
      </Box>

      {/* Right Side (Selected Row Data) */}
      <Box
        sx={{
          width: selectedRow ? "50%" : "0%",
          display: selectedRow ? "flex" : "none",
          flexDirection: "column",
          transition: "width 0.3s ease",
          background: theme.palette.primary.main,
          p: 2,
          borderRadius: "8px",
          overflowY: "auto",
          border: `1px solid ${mode === "dark" ? "black" : "#eeeeee"}`,
        }}
      >
        {/* Bankroll Name */}
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: "bold",
          }}
        >
          {selectedRow?.name}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
          {/* Stats Cards */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* ROI Card */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: theme.palette.secondary.light,
                padding: "1rem",
                borderRadius: "8px",
                textAlign: "center",
                minWidth: "180px",
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                ROI
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color:
                    parseFloat(selectedRow?.stats?.roi || 0) >= 0
                      ? "#4CAF50"
                      : "#F44336",
                }}
              >
                {selectedRow?.stats?.roi || "0"}%
              </Typography>
            </Box>

            {/* Winning Rate Card */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: theme.palette.secondary.light,
                padding: "1rem",
                borderRadius: "8px",
                textAlign: "center",
                minWidth: "180px",
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Winning Rate
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color:
                    parseFloat(selectedRow?.stats?.winningRate || 0) >= 50
                      ? "#4CAF50"
                      : "#F44336",
                }}
              >
                {selectedRow?.stats?.winningRate || "0"}%
              </Typography>
            </Box>
          </Box>

          {/* Graphs Section */}
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* % OF STATS BET (Pie Chart) */}
            <Box
              sx={{
                background: theme.palette.background.default,
                borderRadius: "12px",
                p: 2,
                flex: 1,
                textAlign: "center",
                height: "100%",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                % OF STATS BET
              </Typography>
              <Pie
                data={getStatusBetData(selectedRow)}
                options={{
                  responsive: true,
                }}
              />
            </Box>

            {/* % OF SPORT BET (Pie Chart) */}
            <Box
              sx={{
                background: theme.palette.background.default,
                borderRadius: "12px",
                p: 2,
                flex: 1,
                textAlign: "center",
                height: "100%",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                % OF SPORT BET
              </Typography>
              <Pie
                data={getSportBetData(selectedRow)}
                options={{
                  responsive: true,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Ranking;
