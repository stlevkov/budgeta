import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
//import Chart from "./Chart";
import Copyright from "../components/Copyright";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import ExpensesDirectionStack from "../../components/dynamic/ExpensesStack";
import SavingsDirectionStack from "../../components/dynamic/SavingsStack";
import Divider from "@mui/material/Divider";
import CostAnalyticStack from "../../components/dynamic/CostAnalyticStack";

function Dashboard() {
  const sidebarWidth = 240;
  const [open, setOpen] = React.useState(true);
  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
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
          <CostAnalyticStack />
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
  );
}

export default Dashboard;
