import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  useTheme,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  alpha,
} from "@mui/material";
import BankrollModal from "../components/BankrollModal";
import BankrollCard from "../components/BankrollCard";
import api from "../services/api"; // Axios instance
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";
import AddIcon from "@mui/icons-material/Add";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const Bankrolls = ({ mode }) => {
  const [bankrolls, setBankrolls] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();

  const fetchBankrolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/bankrolls");
      setBankrolls(data); // Set fetched bankrolls
    } catch (error) {
      setError("Failed to fetch bankrolls");
      toast.error("Failed to fetch bankrolls.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Bankrolls from API
  useEffect(() => {
    fetchBankrolls();
  }, []);

  const handleAddBankroll = () => {
    setEditData(null); // Reset edit data for adding a new bankroll
    setModalOpen(true);
  };

  const handleEditBankroll = (bankroll) => {
    setEditData(bankroll);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editData) {
        // Update existing bankroll
        const response = await api.put(`/bankrolls/${editData._id}`, data);
        setBankrolls((prev) =>
          prev.map((item) =>
            item._id === editData._id ? response.data.bankroll : item
          )
        );
        toast.success("Bankroll updated successfully.");
      } else {
        // Add new bankroll
        const response = await api.post("/bankrolls", data);
        setBankrolls((prev) => [...prev, response.data.bankroll]);
        toast.success("Bankroll added successfully.");
      }
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save bankroll.");
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/bankrolls/${deleteId}`);
      toast.success("Bankroll deleted successfully.");
      fetchBankrolls();
    } catch (error) {
      toast.error("Failed to delete bankroll.");
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchBankrolls}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      );
    }

    if (bankrolls.length === 0) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 2,
            textAlign: "center",
            borderRadius: 1,
            border: `1px dashed ${theme.palette.divider}`,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
          }}
        >
          <AccountBalanceWalletIcon
            sx={{
              fontSize: 48,
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          />
          <Typography variant="h6" gutterBottom>
            No Bankrolls Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first bankroll to start tracking your betting funds
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddBankroll}
          >
            Add Your First Bankroll
          </Button>
        </Paper>
      );
    }

    return (
      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        {bankrolls.map((bankroll) => (
          <Grid item xs={12} sm={6} lg={4} key={bankroll._id}>
            <BankrollCard
              bankroll={bankroll}
              onEdit={handleEditBankroll}
              onDelete={handleDelete}
              mode={mode}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 1,
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
              fontWeight={600}
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
              Bankrolls
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track your betting funds across different platforms
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddBankroll}
            sx={{
              px: 2,
              py: 1,
              fontWeight: 500,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Add Bankroll
          </Button>
        </Stack>
      </Paper>

      {renderContent()}

      {/* Modal for Add/Edit Bankroll */}
      <BankrollModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        mode={mode}
      />

      {/* Reusable Confirmation Modal */}
      <ConfirmationModal
        open={confirmOpen}
        mode={mode}
        title="Delete Bankroll"
        message="Are you sure you want to delete this bankroll? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default Bankrolls;
