import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
//import Chart from "./Chart";
import Copyright from "../components/Copyright";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import ExpensesDirectionStack from "../../components/dynamic/ExpensesStack";
import SavingsDirectionStack from "../../components/dynamic/SavingsStack";
import Divider from "@mui/material/Divider";
import CostAnalyticStack from "../../components/dynamic/CostAnalyticStack";
import StatisticChart from "../../components/charts/AreaChart";

export default function Dashboard() {
  const sidebarWidth = 210;
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
          marginTop: "5em",
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
        <Grid container spacing={2} sx={{ margin: 2 }}>
          {/* Target */}
          <Grid xs={12} md={3} lg={5}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* <Target /> */}
              Targets
            </Paper>
          </Grid>
          {/* ChartJs */}
          <Grid xs={12} md={9} lg={7}>
            <Paper sx={{ height: "16em", padding: "1em" }}>
              <StatisticChart />
            </Paper>
          </Grid>
        </Grid>
        <Container maxWidth="lg" sx={{ mt: 1, mb: 1 }}>
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  );
}
