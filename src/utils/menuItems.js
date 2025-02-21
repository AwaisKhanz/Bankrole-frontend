import React from "react";
import {
  AccountBalanceWallet as BankrollsIcon,
  CalendarToday as CalendarIcon,
  Insights as AnalyticsIcon, // New icon for Analytics
  Calculate as RiskCalculatorIcon,
  TableChart as MasanielloIcon, // New icon for Masaniello tool
  EmojiEvents as RankingIcon,
  Telegram as TelegramIcon, // New icon for Telegram
  People as UserManagementIcon,
  Sports as BettingManagementIcon,
} from "@mui/icons-material";

export const getMenuItems = (isProUser, isAdmin) => {
  const menuItems = [
    // MANAGEMENT SECTION
    {
      title: "MANAGEMENT",
      items: [
        ...(isProUser
          ? [
              {
                name: "Bankroll",
                path: "/",
                icon: React.createElement(BankrollsIcon),
              },
              {
                name: "Calendar",
                path: "/calendar",
                icon: React.createElement(CalendarIcon),
              },
              {
                name: "Analytics",
                path: "/analytics",
                icon: React.createElement(AnalyticsIcon),
              },
            ]
          : []),
      ],
    },
    // TOOLS SECTION
    {
      title: "TOOLS",
      items: [
        {
          name: "Risk Calculator",
          path: "/risk-calculator",
          icon: React.createElement(RiskCalculatorIcon),
        },
        {
          name: "Masaniello",
          path: "/masaniello",
          icon: React.createElement(MasanielloIcon),
        },
      ],
    },
    // COMMUNITY SECTION
    {
      title: "COMMUNITY",
      items: [
        {
          name: "Ranking",
          path: "/ranking",
          icon: React.createElement(RankingIcon),
        },
        {
          name: "Telegram",
          path: "/telegram", // Or use an external link like "https://t.me/yourgroup"
          icon: React.createElement(TelegramIcon),
        },
      ],
    },
  ];

  // Add admin-specific items under MANAGEMENT if user is an admin
  if (isAdmin) {
    menuItems.push({
      title: "ADMIN",
      items: [
        {
          name: "User Management",
          path: "/user-management",
          icon: React.createElement(UserManagementIcon),
        },
        {
          name: "Betting Management",
          path: "/betting-management",
          icon: React.createElement(BettingManagementIcon),
        },
      ],
    });
  }

  return menuItems;
};
