"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Paper,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Tooltip,
  Grid,
  Chip,
  alpha,
} from "@mui/material";
import Chart from "chart.js/auto";
import CalculateIcon from "@mui/icons-material/Calculate";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ShowChartIcon from "@mui/icons-material/ShowChart";

// Poisson probability calculation function
function poissonProbability(lambda, x) {
  const logP = -lambda + x * Math.log(lambda) - logFactorial(x);
  return Math.exp(logP);
}

// Helper function for factorial calculation
function logFactorial(n) {
  if (n === 0 || n === 1) return 0;
  let sum = 0;
  for (let i = 2; i <= n; i++) {
    sum += Math.log(i);
  }
  return sum;
}

// Calculate match probabilities based on expected goals
function calculateMatchProbabilities(lambdaTeamA, lambdaTeamB) {
  const maxGoals = 5;
  const probabilitiesA = [];
  const probabilitiesB = [];

  for (let i = 0; i <= maxGoals; i++) {
    probabilitiesA[i] = poissonProbability(lambdaTeamA, i);
    probabilitiesB[i] = poissonProbability(lambdaTeamB, i);
  }

  const resultMatrix = Array(maxGoals + 1)
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

  // Calculate most likely scorelines
  const scorelines = [];
  for (let i = 0; i <= maxGoals; i++) {
    for (let j = 0; j <= maxGoals; j++) {
      scorelines.push({
        scoreA: i,
        scoreB: j,
        probability: resultMatrix[i][j] * 100,
      });
    }
  }

  // Sort by probability (descending)
  scorelines.sort((a, b) => b.probability - a.probability);

  // Take top 3 most likely scorelines
  const topScorelines = scorelines.slice(0, 3);

  return {
    winA: winA.toFixed(2),
    draw: draw.toFixed(2),
    winB: winB.toFixed(2),
    probabilitiesA,
    probabilitiesB,
    topScorelines,
  };
}

const PoissonCalculator = ({ mode }) => {
  const [lambdaA, setLambdaA] = useState("");
  const [lambdaB, setLambdaB] = useState("");
  const [teamAName, setTeamAName] = useState("Team A");
  const [teamBName, setTeamBName] = useState("Team B");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const theme = useTheme();

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Chart configuration object
  const chartConfig = {
    light: {
      textColor: theme.palette.text.primary,
      gridColor: theme.palette.divider,
      lineColors: [theme.palette.primary.main, theme.palette.error.main],
      backgroundColor: theme.palette.background.paper,
    },
    dark: {
      textColor: theme.palette.text.primary,
      gridColor: theme.palette.divider,
      lineColors: [theme.palette.primary.light, theme.palette.error.light],
      backgroundColor: theme.palette.background.paper,
    },
  };

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("poissonState"));
    if (savedState) {
      setLambdaA(savedState.lambdaA || "");
      setLambdaB(savedState.lambdaB || "");
      setTeamAName(savedState.teamAName || "Team A");
      setTeamBName(savedState.teamBName || "Team B");
      setResults(savedState.results || null);
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      lambdaA,
      lambdaB,
      teamAName,
      teamBName,
      results,
    };
    localStorage.setItem("poissonState", JSON.stringify(stateToSave));

    if (results && !error && chartRef.current) {
      updateChart(results.probabilitiesA, results.probabilitiesB);
    }
  }, [lambdaA, lambdaB, teamAName, teamBName, results, error, mode]);

  const calculateProbabilities = () => {
    setError("");
    const lambdaAValue = Number.parseFloat(lambdaA);
    const lambdaBValue = Number.parseFloat(lambdaB);

    if (isNaN(lambdaAValue) || isNaN(lambdaBValue)) {
      setError("Please enter valid expected goals values");
      setResults(null);
      return;
    }

    if (lambdaAValue <= 0 || lambdaBValue <= 0) {
      setError("Expected goals must be greater than 0");
      setResults(null);
      return;
    }

    if (lambdaAValue > 10 || lambdaBValue > 10) {
      setError("Expected goals above 10 are not practical for this calculator");
      setResults(null);
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
    setTeamAName("Team A");
    setTeamBName("Team B");
    setResults(null);
    setError("");

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

    const isDarkMode = theme.palette.mode === "dark";
    const config = isDarkMode ? chartConfig.dark : chartConfig.light;

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [0, 1, 2, 3, 4, 5],
        datasets: [
          {
            label: teamAName,
            data: probA.map((p) => (p * 100).toFixed(2)),
            borderColor: config.lineColors[0],
            backgroundColor: `${config.lineColors[0]}20`,
            borderWidth: 2,
            fill: true,
            pointBackgroundColor: config.lineColors[0],
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: teamBName,
            data: probB.map((p) => (p * 100).toFixed(2)),
            borderColor: config.lineColors[1],
            backgroundColor: `${config.lineColors[1]}20`,
            borderWidth: 2,
            fill: true,
            pointBackgroundColor: config.lineColors[1],
            pointRadius: 4,
            pointHoverRadius: 6,
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
              font: { size: 12, weight: "bold" },
              usePointStyle: true,
              pointStyle: "circle",
            },
            position: "top",
          },
          tooltip: {
            backgroundColor: isDarkMode ? "#424242" : "#ffffff",
            titleColor: isDarkMode ? "#ffffff" : "#212121",
            bodyColor: isDarkMode ? "#ffffff" : "#212121",
            borderColor: config.gridColor,
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw}%`,
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
  };

  const getOddsFromProbability = (probability) => {
    const prob = Number.parseFloat(probability) / 100;
    if (prob <= 0 || prob >= 1) return "-";
    const odds = (1 / prob).toFixed(2);
    return odds;
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${
            theme.palette.background.paper
          } 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalculateIcon
              sx={{
                color: theme.palette.primary.main,
                mr: 1.5,
                fontSize: "1.75rem",
              }}
            />
            <Box>
              <Typography
                variant="h4"
                fontWeight={600}
                gutterBottom
                sx={{
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: `0 2px 4px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                }}
              >
                Poisson Match Calculator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calculate match outcome probabilities based on expected goals
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
          mb: 3,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    {teamAName} Details
                  </Typography>
                  <Tooltip title="Enter the team name and their expected goals (xG)">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <TextField
                  label="Team Name"
                  variant="outlined"
                  fullWidth
                  value={teamAName}
                  onChange={(e) => setTeamAName(e.target.value)}
                  placeholder="Home Team"
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Expected Goals (xG)"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={lambdaA}
                  onChange={(e) => setLambdaA(e.target.value)}
                  placeholder="e.g., 1.75"
                  inputProps={{ step: "0.01", min: "0", max: "10" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SportsSoccerIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    {teamBName} Details
                  </Typography>
                  <Tooltip title="Enter the team name and their expected goals (xG)">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <TextField
                  label="Team Name"
                  variant="outlined"
                  fullWidth
                  value={teamBName}
                  onChange={(e) => setTeamBName(e.target.value)}
                  placeholder="Away Team"
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Expected Goals (xG)"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={lambdaB}
                  onChange={(e) => setLambdaB(e.target.value)}
                  placeholder="e.g., 1.25"
                  inputProps={{ step: "0.01", min: "0", max: "10" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SportsSoccerIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={calculateProbabilities}
              sx={{
                py: 1.25,
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              Calculate Probabilities
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              onClick={clearFields}
              startIcon={<DeleteOutlineIcon />}
              sx={{
                py: 1.25,
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Clear
            </Button>
          </Stack>
        </Box>

        {results && !error && (
          <>
            <Divider />
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Match Outcome Probabilities
              </Typography>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={7}>
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(0, 0, 0, 0.02)",
                          }}
                        >
                          <TableCell>Outcome</TableCell>
                          <TableCell align="center">Probability (%)</TableCell>
                          <TableCell align="center">Implied Odds</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <EmojiEventsIcon
                              sx={{ color: theme.palette.primary.main, mr: 1 }}
                            />
                            {teamAName} Wins
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${results.winA}%`}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                backgroundColor: theme.palette.primary.main,
                                color: "#fff",
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {getOddsFromProbability(results.winA)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <HandshakeIcon
                              sx={{ color: theme.palette.warning.main, mr: 1 }}
                            />
                            Draw
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${results.draw}%`}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                backgroundColor: theme.palette.warning.main,
                                color: "#fff",
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {getOddsFromProbability(results.draw)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <EmojiEventsIcon
                              sx={{ color: theme.palette.error.main, mr: 1 }}
                            />
                            {teamBName} Wins
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${results.winB}%`}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                backgroundColor: theme.palette.error.main,
                                color: "#fff",
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {getOddsFromProbability(results.winB)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      height: "100%",
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      Most Likely Scorelines
                    </Typography>

                    <Stack spacing={1.5} sx={{ mt: 1 }}>
                      {results.topScorelines.map((score, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1,
                            borderRadius: 1,
                            backgroundColor:
                              index === 0
                                ? `${theme.palette.primary.main}15`
                                : theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(0, 0, 0, 0.02)",
                          }}
                        >
                          <Typography variant="body1" fontWeight={600}>
                            {score.scoreA} - {score.scoreB}
                          </Typography>
                          <Chip
                            label={`${score.probability.toFixed(2)}%`}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              backgroundColor:
                                index === 0
                                  ? theme.palette.primary.main
                                  : theme.palette.mode === "dark"
                                  ? "rgba(255, 255, 255, 0.1)"
                                  : "rgba(0, 0, 0, 0.08)",
                              color:
                                index === 0
                                  ? "#fff"
                                  : theme.palette.text.primary,
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ShowChartIcon
                    sx={{ color: theme.palette.primary.main, mr: 1.5 }}
                  />
                  <Typography variant="h6" fontWeight={600}>
                    Goal Distribution
                  </Typography>
                </Box>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Box sx={{ height: "300px", position: "relative" }}>
                    <canvas ref={chartRef}></canvas>
                  </Box>
                </Paper>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    The Poisson distribution is used to model the number of
                    goals each team will score in a match. This calculator uses
                    expected goals (xG) as the lambda parameter for the Poisson
                    distribution.
                  </Typography>
                </Alert>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default PoissonCalculator;
