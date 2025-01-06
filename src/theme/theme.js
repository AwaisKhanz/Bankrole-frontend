import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#192232",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#334155",
      contrastText: "#000000",
    },
    tertiary: {
      main: "#1e293b",
      contrastText: "#000000",
    },
    success: {
      main: "#4CAF50",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#FF9800",
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    button: {
      fontWeight: "bold",
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "0.75rem 1.5rem",
          transition: "all 0.3s ease",
          "@media (max-width: 600px)": {
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            borderRadius: "6px",
          },
        },
        containedPrimary: {
          backgroundColor: "#192232",
          color: "white",
          "&:hover": {
            backgroundColor: "#1e293b",
            boxShadow: "0px 4px 8px #192232",
          },
          "@media (max-width: 600px)": {
            // Small screen styles
            padding: "0.5rem 1rem",
          },
        },
        containedSecondary: {
          backgroundColor: "#1649ff",
          color: "white",
          "&:hover": {
            backgroundColor: "#1649ff",
            boxShadow: "0px 4px 8px #1649ff",
          },
          "@media (max-width: 600px)": {
            // Small screen styles
            padding: "0.5rem 1rem",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            color: "#E2E8F0",
            "& fieldset": {
              borderColor: "#A0AEC0",
            },
            "&:hover fieldset": {
              borderColor: "#E2E8F0",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FFFFFF",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#A0AEC0",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.7)",
            },
            "&:hover fieldset": {
              borderColor: "#FFFFFF",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FFFFFF",
              borderWidth: "2px",
            },
          },
          "& .MuiSelect-select": {
            color: "#FFFFFF",
          },
        },
      },
    },
  },
});

export default theme;
