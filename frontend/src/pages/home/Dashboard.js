import * as React from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
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
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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
  const [errorMessageOpen, setErrorMessageOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("No error yet");
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

  const handleErrorMessageOpen = () => {
    setErrorMessageOpen(true);
  }

  const handleErrorMessageClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorMessageOpen(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <Grid container>
      <Grid xs="auto" sm="auto" md="auto" lg="auto">
        <Sidebar
          open={open}
          toggleSidebar={toggleSidebar}
          sidebarWidth={sidebarWidth}
        />
      </Grid>
      <Grid xs sm md lg>
        <Navbar
          open={open}
          toggleSidebar={toggleSidebar}
          sidebarWidth={sidebarWidth}
          onTargetSaving={calculateCostAnalytics}
        />

        <Grid xs={12} sm={12} md={12} lg={12}>
          {/* Expense Stack */}
          <Grid xs={12} sm={12} md={12} lg={12} sx={{ padding: "1em" }}>
            <ExpensesDirectionStack expensesState={expenses} />
          </Grid>

          <Divider />
          {/* Savings Stack */}
          <Grid xs={12} sm={12} md={12} lg={12} sx={{ padding: "1em" }}>
            <SavingsDirectionStack handleErrorMessageOpen={handleErrorMessageOpen} errorMessage={setErrorMessage} />
          </Grid>
          <Divider>Analytics</Divider>
          {/* Analytic Stack */}
          <Grid xs={12} sm={12} md={12} lg={12} sx={{ padding: "1em" }}>
            <CostAnalyticStack costAnalyticState={costAnalytics} />
          </Grid>
          {/* Statistics Stack */}
          <Grid
            container
            xs={12}
            sm={12}
            md={12}
            lg={12}
            spacing={2}
            sx={{ padding: "1em" }}
          >
            {/* Target */}
            <Grid xs={12} md={3} lg={3}>
              <Paper>
                <TargetStack name={"HOUSE REPAIR"} target={5600} perc={87} />
              </Paper>
            </Grid>
            <Grid xs={12} md={3} lg={3}>
              <Paper>
                <TargetStack name={"NEW CAR"} target={15378} perc={38}/>
              </Paper>
            </Grid>

            {/* ChartJs */}
            <Grid xs={12} md={9} lg={6}>
              <Paper sx={{ height: "22em" }}>
                <StatisticChart />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={errorMessageOpen} autoHideDuration={6000} onClose={handleErrorMessageClose}>
        <Alert onClose={handleErrorMessageClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Stack>
    </Grid>
  );
}
