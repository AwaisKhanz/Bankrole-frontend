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
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

const Login = ({ mode }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { loginAction } = useAuth();
  const theme = useTheme();

  const onSubmit = async (data) => {
    setLoading(true);
    await loginAction(data);
    setLoading(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
          },
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
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Login to manage your bankroll and track your bets
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot your password?
                </Link>
              </Box>

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
                  position: "relative",
                  bgcolor: "#1649ff",
                  "&:hover": {
                    bgcolor: "#0d3ad9",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
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
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#1649ff",
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
