// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";

import "./App.css";
import Dashboard from "./pages/home/Dashboard";

import React from "react";

// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//   },
// });

function App() {
  console.log("Application started. Loading Dashboard view...");
  return (
    <Dashboard />
    // <ThemeProvider theme={darkTheme}>
    //   <CssBaseline />
    //   <div className="App">
    //
    //   </div>
    // </ThemeProvider>
  );
}

export default App;
