import React, { useState } from "react";
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

const MasanielloCalculator = ({ mode }) => {
  const [bankroll, setBankroll] = useState("");
  const [numBets, setNumBets] = useState("");
  const [targetProfit, setTargetProfit] = useState("");
  const [odds, setOdds] = useState("");
  const [results, setResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [betResult, setBetResult] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const theme = useTheme();

  const calculateBets = () => {
    const bankrollValue = parseFloat(bankroll);
    const numBetsValue = parseInt(numBets);
    const targetProfitValue = parseFloat(targetProfit) / 100;
    const oddsArray = odds
      .split(" ")
      .map(Number)
      .filter((n) => !isNaN(n));

    if (
      isNaN(bankrollValue) ||
      isNaN(numBetsValue) ||
      isNaN(targetProfitValue) ||
      bankrollValue <= 0 ||
      numBetsValue <= 0 ||
      targetProfitValue <= 0 ||
      oddsArray.length === 0
    ) {
      setResults([{ message: "Please enter valid values!" }]);
      return;
    }

    setIsCalculating(true);
    setCurrentStep(0);
    setResults([]);
    const initialStake = bankrollValue / numBetsValue;
    const targetBalance = bankrollValue * (1 + targetProfitValue);
    let balance = bankrollValue;
    let bets = [];

    for (let i = 0; i < numBetsValue; i++) {
      if (balance <= 0) {
        bets.push({ message: "❌ Bankroll depleted!" });
        break;
      }

      const odd = oddsArray[i] || oddsArray[oddsArray.length - 1];
      const betAmount = Math.min(balance * 0.1, initialStake); // Max 10% of balance
      bets.push({ step: i + 1, betAmount, odd, balance, pending: true });

      if (balance >= targetBalance) {
        bets.push({ message: "🎯 Profit target achieved!" });
        break;
      }
    }

    setResults(bets);
  };

  const handleBetResult = () => {
    if (!betResult || !["W", "L"].includes(betResult.toUpperCase())) {
      return;
    }

    const updatedResults = [...results];
    const currentBet = updatedResults[currentStep];
    const potentialWin = currentBet.betAmount * (currentBet.odd - 1);
    let newBalance = currentBet.balance;

    if (betResult.toUpperCase() === "W") {
      newBalance += potentialWin;
    } else {
      newBalance -= currentBet.betAmount;
    }

    currentBet.balance = newBalance;
    currentBet.pending = false;
    updatedResults[currentStep] = currentBet;

    // Update subsequent bets
    for (let i = currentStep + 1; i < updatedResults.length; i++) {
      if (!updatedResults[i].message) {
        const betAmount = Math.min(newBalance * 0.1, bankroll / numBets);
        updatedResults[i].betAmount = betAmount;
        updatedResults[i].balance = newBalance;
        updatedResults[i].pending = true;
      }
    }

    setResults(updatedResults);
    setCurrentStep(currentStep + 1);
    setBetResult("");

    if (newBalance <= 0 || newBalance >= bankroll * (1 + targetProfit / 100)) {
      setIsCalculating(false);
    }
  };

  const clearFields = () => {
    setBankroll("");
    setNumBets("");
    setTargetProfit("");
    setOdds("");
    setResults([]);
    setCurrentStep(0);
    setBetResult("");
    setIsCalculating(false);
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
        Masaniello Calculator
      </Typography>
      {!isCalculating ? (
        <>
          <TextField
            label="Initial Bankroll (€)"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={bankroll}
            onChange={(e) => setBankroll(e.target.value)}
            placeholder="Enter your total bankroll"
          />
          <TextField
            label="Number of Planned Bets"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={numBets}
            onChange={(e) => setNumBets(e.target.value)}
            placeholder="Enter number of bets"
          />
          <TextField
            label="Profit Target (%)"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={targetProfit}
            onChange={(e) => setTargetProfit(e.target.value)}
            placeholder="Enter profit target"
          />
          <TextField
            label="Betting Odds (space-separated)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={odds}
            onChange={(e) => setOdds(e.target.value)}
            placeholder="e.g., 2.0 1.8 2.5"
          />
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={calculateBets}
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
        </>
      ) : (
        <>
          {currentStep < results.length && !results[currentStep].message && (
            <Box>
              <Typography variant="body1" mb={2}>
                Bet {currentStep + 1}: Bet €
                {results[currentStep].betAmount.toFixed(2)} at odds{" "}
                {results[currentStep].odd}. Type 'W' if won, 'L' if lost:
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={betResult}
                onChange={(e) => setBetResult(e.target.value)}
                placeholder="Enter W or L"
              />
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleBetResult}
                sx={{ mt: 2 }}
              >
                Submit Result
              </Button>
            </Box>
          )}
        </>
      )}
      {results.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
            📊 Bet History
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: textColor }}>Bet #</TableCell>
                <TableCell sx={{ color: textColor }}>Amount (€)</TableCell>
                <TableCell sx={{ color: textColor }}>Odds</TableCell>
                <TableCell sx={{ color: textColor }}>Balance (€)</TableCell>
                <TableCell sx={{ color: textColor }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((bet, index) => (
                <TableRow key={index}>
                  {bet.message ? (
                    <TableCell colSpan={5} sx={{ color: textColor }}>
                      {bet.message}
                    </TableCell>
                  ) : (
                    <>
                      <TableCell sx={{ color: textColor }}>
                        {bet.step}
                      </TableCell>
                      <TableCell sx={{ color: textColor }}>
                        {bet.betAmount.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: textColor }}>{bet.odd}</TableCell>
                      <TableCell sx={{ color: textColor }}>
                        {bet.balance.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: textColor }}>
                        {bet.pending
                          ? "Pending"
                          : bet.balance > bet.balance - bet.betAmount
                          ? "Won"
                          : "Lost"}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {currentStep >= results.length && (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={clearFields}
              sx={{
                mt: 2,
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
              Reset
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MasanielloCalculator;
