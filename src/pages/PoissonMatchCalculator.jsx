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
import Chart from "chart.js/auto";

function poissonProbability(lambda, x) {
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

function calculateMatchProbabilities(lambdaTeamA, lambdaTeamB) {
  const maxGoals = 5;
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
  const chartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);

  // Chart configuration object
  const chartConfig = {
    light: {
      textColor: "#333333",
      gridColor: "rgba(0, 0, 0, 0.15)",
      lineColors: ["#1976D2", "#D32F2F"],
      backgroundColor: "#ffffff",
    },
    dark: {
      textColor: "#ffffff",
      gridColor: "rgba(255, 255, 255, 0.15)",
      lineColors: ["#42A5F5", "#EF5350"],
      backgroundColor: "#1e293b",
    },
  };

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

    if (results && !results.error && chartRef.current) {
      updateChart(results.probabilitiesA, results.probabilitiesB);
    }
  }, [lambdaA, lambdaB, results, mode]); // Added 'mode' to dependencies

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
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
    localStorage.removeItem("poissonState");
  };

  const updateChart = (probA, probB) => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const isDarkMode = mode === "dark";
    const config = isDarkMode ? chartConfig.dark : chartConfig.light;

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [0, 1, 2, 3, 4, 5],
        datasets: [
          {
            label: "Team A",
            data: probA.map((p) => (p * 100).toFixed(2)),
            borderColor: config.lineColors[0],
            borderWidth: 2,
            fill: false,
            pointBackgroundColor: config.lineColors[0],
            pointRadius: 3,
          },
          {
            label: "Team B",
            data: probB.map((p) => (p * 100).toFixed(2)),
            borderColor: config.lineColors[1],
            borderWidth: 2,
            fill: false,
            pointBackgroundColor: config.lineColors[1],
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Probability (%)",
              color: config.textColor,
              font: { size: 14, weight: "bold" },
            },
            ticks: {
              color: config.textColor,
              font: { size: 12 },
            },
            grid: {
              color: config.gridColor,
              borderColor: config.gridColor,
            },
          },
          x: {
            title: {
              display: true,
              text: "Number of Goals",
              color: config.textColor,
              font: { size: 14, weight: "bold" },
            },
            ticks: {
              color: config.textColor,
              font: { size: 12 },
            },
            grid: {
              color: config.gridColor,
              borderColor: config.gridColor,
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: config.textColor,
              font: { size: 12 },
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
        },
      },
    });

    ctx.canvas.style.backgroundColor = config.backgroundColor;
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
        placeholder="e.g., 2.25"
        inputProps={{ step: "0.01", min: "0", max: "1000" }}
      />
      <TextField
        label="Team B Expected Goals (λB)"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={lambdaB}
        onChange={(e) => setLambdaB(e.target.value)}
        placeholder="e.g., 2.16"
        inputProps={{ step: "0.01", min: "0", max: "1000" }}
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
            <>
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

              <Typography
                variant="h6"
                fontWeight="bold"
                textAlign="center"
                mt={4}
                mb={2}
              >
                📈 Goal Distribution
              </Typography>
              <Box
                sx={{ maxWidth: "100%", overflowX: "auto", height: "250px" }}
              >
                <canvas ref={chartRef} width="400" height="200"></canvas>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PoissonCalculator;
