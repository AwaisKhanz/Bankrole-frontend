// src/utils/menuItems.js
export const getMenuItems = (isProUser, isAdmin) => {
  const menuItems = [
    ...(isProUser
      ? [
          { name: "Bankrolls", path: "/" },
          { name: "Calendar", path: "/calendar" },
        ]
      : []),
    { name: "Ranking", path: "/ranking" },
    { name: "Risk Calculator", path: "/risk-calculator" },
  ];

  if (isAdmin) {
    menuItems.push(
      { name: "User Management", path: "/user-management" },
      { name: "Betting Management", path: "/betting-management" }
    );
  }

  return menuItems;
};
