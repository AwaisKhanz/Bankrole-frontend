import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Box, useTheme } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

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

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { loginAction } = useAuth();

  const onSubmit = (data) => {
    loginAction(data);
  };

  const theme = useTheme();

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
            src="logo_black.png"
            style={{
              width: "200px",
              height: "60px",
              objectFit: "cover",
            }}
          />
        </Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Login
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          gutterBottom
          sx={{ marginBottom: "1rem" }}
        >
          Login to manage your bankroll and track your bets.
        </Typography>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          style={{ marginTop: "2rem" }}
        >
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
            Login
          </Button>
        </form>

        {/* Add Link to Sign Up */}
        <Box
          sx={{
            marginTop: "1rem",
            textAlign: "center",
          }}
        >
          <Typography variant="body2">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
