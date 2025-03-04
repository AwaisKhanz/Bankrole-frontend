import React, { useState } from "react";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";

const RiskCalculator = ({ mode }) => {
  const [bankroll, setBankroll] = useState("");
  const [percentage, setPercentage] = useState("");
  const [result, setResult] = useState("");

  const calculatePercentage = () => {
    const bankrollValue = parseFloat(bankroll);
    const percentageValue = parseFloat(percentage);

    if (
      isNaN(bankrollValue) ||
      isNaN(percentageValue) ||
      bankrollValue <= 0 ||
      percentageValue <= 0
    ) {
      setResult("Please enter valid values!");
      return;
    }

    const calculatedValue = (bankrollValue * percentageValue) / 100;
    setResult(
      `${percentageValue}% of €${bankrollValue} is €${calculatedValue.toFixed(
        2
      )}`
    );
  };

  const clearFields = () => {
    setBankroll("");
    setPercentage("");
    setResult("");
  };

  // Define colors based on the mode
  const backgroundColor = mode === "dark" ? "#1e293b" : "#ffffff";
  const textColor = mode === "dark" ? "#ffffff" : "#000000";
  const boxShadow =
    mode === "dark"
      ? "0px 4px 12px rgba(0, 0, 0, 0.2)"
      : "0px 4px 12px rgba(0, 0, 0, 0.1)";

  return (
    <Box
      sx={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "30px",
        backgroundColor: backgroundColor,
        borderRadius: "12px",
        boxShadow: boxShadow,
        color: textColor,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={3}
        color={textColor}
      >
        Risk Calculator
      </Typography>
      <TextField
        label="Total Bankroll (€)"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={bankroll}
        onChange={(e) => setBankroll(e.target.value)}
        placeholder="Enter your total bankroll"
      />
      <TextField
        label="Percentage (%)"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={percentage}
        onChange={(e) => setPercentage(e.target.value)}
        placeholder="Enter the percentage"
      />
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={calculatePercentage}
        >
          Calculate
        </Button>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={clearFields}
          sx={{
            borderColor: mode === "dark" ? "#FF5252" : "#FF5252",
            color: mode === "dark" ? "#FF5252" : "#FF5252",
            "&:hover": {
              borderColor: mode === "dark" ? "#FF5252" : "#FF5252",
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 82, 82, 0.1)"
                  : "rgba(255, 82, 82, 0.1)",
            },
          }}
        >
          Clear
        </Button>
      </Stack>
      {result && (
        <Typography variant="h6" fontWeight="bold" textAlign="center" mt={3}>
          {result}
        </Typography>
      )}
    </Box>
  );
};

export default RiskCalculator;
