import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

//import Chart from "./Chart";
import Chip from "@mui/material/Chip";
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
            paddingTop: "5em",
            overflow: "auto",
          }}
        >
          <Divider>
            <Chip
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[900],
              }}
              label="EXPENSES"
            />
          </Divider>
          {/* Expense Stack */}
          <Container sx={{ mt: 2, mb: 4 }}>
            <ExpensesDirectionStack />
          </Container>

          {/* Incomes Stack */}
          <Divider>
            <Chip
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[900],
              }}
              label="INCOME"
            />
          </Divider>
          <Container sx={{ mt: 2, mb: 4 }}>
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
          <Divider>
            <Chip
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[900],
              }}
              label="SAVINGS"
            />
          </Divider>
          {/* Savings Stack */}
          <Container sx={{ mt: 2, mb: 4 }}>
            <SavingsDirectionStack />
          </Container>

          <Divider>
            <Chip
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[900],
              }}
              label="STATS"
            />
          </Divider>
          {/* Statistics Stack */}
          <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
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
