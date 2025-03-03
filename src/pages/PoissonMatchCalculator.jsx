import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";

function poissonProbability(lambda, x) {
  // Use logarithmic form to avoid underflow: log(P(x)) = -lambda + x*log(lambda) - log(x!)
  const logP = -lambda + x * Math.log(lambda) - logFactorial(x);
  return Math.exp(logP);
}

function logFactorial(n) {
  if (n === 0 || n === 1) return 0;
  let sum = 0;
  for (let i = 2; i <= n; i++) {
    sum += Math.log(i);
  }
  return sum;
}

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function calculateMatchProbabilities(lambdaTeamA, lambdaTeamB) {
  // Dynamically adjust maxGoals based on lambda (e.g., 3 standard deviations above mean)
  const maxGoals = Math.max(
    5,
    Math.ceil(
      Math.max(lambdaTeamA, lambdaTeamB) +
        3 * Math.sqrt(Math.max(lambdaTeamA, lambdaTeamB))
    )
  );
  let probabilitiesA = [];
  let probabilitiesB = [];

  for (let i = 0; i <= maxGoals; i++) {
    probabilitiesA[i] = poissonProbability(lambdaTeamA, i);
    probabilitiesB[i] = poissonProbability(lambdaTeamB, i);
  }

  let resultMatrix = Array(maxGoals + 1)
    .fill()
    .map(() => Array(maxGoals + 1).fill(0));

  for (let i = 0; i <= maxGoals; i++) {
    for (let j = 0; j <= maxGoals; j++) {
      resultMatrix[i][j] = probabilitiesA[i] * probabilitiesB[j];
    }
  }

  let winA = 0;
  let draw = 0;
  let winB = 0;

  for (let i = 0; i <= maxGoals; i++) {
    for (let j = 0; j <= maxGoals; j++) {
      if (i > j) winA += resultMatrix[i][j];
      else if (i === j) draw += resultMatrix[i][j];
      else if (i < j) winB += resultMatrix[i][j];
    }
  }

  const total = winA + draw + winB;
  if (total > 0) {
    winA = (winA / total) * 100;
    draw = (draw / total) * 100;
    winB = (winB / total) * 100;
  }

  return {
    winA: winA.toFixed(2),
    draw: draw.toFixed(2),
    winB: winB.toFixed(2),
    probabilitiesA,
    probabilitiesB,
  };
}

const PoissonCalculator = ({ mode }) => {
  const [lambdaA, setLambdaA] = useState("");
  const [lambdaB, setLambdaB] = useState("");
  const [results, setResults] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("poissonState"));
    if (savedState) {
      setLambdaA(savedState.lambdaA || "");
      setLambdaB(savedState.lambdaB || "");
      setResults(savedState.results || null);
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      lambdaA,
      lambdaB,
      results,
    };
    localStorage.setItem("poissonState", JSON.stringify(stateToSave));
  }, [lambdaA, lambdaB, results]);

  const calculateProbabilities = () => {
    const lambdaAValue = parseFloat(lambdaA);
    const lambdaBValue = parseFloat(lambdaB);

    if (
      isNaN(lambdaAValue) ||
      isNaN(lambdaBValue) ||
      lambdaAValue <= 0 ||
      lambdaBValue <= 0
    ) {
      setResults({ error: "Please enter valid lambda values greater than 0!" });
      return;
    }

    if (lambdaAValue > 1000 || lambdaBValue > 1000) {
      setResults({
        error:
          "Lambda values above 1000 are not practical for this calculator!",
      });
      return;
    }

    const probabilities = calculateMatchProbabilities(
      lambdaAValue,
      lambdaBValue
    );
    setResults(probabilities);
  };

  const clearFields = () => {
    setLambdaA("");
    setLambdaB("");
    setResults(null);
    localStorage.removeItem("poissonState");
  };

  const backgroundColor = mode === "dark" ? "#1e293b" : "#ffffff";
  const textColor = mode === "dark" ? "#ffffff" : "#000000";
  const boxShadow =
    mode === "dark"
      ? "0px 4px 12px rgba(0, 0, 0, 0.2)"
      : "0px 4px 12px rgba(0, 0, 0, 0.1)";

  return (
    <Box
      sx={{
        maxWidth: "700px",
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
        Poisson Match Calculator
      </Typography>

      <TextField
        label="Team A Expected Goals (λA)"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={lambdaA}
        onChange={(e) => setLambdaA(e.target.value)}
        placeholder="Enter Team A's expected goals"
        inputProps={{ step: "0.1", min: "0", max: "1000" }}
      />
      <TextField
        label="Team B Expected Goals (λB)"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={lambdaB}
        onChange={(e) => setLambdaB(e.target.value)}
        placeholder="Enter Team B's expected goals"
        inputProps={{ step: "0.1", min: "0", max: "1000" }}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={calculateProbabilities}
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

      {results && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
            📊 Match Probabilities
          </Typography>
          {results.error ? (
            <Typography color="error" textAlign="center">
              {results.error}
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: textColor }}>Outcome</TableCell>
                  <TableCell sx={{ color: textColor }}>
                    Probability (%)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: textColor }}>Team A Wins</TableCell>
                  <TableCell sx={{ color: textColor }}>
                    {results.winA}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: textColor }}>Draw</TableCell>
                  <TableCell sx={{ color: textColor }}>
                    {results.draw}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: textColor }}>Team B Wins</TableCell>
                  <TableCell sx={{ color: textColor }}>
                    {results.winB}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PoissonCalculator;
