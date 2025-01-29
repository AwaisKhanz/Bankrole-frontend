import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Box, useTheme } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { showSuccessToast, showErrorToast } from "../utils/toast";

// Define Zod schema for validation
const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, "Username must be at least 2 characters")
      .nonempty("Username is required"),
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Field to highlight in error
    message: "Passwords do not match",
  });

const Register = ({ mode }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/register", data);
      showSuccessToast("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "1rem",
        background: theme.palette.primary.main,
        position: "relative",
      }}
    >
      {/* Form Container */}
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
          />
        </Box>
        {/* Header Text */}
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Register
        </Typography>

        {/* Introductory Text */}
        <Typography
          variant="body2"
          textAlign="center"
          gutterBottom
          sx={{ marginBottom: "1rem" }}
        >
          Sign up to start managing your bankroll and bets.
        </Typography>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 "
          style={{ marginTop: "2rem" }}
        >
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
            label="Password"
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
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{
              marginTop: "1rem",
              padding: "0.75rem",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Register
          </Button>
        </form>

        {/* Link to Login */}
        <Box
          sx={{
            marginTop: "1rem",
            textAlign: "center",
          }}
        >
          <Typography variant="body2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
