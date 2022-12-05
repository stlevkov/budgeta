import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Copyright from "../components/Copyright";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import ExpensesDirectionStack from "../../components/dynamic/ExpensesStack";
import SavingsDirectionStack from "../../components/dynamic/SavingsStack";
import Divider from "@mui/material/Divider";
import CostAnalyticStack from "../../components/dynamic/CostAnalyticStack";
import StatisticChart from "../../components/charts/StatisticChart";
import TargetStack from "../../components/dynamic/TargetStack";
import axios from "axios";
import { useState, useEffect } from "react";
import config from "../../resources/config.json";
import data from "../../resources/data.json";

const fetchData = async (setState, setSumState, defaultState, endpoint) => {
  try {
    const response = await axios.get(config.server.uri + endpoint);
    if (response.data !== "") {
      setState(response.data);
      if (setSumState) {
        setSumState(sumValues(response.data));
      }
    } else {
      console.log("Something is wrong");
      setState(defaultState);
      if (setSumState) {
        setSumState(sumValues(defaultState));
      }
    }
  } catch (err) {
    setState(defaultState);
    if (setSumState) {
      setSumState(sumValues(defaultState));
    }
  }
};

function sumValues(array) {
  let sum = 0;
  array.forEach((obj) => {
    sum += obj.value;
  });
  return sum;
}

function daysInThisMonth() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export default function Dashboard() {
  const sidebarWidth = 210;
  const [open, setOpen] = useState(true);
  const [expenses, setExpenses] = useState([]); // TODO provide as hook in each Stack
  const [incomes, setIncomes] = useState([]); // TODO provide as hook in each Stack
  const [savings, setSavings] = useState([]); // TODO provide as hook in each Stack
  const [costAnalytics, setCostAnalytics] = useState({});

  const [sumExpenses, setSumExpenses] = useState(0);
  const [sumIncomes, setSumIncomes] = useState(0);
  const [sumSavings, setSumSavings] = useState(0);

  /**
   * Daily recommended: (Incomes - (Expenses + Savings + TargetSave + Unexpected)) / days in month
   * Monthly target:    (Incomes - (Expenses + Savings + TargetSave + Unexpected)
   *
   * @param {int} targetSaving Target Saving set by navbar field
   */
  const calculateCostAnalytics = (targetSaving) => {
    let sumAllExpenses =
      sumExpenses +
      sumSavings +
      parseFloat(targetSaving) +
      parseFloat(costAnalytics.unexpected);
    let daily = (sumIncomes - sumAllExpenses) / daysInThisMonth();
    let availableForSpend = sumIncomes - sumAllExpenses;
    const clone = structuredClone(costAnalytics);
    clone.dailyRecommended = Math.round((daily + Number.EPSILON) * 100) / 100;
    clone.monthlyTarget =
      Math.round((availableForSpend + Number.EPSILON) * 100) / 100;
    setCostAnalytics(clone);
  };

  useEffect(() => {
    fetchData(setExpenses, setSumExpenses, data.defaultExpenses, "expenses");
    fetchData(setIncomes, setSumIncomes, data.defaultIncomes, "incomes");
    fetchData(setSavings, setSumSavings, data.defaultSavings, "savings");
    fetchData(
      setCostAnalytics,
      false,
      data.defaultCostAnalytics,
      "costAnalytics"
    );
    return () => {
      setExpenses([]);
      setIncomes([]);
      setSavings([]);
      setCostAnalytics({});
    };
  }, []);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar
        open={open}
        toggleSidebar={toggleSidebar}
        sidebarWidth={sidebarWidth}
        onTargetSaving={calculateCostAnalytics}
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
          flexWrap: "nowrap",
          flexDirection: "column",
          alignItems: "stretch",
          alignContent: "stretch",
          height: "100vh",
          marginTop: "5em",
          overflow: "auto",
        }}
      >
        <Divider>Expenses</Divider>
        {/* Expense Stack */}
        <Container maxWidth sx={{ mt: 2, mb: 2 }}>
          <ExpensesDirectionStack expensesState={expenses} />
        </Container>
        <Divider>Savings</Divider>
        {/* Savings Stack */}
        <Container maxWidth sx={{ mt: 2, mb: 2 }}>
          <SavingsDirectionStack />
        </Container>
        <Divider>Analytics</Divider>
        {/* Analytic Stack */}
        <Container maxWidth sx={{ mt: 2, mb: 2 }}>
          <CostAnalyticStack costAnalyticState={costAnalytics} />
        </Container>
        {/* Statistics Stack */}
        <Grid container spacing={2} sx={{ margin: 2 }}>
          {/* Target */}
          <Grid xs={12} md={3} lg={5}>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Paper>
                  <TargetStack />
                </Paper>
              </Grid>
              <Grid xs={6}>
                <Paper>
                  <TargetStack />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          {/* ChartJs */}
          <Grid xs={12} md={9} lg={7}>
            <Paper sx={{ height: "21rem", padding: "1em" }}>
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
