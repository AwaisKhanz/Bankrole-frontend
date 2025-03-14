"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  CircularProgress,
  Alert,
  useTheme,
  Divider,
} from "@mui/material";
import api from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PaymentPage = ({ mode }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, fetchUserProfile, loading: isAuthentication } = useAuth();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [cancelDisabled, setCancelDisabled] = useState(false);
  const [inputError, setInputError] = useState("");

  const handleInputChange = (event) => {
    setInputError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputError) {
      toast.error("Please fix input errors before submitting.");
      return;
    }
    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) throw new Error(error.message);

      const { data } = await api.post("/stripe/create-subscription", {
        userId: user?._id,
        email: user?.email,
        paymentMethodId: paymentMethod.id,
      });

      const { clientSecret } = data;
      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret
      );

      if (confirmError) throw new Error(confirmError.message);

      toast.success("Subscription successful!");
      fetchUserProfile();
      setSuccessModalOpen(true);
    } catch (err) {
      toast.error(err.message || "Subscription failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelDisabled(true);
    try {
      await api.post("/stripe/cancel-subscription", { userId: user?._id });
      toast.success("Subscription canceled successfully.");
      fetchUserProfile();
      navigate("/");
    } catch (err) {
      toast.error("Failed to cancel subscription.");
      setCancelDisabled(false);
    }
  };

  const stripeElementStyle = {
    style: {
      base: {
        fontSize: "16px",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: "400",
        color: theme.palette.mode === "dark" ? "#E0E0E0" : "#424770",
        "::placeholder": {
          color: theme.palette.mode === "dark" ? "#757575" : "#aab7c4",
        },
        lineHeight: "1.5",
      },
      invalid: {
        color: theme.palette.error.main,
        iconColor: theme.palette.error.main,
      },
    },
    hidePostalCode: true,
  };

  if (isAuthentication) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          backgroundImage:
            mode === "dark"
              ? "linear-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.2) 1px, transparent 1px)"
              : "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (user?.subscription?.status === "active") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: { xs: "1rem", sm: "2rem" },
          backgroundColor: theme.palette.background.default,
          backgroundImage:
            mode === "dark"
              ? "linear-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.2) 1px, transparent 1px)"
              : "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            maxWidth: "450px",
            width: "100%",
            overflow: "hidden",
            borderRadius: "8px",
            backgroundColor: theme.palette.background.paper,
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <Box
            sx={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <img
                src={mode === "dark" ? "/logo_black.png" : "/logo_white.png"}
                alt="Logo"
                style={{
                  width: "180px",
                  height: "54px",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" fontWeight={500} gutterBottom>
                Pro Subscription
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your subscription is active until{" "}
                <strong>
                  {new Date(
                    user.subscription.currentPeriodEnd
                  ).toLocaleDateString()}
                </strong>
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <CheckCircleOutlineIcon color="success" />
              <Typography variant="body1" fontWeight={500}>
                All Premium Features Unlocked
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{ mt: 1, py: 1.5, fontWeight: 500 }}
              onClick={handleCancelSubscription}
              disabled={cancelDisabled}
            >
              {cancelDisabled ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Cancel Subscription"
              )}
            </Button>

            <Divider sx={{ my: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                OR
              </Typography>
            </Divider>

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontWeight: 500 }}
              onClick={() => navigate("/")}
            >
              Return to Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: { xs: "1rem", sm: "2rem" },
        backgroundColor: theme.palette.background.default,
        backgroundImage:
          mode === "dark"
            ? "linear-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.2) 1px, transparent 1px)"
            : "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: "450px",
          width: "100%",
          overflow: "hidden",
          borderRadius: "8px",
          backgroundColor: theme.palette.background.paper,
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
          },
        }}
      >
        <Box
          sx={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <img
              src={mode === "dark" ? "/logo_black.png" : "/logo_white.png"}
              alt="Logo"
              style={{
                width: "180px",
                height: "54px",
                objectFit: "cover",
              }}
            />
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" fontWeight={500} gutterBottom>
              Subscribe to Pro Plan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unlock premium features and enhance your experience
            </Typography>
          </Box>

          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <List disablePadding>
              <ListItem sx={{ py: 0.75 }}>
                <Typography variant="body2">
                  ✓ Unlimited bankroll management
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 0.75 }}>
                <Typography variant="body2">
                  ✓ Unlimited bet management
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 0.75 }}>
                <Typography variant="body2">✓ Advanced analytics</Typography>
              </ListItem>
            </List>
          </Box>

          <Typography
            variant="h6"
            textAlign="center"
            fontWeight="bold"
            sx={{ margin: "0.5rem 0" }}
          >
            $19.99/month
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                padding: "0.75rem",
                marginBottom: "1rem",
                "&:focus-within": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <CardElement
                options={stripeElementStyle}
                onChange={handleInputChange}
              />
            </Box>
            {inputError && (
              <Alert severity="error" sx={{ marginBottom: "1rem" }}>
                {inputError}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontWeight: 500 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Subscribe Now"
              )}
            </Button>
          </form>

          <Divider sx={{ my: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary }}
            >
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Not ready to upgrade?{" "}
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/ranking")}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  p: 0,
                  minWidth: "auto",
                  verticalAlign: "baseline",
                }}
              >
                Continue with Free Plan
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
      <PaymentSuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
      />
    </Box>
  );
};

export default PaymentPage;
