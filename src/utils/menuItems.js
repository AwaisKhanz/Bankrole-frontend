import React from "react"; // Import React
import {
  AccountBalanceWallet as BankrollsIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as RankingIcon,
  Calculate as RiskCalculatorIcon,
  People as UserManagementIcon,
  Sports as BettingManagementIcon,
} from "@mui/icons-material";

export const getMenuItems = (isProUser, isAdmin) => {
  const menuItems = [
    ...(isProUser
      ? [
          {
            name: "Bankrolls",
            path: "/",
            icon: React.createElement(BankrollsIcon),
          },
          {
            name: "Calendar",
            path: "/calendar",
            icon: React.createElement(CalendarIcon),
          },
        ]
      : []),
    {
      name: "Ranking",
      path: "/ranking",
      icon: React.createElement(RankingIcon),
    },
    {
      name: "Risk Calculator",
      path: "/risk-calculator",
      icon: React.createElement(RiskCalculatorIcon),
    },
  ];

  if (isAdmin) {
    menuItems.push(
      {
        name: "User Management",
        path: "/user-management",
        icon: React.createElement(UserManagementIcon),
      },
      {
        name: "Betting Management",
        path: "/betting-management",
        icon: React.createElement(BettingManagementIcon),
      }
    );
  }

  return menuItems;
};
