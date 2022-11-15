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
import StatisticChart from "../../components/charts/StatisticChart";
import axios from "axios";
import { useState, useEffect } from "react";

const defaultSavings = [
  { name: "CAR REPAIRS", description: "Test", value: 150 },
  { name: "APARTMENT REPAIRS", description: "Apartment", value: 80 },
  { name: "CLOTHES", description: "Clothes saving", value: 150 },
  { name: "TOYS", description: "Toys", value: 20 },
  { name: "MEDICAL", description: "Medical", value: 75 },
];

const defaultCostAnalytics = {
  "id": "635c504c360cfd5b7e0dd036",
  "unexpected": 800,
  "targetSaving": 2555,
  "dailyRecommended": 37.26,
  "monthlyTarget": 3710.00,
  "allExpenses": 1790.00
};

const defaultIncomes = [
  {
    "id": "6351b7623300ae5d85e36359",
    "name": "John",
    "description": "Main Salary Income",
    "value": 4900,
    "updatedAt": "2022-11-02T21:39:24.034+00:00"
  },
  {
    "id": "6362e39db7a2ed58209231f7",
    "name": "Kery",
    "description": "Main Salary Income",
    "value": 1600,
    "updatedAt": "2022-11-02T21:39:41.762+00:00"
  }
];

const defaultExpenses = [
  { name: "TV/GSM", description: "Test", value: "80" },
  { name: "PET", description: "My pet expenses for the month", value: "135" },
  {
    name: "APARTMENT",
    description: "Monthly fee (LOAN) for the apartment",
    value: "765",
  },
  {
    name: "WATER/ENERGY",
    description: "Water consumption and Energy",
    value: "258",
  },
  {
    name: "GARAGE RENT",
    description: "Garage fee for parking the car",
    value: "120",
  },
  {
    name: "COSMETICS",
    description: "Monthly expenses for cosmetics stuffs",
    value: "75",
  },
];

const fetchData = async (setState, setSumState, defaultState, endpoint) => {
  try {
    const response = await axios.get("http://localhost:8080/api/" + endpoint);
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
}

function sumValues(array) {
  let sum = 0;
  array.forEach((obj) => { sum += obj.value })
  return sum;
}

function daysInThisMonth() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export default function Dashboard() {
  const sidebarWidth = 210;
  const [open, setOpen] = React.useState(true);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [savings, setSavings] = useState([]);
  const [costAnalytics, setCostAnalytics] = useState({});

  const [sumExpenses, setSumExpenses] = useState(0);
  const [sumIncomes, setSumIncomes] = useState(0);
  const [sumSavings, setSumSavings] = useState(0);

  /**
   * (Incomes - (Expenses + Savings + TargetSave + Unexpected)) / days in month
   * @param {int} targetSaving Target Saving set by navbar field
   */
  const calculateDailyRecommended = (targetSaving) => {
    console.log("sumExpenses: " + sumExpenses);
    console.log("sumSavings: " + sumSavings);
    console.log("target saving: " + targetSaving);
    console.log("unexpected: " + costAnalytics.unexpected);
    let sumAllExpenses = (sumExpenses + sumSavings + parseFloat(targetSaving) + parseFloat(costAnalytics.unexpected));
    console.log("Days in month: " + daysInThisMonth());
    let daily = (sumIncomes - sumAllExpenses) / daysInThisMonth();
    const clone = structuredClone(costAnalytics);
    clone.dailyRecommended = Math.round((daily + Number.EPSILON) * 100) / 100;
    setCostAnalytics(clone);
  }

  useEffect(() => {
    fetchData(setExpenses, setSumExpenses, defaultExpenses, "expenses");
    fetchData(setIncomes, setSumIncomes, defaultIncomes, "incomes");
    fetchData(setSavings, setSumSavings, defaultSavings, "savings");
    fetchData(setCostAnalytics, false, defaultCostAnalytics,"costAnalytics");
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
        onTargetSaving={calculateDailyRecommended}
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
          <CostAnalyticStack costAnalyticState={costAnalytics} />
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
