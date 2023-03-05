import "./App.css";
import Dashboard from "./layouts/Dashboard";

import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SideNavBar from "./layouts/SideBar";

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
    <div id="app" className="App" style={({ display: "flex" })} >
      <SideNavBar/>
      <main style={{width: '100%', marginTop: '6px', marginRight: '6px'} }>
        <Dashboard/>
      </main>
    </div>
    </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;