import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Box, Typography, useTheme } from "@mui/material";
import api from "../services/api";

const CalendarPage = ({ mode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyData, setDailyData] = useState({});
  const theme = useTheme();

  const fetchBankrollData = async () => {
    try {
      const response = await api.get("/bankrolls");
      const bankrolls = response.data;

      const dailyProfits = bankrolls.reduce((acc, bankroll) => {
        bankroll.bets.forEach((bet) => {
          const date = new Date(bet.date);
          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
          let profit = 0;

          if (bet.status === "Won") {
            profit = bet.stake * (bet.odds - 1);
          } else if (bet.status === "Loss") {
            profit = -bet.stake;
          }

          if (!acc[formattedDate])
            acc[formattedDate] = {
              profit: 0,
              symbol: bankroll.currency.symbol,
            };
          acc[formattedDate].profit += profit;
        });
        return acc;
      }, {});

      setDailyData(dailyProfits);
    } catch (error) {
      console.error("Failed to fetch bankroll data:", error);
    }
  };

  useEffect(() => {
    fetchBankrollData();
  }, []);

  const getDailyProfit = (date) => {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    return dailyData[formattedDate] || { profit: 0, symbol: "" };
  };

  return (
    <Box
      sx={{
        padding: "2rem",
        background: mode === "dark" ? "#1e293b" : "#ffffff",
        color: mode === "dark" ? "#ffffff" : "#000000",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Calendar
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <Calendar
          value={currentDate}
          onClickDay={null} // Disable date selection
          onActiveStartDateChange={({ activeStartDate }) =>
            setCurrentDate(activeStartDate)
          }
          tileContent={({ date, view }) =>
            view === "month" && (
              <Box
                sx={{
                  marginTop: "0.5rem",
                  textAlign: "center",
                  fontWeight: "bold",
                  color:
                    getDailyProfit(date).profit > 0
                      ? "#4CAF50"
                      : getDailyProfit(date).profit < 0
                      ? "#FF5252"
                      : mode === "dark"
                      ? "#ffffff"
                      : "#000000",
                }}
              >
                {getDailyProfit(date).profit !== 0 &&
                  `${getDailyProfit(date).symbol}${
                    getDailyProfit(date).profit
                  }`}
              </Box>
            )
          }
          tileClassName={({ date }) => {
            const { profit } = getDailyProfit(date);
            if (profit > 0) return "profit-day";
            if (profit < 0) return "loss-day";
            return "neutral-day";
          }}
          className={`react-calendar ${mode === "dark" ? "dark" : "light"}`} // Apply dynamic class
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
