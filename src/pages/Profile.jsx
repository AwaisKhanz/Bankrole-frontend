import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Box,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../services/api";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Card, CardContent, Alert } from "@mui/material";
import { Divider } from "@mui/material"; // Add Divider for separation

// Schema for profile update
const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")), // Optional password field
});

export default function Profile({ mode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardUpdateLoading, setCardUpdateLoading] = useState(false);
  const [cardInputError, setCardInputError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        email: user.email || "",
        password: "",
      });
      // Fetch current payment method
      const fetchPaymentMethod = async () => {
        try {
          const { data } = await api.get("/stripe/payment-method");
          setPaymentMethod(data.paymentMethod);
        } catch (error) {
          console.error("Error fetching payment method:", error);
        }
      };
      fetchPaymentMethod();
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const updateData = {
        username: data.username,
        email: data.email,
      };
      if (data.password) {
        updateData.password = data.password;
      }

      const response = await api.put("/auth/profile", updateData);
      toast.success("Profile updated successful!");
      setLoading(false);
      reset({ ...data, password: "" });
    } catch (error) {
      setLoading(false);
      toast.error(error || "Please fix input errors before submitting.");
      console.error("Error updating profile:", error);
    }
  };

  const handleCardUpdate = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || cardInputError) {
      toast.error("Please fix card input errors before submitting.");
      return;
    }
    setCardUpdateLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod: newPaymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (error) throw new Error(error.message);

      await api.post("/stripe/update-payment-method", {
        paymentMethodId: newPaymentMethod.id,
      });

      toast.success("Payment card updated successfully!");
      const { data } = await api.get("/stripe/payment-method"); // Refresh payment method
      setPaymentMethod(data.paymentMethod);
    } catch (error) {
      toast.error(error.message || "Failed to update payment card.");
    } finally {
      setCardUpdateLoading(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: "100%",
        padding: "1rem",
        color: mode === "dark" ? "white" : "black",
      }}
    >
      <Box
        sx={{
          maxWidth: "550px",
          width: "100%",
          padding: "2rem",
          borderRadius: "12px",
          backgroundColor: theme.palette.tertiary.main,
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Update Profile
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          gutterBottom
          sx={{ marginBottom: "1rem" }}
        >
          Modify your account details below.
        </Typography>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          style={{ marginTop: "2rem" }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            sx={{ marginBottom: "1rem" }}
          >
            Account Details
          </Typography>
          <TextField
            {...register("username")}
            label="Username"
            variant="outlined"
            fullWidth
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            {...register("email")}
            label="Email"
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            {...register("password")}
            label="New Password (optional)"
            type="password"
            variant="outlined"
            fullWidth
            error={!!errors.password}
            helperText={
              errors.password?.message || "Leave blank to keep current password"
            }
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            disabled={loading}
            sx={{
              marginTop: "1rem",
              padding: "0.75rem",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Account"
            )}
          </Button>
        </form>

        <Box className="flex flex-col gap-4" sx={{ marginTop: "2rem" }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            sx={{ marginBottom: "1rem" }}
          >
            Membership Details
          </Typography>
          {user?.subscription?.status ? (
            <Box>
              <Typography>
                Status:{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {user.subscription.status}
                </span>
              </Typography>
              {user.subscription.currentPeriodEnd && (
                <Typography>
                  Expires:{" "}
                  {new Date(
                    user.subscription.currentPeriodEnd
                  ).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          ) : (
            <Typography>No active membership.</Typography>
          )}
        </Box>

        <Box className="flex flex-col gap-4" sx={{ marginTop: "2rem" }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            sx={{ marginBottom: "1rem" }}
          >
            Payment Card
          </Typography>
          {paymentMethod ? (
            <Card
              sx={{
                marginBottom: "1rem",
                backgroundColor: theme.palette.secondary.main,
              }}
            >
              <CardContent>
                <Typography>
                  Current Card: {paymentMethod.brand.toUpperCase()} ending in{" "}
                  {paymentMethod.last4}
                </Typography>
                <Typography>
                  Expires: {paymentMethod.expMonth}/{paymentMethod.expYear}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Typography>No payment card on file.</Typography>
          )}
          <Box
            sx={{
              border:
                mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.2)"
                  : "1px solid #ccc", // Light grey border for light, subtle white for dark
              borderRadius: "8px",
              padding: "0.75rem", // Slightly more padding for comfort
              marginBottom: "1rem",
              backgroundColor:
                mode === "dark"
                  ? "" // Dark grey for dark mode
                  : "#f9f9f9", // Light grey for light mode
              boxShadow:
                mode === "dark"
                  ? "0 2px 4px rgba(0, 0, 0, 0.3)"
                  : "0 2px 4px rgba(0, 0, 0, 0.05)", // Subtle shadow for depth
              "&:hover": {
                borderColor:
                  mode === "dark" ? "rgba(255, 255, 255, 0.4)" : "#aaa", // Slightly brighter on hover
              },
              transition: "border-color 0.2s ease-in-out", // Smooth transition for hover
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                    fontWeight: "400",
                    color: mode === "dark" ? "#E0E0E0" : "#424770", // Light grey for dark, dark blue-grey for light
                    "::placeholder": {
                      color: mode === "dark" ? "#757575" : "#aab7c4", // Medium grey for dark, light grey for light
                    },
                    lineHeight: "1.5",
                    padding: "4px", // Slight padding for breathing room
                  },
                  invalid: {
                    color: mode === "dark" ? "#FF6B6B" : "#9e2146", // Soft red for dark, darker red for light
                    iconColor: mode === "dark" ? "#FF6B6B" : "#9e2146", // Match icon to text
                  },
                  complete: {
                    color: mode === "dark" ? "#66BB6A" : "#2E7D32", // Soft green for dark, darker green for light
                    iconColor: mode === "dark" ? "#66BB6A" : "#2E7D32", // Match icon to text
                  },
                },
                hidePostalCode: true, // Optional: hide postal code if not needed
              }}
              onChange={(event) =>
                setCardInputError(event.error ? event.error.message : "")
              }
            />
          </Box>
          {cardInputError && (
            <Alert severity="error" sx={{ marginBottom: "1rem" }}>
              {cardInputError}
            </Alert>
          )}
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ padding: "0.75rem", fontWeight: "bold" }}
            onClick={handleCardUpdate}
            disabled={cardUpdateLoading || !stripe || !elements}
          >
            {cardUpdateLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Card"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
