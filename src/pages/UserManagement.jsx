"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  useTheme,
  Paper,
  InputAdornment,
  IconButton,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Tooltip,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WarningIcon from "@mui/icons-material/Warning";
import FilterListIcon from "@mui/icons-material/FilterList";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RemoveIcon from "@mui/icons-material/Remove";
import { useSearchParams } from "react-router-dom";
import api from "../services/api"; // Axios instance
import { toast } from "react-toastify";
import UserDetailsModal from "../components/UserDetailsModal";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const UserManagement = ({ mode }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [roleChangeModalOpen, setRoleChangeModalOpen] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState(null);
  const [newRole, setNewRole] = useState("");

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
          role: roleFilter !== "all" ? roleFilter : undefined,
          subscription:
            subscriptionFilter !== "all" ? subscriptionFilter : undefined,
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
  }, [searchParams, roleFilter, subscriptionFilter]);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleAddUser = async () => {
    try {
      const response = await api.post("/auth/admin/register", newUser);
      toast.success("User added successfully!");
      setAddUserModalOpen(false);
      setNewUser({ username: "", email: "", password: "", role: "user" });
      fetchUsers(); // Refresh user list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add user.");
    }
  };

  // Add handleRoleChange function
  const handleRoleChange = async () => {
    if (!userToChangeRole || !newRole) return;
    try {
      await api.put(`/auth/users/${userToChangeRole._id}/role`, {
        role: newRole,
      });
      toast.success("User role updated successfully!");
      setRoleChangeModalOpen(false);
      setUserToChangeRole(null);
      setNewRole("");
      fetchUsers(); // Refresh user list
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user role."
      );
    }
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

  const confirmDelete = (userId) => {
    const user = users.find((u) => u._id === userId);
    setUserToDelete(user);
    setConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await api.delete(`/auth/users/${userToDelete._id}`);
      toast.success("User deleted successfully.");
      setConfirmDeleteOpen(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh user list
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <AdminPanelSettingsIcon fontSize="small" />;
      case "user":
        return <PersonIcon fontSize="small" />;
      default:
        return <PersonIcon fontSize="small" />;
    }
  };

  const getRoleBadge = (role) => {
    let color, bgColor;

    switch (role) {
      case "admin":
        color = "#000";
        bgColor = "#FFD700";
        break;
      case "user":
        color = "#fff";
        bgColor = "#4CAF50";
        break;
      default:
        color = "#fff";
        bgColor = "#FF9800";
    }

    return (
      <Chip
        icon={getRoleIcon(role)}
        label={role}
        size="small"
        sx={{
          backgroundColor: bgColor,
          color: color,
          fontWeight: 600,
          textTransform: "capitalize",
          "& .MuiChip-icon": {
            color: color,
          },
        }}
      />
    );
  };

  const getSubscriptionBadge = (subscription) => {
    const isActive = subscription?.status === "active";
    return (
      <Chip
        icon={<VerifiedUserIcon fontSize="small" />}
        label={isActive ? "Pro" : "Free"}
        size="small"
        sx={{
          backgroundColor: isActive
            ? "rgba(255, 215, 0, 0.15)"
            : theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.08)",
          color: isActive ? "#B8860B" : theme.palette.text.primary,
          fontWeight: 500,
          "& .MuiChip-icon": {
            color: isActive ? "#B8860B" : theme.palette.text.secondary,
          },
        }}
      />
    );
  };

  const getMovementIcon = (movement) => {
    if (movement > 0) {
      return (
        <ArrowUpwardIcon
          fontSize="small"
          sx={{ color: theme.palette.success.main }}
        />
      );
    } else if (movement < 0) {
      return (
        <ArrowDownwardIcon
          fontSize="small"
          sx={{ color: theme.palette.error.main }}
        />
      );
    }
    return (
      <RemoveIcon
        fontSize="small"
        sx={{ color: theme.palette.text.secondary }}
      />
    );
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
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
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              User Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage all users on the platform
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => setAddUserModalOpen(true)} // Add onClick handler
            sx={{
              px: 2,
              py: 1,
              fontWeight: 500,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Add New User
          </Button>
        </Stack>
      </Paper>
      {/* Search and Filter Bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
          marginBottom: 3,
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
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", md: "auto" },
          }}
        >
          <FormControl sx={{ width: { xs: "100%", sm: 150 } }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              label="Role"
              onChange={(e) => setRoleFilter(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon color="action" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: { xs: "100%", sm: 150 } }}>
            <InputLabel>Subscription</InputLabel>
            <Select
              value={subscriptionFilter}
              label="Subscription"
              onChange={(e) => setSubscriptionFilter(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon color="action" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Plans</MenuItem>
              <MenuItem value="active">Pro</MenuItem>
              <MenuItem value="inactive">Free</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      {/* User List */}
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              No users found
            </Typography>
          </Box>
        ) : (
          users.map((user, index) => (
            <Box
              key={user._id}
              onClick={() => showDetailsModal(user)}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                p: { xs: 2, md: 3 },
                borderBottom:
                  index < users.length - 1
                    ? `1px solid ${theme.palette.divider}`
                    : "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                },
                backgroundColor:
                  selectedUser?._id === user._id
                    ? theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.04)"
                    : "transparent",
              }}
            >
              {/* Top section for mobile - Avatar and Username */}
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  mb: { xs: 2, md: 0 },
                }}
              >
                {/* User Avatar */}
                <Box sx={{ mr: 2 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      user.subscription?.status === "active" ? (
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            bgcolor: "gold",
                            borderRadius: "50%",
                            border: `2px solid ${theme.palette.background.paper}`,
                          }}
                        />
                      ) : null
                    }
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 600,
                      }}
                    >
                      {getInitials(user.username)}
                    </Avatar>
                  </Badge>
                </Box>

                {/* User Info - Always visible */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ mr: 1 }}
                    >
                      {user.username}
                    </Typography>
                    {getRoleBadge(user.role)}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>

                {/* Actions for mobile */}
                <Box sx={{ display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(user._id);
                    }}
                    sx={{
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
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Middle section for mobile - Stats */}
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  width: "100%",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getSubscriptionBadge(user.subscription)}
                </Box>

                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Bankrolls
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {user.bankrolls?.length || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Pending Bets
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {user.bettings?.filter(
                        (bet) =>
                          bet.verificationStatus === "Pending" &&
                          bet.bankrollVisibility === "Public"
                      )?.length || 0}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Bottom section for mobile - Actions */}
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    showDetailsModal(user);
                  }}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  View Details
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserToChangeRole(user);
                    setNewRole(user.role); // Pre-fill with current role
                    setRoleChangeModalOpen(true);
                  }}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    flex: 1,
                  }}
                >
                  Change Role
                </Button>
              </Box>

              {/* Desktop layout - Stats and Actions */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  ml: "auto",
                  gap: 3,
                }}
              >
                {/* User Stats */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 3, mr: 2 }}
                >
                  <Tooltip title="Subscription Plan">
                    <Box>{getSubscriptionBadge(user.subscription)}</Box>
                  </Tooltip>

                  <Tooltip title="Bankrolls">
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Bankrolls
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user.bankrolls?.length || 0}
                      </Typography>
                    </Box>
                  </Tooltip>

                  <Tooltip title="Pending Bets">
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Pending Bets
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user.bettings?.filter(
                          (bet) =>
                            bet.verificationStatus === "Pending" &&
                            bet.bankrollVisibility === "Public"
                        )?.length || 0}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>

                {/* Actions */}
                <Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        showDetailsModal(user);
                      }}
                      sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        boxShadow: "none",
                        "&:hover": {
                          boxShadow: "none",
                        },
                      }}
                    >
                      Details
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserToChangeRole(user);
                        setNewRole(user.role); // Pre-fill with current role
                        setRoleChangeModalOpen(true);
                      }}
                      sx={{
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    >
                      Change Role
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(user._id);
                      }}
                      sx={{
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
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            </Box>
          ))
        )}

        {/* Pagination Controls */}
        {!loading && users.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", sm: "center" },
              gap: { xs: 2, sm: 0 },
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {users.length} of {pagination.total} users
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                disabled={pagination.page === 0}
                onClick={() =>
                  handlePaginationModelChange({
                    page: pagination.page - 1,
                    pageSize: pagination.pageSize,
                  })
                }
                sx={{ minWidth: { xs: 80, sm: 100 }, textTransform: "none" }}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled={
                  (pagination.page + 1) * pagination.pageSize >=
                  pagination.total
                }
                onClick={() =>
                  handlePaginationModelChange({
                    page: pagination.page + 1,
                    pageSize: pagination.pageSize,
                  })
                }
                sx={{ minWidth: { xs: 80, sm: 100 }, textTransform: "none" }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      {/* User Details Modal */}
      <UserDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        user={selectedUser}
      />
      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <WarningIcon color="error" />
          <Typography variant="h6" fontWeight={600}>
            Confirm Deletion
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the user{" "}
            <strong>{userToDelete?.username}</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setConfirmDeleteOpen(false)}
            variant="outlined"
            sx={{
              fontWeight: 500,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{
              fontWeight: 500,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      // Add Add User Modal
      <Dialog
        open={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Add New User
          </Typography>
          <IconButton
            size="small"
            onClick={() => setAddUserModalOpen(false)}
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 0 }}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              fullWidth
              variant="outlined"
              type="email"
              required
            />
            <TextField
              label="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              fullWidth
              variant="outlined"
              type="password"
              required
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                label="Role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setAddUserModalOpen(false)}
            variant="outlined"
            sx={{ fontWeight: 500, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            disabled={!newUser.username || !newUser.email || !newUser.password}
            sx={{
              fontWeight: 500,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>
      // Add Role Change Modal after Add User Modal
      <Dialog
        open={roleChangeModalOpen}
        onClose={() => setRoleChangeModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Change User Role
          </Typography>
          <IconButton
            size="small"
            onClick={() => setRoleChangeModalOpen(false)}
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 0 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Changing role for <strong>{userToChangeRole?.username}</strong>
          </Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Role</InputLabel>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setRoleChangeModalOpen(false)}
            variant="outlined"
            sx={{ fontWeight: 500, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRoleChange}
            variant="contained"
            color="primary"
            disabled={!newRole || newRole === userToChangeRole?.role}
            sx={{
              fontWeight: 500,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            Update Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
