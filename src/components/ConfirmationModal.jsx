"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
  Box,
  IconButton,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";

const ConfirmationModal = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  mode,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <WarningAmberIcon
            sx={{
              color: theme.palette.warning.main,
              mr: 1.5,
              fontSize: "1.5rem",
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            {title || "Confirm Action"}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          onClick={onCancel}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
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
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Typography variant="body1">
          {message || "Are you sure you want to proceed?"}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{ p: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            fontWeight: 500,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
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
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
