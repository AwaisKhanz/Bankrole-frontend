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
} from "@mui/material";
import { useForm } from "react-hook-form";

import React, { useEffect } from "react";
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
  visibility: "Private",
  currency: "",
};

const BankrollModal = ({ open, onClose, onSubmit, initialData }) => {
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
  useEffect(() => {
    if (initialData && Object.entries(initialData).length) {
      reset(initialData);
    } else {
      reset(initialValues);
    }
  }, [initialData, reset]);

  const visibility = watch("visibility");

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset(); // Reset form after submit
    onClose();
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
          background: theme.palette.tertiary.main,
          padding: "1rem",
          color: "white",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: theme.palette.secondary.main,
          color: "#FFFFFF",
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
            sx={{ marginTop: "1rem" }}
          >
            Status
          </Typography>
          <ToggleButtonGroup
            value={visibility}
            exclusive
            onChange={(e, newValue) => {
              if (newValue !== null) {
                setValue("visibility", newValue);
              }
            }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "1.5rem", // Increase spacing
              border: "1px solid #4A5568", // Adjust border color for dark mode
              borderRadius: "8px",
              padding: "0.75rem", // Add padding
              backgroundColor: "#2D3748", // Dark background color
            }}
          >
            <ToggleButton
              value="Public"
              sx={{
                flex: 1,
                textTransform: "none",
                border: "1px solid #4A5568", // Match border with group
                borderRadius: "8px",
                backgroundColor:
                  visibility === "Public" ? "#1649FF" : "transparent", // Highlighted or transparent
                color: visibility === "Public" ? "#FFFFFF" : "#A0AEC0", // Active or inactive text color
                "&:hover": { backgroundColor: "#3B4A5B" }, // Subtle hover effect
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
                border: "1px solid #4A5568", // Match border with group
                borderRadius: "8px",
                backgroundColor:
                  visibility === "Private" ? "#1649FF" : "transparent", // Highlighted or transparent
                color: visibility === "Private" ? "#FFFFFF" : "#A0AEC0", // Active or inactive text color
                "&:hover": { backgroundColor: "#3B4A5B" }, // Subtle hover effect
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

          <FormControl fullWidth margin="normal" error={!!errors.currency}>
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
        </form>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "end",
          paddingTop: "1rem",
          borderTop: "1px solid #E0E0E0",
        }}
      >
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          form="bankroll-form"
          variant="contained"
          color="primary"
        >
          {initialData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BankrollModal;
