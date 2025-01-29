import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import "./index.css";
import Materialtheme from "./theme/theme";
import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./context/AuthContext";

const Main = () => {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "dark");
  const theme = useMemo(() => Materialtheme(mode), [mode]);

  const toggleTheme = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <App toggleTheme={toggleTheme} mode={mode} />
      </AuthProvider>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Main />
  </Router>
);
