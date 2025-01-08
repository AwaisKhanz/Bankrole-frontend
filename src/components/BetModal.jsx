import React, { useEffect } from "react";
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
} from "@mui/material";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  label: z.string().min(1, "Label is required"),
  odds: z.number().min(1, "Odds must be at least 1"),
  stake: z.number().min(0.01, "Stake must be greater than 0"),
  status: z.enum(["Pending", "Won", "Loss"], {
    required_error: "Status is required",
  }),
  verificationCode: z.string().min(1, "Verification Code is required"),
});

const initialValues = {
  date: null,
  sport: "",
  label: "",
  odds: "",
  stake: "",
  verificationCode: "",
  status: "Pending",
};

const BetModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  initialStackSymbol,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    resolver: zodResolver(betSchema),
    defaultValues: initialValues,
  });
  const theme = useTheme();

  useEffect(() => {
    if (initialData && Object.entries(initialData).length) {
      const transformedData = {
        ...initialData,
        date: initialData.date ? new Date(initialData.date) : null,
      };
      reset(transformedData);
    } else {
      reset(initialValues);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
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
        {initialData ? "Update Bet" : "Add Bet"}
      </DialogTitle>

      <DialogContent sx={{ padding: "0px", mb: "1rem", mt: "2rem" }}>
        <form id="bet-form" onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Date Input */}
          <Controller
            name="date"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDateTimePicker
                  className="w-full  !mb-[0.5rem] !mt-2"
                  {...field}
                  label="Date & Time"
                  format="dd/MM/yyyy"
                  // views={["year", "month", "date"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      error={!!errors.date}
                      helperText={errors.date?.message}
                      sx={{
                        "& .MuiInputBase-root": {
                          padding: "0.8rem 1rem",
                        },
                        "& .MuiInputLabel-root": {
                          top: "-4px",
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />

          {/* Sport Input */}
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.sport}
            sx={{ marginBottom: "1rem" }}
          >
            <InputLabel>Sport</InputLabel>
            <Controller
              name="sport"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Sport">
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
              <Typography variant="body2" color="error">
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
                inputProps={{
                  step: "0.01",
                }}
                error={!!errors.odds}
                helperText={errors.odds?.message}
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
                label={`Stake (${initialStackSymbol || "$"})`}
                type="number"
                fullWidth
                margin="normal"
                inputProps={{
                  step: "0.01",
                }}
                error={!!errors.stake}
                helperText={errors.stake?.message}
              />
            )}
          />

          {/* Verification Code Input */}
          <TextField
            {...register("verificationCode")}
            label="Verification Code"
            fullWidth
            margin="normal"
            error={!!errors.verificationCode}
            helperText={errors.verificationCode?.message}
          />

          {/* Status Input */}
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.status}
            sx={{ marginBottom: "1rem" }}
          >
            <InputLabel>Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Status">
                  {["Pending", "Won", "Loss"].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.status && (
              <Typography variant="body2" color="error">
                {errors.status.message}
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
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          form="bet-form"
          variant="contained"
          color="primary"
        >
          {initialData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BetModal;
