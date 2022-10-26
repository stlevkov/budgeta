import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

//import Chart from "./Chart";
import Incomes from "../../components/dynamic/Incomes";
import Copyright from "../components/Copyright";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import ExpensesDirectionStack from "../../components/dynamic/ExpensesStack";
import SavingsDirectionStack from "../../components/dynamic/SavingsStack";
import Divider from "@mui/material/Divider";

console.log("Dashboard.js loaded. Loading functions...");

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Dashboard() {
  console.log("DashboardContent function loaded.");
  const [open, setOpen] = React.useState(true);
  const toggleSidebar = () => {
    setOpen(!open);
  };

  const sidebarWidth = 240;
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Navbar
          open={open}
          toggleSidebar={toggleSidebar}
          sidebarWidth={sidebarWidth}
        />
        <Sidebar
          open={open}
          toggleSidebar={toggleSidebar}
          sidebarWidth={sidebarWidth}
        />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[1000],
            flexGrow: 1,
            height: "100vh",
            marginTop: "4em",
            overflow: "auto",
          }}
        >
          {/* Expense Stack */}
          <Container maxWidth sx={{ mt: 2, mb: 2 }}>
            <ExpensesDirectionStack />
          </Container>

          <Divider />
          {/* Analytic Stack */}
          <Container maxWidth sx={{ mt: 2, mb: 2 }}> 
            {/* Incomes */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Incomes />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            {/* <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Orders />
              </Paper>
            </Grid>*/}
          </Container>
          <Divider>SAVINGS</Divider>
          {/* Savings Stack */}
          <Container maxWidth sx={{ mt: 2, mb: 2 }}>
            <SavingsDirectionStack />
          </Container>

          <Divider />
          {/* Statistics Stack */}
          <Container maxWidth sx={{ mt: 2, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  {/* <Chart /> */}
                  Chart holder
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
