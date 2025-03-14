import { createTheme } from "@mui/material";

// Define a clean, professional color palette
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      // Professional blue that's not too vibrant
      main: "#1649ff",
      light: "#42a5f5",
      dark: "#133ed6",
      contrastText: "#ffffff",
    },
    secondary: {
      // Subtle secondary color
      main: "#546e7a",
      light: "#78909c",
      dark: "#455a64",
      contrastText: "#ffffff",
    },
    tertiary: {
      // For additional UI elements
      main: mode === "dark" ? "#455a64" : "#90a4ae",
      light: mode === "dark" ? "#546e7a" : "#b0bec5",
      dark: mode === "dark" ? "#37474f" : "#78909c",
      contrastText: mode === "dark" ? "#ffffff" : "#000000",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ed6c02",
      light: "#ff9800",
      dark: "#e65100",
      contrastText: "#ffffff",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
      contrastText: "#ffffff",
    },
    background: {
      default: mode === "dark" ? "#121212" : "#f5f5f5",
      paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      subtle: mode === "dark" ? "#2c2c2c" : "#f0f0f0",
    },
    text: {
      primary: mode === "dark" ? "#f5f5f5" : "#212121",
      secondary: mode === "dark" ? "#b0bec5" : "#757575",
      disabled: mode === "dark" ? "#78909c" : "#9e9e9e",
    },
    divider: mode === "dark" ? "#424242" : "#e0e0e0",
  },
});

const theme = (mode) =>
  createTheme({
    ...getDesignTokens(mode),
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "2.5rem",
        fontWeight: 500,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 500,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 500,
        lineHeight: 1.2,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 500,
        lineHeight: 1.2,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 500,
        lineHeight: 1.2,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 500,
        lineHeight: 1.2,
      },
      subtitle1: {
        fontSize: "1rem",
        fontWeight: 500,
        lineHeight: 1.5,
      },
      subtitle2: {
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.5,
      },
      button: {
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1.75,
        textTransform: "none",
      },
      caption: {
        fontSize: "0.75rem",
        fontWeight: 400,
        lineHeight: 1.66,
      },
      overline: {
        fontSize: "0.75rem",
        fontWeight: 500,
        lineHeight: 2.66,
        letterSpacing: "0.08333em",
        textTransform: "uppercase",
      },
    },
    shape: {
      borderRadius: 4,
    },
    shadows: [
      "none",
      "0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.05)",
      "0px 3px 3px -2px rgba(0,0,0,0.06),0px 3px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.06)",
      "0px 3px 5px -1px rgba(0,0,0,0.07),0px 5px 8px 0px rgba(0,0,0,0.05),0px 1px 14px 0px rgba(0,0,0,0.07)",
      "0px 4px 5px -2px rgba(0,0,0,0.08),0px 7px 10px 1px rgba(0,0,0,0.06),0px 2px 16px 1px rgba(0,0,0,0.08)",
      // ... rest of the shadows remain the same as MUI default
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: mode === "dark" ? "#1e1e1e" : "#f0f0f0",
            },
            "&::-webkit-scrollbar-thumb": {
              background: mode === "dark" ? "#424242" : "#bdbdbd",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: mode === "dark" ? "#616161" : "#9e9e9e",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "4px",
            padding: "6px 16px",
            fontWeight: 500,
            boxShadow: "none",
            textTransform: "none",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
            "@media (max-width: 600px)": {
              padding: "4px 12px",
              fontSize: "0.8125rem",
            },
          },
          containedPrimary: {
            backgroundColor: "#1649ff",
            "&:hover": {
              backgroundColor: "#133ed6",
            },
          },
          containedSecondary: {
            backgroundColor: "#546e7a",
            "&:hover": {
              backgroundColor: "#455a64",
            },
          },
          outlined: {
            borderWidth: "1px",
            "&:hover": {
              borderWidth: "1px",
            },
          },
          outlinedPrimary: {
            borderColor: "#1649ff",
            "&:hover": {
              borderColor: "#133ed6",
              backgroundColor: "rgba(25, 118, 210, 0.04)",
            },
          },
          outlinedSecondary: {
            borderColor: "#546e7a",
            "&:hover": {
              borderColor: "#455a64",
              backgroundColor: "rgba(84, 110, 122, 0.04)",
            },
          },
          text: {
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              transition: "all 0.2s",
              "& fieldset": {
                borderColor: mode === "dark" ? "#424242" : "#e0e0e0",
                borderWidth: "1px",
                transition: "all 0.2s",
              },
              "&:hover fieldset": {
                borderColor: mode === "dark" ? "#757575" : "#9e9e9e",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1649ff",
                borderWidth: "2px",
              },
            },
            "& .MuiInputLabel-root": {
              color: mode === "dark" ? "#b0bec5" : "#757575",
              "&.Mui-focused": {
                color: "#1649ff",
              },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              "& fieldset": {
                borderColor: mode === "dark" ? "#424242" : "#e0e0e0",
                borderWidth: "1px",
              },
              "&:hover fieldset": {
                borderColor: mode === "dark" ? "#757575" : "#9e9e9e",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1649ff",
                borderWidth: "2px",
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            borderRadius: "4px",
            boxShadow:
              mode === "dark"
                ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                : "0 2px 8px rgba(0, 0, 0, 0.05)",
          },
          elevation1: {
            boxShadow:
              mode === "dark"
                ? "0 1px 4px rgba(0, 0, 0, 0.3)"
                : "0 1px 4px rgba(0, 0, 0, 0.05)",
          },
          elevation2: {
            boxShadow:
              mode === "dark"
                ? "0 2px 6px rgba(0, 0, 0, 0.35)"
                : "0 2px 6px rgba(0, 0, 0, 0.06)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "8px",
            boxShadow:
              mode === "dark"
                ? "0 4px 16px rgba(0, 0, 0, 0.4)"
                : "0 4px 16px rgba(0, 0, 0, 0.08)",
            padding: "4px",
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: "1.25rem",
            fontWeight: 500,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: "2px",
            margin: "2px 4px",
            padding: "6px 16px",
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
            },
            "&.Mui-selected": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(25, 118, 210, 0.16)"
                  : "rgba(25, 118, 210, 0.08)",
              "&:hover": {
                backgroundColor:
                  mode === "dark"
                    ? "rgba(25, 118, 210, 0.24)"
                    : "rgba(25, 118, 210, 0.12)",
              },
            },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              "& fieldset": {
                borderColor: mode === "dark" ? "#424242" : "#e0e0e0",
                borderWidth: "1px",
              },
              "&:hover fieldset": {
                borderColor: mode === "dark" ? "#757575" : "#9e9e9e",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1649ff",
                borderWidth: "2px",
              },
            },
            "& .MuiInputLabel-root": {
              color: mode === "dark" ? "#b0bec5" : "#757575",
              "&.Mui-focused": {
                color: "#1649ff",
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            boxShadow:
              mode === "dark"
                ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                : "0 2px 8px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
            transition: "box-shadow 0.3s",
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0 4px 12px rgba(0, 0, 0, 0.4)"
                  : "0 4px 12px rgba(0, 0, 0, 0.08)",
            },
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            padding: "16px 24px",
          },
          title: {
            fontSize: "1.125rem",
            fontWeight: 500,
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: "16px 24px",
            "&:last-child": {
              paddingBottom: "24px",
            },
          },
        },
      },
      MuiCardActions: {
        styleOverrides: {
          root: {
            padding: "8px 16px",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            fontWeight: 400,
            "&.MuiChip-colorPrimary": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(25, 118, 210, 0.16)"
                  : "rgba(25, 118, 210, 0.08)",
              color: mode === "dark" ? "#90caf9" : "#1649ff",
            },
            "&.MuiChip-colorSecondary": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(84, 110, 122, 0.16)"
                  : "rgba(84, 110, 122, 0.08)",
              color: mode === "dark" ? "#b0bec5" : "#546e7a",
            },
            "&.MuiChip-colorSuccess": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(46, 125, 50, 0.16)"
                  : "rgba(46, 125, 50, 0.08)",
              color: mode === "dark" ? "#81c784" : "#2e7d32",
            },
            "&.MuiChip-colorWarning": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(237, 108, 2, 0.16)"
                  : "rgba(237, 108, 2, 0.08)",
              color: mode === "dark" ? "#ffb74d" : "#ed6c02",
            },
            "&.MuiChip-colorError": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(211, 47, 47, 0.16)"
                  : "rgba(211, 47, 47, 0.08)",
              color: mode === "dark" ? "#ef9a9a" : "#d32f2f",
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 42,
            height: 26,
            padding: 0,
          },
          switchBase: {
            padding: 1,
            "&.Mui-checked": {
              transform: "translateX(16px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: "#1649ff",
              },
            },
          },
          thumb: {
            width: 24,
            height: 24,
            boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
          },
          track: {
            borderRadius: 13,
            opacity: 1,
            backgroundColor: mode === "dark" ? "#424242" : "#e0e0e0",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: mode === "dark" ? "#424242" : "#e0e0e0",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === "dark" ? "#424242" : "#616161",
            color: "#ffffff",
            fontSize: "0.75rem",
            padding: "6px 10px",
            borderRadius: "4px",
            boxShadow:
              mode === "dark"
                ? "0 2px 8px rgba(0, 0, 0, 0.4)"
                : "0 2px 8px rgba(0, 0, 0, 0.2)",
          },
          arrow: {
            color: mode === "dark" ? "#424242" : "#616161",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${
              mode === "dark" ? "#424242" : "#e0e0e0"
            }`,
            padding: "16px",
          },
          head: {
            fontWeight: 500,
            backgroundColor: mode === "dark" ? "#1e1e1e" : "#f5f5f5",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.04)"
                  : "rgba(0, 0, 0, 0.02)",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "dark"
                ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                : "0 2px 8px rgba(0, 0, 0, 0.05)",
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            minWidth: 100,
          },
        },
      },
    },
  });

export default theme;
