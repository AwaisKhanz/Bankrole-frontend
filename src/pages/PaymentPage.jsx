import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import api from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import { useNavigate } from "react-router-dom";

const SubscriptionCard = ({ title, description, children, mode }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        maxWidth: "500px",
        width: "100%",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        background: theme.palette.secondary.main,
        padding: { sm: "0.5", lg: "1.5rem" },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={mode === "dark" ? "/logo_black.png" : "/logo_white.png"}
            alt="Logo"
            style={{
              width: "50%",
              height: "50px",
              objectFit: "cover",
              marginBottom: "1rem",
            }}
          />
        </Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" textAlign="center" gutterBottom>
            {description}
          </Typography>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

const LoadingScreen = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "2rem",
    }}
  >
    <CircularProgress />
  </Box>
);

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
  };

  if (isAuthentication) return <LoadingScreen />;

  if (user?.subscription?.status === "active") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <SubscriptionCard
          mode={mode}
          title="You are a Pro User!"
          description={`Your subscription is active until ${new Date(
            user.subscription.currentPeriodEnd
          ).toLocaleDateString()}`}
        >
          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{ marginTop: "1rem", fontWeight: "bold" }}
            onClick={handleCancelSubscription}
            disabled={cancelDisabled}
          >
            {cancelDisabled ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Cancel Subscription"
            )}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{
              marginTop: "1rem",
            }}
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>
        </SubscriptionCard>
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
        padding: "2rem",
      }}
    >
      <SubscriptionCard
        mode={mode}
        title="Subscribe to Pro Plan"
        description="Unlock premium features!"
      >
        <List>
          <ListItem>✔ Unlimited bankroll management</ListItem>
          <ListItem>✔ Unlimited bet management</ListItem>
          <ListItem>✔ Advanced analytics</ListItem>
        </List>
        <Typography
          variant="h6"
          textAlign="center"
          fontWeight="bold"
          sx={{ margin: "1rem 0" }}
        >
          $19.99/month
        </Typography>
        <form onSubmit={handleSubmit}>
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
            sx={{ padding: "0.75rem", fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Pay $19.99"
            )}
          </Button>
        </form>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{
            marginTop: "1rem",
          }}
          onClick={() => navigate("/ranking")}
        >
          Continue with Current Plan
        </Button>
      </SubscriptionCard>
      <PaymentSuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
      />
    </Box>
  );
};

export default PaymentPage;
