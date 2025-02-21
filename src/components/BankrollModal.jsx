import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import {
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import ConfirmationModal from "./ConfirmationModal";
import Switch from "@mui/material/Switch";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencies } from "../utils/common";

const bankrollSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startingCapital: z.number().min(1, "Starting capital must be greater than 0"),
  visibility: z.enum(["Public", "Private"]),
  currency: z.object({
    code: z.string().nonempty("Currency code is required"),
    label: z.string().nonempty("Currency label is required"),
    symbol: z.string().nonempty("Currency symbol is required"),
  }),
});

const initialValues = {
  name: "",
  startingCapital: "",
  visibility: "Public",
  currency: "",
};

const BankrollModal = ({ open, onClose, onSubmit, initialData, model }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(bankrollSchema),
    defaultValues: initialValues,
  });
  const theme = useTheme();

  // ✅ Add state for confirmation modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingVisibilityChange, setPendingVisibilityChange] = useState(null);
  const [initialVisibility, setInitialVisibility] = useState("Private");
  const [shareable, setShareable] = useState(initialData?.isShareable || false); // Track shareable state

  useEffect(() => {
    if (initialData && Object.entries(initialData).length) {
      reset(initialData);
      setInitialVisibility(initialData.visibility);
      setShareable(initialData.isShareable || false);
    } else {
      reset(initialValues);
      setInitialVisibility("Private");
      setShareable(false);
    }
  }, [initialData, reset]);

  const visibility = watch("visibility");

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, isShareable: shareable });
    reset(); // Reset form after submit
    onClose();
  };

  // ✅ Handle visibility change with confirmation
  const handleVisibilityChange = (e, newValue) => {
    if (
      initialData &&
      newValue !== null &&
      newValue === "Public" &&
      initialVisibility === "Private"
    ) {
      setPendingVisibilityChange(newValue); // Save intended change
      setConfirmOpen(true); // Show confirmation modal
    } else {
      setValue("visibility", newValue);
    }
  };

  // ✅ Confirm visibility change
  const handleConfirmVisibilityChange = () => {
    setValue("visibility", pendingVisibilityChange);
    setConfirmOpen(false);
    setPendingVisibilityChange(null);
  };

  // ✅ Cancel visibility change
  const handleCancelVisibilityChange = () => {
    setConfirmOpen(false);
    setPendingVisibilityChange(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
          background: theme.palette.primary.main,
          padding: "1rem",
          color: theme.palette.text.primary,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: theme.palette.secondary.main,
          color: theme.palette.primary.contrastText,
          padding: "1.5rem",
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        {initialData ? "Update Bankroll" : "Add Bankroll"}
      </DialogTitle>
      <DialogContent sx={{ padding: "0px", mb: "1rem" }}>
        <form id="bankroll-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            {...register("name")}
            label="Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            {...register("startingCapital", { valueAsNumber: true })}
            label="Starting Capital"
            type="number"
            fullWidth
            margin="normal"
            error={!!errors.startingCapital}
            helperText={errors.startingCapital?.message}
          />
          <Typography
            variant="body2"
            fontWeight="bold"
            gutterBottom
            sx={{ marginTop: "1rem", color: theme.palette.text.primary }}
          >
            Status
          </Typography>
          <ToggleButtonGroup
            value={visibility}
            exclusive
            onChange={handleVisibilityChange}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "1.5rem",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "8px",
              padding: "0.75rem",
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <ToggleButton
              value="Public"
              sx={{
                flex: 1,
                textTransform: "none",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                backgroundColor:
                  visibility === "Public"
                    ? theme.palette.primary.main
                    : "transparent",
                color:
                  visibility === "Public"
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.secondary,
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <VisibilityIcon sx={{ marginRight: "8px" }} />
              Public
            </ToggleButton>
            <ToggleButton
              value="Private"
              sx={{
                flex: 1,
                textTransform: "none",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                backgroundColor:
                  visibility === "Private"
                    ? theme.palette.primary.main
                    : "transparent",
                color:
                  visibility === "Private"
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.secondary,
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <LockIcon sx={{ marginRight: "8px" }} />
              Private
            </ToggleButton>
          </ToggleButtonGroup>

          {errors.visibility && (
            <Typography
              variant="body2"
              color="error"
              sx={{ marginBottom: "1rem" }}
            >
              {errors.visibility.message}
            </Typography>
          )}
          <FormControl
            sx={{
              minWidth: 200,
            }}
            fullWidth
            margin="normal"
            error={!!errors.currency}
          >
            <InputLabel>Currency</InputLabel>
            <Select
              value={watch("currency")?.code || ""}
              onChange={(e) => {
                const selectedCurrency = currencies.find(
                  (cur) => cur.code === e.target.value
                );
                setValue("currency", selectedCurrency);
              }}
              label="Currency"
            >
              {currencies.map((cur) => (
                <MenuItem key={cur.code} value={cur.code}>
                  {`${cur.symbol} - ${cur.label}`}
                </MenuItem>
              ))}
            </Select>

            {errors.currency?.code && (
              <Typography variant="body2" color="error">
                {errors.currency.code.message}
              </Typography>
            )}
          </FormControl>

          <Box
            sx={{ display: "flex", alignItems: "center", marginTop: "1rem" }}
          >
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: theme.palette.text.primary, marginRight: "1rem" }}
            >
              Enable Shareable Link
            </Typography>
            <Switch
              checked={shareable}
              onChange={(e) => {
                setShareable(e.target.checked);
                setValue("isShareable", e.target.checked);
              }}
              color="tertiary"
            />
          </Box>
          {initialData && Object.entries(initialData).length && shareable && (
            <TextField
              value={
                initialData?.shareableLink ||
                `${window.location.origin}/bankroll/view/${initialData?._id}`
              }
              label="Shareable Link"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              helperText="Copy this link to share your bankroll"
            />
          )}
        </form>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "end",
          paddingTop: "1rem",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button onClick={onClose} variant="contained" color="primary">
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          type="submit"
          form="bankroll-form"
        >
          {initialData ? "Update" : "Add"}
        </Button>
      </DialogActions>

      <ConfirmationModal
        open={confirmOpen}
        title="Change Visibility to Public?"
        message="Changing this bankroll to public will delete all existing bets. Are you sure you want to proceed?"
        onConfirm={handleConfirmVisibilityChange}
        onCancel={handleCancelVisibilityChange}
      />
    </Dialog>
  );
};

export default BankrollModal;
