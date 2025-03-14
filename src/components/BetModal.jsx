"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LabelIcon from "@mui/icons-material/Label";
import SpeedIcon from "@mui/icons-material/Speed";
import PaidIcon from "@mui/icons-material/Paid";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const betSchema = z.object({
  date: z.date({ required_error: "Date is required" }),
  sport: z.enum(
    [
      "Football",
      "Tennis",
      "Basketball",
      "Volleyball",
      "American Football",
      "Ice Hockey",
      "Other Sport",
    ],
    {
      required_error: "Sport is required",
    }
  ),
  label: z.string().min(1, "Bet label is required"),
  odds: z.number().min(1, "Odds must be at least 1"),
  stake: z.number().min(0.01, "Stake must be greater than 0"),
  status: z.enum(["Pending", "Won", "Loss", "Void", "Cashout"], {
    required_error: "Status is required",
  }),
  verificationImage: z.any().optional(),
  cashoutImage: z.any().optional(),
  cashoutAmount: z.number().optional(),
});

const initialValues = {
  date: new Date(),
  verificationImage: null,
  status: "Pending",
};

const BetModal = ({ open, onClose, onSubmit, bankroll, initialData, mode }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
    setValue,
    clearErrors,
    setError,
  } = useForm({
    resolver: zodResolver(betSchema),
    defaultValues: initialValues,
  });
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [cashoutPreviewImage, setCashoutPreviewImage] = useState(null);

  useEffect(() => {
    if (initialData && Object.entries(initialData).length) {
      const transformedData = {
        ...initialData,
        date: initialData.date ? new Date(initialData.date) : null,
        verificationImage: null,
        cashoutImage: null,
      };

      reset(transformedData);

      if (initialData.verificationImageUrl) {
        setPreviewImage(initialData.verificationImageUrl);
      }
      if (initialData.cashoutImageUrl) {
        setCashoutPreviewImage(initialData.cashoutImageUrl);
      }
    } else {
      reset(initialValues);
      setPreviewImage(null);
      setCashoutPreviewImage(null);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    if (!initialData && bankroll?.visibility !== "Private") {
      if (!data.verificationImage) {
        setError("verificationImage", {
          message: "Verification image is required",
        });
        return;
      }
      if (data.status === "Cashout" && !data.cashoutImage) {
        setError("cashoutImage", {
          message: "Cashout image is required",
        });
        return;
      }
    }
    setLoading(true);
    try {
      await onSubmit(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("verificationImage", file);
      setPreviewImage(URL.createObjectURL(file));
      clearErrors("verificationImage");
    }
  };

  const handleCashoutImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("cashoutImage", file);
      setCashoutPreviewImage(URL.createObjectURL(file));
      clearErrors("cashoutImage");
    }
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
          overflow: "hidden",
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
          {initialData ? "Update Bet" : "Add Bet"}
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
        <form id="bet-form" onSubmit={handleSubmit(handleFormSubmit)}>
          {initialData?.verificationStatus === "Accepted" && (
            <Alert severity="info" sx={{ mb: 3 }}>
              This bet has been verified. You can only edit the status and
              label.
            </Alert>
          )}
          {/* Date Input */}
          <Controller
            name="date"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDateTimePicker
                  {...field}
                  label="Date"
                  format="dd/MM/yyyy"
                  views={["year", "month", "date", "day"]}
                  disabled={initialData?.verificationStatus === "Accepted"}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      error: !!errors.date,
                      helperText: errors.date?.message,
                      InputProps: {
                        startAdornment: (
                          <CalendarTodayIcon
                            sx={{
                              mr: 1,
                              color: theme.palette.text.secondary,
                            }}
                          />
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />

          {/* Sport Input */}
          <FormControl fullWidth margin="normal" error={!!errors.sport}>
            <InputLabel>Sport</InputLabel>
            <Controller
              name="sport"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Sport"
                  disabled={initialData?.verificationStatus === "Accepted"}
                  startAdornment={
                    <SportsSoccerIcon
                      sx={{ mr: 1, color: theme.palette.text.secondary }}
                    />
                  }
                >
                  {[
                    "Football",
                    "Tennis",
                    "Basketball",
                    "Volleyball",
                    "American Football",
                    "Ice Hockey",
                    "Other Sport",
                  ].map((sport) => (
                    <MenuItem key={sport} value={sport}>
                      {sport}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.sport && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 0.5, ml: 1.5 }}
              >
                {errors.sport.message}
              </Typography>
            )}
          </FormControl>

          {/* Label Input */}
          <TextField
            {...register("label")}
            label="Bet Label"
            fullWidth
            margin="normal"
            error={!!errors.label}
            helperText={errors.label?.message}
            InputProps={{
              startAdornment: (
                <LabelIcon
                  sx={{ mr: 1, color: theme.palette.text.secondary }}
                />
              ),
            }}
          />

          {/* Odds Input */}
          <Controller
            name="odds"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(Number(e.target.value) || "")}
                label="Odds"
                type="number"
                fullWidth
                margin="normal"
                disabled={initialData?.verificationStatus === "Accepted"}
                inputProps={{
                  step: "0.01",
                }}
                error={!!errors.odds}
                helperText={errors.odds?.message}
                InputProps={{
                  startAdornment: (
                    <SpeedIcon
                      sx={{ mr: 1, color: theme.palette.text.secondary }}
                    />
                  ),
                }}
              />
            )}
          />

          {/* Stake Input */}
          <Controller
            name="stake"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(Number(e.target.value) || "")}
                label={`Stake (${bankroll?.currency?.symbol || "$"})`}
                type="number"
                fullWidth
                margin="normal"
                disabled={initialData?.verificationStatus === "Accepted"}
                inputProps={{
                  step: "0.01",
                }}
                error={!!errors.stake}
                helperText={errors.stake?.message}
                InputProps={{
                  startAdornment: (
                    <PaidIcon
                      sx={{ mr: 1, color: theme.palette.text.secondary }}
                    />
                  ),
                }}
              />
            )}
          />

          {/* Verification Image Upload */}
          {bankroll?.visibility !== "Private" && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                Verification Image
              </Typography>

              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadFileIcon />}
                sx={{
                  py: 1.25,
                  textTransform: "none",
                  fontWeight: 500,
                  borderStyle: "dashed",
                }}
              >
                Upload Verification Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              {previewImage && (
                <Paper
                  variant="outlined"
                  sx={{
                    mt: 2,
                    borderRadius: 1,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Verification Preview"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 1,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <PhotoCameraIcon sx={{ color: "white", mr: 1 }} />
                    <Typography variant="caption" sx={{ color: "white" }}>
                      Verification Image
                    </Typography>
                  </Box>
                </Paper>
              )}

              {errors?.verificationImage && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {errors.verificationImage?.message}
                </Typography>
              )}
            </Box>
          )}

          {/* Status Input */}
          <FormControl fullWidth margin="normal" error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Status">
                  {bankroll?.visibility === "Public" && !initialData
                    ? [
                        <MenuItem key="Pending" value="Pending">
                          Pending
                        </MenuItem>,
                      ]
                    : ["Won", "Loss", "Void", "Cashout", "Pending"].map(
                        (status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        )
                      )}
                </Select>
              )}
            />
            {errors.status && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 0.5, ml: 1.5 }}
              >
                {errors.status.message}
              </Typography>
            )}
          </FormControl>

          {/* Cashout Amount Input (shown only if status is Cashout) */}
          <Controller
            name="status"
            control={control}
            render={({ field }) =>
              field.value === "Cashout" && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Cashout Details
                    </Typography>
                  </Divider>

                  <Controller
                    name="cashoutAmount"
                    control={control}
                    render={({ field: amountField }) => (
                      <TextField
                        {...amountField}
                        value={amountField.value || ""}
                        onChange={(e) =>
                          amountField.onChange(Number(e.target.value) || "")
                        }
                        label={`Cashout Amount (${
                          bankroll?.currency?.symbol || "$"
                        })`}
                        type="number"
                        fullWidth
                        margin="normal"
                        inputProps={{
                          step: "0.01",
                        }}
                        error={!!errors.cashoutAmount}
                        helperText={errors.cashoutAmount?.message}
                        InputProps={{
                          startAdornment: (
                            <PaidIcon
                              sx={{
                                mr: 1,
                                color: theme.palette.text.secondary,
                              }}
                            />
                          ),
                        }}
                      />
                    )}
                  />

                  {/* Cashout Image Upload */}
                  {bankroll?.visibility !== "Private" && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={500}
                        gutterBottom
                      >
                        Cashout Image
                      </Typography>

                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        startIcon={<UploadFileIcon />}
                        sx={{
                          py: 1.25,
                          textTransform: "none",
                          fontWeight: 500,
                          borderStyle: "dashed",
                        }}
                      >
                        Upload Cashout Image
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleCashoutImageChange}
                        />
                      </Button>

                      {cashoutPreviewImage && (
                        <Paper
                          variant="outlined"
                          sx={{
                            mt: 2,
                            borderRadius: 1,
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <img
                            src={cashoutPreviewImage || "/placeholder.svg"}
                            alt="Cashout Preview"
                            style={{
                              width: "100%",
                              height: "150px",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              p: 1,
                              backgroundColor: "rgba(0,0,0,0.6)",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <PhotoCameraIcon sx={{ color: "white", mr: 1 }} />
                            <Typography
                              variant="caption"
                              sx={{ color: "white" }}
                            >
                              Cashout Image
                            </Typography>
                          </Box>
                        </Paper>
                      )}

                      {errors?.cashoutImage && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          {errors.cashoutImage?.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              )
            }
          />
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
          form="bet-form"
          disabled={loading}
          sx={{
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {loading ? "Processing..." : initialData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BetModal;
