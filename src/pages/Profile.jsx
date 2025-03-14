"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Box,
  useTheme,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent,
  Stack,
  IconButton,
  InputAdornment,
  Chip,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../services/api";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  CreditCard,
  Badge,
} from "@mui/icons-material";

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
  const [showPassword, setShowPassword] = useState(false);

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

      await api.put("/auth/profile", updateData);
      toast.success("Profile updated successfully!");
      reset({ ...data, password: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (!stripe || !elements) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const formatExpiryDate = (month, year) => {
    return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
  };

  const getCardBrandIcon = (brand) => {
    // You could replace this with actual card brand icons
    return <CreditCard />;
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Profile
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Manage your account settings and payment information
      </Typography>

      <Grid container spacing={3}>
        {/* Account Details Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Badge sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
              <Typography variant="h6" fontWeight={600}>
                Account Details
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2.5}>
                <TextField
                  {...register("username")}
                  label="Username"
                  variant="outlined"
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  {...register("email")}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  {...register("password")}
                  label="New Password (optional)"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  error={!!errors.password}
                  helperText={
                    errors.password?.message ||
                    "Leave blank to keep current password"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 1,
                    py: 1.25,
                    fontWeight: 500,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Update Account"
                  )}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* Membership and Payment Section */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3} sx={{ height: "100%" }}>
            {/* Membership Details */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <CreditCard
                  sx={{ color: theme.palette.primary.main, mr: 1.5 }}
                />
                <Typography variant="h6" fontWeight={600}>
                  Membership Details
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Chip
                      label={
                        user?.subscription?.status === "active"
                          ? "Active"
                          : "Inactive"
                      }
                      size="small"
                      color={
                        user?.subscription?.status === "active"
                          ? "success"
                          : "default"
                      }
                      sx={{
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Plan
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2" fontWeight={500}>
                      {user?.subscription?.status === "active"
                        ? "Pro Plan"
                        : "Free Plan"}
                    </Typography>
                  </Grid>

                  {user?.subscription?.currentPeriodEnd && (
                    <>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Renewal Date
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(
                            user.subscription.currentPeriodEnd
                          ).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>

              {user?.subscription?.status !== "active" && (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  href="/payment"
                  sx={{
                    mt: 2,
                    py: 1.25,
                    fontWeight: 500,
                    textTransform: "none",
                  }}
                >
                  Upgrade to Pro
                </Button>
              )}
            </Paper>

            {/* Payment Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                flexGrow: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <CreditCard
                  sx={{ color: theme.palette.primary.main, mr: 1.5 }}
                />
                <Typography variant="h6" fontWeight={600}>
                  Payment Method
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {paymentMethod ? (
                <Card
                  variant="outlined"
                  sx={{
                    mb: 3,
                    borderRadius: 1,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.02)",
                  }}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      {getCardBrandIcon(paymentMethod.brand)}
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{ ml: 1, textTransform: "capitalize" }}
                      >
                        {paymentMethod.brand} •••• {paymentMethod.last4}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Expires:{" "}
                      {formatExpiryDate(
                        paymentMethod.expMonth,
                        paymentMethod.expYear
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <Alert severity="info" sx={{ mb: 3 }}>
                  No payment card on file
                </Alert>
              )}

              <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                Update Payment Card
              </Typography>

              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  p: 2,
                  mb: 2,
                  backgroundColor: theme.palette.background.paper,
                  transition: "border-color 0.2s ease-in-out",
                  "&:hover": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(0, 0, 0, 0.3)",
                  },
                  "&:focus-within": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
                  },
                }}
              >
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                        fontWeight: "400",
                        color: theme.palette.text.primary,
                        "::placeholder": {
                          color: theme.palette.text.secondary,
                        },
                        lineHeight: "1.5",
                      },
                      invalid: {
                        color: theme.palette.error.main,
                        iconColor: theme.palette.error.main,
                      },
                      complete: {
                        color: theme.palette.success.main,
                        iconColor: theme.palette.success.main,
                      },
                    },
                    hidePostalCode: true,
                  }}
                  onChange={(event) =>
                    setCardInputError(event.error ? event.error.message : "")
                  }
                />
              </Box>

              {cardInputError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {cardInputError}
                </Alert>
              )}

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCardUpdate}
                disabled={cardUpdateLoading || !stripe || !elements}
                sx={{
                  py: 1.25,
                  fontWeight: 500,
                }}
              >
                {cardUpdateLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update Card"
                )}
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
