"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Box,
  useTheme,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Lock,
} from "@mui/icons-material";

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
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const Register = ({ mode }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();
  const theme = useTheme();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.post("/auth/register", data);
      showSuccessToast("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
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
        minHeight: "100vh",
        padding: { xs: "1rem", sm: "2rem" },
        backgroundColor: theme.palette.background.default,
        backgroundImage:
          mode === "dark"
            ? "linear-gradient(135deg, #0a2463 0%, #1649ff 50%, #0a2463 100%)"
            : "linear-gradient(135deg, #c5d5ff 0%, #1649ff 50%, #0d3ad9 100%)",
        backgroundSize: "cover",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            mode === "dark"
              ? "radial-gradient(circle at 50% 50%, rgba(61, 90, 254, 0.2) 0%, rgba(22, 73, 255, 0) 50%)"
              : "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 60%)",
          opacity: 0.8,
          zIndex: 1,
        },
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
          position: "relative",
          zIndex: 2,
          boxShadow:
            mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 15px rgba(22, 73, 255, 0.2)"
              : "0 8px 32px rgba(22, 73, 255, 0.15)",
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
            <Typography
              variant="h5"
              fontWeight={500}
              gutterBottom
              sx={{ color: theme.palette.text.primary }}
            >
              Create Account
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Sign up to start managing your bankroll and bets
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
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
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                {...register("confirmPassword")}
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
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
                  py: 1.5,
                  fontWeight: 500,
                  bgcolor: "#1649ff",
                  "&:hover": {
                    bgcolor: "#0d3ad9",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </Box>
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
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#1649ff",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
