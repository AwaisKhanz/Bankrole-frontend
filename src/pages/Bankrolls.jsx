import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Grid, Grid2 } from "@mui/material";
import BankrollModal from "../components/BankrollModal";
import BankrollCard from "../components/BankrollCard";
import api from "../services/api"; // Axios instance
import { toast } from "react-toastify";

const Bankrolls = () => {
  const [bankrolls, setBankrolls] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch Bankrolls from API
  useEffect(() => {
    const fetchBankrolls = async () => {
      try {
        const { data } = await api.get("/bankrolls");
        setBankrolls(data); // Set fetched bankrolls
      } catch (error) {
        toast.error("Failed to fetch bankrolls.");
      }
    };
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
            <BankrollCard bankroll={bankroll} onEdit={handleEditBankroll} />
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
    </Box>
  );
};

export default Bankrolls;
