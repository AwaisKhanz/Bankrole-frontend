import React, { useEffect, useState } from "react";
import { Typography, Box, Chip } from "@mui/material";
import api from "../services/api"; // Replace with your actual API service
import { useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

const Ranking = () => {
  const [topBankrolls, setTopBankrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  // const [search, setSearch] = useState(searchParams.get("search") || "");
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get("page") || 0),
    pageSize: Number(searchParams.get("limit") || 10),
    total: 0,
  });

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

  // const debounce = (func, delay) => {
  //   let timer;
  //   return (...args) => {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => func(...args), delay);
  //   };
  // };

  // const handleSearch = useCallback(
  //   debounce((query) => {
  //     setSearchParams((prev) => {
  //       const params = new URLSearchParams(prev);
  //       params.set("search", query);
  //       params.set("page", 0);
  //       return params;
  //     });
  //   }, 500),
  //   []
  // );

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
      minWidth: 200,
      valueGetter: (value, row) => row?.name || "N/A",
    },
    {
      field: "_id",
      headerName: "Id",
      flex: 1,
      minWidth: 200,
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
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Ranking
      </Typography>

      {/* Search Bar */}
      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search by username or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value);
          }}
          sx={{
            flex: 1,
          }}
        />
      </Box> */}

      {/* Data Grid */}
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
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
          sx={{
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            "& .MuiDataGrid-columnHeaders": {
              fontSize: "16px",
            },
            "& .MuiDataGrid-cell": {
              wordBreak: "break-word",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Ranking;
