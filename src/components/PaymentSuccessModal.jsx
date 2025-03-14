"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const PaymentSuccessModal = ({ open, onClose }) => {
  const handleReload = () => {
    window.location.href = "/"; // Reload the current route
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
        },
      }}
    >
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
