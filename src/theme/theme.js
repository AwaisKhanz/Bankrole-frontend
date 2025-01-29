import { createTheme } from "@mui/material";

const theme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#192232" : "#f0f0f0",
        contrastText: mode === "dark" ? "#ffffff" : "#000000",
      },
      secondary: {
        main: mode === "dark" ? "#334155" : "#ffffff",
        contrastText: mode === "dark" ? "#000000" : "#000000",
      },
      tertiary: {
        main: mode === "dark" ? "#1e293b" : "#ffffff",
        contrastText: mode === "dark" ? "#000000" : "#000000",
      },
      success: {
        main: "#4CAF50",
        contrastText: "#ffffff",
      },
      warning: {
        main: "#FF9800",
        contrastText: "#ffffff",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#ffffff",
        paper: mode === "dark" ? "#1e293b" : "#f0f0f0",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000",
        secondary: mode === "dark" ? "#A0AEC0" : "#333333",
      },
      divider: mode === "dark" ? "#334155" : "#000",
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
            backgroundColor: mode === "dark" ? "#192232" : "#f0f0f0",
            color: mode === "dark" ? "#ffffff" : "#000000",
            "&:hover": {
              backgroundColor: mode === "dark" ? "#1e293b" : "#e0e0e0",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            },
            "@media (max-width: 600px)": {
              padding: "0.5rem 1rem",
            },
          },
          containedSecondary: {
            backgroundColor: "#1649ff",
            color: "white",
            "&:hover": {
              backgroundColor: "#1649ff",
              boxShadow: "0px 4px 8px rgba(22, 73, 255, 0.3)",
            },
            "@media (max-width: 600px)": {
              padding: "0.5rem 1rem",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              color: mode === "dark" ? "#E2E8F0" : "#000000",
              "& fieldset": {
                borderColor: mode === "dark" ? "#A0AEC0" : "#c0c0c0",
              },
              "&:hover fieldset": {
                borderColor: mode === "dark" ? "#E2E8F0" : "#000000",
              },
              "&.Mui-focused fieldset": {
                borderColor: mode === "dark" ? "#E2E8F0" : "#000000",
              },
            },
            "& .MuiInputLabel-root": {
              color: mode === "dark" ? "#A0AEC0" : "#333333",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: mode === "dark" ? "#E2E8F0" : "#000000",
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: mode === "dark" ? "#A0AEC0" : "#c0c0c0",
              },
              "&:hover fieldset": {
                borderColor: mode === "dark" ? "#E2E8F0" : "#000000",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1649ff",
                borderWidth: "2px",
              },
            },
            "& .MuiSelect-select": {
              color: mode === "dark" ? "#E2E8F0" : "#000000",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#1e293b" : "#ffffff",
            color: mode === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "dark" ? "#1e293b" : "#ffffff",
            color: mode === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#E2E8F0" : "#000000",
            "&:hover": {
              backgroundColor: mode === "dark" ? "#334155" : "#f0f0f0",
            },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            minWidth: 200,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(0, 0, 0, 0.7)", // Dynamic border color
              },
              "&:hover fieldset": {
                borderColor: mode === "dark" ? "#FFFFFF" : "#000000", // Dynamic hover border color
              },
              "&.Mui-focused fieldset": {
                borderColor: mode === "dark" ? "#FFFFFF" : "#000000", // Dynamic focus border color
                borderWidth: "2px",
              },
            },
            "& .MuiInputLabel-root": {
              color:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(0, 0, 0, 0.7)", // Dynamic label color
              "&.Mui-focused": {
                color: mode === "dark" ? "#FFFFFF" : "#000000", // Dynamic focused label color
              },
            },
          },
        },
      },
    },
  });

export default theme;
