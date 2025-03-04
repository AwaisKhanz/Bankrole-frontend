import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Grid, Grid2 } from "@mui/material";
import BankrollModal from "../components/BankrollModal";
import BankrollCard from "../components/BankrollCard";
import api from "../services/api"; // Axios instance
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";

const Bankrolls = ({ mode }) => {
  const [bankrolls, setBankrolls] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchBankrolls = async () => {
    try {
      const { data } = await api.get("/bankrolls");
      setBankrolls(data); // Set fetched bankrolls
    } catch (error) {
      toast.error("Failed to fetch bankrolls.");
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

  return (
    <Box sx={{}}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Bankrolls
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddBankroll}
          sx={{ marginBottom: "1rem" }}
        >
          Add Bankroll
        </Button>
      </Box>

      <Grid container spacing={3}>
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
      {/* Modal for Add/Edit Bankroll */}
      <BankrollModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
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
