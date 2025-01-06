import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const PaymentSuccessModal = ({ open }) => {
  const handleReload = () => {
    window.location.href = "/"; // Reload the current route
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Payment Successful!</DialogTitle>
      <DialogContent>
        <Typography>
          Your subscription was successful. Enjoy the premium features!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleReload}>
          Back to Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentSuccessModal;
