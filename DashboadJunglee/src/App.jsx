// src/App.jsx
import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  Switch,
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Dashboard from "../src/components/Dashboard";
import "../src/components/styles.css";

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: "darkgreen" }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              color: "#fff",
              textAlign: "center",
            }}
          >
            WiJunglee Dashboard
          </Typography>
          <Box className="theme-toggle">
            <Switch checked={darkMode} onChange={handleThemeChange} />
          </Box>
        </Toolbar>
      </AppBar>
      <Container>
        <Dashboard />
      </Container>
    </ThemeProvider>
  );
};

export default App;
