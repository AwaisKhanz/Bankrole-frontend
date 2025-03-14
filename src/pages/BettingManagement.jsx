"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Chip,
  Stack,
  useTheme,
  Paper,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Avatar,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RemoveIcon from "@mui/icons-material/Remove";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import BetDetailsModal from "../components/BetDetailsModal";

const BettingManagement = ({ mode }) => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedBet, setSelectedBet] = useState(null);
  const [betDetailsOpen, setBetDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const theme = useTheme();

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
          verificationStatus: statusFilter,
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
  }, [searchParams, statusFilter]);

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

  const handleBetRowClick = (bet) => {
    setSelectedBet(bet);
    setBetDetailsOpen(true);
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

  return (
    <Box sx={{ width: "100%" }}>
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
              Betting Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review and manage bet verification requests
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          marginBottom: 3,
          width: "100%",
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
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />

        <FormControl sx={{ width: { xs: "100%", md: 200 } }}>
          <InputLabel>Verification Status</InputLabel>
          <Select
            value={statusFilter}
            label="Verification Status"
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon color="action" />
              </InputAdornment>
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Accepted">Accepted</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {bets.map((bet, index) => (
          <Box
            key={bet._id}
            onClick={() => handleBetRowClick(bet)}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              p: { xs: 2, md: 3 },
              borderBottom: `1px solid ${theme.palette.divider}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
              },
              backgroundColor:
                selectedBet?._id === bet._id
                  ? theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.04)"
                  : "transparent",
            }}
          >
            {/* Mobile view - Top section with Rank and Sport */}
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              {/* Rank and movement */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {getRankIcon(index + 1)}
                <Box sx={{ ml: 1 }}>{getMovementIcon(bet.rankChange)}</Box>
              </Box>

              {/* Sport chip - visible only on mobile */}
              <Chip
                label={bet.sport}
                size="small"
                icon={<SportsSoccerIcon />}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  "& .MuiChip-icon": {
                    color: "#fff",
                  },
                }}
              />
            </Box>

            {/* Desktop view - Rank on left */}
            <Box
              sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}
            >
              {getRankIcon(index + 1)}
              <Box sx={{ ml: 1 }}>{getMovementIcon(bet.rankChange)}</Box>
            </Box>

            {/* Middle section - User info and bet details */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                width: "100%",
                gap: { xs: 1.5, sm: 2 },
                ml: { sm: 2 },
                flex: 1,
              }}
            >
              {/* Sport chip - visible only on desktop */}
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  mr: 2,
                }}
              >
                <Chip
                  label={bet.sport}
                  size="small"
                  icon={<SportsSoccerIcon />}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                    "& .MuiChip-icon": {
                      color: "#fff",
                    },
                  }}
                />
              </Box>

              {/* User info */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {bet.userId?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {bet.userId?.email}
                </Typography>
              </Box>

              {/* Bet details */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: { xs: 1, sm: 2 },
                  ml: { sm: "auto" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  €{bet.stake}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Chip
                    label={bet.status}
                    size="small"
                    sx={{
                      backgroundColor:
                        bet.status === "Won"
                          ? theme.palette.success.main
                          : bet.status === "Loss"
                          ? theme.palette.error.main
                          : theme.palette.grey[500],
                      color: "#fff",
                    }}
                  />

                  <Chip
                    label={bet.verificationStatus}
                    size="small"
                    icon={
                      bet.verificationStatus === "Accepted" ? (
                        <CheckCircleIcon fontSize="small" />
                      ) : bet.verificationStatus === "Rejected" ? (
                        <CancelIcon fontSize="small" />
                      ) : null
                    }
                    sx={{
                      backgroundColor:
                        bet.verificationStatus === "Accepted"
                          ? theme.palette.success.main
                          : bet.verificationStatus === "Rejected"
                          ? theme.palette.error.main
                          : theme.palette.warning.main,
                      color: "#fff",
                      "& .MuiChip-icon": {
                        color: "#fff",
                      },
                    }}
                  />
                </Stack>
              </Box>
            </Box>
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && bets.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No bets found
            </Typography>
          </Box>
        )}

        {/* Pagination Controls */}
        {!loading && bets.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {bets.length} of {pagination.total} bets
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
                sx={{ minWidth: 100, textTransform: "none" }}
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
                sx={{ minWidth: 100, textTransform: "none" }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <BetDetailsModal
        open={betDetailsOpen}
        onClose={() => setBetDetailsOpen(false)}
        bet={selectedBet}
        onApprove={(id) => {
          try {
            api.put(`/bets/admin/approve/${id}`).then(({ data }) => {
              toast.success(data.message);
              setBetDetailsOpen(false);
              fetchBets();
            });
          } catch (error) {
            toast.error(
              error.response?.data?.message || "Failed to approve bet."
            );
          }
        }}
        onReject={(id) => {
          try {
            api.put(`/bets/admin/reject/${id}`).then(({ data }) => {
              toast.success(data.message);
              setBetDetailsOpen(false);
              fetchBets();
            });
          } catch (error) {
            toast.error(
              error.response?.data?.message || "Failed to reject bet."
            );
          }
        }}
      />
    </Box>
  );
};

export default BettingManagement;
