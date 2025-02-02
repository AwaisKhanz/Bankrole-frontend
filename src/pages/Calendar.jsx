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
        padding: "1rem",
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
          tileContent={({ date, view }) => {
            const dailyProfit = getDailyProfit(date);

            if (view === "month" && dailyProfit.profit !== 0) {
              return (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100px",
                    height: "120px",
                    backgroundColor:
                      dailyProfit.profit > 0
                        ? "rgba(76, 175, 80, 0.2)"
                        : "rgba(244, 67, 54, 0.2)",

                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderBottom: "4px solid #E5C100",
                    padding: "10px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: mode === "dark" ? "white" : "#0A50A0",
                    }}
                  >
                    {date.getDate()}{" "}
                    {date.toLocaleString("default", { month: "short" })}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#777", marginBottom: "4px" }}
                  >
                    {date.toLocaleDateString("en-US", { weekday: "long" })}
                  </Typography>
                  <Typography
                    // variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color:
                        dailyProfit.profit > 0
                          ? mode === "dark"
                            ? "white"
                            : "#0A50A0"
                          : "#FF5252",
                    }}
                  >
                    {dailyProfit.symbol}
                    {dailyProfit.profit.toFixed(2)}
                  </Typography>
                </Box>
              );
            }
            return view === "month" ? (
              <Typography>{date.getDate()}</Typography>
            ) : null;
          }}
          tileClassName={({ date }) => {
            const { profit } = getDailyProfit(date);
            if (profit > 0) return "profit-day";
            if (profit < 0) return "loss-day";
            return "neutral-day";
          }}
          className={`react-calendar ${mode === "dark" ? "dark" : "light"}`}
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
