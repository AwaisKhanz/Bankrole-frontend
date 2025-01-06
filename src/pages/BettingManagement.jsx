import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, TextField, Chip, Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

const BettingManagement = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

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

  const [pagination, setPagination] = useState({
    page: Number(searchParams.get("page") || 0),
    pageSize: Number(searchParams.get("limit") || 10),
    total: 0,
  });

  const fetchBets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bets/admin/all", {
        params: {
          search: searchParams.get("search") || "",
          page: pagination.page + 1,
          limit: pagination.pageSize,
        },
      });
      setBets(data.bets);
      setPagination((prev) => ({
        ...prev,
        total: data.totalBets,
        page: data.currentPage - 1,
      }));
    } catch (error) {
      toast.error("Failed to fetch bets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
  }, [searchParams]);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = useCallback(
    debounce((query) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("search", query);
        params.set("page", 0); // Reset to first page on new search
        return params;
      });
    }, 500),
    []
  );

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

  const handleApprove = async (id, verificationCode) => {
    try {
      const { data } = await api.put(`/bets/admin/approve/${id}`, {
        verificationCode,
      });
      toast.success(data.message);
      fetchBets(); // Refresh bets list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve bet.");
    }
  };

  const handleReject = async (id) => {
    try {
      const { data } = await api.put(`/bets/admin/reject/${id}`);
      toast.success(data.message);
      fetchBets(); // Refresh bets list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject bet.");
    }
  };

  const columns = [
    {
      field: "userId",
      headerName: "User",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            <strong>{params.row.userId?.username}</strong>
          </Typography>
          <Typography variant="caption">{params.row.userId?.email}</Typography>
        </Box>
      ),
    },
    {
      field: "sport",
      headerName: "Sport",
      flex: 0.5,
      minWidth: 150,
    },
    { field: "stake", headerName: "Stake", flex: 0.5, minWidth: 100 },
    {
      field: "verificationCode",
      headerName: "Verification Code",
      flex: 0.5,
      minWidth: 150,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor:
              params.value === "Won"
                ? "#4CAF50"
                : params.value === "Loss"
                ? "#F44336"
                : "#B0BEC5",
            color: "#fff",
          }}
        />
      ),
    },
    {
      field: "verificationStatus",
      headerName: "Verification Status",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => {
        let backgroundColor = "#FFC107"; // Default: Pending
        let label = "Pending";

        if (params.row.verificationStatus === "Accepted") {
          backgroundColor = "#4CAF50";
          label = "Accepted";
        } else if (params.row.verificationStatus === "Rejected") {
          backgroundColor = "#F44336";
          label = "Rejected";
        }

        return (
          <Chip
            label={label}
            sx={{
              backgroundColor,
              color: "#fff",
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              handleApprove(params.row._id, params.row.verificationCode)
            }
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleReject(params.row._id)}
          >
            Reject
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Betting Management
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search by sport or label"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value);
          }}
          sx={{
            flex: 1,
          }}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <DataGrid
          rows={bets}
          columns={columns}
          pagination
          pageSize={pagination.pageSize}
          getRowId={(row) => row._id}
          pageSizeOptions={[10, 50, 100]}
          rowCount={pagination.total}
          page={pagination.page}
          loading={loading}
          paginationMode="server"
          paginationModel={{
            page: pagination.page,
            pageSize: pagination.pageSize,
          }}
          getRowSpacing={(params) => ({
            top: 10,
            bottom: 10,
          })}
          onPaginationModelChange={handlePaginationModelChange}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default BettingManagement;
