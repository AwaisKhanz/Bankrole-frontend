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

const MasanielloCalculator = ({ mode }) => {
  const [bankroll, setBankroll] = useState("");
  const [numBets, setNumBets] = useState("");
  const [targetProfit, setTargetProfit] = useState("");
  const [probability, setProbability] = useState(""); // New probability input
  const [odds, setOdds] = useState("");
  const [results, setResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [betResult, setBetResult] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const theme = useTheme();

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("masanielloState"));
    if (savedState) {
      setBankroll(savedState.bankroll || "");
      setNumBets(savedState.numBets || "");
      setTargetProfit(savedState.targetProfit || "");
      setProbability(savedState.probability || "");
      setOdds(savedState.odds || "");
      setResults(savedState.results || []);
      setCurrentStep(savedState.currentStep || 0);
      setIsCalculating(savedState.isCalculating || false);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      bankroll,
      numBets,
      targetProfit,
      probability,
      odds,
      results,
      currentStep,
      isCalculating,
    };
    localStorage.setItem("masanielloState", JSON.stringify(stateToSave));
  }, [
    bankroll,
    numBets,
    targetProfit,
    probability,
    odds,
    results,
    currentStep,
    isCalculating,
  ]);

  const calculateBets = () => {
    const bankrollValue = parseFloat(bankroll);
    const numBetsValue = parseInt(numBets);
    const targetProfitValue = parseFloat(targetProfit);
    const probabilityValue = parseFloat(probability) / 100;
    const oddsArray = odds
      .split(" ")
      .map(Number)
      .filter((n) => !isNaN(n));

    if (
      isNaN(bankrollValue) ||
      isNaN(numBetsValue) ||
      isNaN(targetProfitValue) ||
      isNaN(probabilityValue) ||
      bankrollValue <= 0 ||
      numBetsValue <= 0 ||
      targetProfitValue <= 0 ||
      probabilityValue <= 0 ||
      probabilityValue > 1 ||
      oddsArray.length === 0
    ) {
      setResults([{ message: "Please enter valid values!" }]);
      return;
    }

    setIsCalculating(true);
    setCurrentStep(0);
    setResults([]);

    // Masaniello staking calculation
    const factor =
      (bankrollValue * targetProfitValue) /
      Math.pow(oddsArray[0] - 1, numBetsValue);
    let remainingBankroll = bankrollValue;
    let bets = [];

    for (let i = 0; i < numBetsValue; i++) {
      if (remainingBankroll <= 0) {
        bets.push({ message: "❌ Bankroll depleted!" });
        break;
      }

      const odd = oddsArray[i] || oddsArray[oddsArray.length - 1];
      const stake = (factor * (odd - 1)) / (numBetsValue - i);
      const betAmount = Math.min(stake, remainingBankroll);
      bets.push({
        step: i + 1,
        betAmount,
        odd,
        balance: remainingBankroll,
        pending: true,
      });
      remainingBankroll -= betAmount;
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

    if (betResult.toUpperCase() === "W") {
      currentBet.balance += potentialWin;
    } else {
      currentBet.balance -= currentBet.betAmount;
    }

    currentBet.pending = false;
    currentBet.status = betResult.toUpperCase() === "W" ? "Won" : "Lost"; // Fixed status
    updatedResults[currentStep] = currentBet;

    // Update subsequent bets' balance
    for (let i = currentStep + 1; i < updatedResults.length; i++) {
      if (!updatedResults[i].message) {
        updatedResults[i].balance = currentBet.balance;
        // Recalculate stake for remaining bets (not re-applying full Masaniello here, just updating balance)
      }
    }

    setResults(updatedResults);
    setCurrentStep(currentStep + 1);
    setBetResult("");

    if (
      currentBet.balance <= 0 ||
      currentBet.balance >= bankroll * (1 + targetProfit / 100)
    ) {
      setIsCalculating(false);
    }
  };

  const handleOddChange = (index, newOdd) => {
    const updatedResults = [...results];
    const parsedOdd = parseFloat(newOdd);
    if (!isNaN(parsedOdd) && parsedOdd > 1 && updatedResults[index].pending) {
      updatedResults[index].odd = parsedOdd;
      setResults(updatedResults);
    }
  };

  const clearFields = () => {
    setBankroll("");
    setNumBets("");
    setTargetProfit("");
    setProbability("");
    setOdds("");
    setResults([]);
    setCurrentStep(0);
    setBetResult("");
    setIsCalculating(false);
    localStorage.removeItem("masanielloState"); // Clear saved state
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
            inputProps={{ step: "0.01" }}
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
            label="Profit Target (e.g., 1.5 for 50%)"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={targetProfit}
            onChange={(e) => setTargetProfit(e.target.value)}
            placeholder="Enter profit target"
            inputProps={{ step: "0.01" }}
          />
          <TextField
            label="Probability of Winning (%)"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={probability}
            onChange={(e) => setProbability(e.target.value)}
            placeholder="Enter probability (e.g., 60)"
            inputProps={{ step: "1", min: "0", max: "100" }}
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
                      <TableCell sx={{ color: textColor }}>
                        {bet.pending ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            type="number"
                            value={bet.odd}
                            onChange={(e) =>
                              handleOddChange(index, e.target.value)
                            }
                            sx={{ width: "80px" }}
                            inputProps={{ step: "0.1", min: "1" }}
                          />
                        ) : (
                          bet.odd
                        )}
                      </TableCell>
                      <TableCell sx={{ color: textColor }}>
                        {bet.balance.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: textColor }}>
                        {bet.pending ? "Pending" : bet.status}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {currentStep >= results.length && (
            <>
              <Typography
                variant="h6"
                fontWeight="bold"
                textAlign="center"
                sx={{ mt: 2, color: mode === "dark" ? "#66BB6A" : "#2E7D32" }}
              >
                COMPLETED
              </Typography>
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
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MasanielloCalculator;
