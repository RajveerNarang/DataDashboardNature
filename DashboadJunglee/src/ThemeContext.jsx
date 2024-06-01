//ThemeContext.jsx
import React, { createContext, useState, useMemo, useContext } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#121212",
                  paper: "#1D1D1D",
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#B3B3B3",
                },
              }
            : {
                background: {
                  default: "#ffffff",
                  paper: "#f5f5f5",
                },
                text: {
                  primary: "#000000",
                  secondary: "#4f4f4f",
                },
              }),
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
