// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";

import "./App.css";
import Dashboard from "./pages/home/Dashboard";

import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

function App() {
  console.log("Application started. Loading Dashboard view...");
  const themeModeStored =
    localStorage.getItem("themeMode") !== undefined &&
    localStorage.getItem("themeMode") !== null
      ? localStorage.getItem("themeMode")
      : "dark";

  const [mode, setMode] = React.useState(themeModeStored);
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
      },
    }),
    []
  );

  const defaultTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Dashboard />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
