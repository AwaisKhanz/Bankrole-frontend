"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Box,
  Switch,
  FormHelperText,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import ConfirmationModal from "./ConfirmationModal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencies } from "../utils/common";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";

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

const BankrollModal = ({ open, onClose, onSubmit, initialData, mode }) => {
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

  // Add state for confirmation modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingVisibilityChange, setPendingVisibilityChange] = useState(null);
  const [initialVisibility, setInitialVisibility] = useState("Private");
  const [shareable, setShareable] = useState(initialData?.isShareable || false); // Track shareable state
  const [linkCopied, setLinkCopied] = useState(false);

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

  // Handle visibility change with confirmation
  const handleVisibilityChange = (e, newValue) => {
    if (
      initialData &&
      newValue !== null &&
      newValue === "Public" &&
      initialVisibility === "Private"
    ) {
      setPendingVisibilityChange(newValue); // Save intended change
      setConfirmOpen(true); // Show confirmation modal
    } else if (newValue !== null) {
      setValue("visibility", newValue);
    }
  };

  // Confirm visibility change
  const handleConfirmVisibilityChange = () => {
    setValue("visibility", pendingVisibilityChange);
    setConfirmOpen(false);
    setPendingVisibilityChange(null);
  };

  // Cancel visibility change
  const handleCancelVisibilityChange = () => {
    setConfirmOpen(false);
    setPendingVisibilityChange(null);
  };

  const copyToClipboard = () => {
    const link =
      initialData?.shareableLink ||
      `${window.location.origin}/bankroll/view/${initialData?._id}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {initialData ? "Update Bankroll" : "Add Bankroll"}
        </Typography>
        <IconButton
          edge="end"
          onClick={onClose}
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

      <DialogContent sx={{ p: 3, mt: 2 }}>
        <form id="bankroll-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ mb: 3 }}>
            <TextField
              {...register("name")}
              label="Bankroll Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 2.5 }}
            />

            <TextField
              {...register("startingCapital", { valueAsNumber: true })}
              label="Starting Capital"
              type="number"
              fullWidth
              error={!!errors.startingCapital}
              helperText={errors.startingCapital?.message}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={500} gutterBottom>
              Visibility
            </Typography>

            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: 1,
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <ToggleButtonGroup
                value={visibility}
                exclusive
                onChange={handleVisibilityChange}
                aria-label="bankroll visibility"
                fullWidth
                size="small"
                sx={{
                  "& .MuiToggleButtonGroup-grouped": {
                    border: 0,
                    borderRadius: 1,
                    mx: 0.5,
                    py: 1,
                  },
                }}
              >
                <ToggleButton
                  value="Public"
                  aria-label="public"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    color:
                      visibility === "Public"
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                    backgroundColor:
                      visibility === "Public"
                        ? theme.palette.primary.main
                        : "transparent",
                    "&:hover": {
                      backgroundColor:
                        visibility === "Public"
                          ? theme.palette.primary.dark
                          : theme.palette.action.hover,
                    },
                  }}
                >
                  <VisibilityIcon sx={{ mr: 1, fontSize: "1.25rem" }} />
                  Public
                </ToggleButton>

                <ToggleButton
                  value="Private"
                  aria-label="private"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    color:
                      visibility === "Private"
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                    backgroundColor:
                      visibility === "Private"
                        ? theme.palette.primary.main
                        : "transparent",
                    "&:hover": {
                      backgroundColor:
                        visibility === "Private"
                          ? theme.palette.primary.dark
                          : theme.palette.action.hover,
                    },
                  }}
                >
                  <LockIcon sx={{ mr: 1, fontSize: "1.25rem" }} />
                  Private
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>

            {errors.visibility && (
              <FormHelperText error>{errors.visibility.message}</FormHelperText>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth error={!!errors.currency}>
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
                <FormHelperText error>
                  {errors.currency.code.message}
                </FormHelperText>
              )}
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderRadius: 1,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.02)",
            }}
          >
            <Box>
              <Typography variant="subtitle2" fontWeight={500}>
                Enable Shareable Link
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Allow others to view this bankroll
              </Typography>
            </Box>

            <Switch
              checked={shareable}
              onChange={(e) => {
                setShareable(e.target.checked);
                setValue("isShareable", e.target.checked);
              }}
              color="primary"
            />
          </Box>

          {initialData && Object.entries(initialData).length && shareable && (
            <Box sx={{ mt: 3 }}>
              <TextField
                value={
                  initialData?.shareableLink ||
                  `${window.location.origin}/bankroll/view/${initialData?._id}`
                }
                label="Shareable Link"
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={copyToClipboard}
                        color={linkCopied ? "success" : "default"}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText={
                  linkCopied
                    ? "Link copied to clipboard!"
                    : "Copy this link to share your bankroll"
                }
              />
            </Box>
          )}
        </form>
      </DialogContent>

      <DialogActions
        sx={{ p: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            fontWeight: 500,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          form="bankroll-form"
          sx={{
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
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
        mode={mode}
      />
    </Dialog>
  );
};

export default BankrollModal;
