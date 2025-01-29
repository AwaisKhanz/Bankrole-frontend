import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Box, useTheme } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const ResetPassword = ({ mode }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });
  const theme = useTheme();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, {
        password: data.password,
      });
      toast.success("Password reset successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
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
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img
            src={mode === "dark" ? "/logo_black.png" : "/logo_white.png"}
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
          Reset Password
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ marginBottom: "1rem" }}
        >
          Enter your new password below.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "2rem" }}>
          <TextField
            {...register("password")}
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            {...register("confirmPassword")}
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={{ marginTop: "1rem" }}
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
            {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
