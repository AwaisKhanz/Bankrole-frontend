import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, TextField, Button, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSearchParams } from "react-router-dom";
import api from "../services/api"; // Axios instance
import { toast } from "react-toastify";
import UserDetailsModal from "../components/UserDetailsModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const showDetailsModal = (user) => {
    setSelectedUser(user);
    setDetailsModalOpen(true);
  };

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

  // Parse initial query params
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get("page") || 0),
    pageSize: Number(searchParams.get("limit") || 10),
    total: 0,
  });

  const [search, setSearch] = useState(searchParams.get("search") || "");

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/users", {
        params: {
          search: searchParams.get("search") || "",
          page: pagination.page + 1, // Backend uses 1-based indexing
          limit: pagination.pageSize,
        },
      });
      setUsers(data.users);
      setPagination((prev) => ({
        ...prev,
        total: data.totalUsers, // Use totalUsers from the backend
        page: data.currentPage - 1, // Convert 1-based index to 0-based
      }));
    } catch (error) {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchParams]);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Handle search
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

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/auth/users/${userId}`);
      toast.success("User deleted successfully.");
      fetchUsers(); // Refresh user list
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const columns = [
    { field: "username", headerName: "Username", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => {
        const backgroundColor =
          params.value === "admin"
            ? "#FFD700"
            : params.value === "user"
            ? "#4CAF50"
            : "#FF9800";

        const textColor = params.value === "admin" ? "#000" : "#fff";

        return (
          <Chip
            label={params.value}
            sx={{
              backgroundColor,
              color: textColor,
              fontWeight: "bold",
              textTransform: "capitalize",
              borderRadius: "8px",
              padding: "0 8px",
            }}
          />
        );
      },
    },

    {
      field: "subscription",
      headerName: "Plan",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => (
        <Box>
          {params.row.subscription?.status === "active"
            ? `Pro (Ends: ${new Date(
                params.row.subscription?.currentPeriodEnd
              ).toLocaleDateString()})`
            : "Free"}
        </Box>
      ),
    },
    {
      field: "bankrolls",
      headerName: "Bankrolls",
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <Box>
          {params.row.bankrolls.length > 0
            ? `${params.row.bankrolls.length} bankroll(s)`
            : "None"}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 0.5,
      minWidth: 180,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            height: "100%",
          }}
        >
          <DeleteIcon
            sx={{
              color: "error.main",
              cursor: "pointer",
              "&:hover": { color: "error.dark" },
            }}
            onClick={() => handleDelete(params.row._id)}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => showDetailsModal(params.row)}
          >
            Details
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        User Management
      </Typography>

      {/* Search Bar */}
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
      </Box>

      {/* Data Grid */}
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <DataGrid
          rows={users}
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

      <UserDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        user={selectedUser}
      />
    </Box>
  );
};

export default UserManagement;
