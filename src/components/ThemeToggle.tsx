"use client";

import { useTheme as useCustomTheme } from "./ThemeProvider";
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export function ThemeToggle() {
  const { theme, toggleTheme } = useCustomTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      size="small"
      color="inherit"
    >
      {theme === "light" ? <Brightness4 /> : <Brightness7 />}
    </IconButton>
  );
}
