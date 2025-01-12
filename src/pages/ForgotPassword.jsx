import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Box, useTheme } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const theme = useTheme();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", data);
      toast.success("Password reset link sent to your email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: "100vh",
        padding: "1rem",
        background: theme.palette.primary.main,
        color: "white",
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
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img
            src="/logo_black.png"
            style={{
              width: "200px",
              height: "60px",
              objectFit: "cover",
            }}
            alt="Logo"
          />
        </Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Forgot Password
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ marginBottom: "1rem" }}
        >
          Enter your email to receive a password reset link.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "2rem" }}>
          <TextField
            {...register("email")}
            label="Email"
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
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
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <Box sx={{ marginTop: "1rem", textAlign: "center" }}>
          <Typography variant="body2">
            Remembered your password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
